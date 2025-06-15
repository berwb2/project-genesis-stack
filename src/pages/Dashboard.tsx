
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

const Dashboard = () => {
  const isMobile = useIsMobile();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const { data: documentsData, isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: async () => {
      const response = await listDocuments({}, { field: 'updated_at', direction: 'desc' }, 1, 5);
      return response;
    },
    enabled: !!user,
  });

  const isLoading = isUserLoading || isDocumentsLoading;
  const recentDocuments = documentsData?.documents || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (isMobile) {
      if (diffInHours < 1) return 'Now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 relative">
      <Navbar />
      <MobileNav />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${isMobile ? 'px-2 pt-20' : 'p-8'} transition-all animate-fade-in overflow-y-auto`}>
          {isLoading ? (
            <ContentLoader />
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-water-light to-blue-100 dark:from-slate-800 dark:to-slate-800/50 border border-water-light dark:border-slate-700 shadow mb-8 px-6 py-8 flex items-center gap-5 overflow-hidden relative">
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="rounded-full bg-water dark:bg-sky-500 px-6 py-6 flex items-center justify-center shadow-md">
                    <LayoutDashboard className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-medium text-water-deep dark:text-sky-300 mb-2">
                    Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
                  </h1>
                  <div className="max-w-2xl text-blue-800 dark:text-blue-300 text-base md:text-lg">
                    Here’s what’s happening in your workspace today. Jump in!
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`grid gap-4 mb-10 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} transition-all`}>
                <Card className="border-water-light dark:border-slate-800 cursor-pointer bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-800/80">
                  <CardContent className="p-5">
                    <Link to="/documents" className="block">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-water-light dark:bg-sky-900/50 rounded-lg shadow ring-2 ring-water/20 dark:ring-sky-500/20">
                          <FileText className="h-6 w-6 text-water dark:text-sky-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-water-deep dark:text-slate-100">Documents</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-400 opacity-80">Manage files</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-water-light dark:border-slate-800 cursor-pointer bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-800/80">
                  <CardContent className="p-5">
                    <Link to="/folders" className="block">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-200 dark:bg-blue-900/50 rounded-lg shadow ring-2 ring-blue-200/20 dark:ring-blue-500/20">
                          <FolderOpen className="h-6 w-6 text-water-deep dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-water-deep dark:text-slate-100">Folders</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-400 opacity-80">Organize content</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-water-light dark:border-slate-800 cursor-pointer bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-800/80">
                  <CardContent className="p-5">
                    <Link to="/book-writer" className="block">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg shadow ring-2 ring-purple-200/20 dark:ring-purple-500/20">
                          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-water-deep dark:text-slate-100">Write</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-400 opacity-80">Create books</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-water-light dark:border-slate-800 cursor-pointer bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-800/80">
                  <CardContent className="p-5">
                    <Link to="/grand-strategist" className="block">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg shadow ring-2 ring-orange-200/20 dark:ring-orange-500/20">
                          <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-water-deep dark:text-slate-100">AI Chat</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-400 opacity-80">Get insights</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Documents */}
              <Card className="border-water-light dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 shadow-2xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
                  <CardTitle className="text-water-deep dark:text-sky-300 font-serif text-xl">Recent Documents</CardTitle>
                  <Button variant="outline" size="sm" className="border-water dark:border-sky-500 dark:text-sky-300 dark:hover:bg-sky-900/50 dark:hover:text-sky-200" asChild>
                    <Link to="/documents">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-blue-500 dark:text-sky-400 mb-4 text-lg">No documents yet</p>
                      <Button asChild>
                        <Link to="/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create your first document
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800/50 dark:to-slate-900/20 rounded-xl hover:-translate-y-1 hover:shadow-lg dark:hover:bg-slate-800 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center bg-blue-100 dark:bg-sky-900/50 rounded-md h-10 w-10 flex-shrink-0">
                              <FileText className="h-5 w-5 text-water-deep dark:text-sky-400" />
                            </div>
                            <div className="min-w-0">
                              <Link to={`/documents/${doc.id}`} className="block group">
                                <h4 className="font-medium text-water-deep dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-sky-300 truncate">{doc.title}</h4>
                                <p className="text-xs text-blue-800 dark:text-blue-400 opacity-80 mt-0.5 truncate">
                                  {doc.content_type} • Updated {formatDate(doc.updated_at)}
                                </p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
