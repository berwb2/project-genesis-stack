
import React from 'react';
import { DocumentMeta } from '@/types/documents';
import 'highlight.js/styles/github.css';
import { formatDocumentContent } from '@/lib/formatDocument';

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

  // The content from the editor should already be formatted with the correct classes.
  // We can still run some processing for things like code highlighting or other dynamic features.
  const processedContent = formatDocumentContent(document.content as string);

  return (
    <div className="relative">
      {/* Luxury Document Container */}
      <div 
        className={`luxury-document-content ${className}`}
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
  );
};

export default DocumentRenderer;
