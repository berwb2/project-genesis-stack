import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, ChevronRight, FileText, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

const BookWriter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileNav />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {!useIsMobile() && <Sidebar />}
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Book Writer</h1>
                <div className="text-muted-foreground">Create and manage your book projects</div>
              </div>
              <Button asChild>
                <Link to="/create?type=book">
                  <Plus className="mr-2 h-4 w-4" />
                  New Book
                </Link>
              </Button>
            </div>
            
            <Tabs defaultValue="current" className="space-y-4">
              <TabsList>
                <TabsTrigger value="current">Current Projects</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Book Project Card */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>Fantasy Novel</span>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        Last edited 2 days ago • 24 chapters
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">65,000</span> words
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/books/1">
                            Open <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Book Project Card */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>Memoir</span>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        Last edited 5 days ago • 12 chapters
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">32,500</span> words
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/books/2">
                            Open <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Create New Book Card */}
                  <Card className="border-dashed hover:shadow-md transition-shadow">
                    <CardContent className="flex flex-col items-center justify-center h-full py-8">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <Plus className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Create New Book</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Start a new book project from scratch or template
                      </p>
                      <Button asChild>
                        <Link to="/create?type=book">
                          <Plus className="mr-2 h-4 w-4" />
                          New Book
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Recent Documents</h2>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Chapter 1: The Beginning</div>
                      <div className="text-sm text-muted-foreground">Fantasy Novel • Edited 2 days ago</div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                  
                  <div className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Character Profile: Protagonist</div>
                      <div className="text-sm text-muted-foreground">Fantasy Novel • Edited 3 days ago</div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                  
                  <div className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Chapter 5: Childhood Memories</div>
                      <div className="text-sm text-muted-foreground">Memoir • Edited 5 days ago</div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle>Novel Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Standard novel structure with chapter organization
                      </p>
                      <Button size="sm">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle>Non-Fiction Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Organized sections with research notes and citations
                      </p>
                      <Button size="sm">Use Template</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle>Short Story Collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Multiple short stories with shared themes
                      </p>
                      <Button size="sm">Use Template</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Book Writer Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-template">Default Template</Label>
                      <Select defaultValue="novel">
                        <SelectTrigger id="default-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novel">Novel Template</SelectItem>
                          <SelectItem value="nonfiction">Non-Fiction Template</SelectItem>
                          <SelectItem value="shortstory">Short Story Collection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author-name">Default Author Name</Label>
                      <Input id="author-name" placeholder="Your name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="copyright">Default Copyright Notice</Label>
                      <Textarea id="copyright" placeholder="© 2023 Your Name. All rights reserved." />
                    </div>
                    
                    <Button>Save Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookWriter;
