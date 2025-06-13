
interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  apiVersion: string;
  model: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AzureAIService {
  private config: AzureOpenAIConfig;

  constructor() {
    this.config = {
      endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
      apiKey: import.meta.env.VITE_AZURE_OPENAI_KEY || '',
      apiVersion: import.meta.env.VITE_AZURE_OPENAI_VERSION || '2024-05-01-preview',
      model: import.meta.env.VITE_AZURE_OPENAI_MODEL || 'gpt-4o'
    };
  }

  private validateConfig(): void {
    if (!this.config.endpoint || !this.config.apiKey) {
      throw new Error('Azure OpenAI configuration is incomplete. Please check your environment variables.');
    }
  }

  async createChatCompletion(
    messages: ChatMessage[],
    options: {
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    } = {}
  ): Promise<ChatCompletionResponse> {
    this.validateConfig();

    const url = `${this.config.endpoint}/openai/deployments/${this.config.model}/chat/completions?api-version=${this.config.apiVersion}`;

    const requestBody = {
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      stream: options.stream || false
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Azure OpenAI service error:', error);
      throw error;
    }
  }

  async generateText(
    prompt: string,
    systemMessage?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await this.createChatCompletion(messages, options);
    
    return response.choices[0]?.message?.content || '';
  }

  async analyzeDocument(
    documentContent: string,
    analysisType: 'summary' | 'insights' | 'improvements' | 'keywords'
  ): Promise<string> {
    const systemPrompts = {
      summary: 'You are an expert document summarizer. Provide a concise, well-structured summary of the given document.',
      insights: 'You are an expert analyst. Analyze the document and provide key insights, patterns, and important observations.',
      improvements: 'You are an expert editor. Suggest specific improvements for clarity, structure, and impact.',
      keywords: 'You are an expert in content analysis. Extract the most important keywords and key phrases from the document.'
    };

    return this.generateText(
      documentContent,
      systemPrompts[analysisType],
      { maxTokens: 800, temperature: 0.3 }
    );
  }

  async enhanceContent(
    content: string,
    enhancementType: 'grammar' | 'style' | 'clarity' | 'expansion'
  ): Promise<string> {
    const systemPrompts = {
      grammar: 'You are an expert grammar and spelling checker. Correct any errors while maintaining the original meaning and tone.',
      style: 'You are an expert writing coach. Improve the writing style, flow, and readability while preserving the original message.',
      clarity: 'You are an expert editor focused on clarity. Rewrite the content to be clearer and more understandable.',
      expansion: 'You are an expert writer. Expand the content with relevant details, examples, and insights while maintaining quality.'
    };

    return this.generateText(
      content,
      systemPrompts[enhancementType],
      { maxTokens: 1200, temperature: 0.4 }
    );
  }

  async generateIdeas(
    topic: string,
    context?: string,
    count: number = 5
  ): Promise<string[]> {
    const systemMessage = `You are a creative idea generator. Generate exactly ${count} creative, practical, and diverse ideas about the given topic. Format each idea as a separate line starting with a number.`;
    
    const prompt = context 
      ? `Topic: ${topic}\nContext: ${context}\nGenerate ${count} ideas:`
      : `Topic: ${topic}\nGenerate ${count} ideas:`;

    const response = await this.generateText(prompt, systemMessage, {
      maxTokens: 600,
      temperature: 0.8
    });

    return response
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(idea => idea.length > 0)
      .slice(0, count);
  }
}

// Export a singleton instance
export const azureAIService = new AzureAIService();
