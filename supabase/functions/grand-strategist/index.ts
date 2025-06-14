
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

    // Azure OpenAI Configuration - using your specific credentials
    const azureEndpoint = 'https://azure-openai-testhypoth-1.openai.azure.com';
    const azureApiKey = '2BLjtvECQMqaSdRlDZgjnpGHGHX23WNCmkUlDn3fktOnryTNov4BJQQJ99BFACL93NaXJ3w3AAABACOGKe9X';
    const apiVersion = '2024-05-01-preview';
    const deploymentName = 'gpt-4o'; // Your deployment name

    console.log('Using Azure OpenAI endpoint:', azureEndpoint);

    // Initialize Supabase client to access user's documents
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        userId = user?.id;
      } catch (authError) {
        console.log('Auth check failed, proceeding without user context:', authError);
      }
    }

    // Get user's documents for context (if authenticated)
    let documentsContext = '';
    if (userId) {
      try {
        const { data: documents, error } = await supabase
          .from('documents')
          .select('title, content, content_type, updated_at')
          .eq('user_id', userId)
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
    }

    // Prepare system message for Grand Strategist
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

    // Build Azure OpenAI request URL
    const azureUrl = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    const requestBody = {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    };

    console.log('Calling Azure OpenAI API...');

    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey, // Azure uses api-key header
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Azure OpenAI Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error('Azure OpenAI API authentication failed. Please check your API key and endpoint.');
      } else if (response.status === 429) {
        throw new Error('Azure OpenAI API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error(`Azure OpenAI deployment '${deploymentName}' not found. Please check your deployment name.`);
      } else {
        throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Azure OpenAI API');
    }

    const result = data.choices[0].message.content;
    
    console.log(`Grand Strategist response generated successfully (${result.length} characters)`);

    return new Response(JSON.stringify({ 
      result,
      usage: data.usage || {},
      model: deploymentName,
      documentsAccessed: documentsContext.length > 0,
      endpoint: 'Azure OpenAI'
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
