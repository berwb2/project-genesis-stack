
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Loader2, CheckCircle, AlertTriangle, Sparkles, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

const GrandStrategist = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for the Grand Strategist');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      console.log('Calling Grand Strategist with prompt:', prompt.substring(0, 100) + '...');
      
      const { data, error: functionError } = await supabase.functions.invoke('grand-strategist', {
        body: {
          prompt: prompt.trim(),
          context: `User is requesting strategic assistance with: ${prompt.substring(0, 200)}`,
          documentType: 'strategy'
        }
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(`Function call failed: ${functionError.message}`);
      }

      if (data?.error) {
        console.error('Grand Strategist function returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.result) {
        throw new Error('No response generated from Grand Strategist');
      }

      setResponse(data.result);
      setRequestCount(prev => prev + 1);
      toast.success('Grand Strategist response generated successfully!');
      
    } catch (err: any) {
      console.error('Grand Strategist error:', err);
      const errorMessage = err.message || 'Failed to get response from Grand Strategist';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt('');
    setResponse('');
    setError(null);
  };

  const samplePrompts = [
    "Help me create a comprehensive business strategy for launching a new product",
    "Analyze the competitive landscape for AI-powered document management tools",
    "Develop a content strategy for increasing user engagement on our platform",
    "Create a project roadmap for implementing advanced AI features",
    "Design a framework for measuring success in document collaboration tools"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      <MobileNav />
      
      <div className="flex">
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Grand Strategist
                  </h1>
                  <p className="text-gray-600 text-lg">Your AI-powered strategic advisor and document intelligence assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Brain className="w-4 h-4 mr-1" />
                  Azure OpenAI Powered
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Strategic Intelligence
                </Badge>
                {requestCount > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {requestCount} Request{requestCount !== 1 ? 's' : ''} Complete
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Brain className="h-5 w-5" />
                    Strategic Input
                  </CardTitle>
                  <CardDescription>
                    Describe your challenge, goal, or question for strategic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Textarea
                        placeholder="Enter your strategic question or challenge here. The Grand Strategist will provide comprehensive analysis and actionable recommendations..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={8}
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        {prompt.length}/2000 characters
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !prompt.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Strategizing...
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Consult Grand Strategist
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={clearAll}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Clear
                      </Button>
                    </div>
                  </form>

                  {/* Sample Prompts */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sample Strategic Questions:</h4>
                    <div className="space-y-2">
                      {samplePrompts.map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(sample)}
                          className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Sparkles className="h-5 w-5" />
                    Strategic Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive insights and actionable recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Strategic Analysis Failed:</strong> {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">The Grand Strategist is analyzing your request...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
                      </div>
                    </div>
                  )}

                  {response && !isLoading && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="prose prose-blue max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {response}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(response)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          Copy Analysis
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([response], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'grand-strategist-analysis.txt';
                            a.click();
                          }}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  )}

                  {!response && !isLoading && !error && (
                    <div className="text-center py-12 text-gray-500">
                      <Crown className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Your strategic analysis will appear here</p>
                      <p className="text-sm mt-2">Enter a question above to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Features Overview */}
            <Card className="mt-8 border-indigo-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-800">Grand Strategist Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-800 mb-2">Strategic Analysis</h3>
                    <p className="text-sm text-purple-700">Deep analysis of business challenges with actionable insights</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-800 mb-2">Content Strategy</h3>
                    <p className="text-sm text-blue-700">Comprehensive content and communication planning</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Crown className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-indigo-800 mb-2">Executive Guidance</h3>
                    <p className="text-sm text-indigo-700">High-level strategic recommendations and frameworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GrandStrategist;
