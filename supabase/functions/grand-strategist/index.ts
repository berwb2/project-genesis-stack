
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    console.log(`Grand Strategist called with: { promptLength: ${prompt?.length || 0}, hasContext: ${!!context}, documentType: ${documentType || 'unknown'} }`);
    
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required and cannot be empty');
    }

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured. Please contact administrator.');
    }

    console.log('Using OpenAI API for Grand Strategist');

    // Prepare system message based on document type
    let systemMessage = `You are the Grand Strategist, an expert AI assistant specialized in strategic thinking, document creation, and intelligent analysis. You provide thoughtful, well-structured responses that help users achieve their goals.`;
    
    if (documentType) {
      systemMessage += ` You are currently helping with a ${documentType} document.`;
    }

    if (context) {
      systemMessage += ` Consider this context: ${context}`;
    }

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: { status: ${response.status}, statusText: ${response.statusText}, error: ${errorText} }`);
      
      if (response.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('OpenAI model not found. Please check your model configuration.');
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
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
      model: 'gpt-4o-mini'
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
