
import React from 'react';
import EditorStylesheet from '@/components/editor/EditorStylesheet';
import DOMPurify from 'dompurify';

interface DocumentRendererProps {
  content: string;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ content }) => {
  // Sanitize content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });

  return (
    // This wrapper mimics the one in RichTextEditor to ensure consistent styling
    <div className="border rounded-xl shadow-lg bg-white relative border-blue-200 overflow-hidden">
      <div className="p-8 bg-gradient-to-br from-blue-50/30 to-teal-50/30">
        <div className="luxury-editor-container focus-visible:outline-none">
          {/* Tiptap's editor content has the .luxury-editor-content class for styling */}
          <div
            className="luxury-editor-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
      <EditorStylesheet />
    </div>
  );
};

export default DocumentRenderer;
