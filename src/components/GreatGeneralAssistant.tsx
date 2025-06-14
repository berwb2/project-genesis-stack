
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { callGrandStrategist, getAISession, createAISession, updateAISession } from '@/lib/api';
import ChatMessage from './chat/ChatMessage';
import FileUploadArea from './chat/FileUploadArea';
import ChatInput from './chat/ChatInput';
import ChatWelcome from './chat/ChatWelcome';

interface GreatGeneralAssistantProps {
  context?: string;
  documentId?: string;
  documentTitle?: string;
  onInputChange?: (value: string) => void;
  className?: string;
  onResultSelect?: (result: string) => void;
}

interface UploadedFile {
  name: string;
  content: string;
  type: string;
}

const GreatGeneralAssistant: React.FC<GreatGeneralAssistantProps> = ({
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAI = async () => {
      setIsLoading(true);
      try {
        const sessionId = documentId || 'great-general';
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
        toast.error('Failed to initialize Great General assistant.');
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile: UploadedFile = {
          name: file.name,
          content: content,
          type: file.type
        };
        setUploadedFiles(prev => [...prev, newFile]);
        toast.success(`File "${file.name}" uploaded successfully`);
      };
      reader.readAsText(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Include file contents in the message if files are uploaded
    let messageWithFiles = userMessage;
    if (uploadedFiles.length > 0) {
      const fileContents = uploadedFiles.map(file => 
        `\n\n--- File: ${file.name} ---\n${file.content}\n--- End of ${file.name} ---`
      ).join('');
      messageWithFiles += fileContents;
    }

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    onInputChange?.('');
    setIsLoading(true);

    try {
      const documentPayload = {
        id: documentId || 'great-general',
        title: documentTitle || 'Great General Conversation',
        content: context || '',
        type: 'document' as const,
        metadata: { uploadedFiles: uploadedFiles.map(f => ({ name: f.name, type: f.type })) }
      };
      
      const response = await callGrandStrategist(messageWithFiles, documentPayload);

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
      setUploadedFiles([]);
    }
  };

  return (
    <Card className={cn("w-full h-full rounded-lg shadow-md flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700", className)}>
      <CardContent className="p-2 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/logo.png" alt="Great General" />
              <AvatarFallback className="bg-red-100 text-red-600">GG</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Great General</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Military Strategy & Tactics Expert</p>
            </div>
          </div>
        </div>

        <FileUploadArea uploadedFiles={uploadedFiles} onRemoveFile={removeFile} />

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-2 space-y-4 p-2">
          {messages.length === 0 && (
            <ChatWelcome
              title="Welcome to the Great General"
              description="Your military strategy and tactics expert. Upload documents and ask questions about warfare, leadership, and strategic planning."
              fallback="GG"
            />
          )}
          
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              assistantName="Great General"
              assistantFallback="GG"
            />
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/logo.png" alt="Great General" />
                <AvatarFallback className="bg-red-100 text-red-600">GG</AvatarFallback>
              </Avatar>
              <div className="rounded-xl px-4 py-2 max-w-[85%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <p className="text-sm flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing strategy...</p>
              </div>
            </div>
          )}
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onFileUpload={handleFileUpload}
          placeholder="Ask about military strategy, tactics, or upload documents..."
        />
      </CardContent>
    </Card>
  );
};

export default GreatGeneralAssistant;
