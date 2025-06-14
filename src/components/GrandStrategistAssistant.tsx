
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { callGrandStrategist, getAISession, createAISession, updateAISession } from '@/lib/api';

interface AIAssistantProps {
  context?: string;
  documentId?: string;
  documentTitle?: string;
  messages?: any[];
  onSend?: (message: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  onResultSelect?: (result: string) => void;
  variant?: 'default' | 'document';
}

const GrandStrategistAssistant: React.FC<AIAssistantProps> = ({
  context = '',
  documentId,
  documentTitle,
  messages: initialMessages = [],
  onSend,
  inputValue: initialInputValue = '',
  onInputChange,
  isLoading = false,
  className = '',
  onResultSelect,
  variant = 'default'
}) => {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState(initialInputValue);
  const [aiSession, setAiSession] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Initialize AI session on mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        let session = await getAISession('default', 'document');
        if (!session) {
          session = await createAISession('default', 'document');
        }
        setAiSession(session);
        
        // Safely handle chat_history with proper type checking
        const chatHistory = session.chat_history;
        if (Array.isArray(chatHistory)) {
          setMessages(chatHistory);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error initializing AI:', error);
      }
    };

    initializeAI();
  }, []);

  // Update local state when props change
  useEffect(() => {
    setMessages(initialMessages);
    setInput(initialInputValue);
  }, [initialMessages, initialInputValue]);

  // Scroll to bottom on new messages
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
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    onInputChange?.('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const doc = {
        id: documentId || 'general',
        title: documentTitle || 'General Conversation',
        content: context,
        type: 'document' as const
      };
      
      // Call AI with the merged context and user input as message
      const response = await callGrandStrategist(doc, userMessage);

      // Enhanced error check for response structure and debugging
      if (response && (response.response || response.result)) {
        const assistantMessage = { role: 'assistant', content: response.response || response.result };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);

        // Update AI session with chat history
        await updateAISession(aiSession.id, {
          chat_history: updatedMessages
        });

        // If a result selection handler is provided, call it with the AI response
        onResultSelect?.(response.response || response.result);
      } else if (response && response.error) {
        // Show backend error details to help user debug
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn("w-full rounded-lg shadow-md border-gray-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">
          Grand Strategist
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Intelligent Writing Assistant
        </div>
      </CardHeader>
      <CardContent className="pl-2 pr-2 pb-2 pt-0 h-[400px] flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-2">
          {messages.map((message, index) => (
            <div key={index} className={`mb-3 flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="mr-3 h-8 w-8">
                  <AvatarImage src="/logo.png" alt="AI Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-xl px-4 py-2 max-w-[75%] ${message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3 flex items-start justify-start">
              <Avatar className="mr-3 h-8 w-8">
                <AvatarImage src="/logo.png" alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="rounded-xl px-4 py-2 max-w-[75%] bg-gray-100 text-gray-800">
                <p className="text-sm"><Loader2 className="h-4 w-4 animate-spin mr-1 inline-block" /> Thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <div className="flex rounded-md shadow-sm">
            <Input
              type="text"
              placeholder="Ask Grand Strategist..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="rounded-r-none border-gray-200 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              className="rounded-l-none bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrandStrategistAssistant;
