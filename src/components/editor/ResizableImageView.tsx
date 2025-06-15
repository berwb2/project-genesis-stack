
import React, { useRef, useEffect } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

const ResizableImageView: React.FC<NodeViewProps> = ({ node, updateAttributes, selected }) => {
  const { src, alt, title, width, 'data-align': align } = node.attrs;
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const newWidth = `${Math.round(entry.contentRect.width)}px`;
        // Only update if the width has changed to prevent infinite loops
        if (newWidth !== node.attrs.width) {
            updateAttributes({ width: newWidth });
        }
    });
    
    observer.observe(imgRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [node.attrs.width, updateAttributes]);

  const wrapperStyle: React.CSSProperties = {
    lineHeight: 0,
  };

  if (align === 'center') {
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
      className={cn('resizable-image-wrapper group', { 'is-selected': selected })}
      style={wrapperStyle}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={title}
        className="luxury-image resizable"
        style={{ width: width || 'auto' }}
      />
    </NodeViewWrapper>
  )
}

export default ResizableImageView;

