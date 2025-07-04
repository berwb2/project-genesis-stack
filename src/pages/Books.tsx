
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '@/components/ui/layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Book, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import CreateBookDialog from '@/components/CreateBookDialog';
import { listDocuments } from '@/lib/api';

interface BookMeta {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  chapter_count: number;
  total_word_count: number;
}

const Books = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch book documents (documents with content_type 'book')
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      return await listDocuments(
        { contentType: 'book' },
        { field: 'created_at', direction: 'desc' },
        1,
        50
      );
    },
  });

  // Transform documents into book format
  const books: BookMeta[] = booksResponse?.documents?.map(doc => {
    const metadata = doc.metadata as any || {};
    
    let chapters: { wordCount?: number }[] = [];
    try {
      if (doc.content && doc.content.trim() !== '') {
        const parsedContent = JSON.parse(doc.content);
        if (Array.isArray(parsedContent)) {
          chapters = parsedContent;
        }
      }
    } catch (e) {
      console.error(`Error parsing chapters for book ${doc.id}:`, e);
      chapters = [];
    }

    const totalWordCount = chapters.reduce((sum, chapter) => sum + (chapter.wordCount || 0), 0);
    
    return {
      id: doc.id,
      title: doc.title,
      description: metadata.description || null,
      cover_image_url: metadata.cover_image_url || null,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      user_id: doc.user_id,
      chapter_count: chapters.length,
      total_word_count: totalWordCount
    };
  }) || [];

  const handleBookCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-2 text-blue-600">Book Writing Studio</h1>
          <p className="text-blue-700">Create and manage your books with organized chapters</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Book
        </Button>
      </div>

      {books.length === 0 ? (
        <Card className="border-blue-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Book className="h-16 w-16 text-blue-400 mb-4" />
            <h2 className="text-xl font-medium mb-2 text-blue-600">Start Your First Book</h2>
            <p className="text-blue-700 text-center mb-6 max-w-md">
              Create your first book to begin writing organized chapters and building your literary work.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow border-blue-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-serif text-blue-600">
                      <Link to={`/documents/${book.id}`} className="hover:text-blue-700 transition-colors">
                        {book.title}
                      </Link>
                    </CardTitle>
                    {book.description && (
                      <p className="text-sm text-blue-700 line-clamp-2 mt-2">{book.description}</p>
                    )}
                  </div>
                  {book.cover_image_url && (
                    <img 
                      src={book.cover_image_url} 
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded border border-blue-200 ml-3"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    <FileText className="mr-1 h-3 w-3" />
                    {book.chapter_count} chapters
                  </Badge>
                  {book.total_word_count > 0 && (
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      {book.total_word_count.toLocaleString()} words
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Created {format(new Date(book.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBookDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onBookCreated={handleBookCreated}
      />
      
      <footer className="py-6 mt-8 border-t border-blue-200 bg-blue-50">
        <div className="container mx-auto px-4 text-center text-blue-600">
          © {new Date().getFullYear()} DeepWaters. All rights reserved.
        </div>
      </footer>
    </Layout>
  );
};

export default Books;
