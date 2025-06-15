
import React from 'react';
import { DocumentMeta } from '@/types/documents';
import 'highlight.js/styles/github.css';
import { formatDocumentContent } from '@/lib/formatDocument';
import EditorStylesheet from '@/components/editor/EditorStylesheet';

interface DocumentRendererProps {
  document: DocumentMeta;
  className?: string;
  onSectionClick?: (id: string) => void;
}

// This component is read-only and used for rendering the document content
const DocumentRenderer: React.FC<DocumentRendererProps> = ({ 
  document, 
  className = "",
  onSectionClick
}) => {
  if (!document || !document.content) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg">
        <div className="text-blue-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-blue-600 font-medium">No content available</p>
        <p className="text-blue-500 text-sm mt-1">Start writing to see your content here</p>
      </div>
    );
  }

  const processedContent = formatDocumentContent(document.content as string);

  // We now replicate the exact structure from the RichTextEditor to ensure 1:1 visual parity
  // between the editor and the rendered view. This removes any styling discrepancies.
  return (
    <div className={`relative ${className}`}>
      <div className="p-8 bg-gradient-to-br from-blue-50/30 to-teal-50/30">
        <div className="luxury-editor-container">
          <div 
            className="luxury-editor-content"
            dangerouslySetInnerHTML={{ __html: processedContent }}
            onClick={(e) => {
              if (onSectionClick && e.target instanceof HTMLElement) {
                const targetEl = e.target as HTMLElement;
                const headingEl = targetEl.closest('h1, h2, h3, h4, h5, h6');
                if (headingEl && headingEl.id) {
                  onSectionClick(headingEl.id);
                }
              }
            }}
          />
        </div>
      </div>
      <EditorStylesheet />
    </div>
  );
};

export default DocumentRenderer;
