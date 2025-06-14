
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

    // Azure OpenAI Configuration
    const azureEndpoint = 'https://azure-openai-testhypoth-1.openai.azure.com';
    const azureApiKey = '2BLjtvECQMqaSdRlDZgjnpGHGHX23WNCmkUlDn3fktOnryTNov4BJQQJ99BFACL93NaXJ3w3AAABACOGKe9X';
    const apiVersion = '2024-05-01-preview';
    const deploymentName = 'gpt-4o';

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    // Use service role key for broader access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        // Extract JWT token and verify user
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError) {
          console.error('Auth error:', authError);
        } else if (user) {
          userId = user.id;
          console.log('Authenticated user:', userId);
        }
      } catch (authError) {
        console.error('Auth check failed:', authError);
      }
    }

    // Comprehensive document fetching with better error handling
    let documentsContext = '';
    let totalDocuments = 0;
    let totalBooks = 0;
    let totalChapters = 0;
    
    if (userId) {
      try {
        console.log('Fetching comprehensive document data for user:', userId);
        
        // Fetch ALL documents with full content
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select(`
            id,
            title,
            content,
            content_type,
            created_at,
            updated_at,
            metadata,
            word_count
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        // Fetch ALL books with detailed info
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select(`
            id,
            title,
            description,
            genre,
            status,
            word_count,
            created_at,
            updated_at,
            metadata
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        // Fetch ALL chapters with their content
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select(`
            id,
            title,
            content,
            chapter_number,
            status,
            word_count,
            book_id,
            created_at,
            updated_at,
            notes
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        // Log any fetch errors but continue processing
        if (docsError) {
          console.error('Documents fetch error:', docsError);
        }
        if (booksError) {
          console.error('Books fetch error:', booksError);
        }
        if (chaptersError) {
          console.error('Chapters fetch error:', chaptersError);
        }

        // Build comprehensive context with ACTUAL document data
        documentsContext = `\n\n=== USER'S COMPLETE DOCUMENT LIBRARY ===\n\n`;
        
        // Process documents section
        if (documents && documents.length > 0) {
          totalDocuments = documents.length;
          documentsContext += `📄 DOCUMENTS (${totalDocuments} total):\n\n`;
          
          documents.forEach((doc, index) => {
            documentsContext += `${index + 1}. DOCUMENT: "${doc.title}"\n`;
            documentsContext += `   Type: ${doc.content_type}\n`;
            documentsContext += `   Created: ${new Date(doc.created_at).toLocaleDateString()}\n`;
            documentsContext += `   Last Updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
            documentsContext += `   Word Count: ${doc.word_count || 0}\n`;
            
            // Include substantial content (first 2000 chars for better context)
            if (doc.content) {
              const contentPreview = doc.content.substring(0, 2000);
              documentsContext += `   CONTENT:\n   ${contentPreview}${doc.content.length > 2000 ? '\n   [Content continues...]' : ''}\n`;
            }
            
            if (doc.metadata && Object.keys(doc.metadata).length > 0) {
              documentsContext += `   Metadata: ${JSON.stringify(doc.metadata)}\n`;
            }
            documentsContext += `\n---\n\n`;
          });
        } else {
          documentsContext += `📄 DOCUMENTS: No documents found\n\n`;
        }

        // Process books section
        if (books && books.length > 0) {
          totalBooks = books.length;
          documentsContext += `📚 BOOKS (${totalBooks} total):\n\n`;
          
          books.forEach((book, index) => {
            documentsContext += `${index + 1}. BOOK: "${book.title}"\n`;
            documentsContext += `   Genre: ${book.genre || 'Not specified'}\n`;
            documentsContext += `   Status: ${book.status}\n`;
            documentsContext += `   Word Count: ${book.word_count || 0}\n`;
            documentsContext += `   Created: ${new Date(book.created_at).toLocaleDateString()}\n`;
            documentsContext += `   Last Updated: ${new Date(book.updated_at).toLocaleDateString()}\n`;
            
            if (book.description) {
              documentsContext += `   Description: ${book.description}\n`;
            }
            
            if (book.metadata && Object.keys(book.metadata).length > 0) {
              documentsContext += `   Metadata: ${JSON.stringify(book.metadata)}\n`;
            }
            documentsContext += `\n---\n\n`;
          });
        } else {
          documentsContext += `📚 BOOKS: No books found\n\n`;
        }

        // Process chapters section
        if (chapters && chapters.length > 0) {
          totalChapters = chapters.length;
          documentsContext += `📖 CHAPTERS (${totalChapters} total):\n\n`;
          
          chapters.forEach((chapter, index) => {
            documentsContext += `${index + 1}. CHAPTER: "${chapter.title}" (Chapter ${chapter.chapter_number})\n`;
            documentsContext += `   Book ID: ${chapter.book_id}\n`;
            documentsContext += `   Status: ${chapter.status}\n`;
            documentsContext += `   Word Count: ${chapter.word_count || 0}\n`;
            documentsContext += `   Created: ${new Date(chapter.created_at).toLocaleDateString()}\n`;
            documentsContext += `   Last Updated: ${new Date(chapter.updated_at).toLocaleDateString()}\n`;
            
            // Include chapter content (first 1500 chars)
            if (chapter.content) {
              const contentPreview = chapter.content.substring(0, 1500);
              documentsContext += `   CONTENT:\n   ${contentPreview}${chapter.content.length > 1500 ? '\n   [Content continues...]' : ''}\n`;
            }
            
            if (chapter.notes) {
              documentsContext += `   Notes: ${chapter.notes}\n`;
            }
            documentsContext += `\n---\n\n`;
          });
        } else {
          documentsContext += `📖 CHAPTERS: No chapters found\n\n`;
        }

        // Add comprehensive summary
        documentsContext += `=== LIBRARY OVERVIEW ===\n`;
        documentsContext += `📊 Total Documents: ${totalDocuments}\n`;
        documentsContext += `📚 Total Books: ${totalBooks}\n`;
        documentsContext += `📖 Total Chapters: ${totalChapters}\n`;
        documentsContext += `📝 Total Content Items: ${totalDocuments + totalBooks + totalChapters}\n\n`;

        console.log(`Successfully retrieved: ${totalDocuments} documents, ${totalBooks} books, ${totalChapters} chapters`);
        
      } catch (docError) {
        console.error('Error fetching user documents:', docError);
        documentsContext = `\n\n[ERROR: Unable to access user documents - ${docError.message}]\n\n`;
      }
    } else {
      documentsContext = `\n\n[USER NOT AUTHENTICATED: Unable to access documents without valid authentication]\n\n`;
    }

    // Enhanced system message with strict instructions about document references
    const systemMessage = `You are the Grand Strategist, an elite AI personal assistant and strategic life manager with COMPLETE ACCESS to the user's document library.

🎯 CORE CAPABILITIES:
- Strategic analysis and planning across all life/work domains
- Document-based insights and personalized recommendations
- Personal productivity optimization and goal management
- Decision-making support with data-driven insights
- Life organization and strategic planning

🧠 DOCUMENT KNOWLEDGE BASE:
${documentsContext}

🎯 CRITICAL INSTRUCTIONS:
1. **ONLY reference documents that are explicitly listed above** - NEVER make up document names or content
2. **If no documents are available**, clearly state that you don't have access to any documents yet
3. **Be specific about which documents you're referencing** - quote titles exactly as they appear
4. **Make connections between different documents** when you find related content
5. **Provide strategic insights based on patterns** you actually see in their work
6. **If asked about documents not in your knowledge base**, clearly state you don't have access to that information

${context ? `\n🔍 ADDITIONAL CONTEXT: ${context}` : ''}

**HONESTY REQUIREMENT:** You must be completely honest about what documents you can and cannot see. Never fabricate document names, content, or insights that aren't directly based on the information provided above.

**STRATEGIC FOCUS:** Provide high-level strategic advice that leverages your actual knowledge of their document library. Be conversational but professional, like a trusted strategic advisor who has intimate knowledge of their work and projects.`;

    // Build Azure OpenAI request
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
        'api-key': azureApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Azure OpenAI Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
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
      endpoint: 'Azure OpenAI',
      userAuthenticated: !!userId
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
