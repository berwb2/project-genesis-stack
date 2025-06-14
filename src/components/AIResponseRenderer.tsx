
import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { cn } from '@/lib/utils';

interface AIResponseRendererProps {
  content: string;
  className?: string;
}

const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({ content, className }) => {
  const processedContent = React.useMemo(() => {
    let html = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'plaintext';
        const highlightedCode = hljs.highlight(code, { language, ignoreIllegals: true }).value;
        return `<pre class="luxury-code-block"><code class="hljs ${language}">${highlightedCode}</code></pre>`;
    });

    // Headings
    html = html.replace(/^###\s(.*)$/gm, '<h3 class="luxury-heading-3">$1</h3>');
    html = html.replace(/^##\s(.*)$/gm, '<h2 class="luxury-heading-2">$1</h2>');
    html = html.replace(/^#\s(.*)$/gm, '<h1 class="luxury-heading-1">$1</h1>');
    
    // Bold, Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^>\s(.*)$/gm, '<blockquote class="luxury-blockquote">$1</blockquote>');
    
    // Lists
    html = html.replace(/^\s*[-*+]\s(.*)$/gm, (match, item) => `<li class="luxury-list-item">${item}</li>`);
    html = html.replace(/((<li.*>.*<\/li>\s*)+)/g, (match) => `<ul class="luxury-list-bullet">${match}</ul>`);
    html = html.replace(/<\/ul>\s*<ul/g, '');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="luxury-inline-code">$1</code>');

    // Paragraphs
    html = html.split('\n').filter(p => p.trim() !== '').map(p => {
        if (p.startsWith('<') && p.endsWith('>')) return p;
        return `<p class="luxury-paragraph">${p}</p>`;
    }).join('');

    return html;
  }, [content]);

  return (
    <>
      <div
        className={cn('prose prose-sm max-w-none dark:prose-invert', className)}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      <style>{`
        .prose :where(strong):not(:where([class~="not-prose"] *)) {
            color: inherit;
        }
        .luxury-heading-1, .luxury-heading-2, .luxury-heading-3 { margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; line-height: 1.3; }
        .luxury-heading-1 { font-size: 1.5em; }
        .luxury-heading-2 { font-size: 1.25em; }
        .luxury-heading-3 { font-size: 1.1em; }
        .luxury-paragraph { margin-bottom: 0.5em; text-align: left; }
        .luxury-list-bullet { list-style: disc; padding-left: 1.5rem; margin: 0.5em 0; }
        .luxury-blockquote { border-left: 3px solid #3b82f6; background-color: rgba(59, 130, 246, 0.1); padding: 0.5em 1em; margin: 0.5em 0; }
        .luxury-inline-code { background: rgba(100, 116, 139, 0.2); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .luxury-code-block { background-color: #020617; color: #e2e8f0; padding: 1rem; margin: 1em 0; border-radius: 0.5rem; overflow-x: auto; }
        .luxury-code-block code { background: none; color: inherit; padding: 0; }
      `}</style>
    </>
  );
};

export default AIResponseRenderer;
