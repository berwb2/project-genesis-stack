
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Upload } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onFileUpload,
  placeholder = "Type your message..."
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className="w-full rounded-full py-6 pl-5 pr-20 bg-gray-100 dark:bg-gray-800 border-transparent focus-visible:ring-2 focus-visible:ring-red-500"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.pdf,.doc,.docx"
            onChange={onFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full w-10 h-10 p-0 bg-gray-500 hover:bg-gray-600 text-white"
            disabled={isLoading}
            size="icon"
            type="button"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload files</span>
          </Button>
          <Button
            onClick={onSend}
            className="rounded-full w-10 h-10 p-0 bg-red-500 hover:bg-red-600 text-white"
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
