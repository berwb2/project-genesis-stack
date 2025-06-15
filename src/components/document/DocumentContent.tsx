
import React from 'react';
import { CardContent } from "@/components/ui/card";
import RichTextEditor from '@/components/RichTextEditor';
import DocumentRenderer from '@/components/DocumentRenderer';

interface DocumentContentProps {
  isEditing: boolean;
  content: string;
  onContentChange: (newContent: string) => void;
  document: any;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  isEditing,
  content,
  onContentChange,
  document,
}) => {
  return (
    <CardContent className="p-0">
      {isEditing ? (
        <div className="no-print">
          <RichTextEditor
            content={content}
            onChange={onContentChange}
            placeholder="Start writing your document content here..."
          />
        </div>
      ) : (
        <div id="pdf-export-area">
          <div className="p-2">
            <DocumentRenderer 
              document={{
                ...document,
                content: content
              }} 
              className="min-h-96"
            />
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default DocumentContent;
