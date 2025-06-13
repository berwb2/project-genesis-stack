
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Brain, ChevronDown, ChevronUp, Sparkles, Loader2, Copy, RefreshCw } from 'lucide-react';
import { useAIGenerate, useDocumentAnalysis, useContentEnhancement, useIdeaGeneration } from '@/hooks/useAzureAI';
import { toast } from '@/components/ui/sonner';

interface AIAssistantProps {
  context?: string;
  onResultSelect?: (result: string) => void;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  context = '',
  onResultSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'enhance' | 'ideas'>('generate');
  const [prompt, setPrompt] = useState('');
  const [analysisType, setAnalysisType] = useState<'summary' | 'insights' | 'improvements' | 'keywords'>('summary');
  const [enhancementType, setEnhancementType] = useState<'grammar' | 'style' | 'clarity' | 'expansion'>('grammar');
  const [ideaTopic, setIdeaTopic] = useState('');

  const { generateText, result: generatedText, isLoading: isGenerating } = useAIGenerate();
  const { analyzeDocument, results: analysisResults, isLoading: isAnalyzing } = useDocumentAnalysis();
  const { enhanceContent, enhancedContent, isLoading: isEnhancing } = useContentEnhancement();
  const { generateIdeas, ideas, isLoading: isGeneratingIdeas } = useIdeaGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await generateText(prompt, context ? `Context: ${context}` : undefined);
  };

  const handleAnalyze = async () => {
    if (!context.trim()) {
      toast.error('No content to analyze');
      return;
    }
    await analyzeDocument(context, analysisType);
  };

  const handleEnhance = async () => {
    if (!context.trim()) {
      toast.error('No content to enhance');
      return;
    }
    await enhanceContent(context, enhancementType);
  };

  const handleGenerateIdeas = async () => {
    if (!ideaTopic.trim()) return;
    await generateIdeas(ideaTopic, context);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const insertResult = (text: string) => {
    onResultSelect?.(text);
    toast.success('Result applied');
  };

  return (
    <Card className={`border-purple-200 shadow-lg ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {[
                { id: 'generate', label: 'Generate', icon: Sparkles },
                { id: 'analyze', label: 'Analyze', icon: Brain },
                { id: 'enhance', label: 'Enhance', icon: RefreshCw },
                { id: 'ideas', label: 'Ideas', icon: Sparkles }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(id as any)}
                  className="whitespace-nowrap"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="What would you like me to generate?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate
                </Button>
                
                {generatedText && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Generated Content</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedText)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {onResultSelect && (
                          <Button size="sm" variant="ghost" onClick={() => insertResult(generatedText)}>
                            Insert
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
                  </div>
                )}
              </div>
            )}

            {/* Analyze Tab */}
            {activeTab === 'analyze' && (
              <div className="space-y-3">
                <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="insights">Key Insights</SelectItem>
                    <SelectItem value="improvements">Improvements</SelectItem>
                    <SelectItem value="keywords">Keywords</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!context.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                  Analyze Content
                </Button>
                
                {analysisResults[analysisType] && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Analysis: {analysisType}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(analysisResults[analysisType])}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {onResultSelect && (
                          <Button size="sm" variant="ghost" onClick={() => insertResult(analysisResults[analysisType])}>
                            Insert
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{analysisResults[analysisType]}</p>
                  </div>
                )}
              </div>
            )}

            {/* Enhance Tab */}
            {activeTab === 'enhance' && (
              <div className="space-y-3">
                <Select value={enhancementType} onValueChange={(value: any) => setEnhancementType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">Fix Grammar</SelectItem>
                    <SelectItem value="style">Improve Style</SelectItem>
                    <SelectItem value="clarity">Enhance Clarity</SelectItem>
                    <SelectItem value="expansion">Expand Content</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleEnhance} 
                  disabled={!context.trim() || isEnhancing}
                  className="w-full"
                >
                  {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Enhance Content
                </Button>
                
                {enhancedContent && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Enhanced: {enhancementType}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(enhancedContent)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {onResultSelect && (
                          <Button size="sm" variant="ghost" onClick={() => insertResult(enhancedContent)}>
                            Insert
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{enhancedContent}</p>
                  </div>
                )}
              </div>
            )}

            {/* Ideas Tab */}
            {activeTab === 'ideas' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="What topic would you like ideas about?"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  rows={2}
                />
                <Button 
                  onClick={handleGenerateIdeas} 
                  disabled={!ideaTopic.trim() || isGeneratingIdeas}
                  className="w-full"
                >
                  {isGeneratingIdeas ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate Ideas
                </Button>
                
                {ideas.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Generated Ideas</Badge>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ideas.join('\n'))}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <ul className="space-y-2">
                      {ideas.map((idea, index) => (
                        <li key={index} className="text-sm p-2 bg-white rounded border-l-4 border-purple-400">
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AIAssistant;
