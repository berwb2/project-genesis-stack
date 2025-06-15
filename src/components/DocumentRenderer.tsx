import React from 'react';
import { DocumentMeta } from '@/types/documents';
import 'highlight.js/styles/github.css';

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

  // Process HTML content to enhance formatting with DeepWaters blue-themed styling
  let processedContent = document.content as string;
  if (typeof processedContent === 'string') {
    // Enhanced heading styles with blue theme
    processedContent = processedContent
      .replace(/<h1([^>]*)>/g, '<h1$1 class="luxury-heading-1">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="luxury-heading-2">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="luxury-heading-3">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="luxury-heading-4">')
      .replace(/<h5([^>]*)>/g, '<h5$1 class="luxury-heading-5">')
      .replace(/<h6([^>]*)>/g, '<h6$1 class="luxury-heading-6">');
    
    // Enhanced paragraph styling
    processedContent = processedContent
      .replace(/<p([^>]*)>/g, '<p$1 class="luxury-paragraph">');
    
    // Enhanced list styling
    processedContent = processedContent
      .replace(/<ul([^>]*)>/g, '<ul$1 class="luxury-list-bullet">')
      .replace(/<ol([^>]*)>/g, '<ol$1 class="luxury-list-numbered">')
      .replace(/<li([^>]*)>/g, '<li$1 class="luxury-list-item">');
    
    // Enhanced blockquote styling
    processedContent = processedContent
      .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="luxury-blockquote">');
    
    // Enhanced table styling
    processedContent = processedContent
      .replace(/<table([^>]*)>/g, '<table$1 class="luxury-table">')
      .replace(/<th([^>]*)>/g, '<th$1 class="luxury-table-header">')
      .replace(/<td([^>]*)>/g, '<td$1 class="luxury-table-cell">');
    
    // Enhanced code styling
    processedContent = processedContent
      .replace(/<code([^>]*)>/g, '<code$1 class="luxury-inline-code">')
      .replace(/<pre([^>]*)>/g, '<pre$1 class="luxury-code-block">');
    
    // Add luxury dividers
    processedContent = processedContent
      .replace(/<hr\s*\/?>/g, '<hr class="luxury-divider" />');
  }

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
