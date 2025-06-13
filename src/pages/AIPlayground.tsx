import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AIAssistant from '@/components/AIAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAIGenerate, useDocumentAnalysis, useContentEnhancement, useIdeaGeneration } from '@/hooks/useAzureAI';
import { Brain, Sparkles, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const AIPlayground = () => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'enhance' | 'ideas'>('generate');
  const isMobile = useIsMobile();

  const aiGenerate = useAIGenerate({
    onSuccess: (result) => setContent(result),
    onError: (error) => console.error('Generation error:', error)
  });

  const documentAnalysis = useDocumentAnalysis({
    onSuccess: (result) => console.log('Analysis complete:', result),
    onError: (error) => console.error('Analysis error:', error)
  });

  const contentEnhancement = useContentEnhancement({
    onSuccess: (result) => setContent(result),
    onError: (error) => console.error('Enhancement error:', error)
  });

  const ideaGeneration = useIdeaGeneration({
    onSuccess: (ideas) => setContent(Array.isArray(ideas) ? ideas.join('\n\n') : ideas),
    onError: (error) => console.error('Idea generation error:', error)
  });

  const handleResultSelect = (result: string) => {
    setContent(result);
  };

  const sampleTexts = [
    "Write a comprehensive guide to implementing AI in business workflows.",
    "The quick brown fox jumps over the lazy dog. This is a sample sentence that could be improved for clarity and style.",
    "Explain quantum computing in simple terms for beginners, covering the basic principles and potential applications.",
    "Create a detailed marketing strategy for a new mobile app that helps users manage their daily tasks and productivity."
  ];

  const features = [
    {
      id: 'generate',
      title: 'Content Generation',
      description: 'Generate creative content, articles, and responses using AI prompts',
      color: 'purple',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: 'analyze',
      title: 'Document Analysis', 
      description: 'Analyze documents for summaries, insights, and key information',
      color: 'blue',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: 'enhance',
      title: 'Content Enhancement',
      description: 'Improve grammar, style, clarity, and expand existing content',
      color: 'green',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: 'ideas',
      title: 'Idea Generation',
      description: 'Generate creative ideas and brainstorm solutions for any topic',
      color: 'orange',
      icon: <Loader2 className="h-5 w-5" />
    }
  ] as const;

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 text-purple-900 border-purple-200',
      blue: 'bg-blue-50 text-blue-900 border-blue-200',
      green: 'bg-green-50 text-green-900 border-green-200',
      orange: 'bg-orange-50 text-orange-900 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const renderFeaturePanel = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-800">Content Generation</h3>
            <p className="text-sm text-gray-600">Use AI to generate original content based on your prompts and requirements.</p>
            <Button
              onClick={() => aiGenerate.generateText('Generate an engaging blog post about the future of AI in everyday life')}
              disabled={aiGenerate.isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {aiGenerate.isLoading ? 'Generating...' : 'Generate Sample Content'}
            </Button>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-800">Document Analysis</h3>
            <p className="text-sm text-gray-600">Analyze your content for insights, summaries, and key information extraction.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => documentAnalysis.analyzeDocument(content, 'summary')}
                disabled={documentAnalysis.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Summarize
              </Button>
              <Button
                onClick={() => documentAnalysis.analyzeDocument(content, 'insights')}
                disabled={documentAnalysis.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Get Insights
              </Button>
              <Button
                onClick={() => documentAnalysis.analyzeDocument(content, 'improvements')}
                disabled={documentAnalysis.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Suggest Improvements
              </Button>
              <Button
                onClick={() => documentAnalysis.analyzeDocument(content, 'keywords')}
                disabled={documentAnalysis.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Extract Keywords
              </Button>
            </div>
            {documentAnalysis.isLoading && (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing content...
              </div>
            )}
            {Object.entries(documentAnalysis.results).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Analysis Results:</h4>
                {Object.entries(documentAnalysis.results).map(([type, result]) => (
                  <div key={type} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-sm text-blue-800 capitalize mb-1">{type}</div>
                    <div className="text-sm text-blue-700">{result}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-green-800">Content Enhancement</h3>
            <p className="text-sm text-gray-600">Improve your existing content with AI-powered enhancements.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => contentEnhancement.enhanceContent(content, 'grammar')}
                disabled={contentEnhancement.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Fix Grammar
              </Button>
              <Button
                onClick={() => contentEnhancement.enhanceContent(content, 'style')}
                disabled={contentEnhancement.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Improve Style
              </Button>
              <Button
                onClick={() => contentEnhancement.enhanceContent(content, 'clarity')}
                disabled={contentEnhancement.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Enhance Clarity
              </Button>
              <Button
                onClick={() => contentEnhancement.enhanceContent(content, 'expansion')}
                disabled={contentEnhancement.isLoading || !content.trim()}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Expand Content
              </Button>
            </div>
            {contentEnhancement.isLoading && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enhancing content...
              </div>
            )}
          </div>
        );

      case 'ideas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-orange-800">Idea Generation</h3>
            <p className="text-sm text-gray-600">Generate creative ideas and brainstorm solutions for any topic.</p>
            <Button
              onClick={() => ideaGeneration.generateIdeas('innovative mobile app features', 'productivity and task management', 5)}
              disabled={ideaGeneration.isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {ideaGeneration.isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
            </Button>
            {ideaGeneration.ideas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Generated Ideas:</h4>
                <div className="space-y-2">
                  {ideaGeneration.ideas.map((idea, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded border border-orange-200">
                      <div className="text-sm text-orange-800">{index + 1}. {idea}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
                  <p className="text-gray-600">Explore Azure OpenAI capabilities with advanced AI features</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Brain className="w-4 h-4 mr-1" />
                  Azure OpenAI
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Multi-Modal AI
                </Badge>
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
                      placeholder="Enter your content here for AI analysis and enhancement, or use the AI features to generate new content..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="mb-4 border-blue-200 focus:border-blue-400"
                    />
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Quick start with sample content:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {sampleTexts.map((text, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setContent(text)}
                            className="text-xs text-left h-auto p-3 whitespace-normal"
                          >
                            Sample {index + 1}: {text.substring(0, 80)}...
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center justify-between">
                      <span>Word count: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
                      <span>Characters: {content.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Feature Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {features.map((feature) => (
                        <Button
                          key={feature.id}
                          variant={activeTab === feature.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveTab(feature.id)}
                          className={`flex items-center gap-2 ${
                            activeTab === feature.id 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {feature.icon}
                          {feature.title}
                        </Button>
                      ))}
                    </div>

                    {/* Feature Panel */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      {renderFeaturePanel()}
                    </div>
                  </CardContent>
                </Card>

                {/* Azure OpenAI Features Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Azure OpenAI Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature) => (
                        <div key={feature.id} className={`p-4 rounded-lg border ${getColorClasses(feature.color)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {feature.icon}
                            <h3 className="font-medium">{feature.title}</h3>
                          </div>
                          <p className="text-sm opacity-80">{feature.description}</p>
                        </div>
                      ))}
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
