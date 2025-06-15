
import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ResizableImageView from './ResizableImageView'

const CustomImage = Image.extend({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.style.width || element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            style: `width: ${attributes.width};`,
          }
        },
      },
      'data-align': {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) => ({
          'data-align': attributes['data-align'],
        }),
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})

export default CustomImage

