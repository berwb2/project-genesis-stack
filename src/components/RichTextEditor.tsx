import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from './editor/TableHeader';
import TextAlign from '@tiptap/extension-text-align';
import CustomImage from './editor/CustomImageExtension';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import EditorToolbar from './editor/EditorToolbar';
import EditorBubbleMenu from './editor/EditorBubbleMenu';
import EditorStylesheet from './editor/EditorStylesheet';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content, 
  onChange,
  placeholder = 'Start writing your document content here...',
  editable = true
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'luxury-paragraph',
          },
        },
        codeBlock: false, // Disable default code block to fix console warning
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'luxury-code-block',
        },
      }),
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: 'luxury-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        HTMLAttributes: {
          class: 'luxury-table',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'luxury-table-row',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'luxury-table-header',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'luxury-table-cell',
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: 'luxury-image',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'luxury-editor-content focus:outline-none',
      },
      transformPastedHTML(html) {
        // Enhanced HTML paste processing for better formatting
        let processed = html;
        
        // Clean up common paste artifacts
        processed = processed.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
        processed = processed.replace(/class="[^"]*"/g, ''); // Remove external classes
        processed = processed.replace(/style="[^"]*"/g, ''); // Remove inline styles
        processed = processed.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, ''); // Remove spans
        processed = processed.replace(/<div[^>]*>/g, '<p>').replace(/<\/div>/g, '</p>'); // Convert divs to paragraphs
        
        // Apply luxury formatting classes immediately
        processed = processed.replace(/<h([1-6])([^>]*)>/g, '<h$1 class="luxury-heading-$1">');
        processed = processed.replace(/<p([^>]*)>/g, '<p class="luxury-paragraph">');
        processed = processed.replace(/<ul([^>]*)>/g, '<ul class="luxury-list-bullet">');
        processed = processed.replace(/<ol([^>]*)>/g, '<ol class="luxury-list-numbered">');
        processed = processed.replace(/<li([^>]*)>/g, '<li class="luxury-list-item">');
        processed = processed.replace(/<blockquote([^>]*)>/g, '<blockquote class="luxury-blockquote">');
        
        return processed;
      },
      transformPastedText(text) {
        let content = '';
        const blocks = text.split(/\n\s*\n/); // Split by one or more empty lines
        
        for (const block of blocks) {
            const trimmedBlock = block.trim();
            if (!trimmedBlock) continue;
            
            const lines = trimmedBlock.split('\n');
            const isUnorderedList = lines.every(item => item.match(/^[\*\-\+]\s/));
            const isOrderedList = lines.every(item => item.match(/^\d+\.\s/));
            
            if (isUnorderedList) {
                content += '<ul class="luxury-list-bullet">';
                lines.forEach(item => {
                    content += `<li class="luxury-list-item">${item.replace(/^[\*\-\+]\s/, '')}</li>`;
                });
                content += '</ul>';
            } else if (isOrderedList) {
                content += '<ol class="luxury-list-numbered">';
                lines.forEach(item => {
                    content += `<li class="luxury-list-item">${item.replace(/^\d+\.\s/, '')}</li>`;
                });
                content += '</ol>';
            } else if (lines.length === 1 && trimmedBlock.match(/^#+\s/)) { // Heading - must be single line block
                const match = trimmedBlock.match(/^(#+)\s(.*)/);
                if (match) {
                    const level = match[1].length;
                    const textContent = match[2];
                    if (level <= 6) {
                        content += `<h${level} class="luxury-heading-${level}">${textContent}</h${level}>`;
                    } else { // treat as paragraph if h7 or more
                        content += `<p class="luxury-paragraph">${trimmedBlock}</p>`;
                    }
                }
            } else if (trimmedBlock.startsWith('> ')) { // Blockquote
                const bqContent = lines.map(line => line.replace(/^>\s?/, '')).join('<br>');
                content += `<blockquote class="luxury-blockquote">${bqContent}</blockquote>`;
            } else { // Paragraph
                content += `<p class="luxury-paragraph">${trimmedBlock.replace(/\n/g, '<br>')}</p>`;
            }
        }
        return content;
      },
    },
    onCreate: ({ editor }) => {
      // Apply luxury formatting immediately on create and whenever initial content is set
      applyLuxuryFormatting(editor);
    },
  });

  // Function to apply luxury formatting to existing content
  const applyLuxuryFormatting = (editorInstance: any) => {
    if (!editorInstance) return;
    setTimeout(() => {
      const currentContent = editorInstance.getHTML();
      let luxuryContent = currentContent;
      
      // Apply luxury classes to existing elements
      luxuryContent = luxuryContent.replace(/<h1(?![^>]*class=)/g, '<h1 class="luxury-heading-1"');
      luxuryContent = luxuryContent.replace(/<h2(?![^>]*class=)/g, '<h2 class="luxury-heading-2"');
      luxuryContent = luxuryContent.replace(/<h3(?![^>]*class=)/g, '<h3 class="luxury-heading-3"');
      luxuryContent = luxuryContent.replace(/<h4(?![^>]*class=)/g, '<h4 class="luxury-heading-4"');
      luxuryContent = luxuryContent.replace(/<h5(?![^>]*class=)/g, '<h5 class="luxury-heading-5"');
      luxuryContent = luxuryContent.replace(/<h6(?![^>]*class=)/g, '<h6 class="luxury-heading-6"');
      luxuryContent = luxuryContent.replace(/<p(?![^>]*class=)/g, '<p class="luxury-paragraph"');
      luxuryContent = luxuryContent.replace(/<ul(?![^>]*class=)/g, '<ul class="luxury-list-bullet"');
      luxuryContent = luxuryContent.replace(/<ol(?![^>]*class=)/g, '<ol class="luxury-list-numbered"');
      luxuryContent = luxuryContent.replace(/<li(?![^>]*class=)/g, '<li class="luxury-list-item"');
      luxuryContent = luxuryContent.replace(/<blockquote(?![^>]*class=)/g, '<blockquote class="luxury-blockquote"');
      
      if (luxuryContent !== currentContent) {
        editorInstance.commands.setContent(luxuryContent, false);
      }
      // Add debug log
      console.debug("[RichTextEditor] Applied luxury formatting after edit mode toggle or content change.");
    }, 100);
  };

  // Enhanced: Ensures luxury formatting on mount and when content is set for the first time
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
      applyLuxuryFormatting(editor);
    }
  }, [editor, content]);

  // Enhanced: ensures formatting is always reapplied on edit mode toggle or first load
  useEffect(() => {
    if (editor) {
      applyLuxuryFormatting(editor);
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [editor, content]);

  // NEW: Ensure formatting is always reapplied when switching to edit mode ("editable" changes)
  useEffect(() => {
    if (editor) {
      applyLuxuryFormatting(editor);
      console.debug('[RichTextEditor] Forced re-apply of luxury formatting due to editable toggle:', editable);
    }
  }, [editor, editable]);

  if (!editor) {
    return (
      <div className="border rounded-lg shadow-sm bg-background border-blue-200 min-h-[400px] flex items-center justify-center">
        <div className="text-blue-600">Loading luxury editor...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-lg bg-white relative border-blue-200 overflow-hidden">
      {editable && <EditorToolbar editor={editor} />}
      {editor && editable && <EditorBubbleMenu editor={editor} />}
      <div className="p-8 bg-gradient-to-br from-blue-50/30 to-teal-50/30">
        <EditorContent 
          editor={editor} 
          className="luxury-editor-container focus-visible:outline-none"
        />
      </div>
      <EditorStylesheet />
    </div>
  );
};

export default RichTextEditor;
