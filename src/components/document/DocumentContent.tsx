
import React from 'react';
import { CardContent } from "@/components/ui/card";
import RichTextEditor from '@/components/RichTextEditor';

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
}) => {
  return (
    <CardContent className="p-0">
      {isEditing ? (
        <div className="no-print">
          <RichTextEditor
            content={content}
            onChange={onContentChange}
            placeholder="Start writing your document content here..."
            editable={true}
          />
        </div>
      ) : (
        <div id="pdf-export-area">
          <RichTextEditor 
            content={content}
            onChange={() => {}}
            editable={false}
          />
        </div>
      )}
    </CardContent>
  );
};

export default DocumentContent;
