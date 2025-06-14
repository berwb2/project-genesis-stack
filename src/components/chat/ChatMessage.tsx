
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIResponseRenderer from '../AIResponseRenderer';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  assistantName?: string;
  assistantAvatar?: string;
  assistantFallback?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  assistantName = "Assistant",
  assistantAvatar = "/logo.png",
  assistantFallback = "AI"
}) => {
  return (
    <div className={`flex items-start gap-3 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={assistantAvatar} alt={assistantName} />
          <AvatarFallback className="bg-red-100 text-red-600">{assistantFallback}</AvatarFallback>
        </Avatar>
      )}
      <div className={`rounded-xl px-4 py-2 max-w-[85%] text-sm ${message.role === 'user' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
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
  );
};

export default ChatMessage;
