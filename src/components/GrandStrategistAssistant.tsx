
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { callGrandStrategist, getAISession, createAISession, updateAISession } from '@/lib/api';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ChatWelcome from './chat/ChatWelcome';
import ChatLoadingIndicator from './chat/ChatLoadingIndicator';

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
        const assistantId = 'grand-strategist';
        let session = await getAISession(documentId || null, 'document', assistantId);
        if (!session) {
          session = await createAISession(documentId || null, 'document', assistantId);
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
        metadata: {
          assistant: 'grand-strategist'
        }
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
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast.info("File upload is not currently supported by the Grand Strategist.");
  };

  return (
    <Card className={cn("w-full h-full rounded-lg shadow-md flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700", className)}>
      <CardContent className="p-2 h-full flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-2 space-y-4 p-2">
          {messages.length === 0 && !isLoading ? (
            <ChatWelcome
              title="Grand Strategist Assistant"
              description="Your personal assistant for high-level strategy and planning."
              avatar="/logo.png"
              fallback="GS"
            />
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                assistantName="Grand Strategist"
                assistantAvatar="/logo.png"
                assistantFallback="GS"
              />
            ))
          )}
          {isLoading && (
             <ChatLoadingIndicator
              avatarSrc="/logo.png"
              avatarFallback="GS"
              text="Thinking..."
            />
          )}
        </div>
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onFileUpload={handleFileUpload}
          placeholder="Ask the Grand Strategist..."
        />
      </CardContent>
    </Card>
  );
};

export default GrandStrategistAssistant;
