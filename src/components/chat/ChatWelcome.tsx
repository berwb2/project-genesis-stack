
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatWelcomeProps {
  title: string;
  description: string;
  avatar?: string;
  fallback?: string;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  title,
  description,
  avatar = "/logo.png",
  fallback = "AI"
}) => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
      <div className="mb-4">
        <Avatar className="h-16 w-16 mx-auto mb-3">
          <AvatarImage src={avatar} alt={title} />
          <AvatarFallback className="bg-red-100 text-red-600 text-lg">{fallback}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ChatWelcome;
