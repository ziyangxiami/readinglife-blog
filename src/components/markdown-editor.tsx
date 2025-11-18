'use client'

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Heading, List, ListOrdered, Link, Image, Code, Quote, Eye, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

/**
 * Markdown编辑器组件
 * 支持实时预览、工具栏快捷操作
 */
export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "开始写作...",
  height = "400px"
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /**
   * 插入文本到光标位置
   */
  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // 恢复光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  /**
   * 工具栏操作
   */
  const toolbarActions = [
    {
      icon: Bold,
      title: '粗体',
      action: () => insertText('**', '**')
    },
    {
      icon: Italic,
      title: '斜体',
      action: () => insertText('*', '*')
    },
    {
      icon: Heading,
      title: '标题',
      action: () => insertText('## ', '')
    },
    {
      icon: List,
      title: '无序列表',
      action: () => insertText('- ', '')
    },
    {
      icon: ListOrdered,
      title: '有序列表',
      action: () => insertText('1. ', '')
    },
    {
      icon: Quote,
      title: '引用',
      action: () => insertText('> ', '')
    },
    {
      icon: Code,
      title: '代码',
      action: () => insertText('`', '`')
    },
    {
      icon: Link,
      title: '链接',
      action: () => {
        const url = prompt('请输入链接地址:')
        if (url) {
          const text = prompt('请输入链接文字:') || url
          insertText(`[${text}](${url})`)
        }
      }
    },
    {
      icon: Image,
      title: '图片',
      action: () => {
        const url = prompt('请输入图片地址:')
        const alt = prompt('请输入图片描述:') || '图片描述'
        if (url) {
          insertText(`![${alt}](${url})`)
        }
      }
    }
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          {toolbarActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.action}
                title={action.title}
                className="h-8 w-8 p-0"
              >
                <Icon className="w-4 h-4" />
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2"
        >
          {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isPreview ? '编辑' : '预览'}
        </Button>
      </div>

      {/* 编辑器区域 */}
      <div className="relative" style={{ height }}>
        {isPreview ? (
          /* 预览模式 */
          <div className="h-full overflow-y-auto p-4 bg-white">
            <div className="prose prose-sm max-w-none">
              {value ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium mt-3 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-blue-50 p-3 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => (
                      <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm`}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
                        {children}
                      </pre>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => (
                      <div className="my-4">
                        <img src={src} alt={alt} className="rounded-lg shadow-md max-w-full" />
                        {alt && <p className="text-center text-sm text-gray-600 mt-2">{alt}</p>}
                      </div>
                    )
                  }}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>开始写作以查看预览...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 编辑模式 */
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none p-4 font-mono text-sm leading-relaxed"
            style={{ minHeight: height }}
          />
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>字数: {value.length}</span>
          <span>行数: {value.split('\n').length}</span>
        </div>
        <div>
          {isPreview ? '预览模式' : '编辑模式'}
        </div>
      </div>
    </div>
  )
}