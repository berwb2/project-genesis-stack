import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface AIAssistantSidebarProps {
  context?: string;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  onSend?: (message: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'document';
  onClose?: () => void;
}

const GrandStrategistAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({
  context = '',
  messages: initialMessages = [],
  onSend,
  inputValue: initialInputValue = '',
  onInputChange,
  isLoading,
  className,
  variant = 'default',
  onClose
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState(initialInputValue);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(initialMessages);
    setInputValue(initialInputValue);
  }, [initialMessages, initialInputValue]);

  useEffect(() => {
    // Scroll to bottom on message change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange?.(value);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setMessages([...messages, { role: 'user', content: message }]);
    setInputValue('');
    onInputChange?.('');
    onSend?.(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getHeaderTitle = () => {
    switch (variant) {
      case 'document':
        return 'Grand Strategist Assistant';
      default:
        return 'Grand Strategist Claude';
    }
  };

  const getHeaderDescription = () => {
    switch (variant) {
      case 'document':
        return 'AI assistant for document insights';
      default:
        return 'Intelligent writing assistant';
    }
  };

  const getSystemPrompt = () => {
    switch (variant) {
      case 'document':
        return `You are a Grand Strategist assistant helping users understand their documents. Use the document context to answer questions accurately.`;
      default:
        return `You are a Grand Strategist intelligent writing assistant. Help users generate content, improve writing, and brainstorm ideas.`;
    }
  };

  return (
    <Card className={cn("w-full rounded-lg border shadow-md flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{getHeaderTitle()}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {getHeaderDescription()}
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 space-y-2">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto scroll-smooth space-y-2 mb-2"
        >
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2">
              {message.role === 'assistant' ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/logo.png" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm w-full break-words">
                    {message.content}
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-500 text-white rounded-lg p-3 text-sm w-full break-words">
                    {message.content}
                  </div>
                </>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/logo.png" alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3 text-sm w-full">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center space-x-2 mt-2">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow rounded-md border-gray-200 focus:border-blue-500"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrandStrategistAssistantSidebar;
