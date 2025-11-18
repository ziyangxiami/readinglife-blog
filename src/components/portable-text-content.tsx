import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface PortableTextContentProps {
  content: any
}

/**
 * Portable Text内容渲染组件
 * 将Sanity的Portable Text格式渲染为React组件
 */
export function PortableTextContent({ content }: PortableTextContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText
        value={content}
        components={{
          types: {
            image: ({ value }) => {
              if (!value?.asset?._ref) return null
              
              return (
                <div className="my-8">
                  <Image
                    src={urlFor(value).url()}
                    alt={value.alt || '图片'}
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                  {value.caption && (
                    <p className="text-sm text-gray-600 text-center mt-3 italic">
                      {value.caption}
                    </p>
                  )}
                </div>
              )
            },
            code: ({ value }) => {
              return (
                <div className="my-6">
                  <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                    {value.filename && (
                      <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        {value.filename}
                      </div>
                    )}
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className={`language-${value.language || 'text'}`}>
                        {value.code}
                      </code>
                    </pre>
                  </div>
                </div>
              )
            }
          },
          block: {
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6 leading-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-5 leading-tight">
                {children}
              </h3>
            ),
            normal: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 bg-blue-50 p-4 rounded-r">
                {children}
              </blockquote>
            )
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2">
                {children}
              </ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2">
                {children}
              </ol>
            )
          }
        }}
      />
    </div>
  )
}