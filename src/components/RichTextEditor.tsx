import React, { useEffect } from 'react';
import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
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
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Code from '@tiptap/extension-code';

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
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        code: false,
        codeBlock: false,
        paragraph: {
          HTMLAttributes: {
            class: 'luxury-paragraph',
          },
        },
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `luxury-heading-${level}`,
            }),
            0,
          ];
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'luxury-blockquote',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'luxury-list-bullet',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'luxury-list-numbered',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'luxury-list-item',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'luxury-divider',
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'luxury-inline-code',
        },
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
        processed = processed.replace(/style="[^"]*"/g, ''); // Remove inline styles
        processed = processed.replace(/class="[^"]*"/g, ''); // Remove all classes, tiptap will add correct ones
        processed = processed.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, ''); // Remove spans
        processed = processed.replace(/<div[^>]*>/g, '<p>').replace(/<\/div>/g, '</p>'); // Convert divs to paragraphs
        
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
                content += '<ul>';
                lines.forEach(item => {
                    content += `<li>${item.replace(/^[\*\-\+]\s/, '')}</li>`;
                });
                content += '</ul>';
            } else if (isOrderedList) {
                content += '<ol>';
                lines.forEach(item => {
                    content += `<li>${item.replace(/^\d+\.\s/, '')}</li>`;
                });
                content += '</ol>';
            } else if (lines.length === 1 && trimmedBlock.match(/^#+\s/)) { // Heading - must be single line block
                const match = trimmedBlock.match(/^(#+)\s(.*)/);
                if (match) {
                    const level = match[1].length;
                    const textContent = match[2];
                    if (level <= 6) {
                        content += `<h${level}>${textContent}</h${level}>`;
                    } else { // treat as paragraph if h7 or more
                        content += `<p>${trimmedBlock}</p>`;
                    }
                }
            } else if (trimmedBlock.startsWith('> ')) { // Blockquote
                const bqContent = lines.map(line => line.replace(/^>\s?/, '')).join('<br>');
                content += `<blockquote>${bqContent}</blockquote>`;
            } else { // Paragraph
                content += `<p>${trimmedBlock.replace(/\n/g, '<br>')}</p>`;
            }
        }
        return content;
      },
    },
  });

  // Re-apply highlights when content changes
  useEffect(() => {
    if (editor) {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [editor, content, editable]);

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
