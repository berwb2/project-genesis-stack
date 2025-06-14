
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

    // Get ALL user's documents and books/chapters for comprehensive context
    let documentsContext = '';
    let totalDocuments = 0;
    let totalBooks = 0;
    let totalChapters = 0;
    
    if (userId) {
      try {
        console.log('Fetching comprehensive document data for user:', userId);
        
        // Fetch ALL documents (not limited to 10)
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select('id, title, content, content_type, created_at, updated_at, metadata, word_count')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        // Fetch ALL books
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title, description, genre, status, word_count, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        // Fetch ALL chapters
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select('id, title, content, chapter_number, status, word_count, book_id, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (docsError) console.log('Documents fetch error:', docsError);
        if (booksError) console.log('Books fetch error:', booksError);
        if (chaptersError) console.log('Chapters fetch error:', chaptersError);

        // Build comprehensive context
        documentsContext = `\n\n=== USER'S COMPLETE DOCUMENT LIBRARY ===\n\n`;
        
        // Add documents section
        if (documents && documents.length > 0) {
          totalDocuments = documents.length;
          documentsContext += `📄 DOCUMENTS (${totalDocuments} total):\n`;
          
          documents.forEach((doc, index) => {
            documentsContext += `\n${index + 1}. "${doc.title}" (${doc.content_type})\n`;
            documentsContext += `   📅 Last updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
            documentsContext += `   📊 Word count: ${doc.word_count || 0}\n`;
            
            // Include substantial content excerpt (first 1000 chars for better context)
            if (doc.content) {
              const contentPreview = doc.content.substring(0, 1000);
              documentsContext += `   📝 Content: ${contentPreview}${doc.content.length > 1000 ? '...' : ''}\n`;
            }
            
            if (doc.metadata && Object.keys(doc.metadata).length > 0) {
              documentsContext += `   🏷️ Metadata: ${JSON.stringify(doc.metadata)}\n`;
            }
            documentsContext += `\n`;
          });
        }

        // Add books section
        if (books && books.length > 0) {
          totalBooks = books.length;
          documentsContext += `\n📚 BOOKS (${totalBooks} total):\n`;
          
          books.forEach((book, index) => {
            documentsContext += `\n${index + 1}. "${book.title}" (${book.genre || 'No genre'})\n`;
            documentsContext += `   📊 Status: ${book.status}\n`;
            documentsContext += `   📈 Word count: ${book.word_count || 0}\n`;
            documentsContext += `   📅 Last updated: ${new Date(book.updated_at).toLocaleDateString()}\n`;
            
            if (book.description) {
              documentsContext += `   📖 Description: ${book.description}\n`;
            }
            documentsContext += `\n`;
          });
        }

        // Add chapters section
        if (chapters && chapters.length > 0) {
          totalChapters = chapters.length;
          documentsContext += `\n📖 CHAPTERS (${totalChapters} total):\n`;
          
          chapters.forEach((chapter, index) => {
            documentsContext += `\n${index + 1}. "${chapter.title}" (Chapter ${chapter.chapter_number})\n`;
            documentsContext += `   📊 Status: ${chapter.status}\n`;
            documentsContext += `   📈 Word count: ${chapter.word_count || 0}\n`;
            documentsContext += `   📅 Last updated: ${new Date(chapter.updated_at).toLocaleDateString()}\n`;
            
            // Include chapter content excerpt
            if (chapter.content) {
              const contentPreview = chapter.content.substring(0, 800);
              documentsContext += `   📝 Content: ${contentPreview}${chapter.content.length > 800 ? '...' : ''}\n`;
            }
            documentsContext += `\n`;
          });
        }

        // Add summary statistics
        documentsContext += `\n=== LIBRARY SUMMARY ===\n`;
        documentsContext += `📊 Total Documents: ${totalDocuments}\n`;
        documentsContext += `📚 Total Books: ${totalBooks}\n`;
        documentsContext += `📖 Total Chapters: ${totalChapters}\n`;
        documentsContext += `📝 Total Items: ${totalDocuments + totalBooks + totalChapters}\n\n`;

        console.log(`Retrieved comprehensive data: ${totalDocuments} documents, ${totalBooks} books, ${totalChapters} chapters`);
        
      } catch (docError) {
        console.log('Could not fetch user documents:', docError);
        documentsContext = '\n\n[Note: Unable to access user documents at this time]\n\n';
      }
    } else {
      documentsContext = '\n\n[Note: User not authenticated - no document access]\n\n';
    }

    // Enhanced system message for Grand Strategist with comprehensive document access
    const systemMessage = `You are the Grand Strategist, an elite AI personal assistant and strategic life manager. You have COMPLETE ACCESS to the user's entire document library and can provide strategic insights based on their actual content.

🎯 YOUR CORE CAPABILITIES:
- Strategic analysis and planning across all life/work domains
- Document-based insights and connections
- Personal productivity optimization
- Project and goal management
- Decision-making support with data-driven insights
- Life organization and strategic planning

🧠 KNOWLEDGE BASE:
You have access to the user's complete document library containing their thoughts, projects, plans, and work. Use this knowledge to provide personalized, contextual advice that references their actual content.

📚 CURRENT DOCUMENT ACCESS:
${documentsContext}

🎯 STRATEGIC DIRECTIVES:
1. ALWAYS reference specific documents when relevant to the user's question
2. Make connections between different documents and projects
3. Provide strategic insights based on patterns you see in their work
4. Be specific about which documents you're referencing - never make up document names
5. If you don't have relevant documents, clearly state what information you're missing
6. Focus on strategic, high-level guidance that helps with planning and decision-making

${context ? `\n🔍 ADDITIONAL CONTEXT: ${context}` : ''}

IMPORTANT: Only reference documents that are actually listed above. If asked about documents not in your knowledge base, clearly state that you don't have access to that information. Be honest about what you can and cannot see.

Provide strategic, actionable advice that leverages your knowledge of their document library. Be conversational but professional, like a trusted strategic advisor.`;

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
      documentsAccessed: totalDocuments + totalBooks + totalChapters,
      documentStats: {
        documents: totalDocuments,
        books: totalBooks,
        chapters: totalChapters,
        total: totalDocuments + totalBooks + totalChapters
      },
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
