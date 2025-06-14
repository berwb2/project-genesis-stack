
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

    // Get Azure OpenAI configuration from environment
    const azureEndpoint = Deno.env.get('VITE_AZURE_OPENAI_ENDPOINT');
    const azureApiKey = Deno.env.get('VITE_AZURE_OPENAI_KEY');
    const azureApiVersion = Deno.env.get('VITE_AZURE_OPENAI_VERSION') || '2024-05-01-preview';
    const azureModel = Deno.env.get('VITE_AZURE_OPENAI_MODEL') || 'gpt-4o';

    if (!azureEndpoint || !azureApiKey) {
      throw new Error('Azure OpenAI configuration missing. Please check environment variables.');
    }

    // Construct the Azure OpenAI API URL
    const apiUrl = `${azureEndpoint}openai/deployments/${azureModel}/chat/completions?api-version=${azureApiVersion}`;
    
    console.log(`Calling Azure OpenAI API with model: ${azureModel}`);

    // Prepare system message based on document type
    let systemMessage = `You are the Grand Strategist, an expert AI assistant specialized in strategic thinking, document creation, and intelligent analysis. You provide thoughtful, well-structured responses that help users achieve their goals.`;
    
    if (documentType) {
      systemMessage += ` You are currently helping with a ${documentType} document.`;
    }

    if (context) {
      systemMessage += ` Consider this context: ${context}`;
    }

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

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure OpenAI API error: { status: ${response.status}, statusText: ${response.statusText}, error: ${errorText} }`);
      
      if (response.status === 401) {
        throw new Error('Azure OpenAI API authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('Azure OpenAI API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('Azure OpenAI deployment not found. Please check your model deployment.');
      } else {
        throw new Error(`Azure OpenAI API error: ${response.status} - ${response.statusText}`);
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
      model: azureModel 
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
