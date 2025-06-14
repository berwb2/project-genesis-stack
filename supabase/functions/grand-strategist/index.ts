
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DatabaseService } from './database-service.ts';
import { AzureAIService } from './azure-ai-service.ts';
import { corsHeaders, validateInput, validateEnvironment, extractAuthToken } from './utils.ts';
import type { GrandStrategistRequest, GrandStrategistResponse } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context }: GrandStrategistRequest = await req.json();
    
    console.log('Grand Strategist called with prompt:', prompt?.substring(0, 100));
    
    // Validate input
    validateInput(prompt);

    // Validate environment
    const { supabaseUrl, supabaseServiceKey } = validateEnvironment();

    // Initialize services
    const dbService = new DatabaseService(supabaseUrl, supabaseServiceKey);
    const aiService = new AzureAIService();

    // Get user authentication
    const authToken = extractAuthToken(req);
    let userId: string | null = null;
    
    if (authToken) {
      userId = await dbService.getUserFromToken(authToken);
    }

    // Fetch user documents and build context
    let documentsContext = '';
    let documentStats = { documents: 0, books: 0, chapters: 0, total: 0 };
    
    if (userId) {
      const { documentsContext: fetchedContext, documentStats: fetchedStats } = 
        await dbService.fetchUserDocuments(userId);
      documentsContext = fetchedContext;
      documentStats = fetchedStats;
    } else {
      documentsContext = `\n\n[USER NOT AUTHENTICATED: Unable to access documents without valid authentication]\n\n`;
    }

    // Ensure context is a string
    const contextString = typeof context === 'object' && context !== null 
      ? JSON.stringify(context) 
      : String(context || '');

    // Build system message and generate response
    const systemMessage = aiService.buildSystemMessage(documentsContext, contextString);
    const data = await aiService.generateResponse(prompt, systemMessage);
    
    const result = data.choices[0].message.content;
    
    console.log(`Grand Strategist response generated successfully (${result.length} characters)`);

    const response: GrandStrategistResponse = {
      result,
      usage: data.usage || {},
      model: 'gpt-4o',
      documentsAccessed: documentStats.total,
      documentStats,
      endpoint: 'Azure OpenAI',
      userAuthenticated: !!userId
    };

    return new Response(JSON.stringify(response), {
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
