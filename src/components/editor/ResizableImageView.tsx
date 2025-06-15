
import React, { useRef, useEffect } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

const ResizableImageView: React.FC<NodeViewProps> = ({ node, updateAttributes, selected }) => {
  const { src, alt, title, width, 'data-align': align } = node.attrs;
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (align === 'full') {
      return; // Do not observe size changes for full-width images
    }
    
    const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const newWidth = `${Math.round(entry.contentRect.width)}px`;
        // Only update if the width has changed to prevent infinite loops
        if (newWidth !== node.attrs.width) {
            updateAttributes({ width: newWidth });
        }
    });
    
    observer.observe(imgRef.current);
    observerRef.current = observer;
    
    return () => {
      observer.disconnect();
    };
  }, [node.attrs.width, updateAttributes, align]);

  const wrapperStyle: React.CSSProperties = {
    lineHeight: 0,
  };

  let finalWidth = width || 'auto';

  if (align === 'full') {
    wrapperStyle.width = '100%';
    wrapperStyle.float = 'none';
    wrapperStyle.display = 'block';
    finalWidth = '100%';
  } else if (align === 'center') {
    wrapperStyle.display = 'block';
    wrapperStyle.marginLeft = 'auto';
    wrapperStyle.marginRight = 'auto';
  } else if (align === 'left') {
    wrapperStyle.float = 'left';
    wrapperStyle.marginRight = '1rem';
  } else if (align === 'right') {
    wrapperStyle.float = 'right';
    wrapperStyle.marginLeft = '1rem';
  }


  return (
    <NodeViewWrapper
      as="div"
      className={cn('resizable-image-wrapper group', { 'is-selected': selected, 'is-full-width': align === 'full' })}
      style={wrapperStyle}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={title}
        className="luxury-image resizable"
        style={{ width: finalWidth }}
      />
    </NodeViewWrapper>
  )
}

export default ResizableImageView;
