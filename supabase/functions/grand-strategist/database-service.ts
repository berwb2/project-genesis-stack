
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { Document, Book, Chapter, DocumentContext } from './types.ts';

export class DatabaseService {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async getUserFromToken(token: string): Promise<string | null> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
      
      if (authError) {
        console.error('Auth error:', authError);
        return null;
      }
      
      if (user) {
        console.log('Authenticated user:', user.id);
        return user.id;
      }
      
      return null;
    } catch (authError) {
      console.error('Auth check failed:', authError);
      return null;
    }
  }

  async fetchUserDocuments(userId: string): Promise<{ 
    documentsContext: string; 
    documentStats: DocumentContext;
  }> {
    let documentsContext = '';
    let totalDocuments = 0;
    let totalBooks = 0;
    let totalChapters = 0;
    
    try {
      console.log('Fetching comprehensive document data for user:', userId);
      
      // Fetch ALL documents with full content
      const { data: documents, error: docsError } = await this.supabase
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
      const { data: books, error: booksError } = await this.supabase
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
      const { data: chapters, error: chaptersError } = await this.supabase
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
      documentsContext = this.buildDocumentsContext(documents, books, chapters);
      
      totalDocuments = documents?.length || 0;
      totalBooks = books?.length || 0;
      totalChapters = chapters?.length || 0;

      console.log(`Successfully retrieved: ${totalDocuments} documents, ${totalBooks} books, ${totalChapters} chapters`);
      
    } catch (docError) {
      console.error('Error fetching user documents:', docError);
      documentsContext = `\n\n[ERROR: Unable to access user documents - ${docError.message}]\n\n`;
    }

    return {
      documentsContext,
      documentStats: {
        documents: totalDocuments,
        books: totalBooks,
        chapters: totalChapters,
        total: totalDocuments + totalBooks + totalChapters
      }
    };
  }

  private buildDocumentsContext(documents: Document[], books: Book[], chapters: Chapter[]): string {
    let context = `\n\n=== USER'S COMPLETE DOCUMENT LIBRARY ===\n\n`;
    
    // Process documents section
    if (documents && documents.length > 0) {
      context += `📄 DOCUMENTS (${documents.length} total):\n\n`;
      
      documents.forEach((doc, index) => {
        context += `${index + 1}. DOCUMENT: "${doc.title}"\n`;
        context += `   Type: ${doc.content_type}\n`;
        context += `   Created: ${new Date(doc.created_at).toLocaleDateString()}\n`;
        context += `   Last Updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
        context += `   Word Count: ${doc.word_count || 0}\n`;
        
        // Include substantial content (first 2000 chars for better context)
        if (doc.content) {
          const contentPreview = doc.content.substring(0, 2000);
          context += `   CONTENT:\n   ${contentPreview}${doc.content.length > 2000 ? '\n   [Content continues...]' : ''}\n`;
        }
        
        if (doc.metadata && Object.keys(doc.metadata).length > 0) {
          context += `   Metadata: ${JSON.stringify(doc.metadata)}\n`;
        }
        context += `\n---\n\n`;
      });
    } else {
      context += `📄 DOCUMENTS: No documents found\n\n`;
    }

    // Process books section
    if (books && books.length > 0) {
      context += `📚 BOOKS (${books.length} total):\n\n`;
      
      books.forEach((book, index) => {
        context += `${index + 1}. BOOK: "${book.title}"\n`;
        context += `   Genre: ${book.genre || 'Not specified'}\n`;
        context += `   Status: ${book.status}\n`;
        context += `   Word Count: ${book.word_count || 0}\n`;
        context += `   Created: ${new Date(book.created_at).toLocaleDateString()}\n`;
        context += `   Last Updated: ${new Date(book.updated_at).toLocaleDateString()}\n`;
        
        if (book.description) {
          context += `   Description: ${book.description}\n`;
        }
        
        if (book.metadata && Object.keys(book.metadata).length > 0) {
          context += `   Metadata: ${JSON.stringify(book.metadata)}\n`;
        }
        context += `\n---\n\n`;
      });
    } else {
      context += `📚 BOOKS: No books found\n\n`;
    }

    // Process chapters section
    if (chapters && chapters.length > 0) {
      context += `📖 CHAPTERS (${chapters.length} total):\n\n`;
      
      chapters.forEach((chapter, index) => {
        context += `${index + 1}. CHAPTER: "${chapter.title}" (Chapter ${chapter.chapter_number})\n`;
        context += `   Book ID: ${chapter.book_id}\n`;
        context += `   Status: ${chapter.status}\n`;
        context += `   Word Count: ${chapter.word_count || 0}\n`;
        context += `   Created: ${new Date(chapter.created_at).toLocaleDateString()}\n`;
        context += `   Last Updated: ${new Date(chapter.updated_at).toLocaleDateString()}\n`;
        
        // Include chapter content (first 1500 chars)
        if (chapter.content) {
          const contentPreview = chapter.content.substring(0, 1500);
          context += `   CONTENT:\n   ${contentPreview}${chapter.content.length > 1500 ? '\n   [Content continues...]' : ''}\n`;
        }
        
        if (chapter.notes) {
          context += `   Notes: ${chapter.notes}\n`;
        }
        context += `\n---\n\n`;
      });
    } else {
      context += `📖 CHAPTERS: No chapters found\n\n`;
    }

    // Add comprehensive summary
    const totalDocs = documents?.length || 0;
    const totalBooks = books?.length || 0;
    const totalChapters = chapters?.length || 0;
    
    context += `=== LIBRARY OVERVIEW ===\n`;
    context += `📊 Total Documents: ${totalDocs}\n`;
    context += `📚 Total Books: ${totalBooks}\n`;
    context += `📖 Total Chapters: ${totalChapters}\n`;
    context += `📝 Total Content Items: ${totalDocs + totalBooks + totalChapters}\n\n`;

    return context;
  }
}
