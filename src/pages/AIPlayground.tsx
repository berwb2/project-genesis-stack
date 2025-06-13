
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AIAssistant from '@/components/AIAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { Brain, Sparkles } from 'lucide-react';

const AIPlayground = () => {
  const [content, setContent] = useState('');
  const isMobile = useIsMobile();

  const handleResultSelect = (result: string) => {
    setContent(result);
  };

  const sampleTexts = [
    "Write a blog post about the future of artificial intelligence.",
    "The quick brown fox jumps over the lazy dog. This is a sample sentence that could be improved for clarity and style.",
    "Explain quantum computing in simple terms for beginners.",
    "Create a marketing strategy for a new mobile app."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />
      <MobileNav />
      
      <div className="flex">
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Playground</h1>
                  <p className="text-gray-600">Explore Azure OpenAI capabilities</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Content Workspace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter your content here for AI analysis and enhancement, or use the AI Assistant to generate new content..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="mb-4"
                    />
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Quick start with sample content:</p>
                      <div className="flex flex-wrap gap-2">
                        {sampleTexts.map((text, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setContent(text)}
                            className="text-xs"
                          >
                            Sample {index + 1}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Word count: {content.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Features Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Azure OpenAI Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-medium text-purple-900 mb-2">Content Generation</h3>
                        <p className="text-sm text-purple-700">Generate creative content, articles, and responses using AI prompts.</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Document Analysis</h3>
                        <p className="text-sm text-blue-700">Analyze documents for summaries, insights, and key information.</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2">Content Enhancement</h3>
                        <p className="text-sm text-green-700">Improve grammar, style, clarity, and expand existing content.</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-medium text-orange-900 mb-2">Idea Generation</h3>
                        <p className="text-sm text-orange-700">Generate creative ideas and brainstorm solutions for any topic.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Assistant Sidebar */}
              <div className="lg:col-span-1">
                <AIAssistant 
                  context={content}
                  onResultSelect={handleResultSelect}
                  className="sticky top-6"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIPlayground;
