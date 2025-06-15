import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, BookOpen, Brain, Plus, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listDocuments, getCurrentUser } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import ContentLoader from '@/components/ContentLoader';

const Books = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileNav />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 p-8 transition-all animate-fade-in overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Books</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Create New Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">Start writing a new book with AI assistance</p>
                  <Button asChild>
                    <Link to="/book-writer">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Book
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Sample books - would be replaced with actual data */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>The Art of Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">A comprehensive guide to strategic thinking</p>
                  <Button variant="outline" asChild>
                    <Link to="/books/1">View Book</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Deep Waters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">A novel about exploration and discovery</p>
                  <Button variant="outline" asChild>
                    <Link to="/books/2">View Book</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Books;
