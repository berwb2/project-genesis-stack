
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils"

interface AIAssistantSidebarProps {
  document?: any;
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
  document,
  messages: initialMessages = [],
  onSend,
  inputValue: initialInputValue = '',
  onInputChange,
  isLoading,
  className,
  onClose
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState(initialInputValue);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setInputValue(initialInputValue);
  }, [initialMessages, initialInputValue]);

  useEffect(() => {
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
    onSend?.(message);
    setInputValue('');
    onInputChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn("w-full h-full rounded-lg border-none shadow-none flex flex-col bg-transparent", className)}>
      <CardContent className="flex-grow flex flex-col p-2 space-y-2">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto scroll-smooth space-y-4 p-2"
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-2 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src="/logo.png" alt="AI Avatar" />
                  <AvatarFallback>GS</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 text-sm max-w-[85%] break-words ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {message.content}
              </div>
              {message.role === 'user' && (
                 <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2 justify-start">
               <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src="/logo.png" alt="AI Avatar" />
                  <AvatarFallback>GS</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 text-sm bg-gray-100 dark:bg-gray-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 p-2 border-t dark:border-gray-700">
          <Input
            placeholder="Ask anything..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 px-4 py-2 bg-white dark:bg-gray-800"
          />
          <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()} size="icon" className="rounded-full flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrandStrategistAssistantSidebar;
