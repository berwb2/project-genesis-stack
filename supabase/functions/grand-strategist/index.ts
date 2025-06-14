
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, documentType } = await req.json();
    
    console.log('Grand Strategist called with prompt:', prompt?.substring(0, 100));
    
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required and cannot be empty');
    }

    // Get OpenAI API key (we'll use standard OpenAI for now)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase secrets.');
    }

    // Initialize Supabase client to access user's documents
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
    }

    // Get user's documents for context
    let documentsContext = '';
    try {
      const { data: documents, error } = await supabase
        .from('documents')
        .select('title, content, content_type, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (!error && documents && documents.length > 0) {
        documentsContext = `\n\nUser's Recent Documents:\n`;
        documents.forEach((doc, index) => {
          documentsContext += `${index + 1}. "${doc.title}" (${doc.content_type})\n`;
          // Include first 500 characters of content
          const snippet = doc.content?.substring(0, 500) || '';
          if (snippet) {
            documentsContext += `   Content preview: ${snippet}...\n`;
          }
          documentsContext += `   Last updated: ${new Date(doc.updated_at).toLocaleDateString()}\n\n`;
        });
      }
    } catch (docError) {
      console.log('Could not fetch documents:', docError);
      // Continue without document context
    }

    // Prepare system message
    const systemMessage = `You are the Grand Strategist, a highly intelligent personal assistant and life manager. You have access to the user's documents and can provide strategic advice, insights, and help with personal and professional organization.

Your capabilities:
- Strategic thinking and analysis
- Document management insights
- Personal productivity advice
- Life and work organization
- Project planning and execution
- Decision-making support

Context about the user:
- They have a document management system called DeepWaters
- You can see their recent documents and content
- Help them organize, strategize, and optimize their work and life

${documentsContext}

${context ? `Additional context: ${context}` : ''}

Provide thoughtful, strategic, and actionable advice. Be conversational but professional.`;

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    };

    console.log('Calling OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`OpenAI Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    const result = data.choices[0].message.content;
    
    console.log(`Grand Strategist response generated successfully (${result.length} characters)`);

    return new Response(JSON.stringify({ 
      result,
      usage: data.usage || {},
      model: 'gpt-4o-mini',
      documentsAccessed: documentsContext.length > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grand-strategist function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.stack || 'No stack trace available'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
