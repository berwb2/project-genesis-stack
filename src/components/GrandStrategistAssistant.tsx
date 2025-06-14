

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { callGrandStrategist, getAISession, createAISession, updateAISession } from '@/lib/api';
import AIResponseRenderer from './AIResponseRenderer';

interface AIAssistantProps {
  context?: string;
  documentId?: string;
  documentTitle?: string;
  onInputChange?: (value: string) => void;
  className?: string;
  onResultSelect?: (result: string) => void;
  variant?: 'default' | 'document';
}

const GrandStrategistAssistant: React.FC<AIAssistantProps> = ({
  context = '',
  documentId,
  documentTitle,
  onInputChange,
  className = '',
  onResultSelect,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [aiSession, setAiSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAI = async () => {
      setIsLoading(true);
      try {
        const sessionId = documentId || 'general';
        let session = await getAISession(sessionId, 'document');
        if (!session) {
          session = await createAISession(sessionId, 'document');
        }
        setAiSession(session);
        
        const chatHistory = session.chat_history;
        if (Array.isArray(chatHistory)) {
          setMessages(chatHistory);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error initializing AI:', error);
        toast.error('Failed to initialize AI assistant.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAI();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    onInputChange?.('');
    setIsLoading(true);

    try {
      const documentPayload = {
        id: documentId || 'general',
        title: documentTitle || 'General Conversation',
        content: context || '',
        type: 'document' as const,
        metadata: {}
      };
      
      const response = await callGrandStrategist(userMessage, documentPayload);

      if (response && (response.response || response.result)) {
        const assistantMessageContent = response.response || response.result;
        const assistantMessage = { role: 'assistant', content: assistantMessageContent };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);

        if (aiSession) {
          await updateAISession(aiSession.id, {
            chat_history: updatedMessages
          });
        }
        onResultSelect?.(assistantMessageContent);
      } else if (response && response.error) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `AI service error: ${response.error}\n\nRaw details: ${JSON.stringify(response.details || response)}`
          }
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `Unexpected AI response format: ${JSON.stringify(response)}`
          }
        ]);
      }
    } catch (error: any) {
      console.error('[AI CALL ERROR]', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please check your AI configuration and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn("w-full h-full rounded-lg shadow-md flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700", className)}>
      <CardContent className="p-2 h-full flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-2 space-y-4 p-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/logo.png" alt="AI Avatar" />
                  <AvatarFallback>GS</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-xl px-4 py-2 max-w-[85%] text-sm ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
                {message.role === 'assistant' ? (
                  <AIResponseRenderer content={message.content} />
                ) : (
                  <p className="break-words">{message.content}</p>
                )}
              </div>
               {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && !messages.some(m => m.role === 'assistant' && m.content.includes('Thinking')) && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/logo.png" alt="AI Avatar" />
                <AvatarFallback>GS</AvatarFallback>
              </Avatar>
              <div className="rounded-xl px-4 py-2 max-w-[85%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <p className="text-sm flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-full py-6 pl-5 pr-14 bg-gray-100 dark:bg-gray-800 border-transparent focus-visible:ring-2 focus-visible:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrandStrategistAssistant;

