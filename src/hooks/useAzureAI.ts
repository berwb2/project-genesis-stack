
import { useState, useCallback } from 'react';
import { azureAIService } from '@/services/azureAIService';
import { toast } from '@/components/ui/sonner';

interface UseAIGenerateOptions {
  onSuccess?: (result: string) => void;
  onError?: (error: Error) => void;
}

export const useAIGenerate = (options?: UseAIGenerateOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const generateText = useCallback(async (
    prompt: string,
    systemMessage?: string,
    aiOptions?: { maxTokens?: number; temperature?: number }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await azureAIService.generateText(prompt, systemMessage, aiOptions);
      setResult(response);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      toast.error('AI generation failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    generateText,
    result,
    isLoading,
    error,
    clearResult: () => setResult(''),
    clearError: () => setError(null)
  };
};

export const useDocumentAnalysis = (options?: UseAIGenerateOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState<Error | null>(null);

  const analyzeDocument = useCallback(async (
    content: string,
    analysisType: 'summary' | 'insights' | 'improvements' | 'keywords'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await azureAIService.analyzeDocument(content, analysisType);
      setResults(prev => ({ ...prev, [analysisType]: response }));
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      toast.error('Document analysis failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    analyzeDocument,
    results,
    isLoading,
    error,
    clearResults: () => setResults({}),
    clearError: () => setError(null)
  };
};

export const useContentEnhancement = (options?: UseAIGenerateOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const enhanceContent = useCallback(async (
    content: string,
    enhancementType: 'grammar' | 'style' | 'clarity' | 'expansion'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await azureAIService.enhanceContent(content, enhancementType);
      setEnhancedContent(response);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      toast.error('Content enhancement failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    enhanceContent,
    enhancedContent,
    isLoading,
    error,
    clearContent: () => setEnhancedContent(''),
    clearError: () => setError(null)
  };
};

export const useIdeaGeneration = (options?: UseAIGenerateOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateIdeas = useCallback(async (
    topic: string,
    context?: string,
    count: number = 5
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await azureAIService.generateIdeas(topic, context, count);
      setIdeas(response);
      options?.onSuccess?.(response.join('\n'));
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      toast.error('Idea generation failed: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    generateIdeas,
    ideas,
    isLoading,
    error,
    clearIdeas: () => setIdeas([]),
    clearError: () => setError(null)
  };
};
