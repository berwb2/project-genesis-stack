
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';

interface ChatLoadingIndicatorProps {
  avatarSrc: string;
  avatarFallback: string;
  avatarClassName?: string;
  text?: string;
}

const ChatLoadingIndicator: React.FC<ChatLoadingIndicatorProps> = ({
  avatarSrc,
  avatarFallback,
  avatarClassName = "h-8 w-8 flex-shrink-0",
  text = 'Thinking...',
}) => {
  return (
    <div className="flex items-start gap-3 justify-start">
      <Avatar className={avatarClassName}>
        <AvatarImage src={avatarSrc} alt="AI Avatar" />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="rounded-xl px-4 py-2 max-w-[85%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <p className="text-sm flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> {text}
        </p>
      </div>
    </div>
  );
};

export default ChatLoadingIndicator;
