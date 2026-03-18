import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PortableTextContentProps {
  content: string | { [key: string]: any }
}

/**
 * Portable Text内容渲染组件 -> 已重构为纯 Markdown 渲染组件
 * 为保持向后兼容，组件名未更改，但现在直接渲染 sanity-plugin-markdown 返回的数据
 */
export function PortableTextContent({ content }: PortableTextContentProps) {
  if (!content) return null;

  let markdownString = '';
  if (typeof content === 'string') {
    markdownString = content;
  } else if (typeof content === 'object' && content !== null) {
    // 兼容可能返回的包裹对象结构
    markdownString = content.body || content.markdown || content.current || '';
  }

  if (!markdownString) return null;

  return (
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-4">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({node, ...props}) => (
            <span className="block my-8">
              <img {...props} className="rounded-lg shadow-md max-w-full h-auto mx-auto" loading="lazy" alt={props.alt || '图片'} />
            </span>
          )
        }}
      >
        {markdownString}
      </ReactMarkdown>
    </div>
  )
}