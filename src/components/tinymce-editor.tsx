'use client'

import { useRef, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface TinymceEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
  placeholder?: string
  autoSave?: boolean
  autoSaveInterval?: number
  onAutoSave?: (content: string) => void
}

/**
 * TinyMCE 富文本编辑器组件
 * 支持图片上传、代码高亮、自动保存等功能
 * 现在使用Sanity Studio进行身份验证，不再依赖Next Auth
 */
export default function TinymceEditor({
  value,
  onChange,
  height = 500,
  placeholder = '开始写作...',
  autoSave = false,
  autoSaveInterval = 30000,
  onAutoSave
}: TinymceEditorProps) {
  const editorRef = useRef<any>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 自动保存逻辑
  useEffect(() => {
    if (!autoSave) return

    // 清除之前的定时器
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // 设置新的自动保存定时器
    autoSaveTimerRef.current = setInterval(() => {
      if (editorRef.current && onAutoSave) {
        const content = editorRef.current.getContent()
        onAutoSave(content)
      }
    }, autoSaveInterval)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [autoSave, autoSaveInterval, onAutoSave])

  const handleImageUpload = (blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/admin/upload', true)
      
      // Sanity Studio处理身份验证，浏览器会自动携带相关cookie
      console.log("[Editor] 上传图片到Sanity Studio")
      
      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100)
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.url) {
              resolve(response.url)
            } else {
              reject(new Error('上传失败: ' + (response.error || '未知错误')))
            }
          } catch (error) {
            reject(new Error('解析响应失败'))
          }
        } else if (xhr.status === 401) {
          reject(new Error('未授权：请先登录Sanity Studio'))
        } else {
          reject(new Error('上传失败: HTTP ' + xhr.status))
        }
      }

      xhr.onerror = () => {
        reject(new Error('网络错误'))
      }

      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())
      xhr.send(formData)
    })
  }

  return (
    <div className="relative">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(_evt, editor) => {
          editorRef.current = editor
        }}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          placeholder,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'codesample', 'autoresize'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image link codesample | removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_file_types: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
          max_filesize: 10 * 1024 * 1024, // 10MB
          language: 'zh_CN',
          language_url: '/tinymce/langs/zh_CN.js',
          setup: (editor: any) => {
            editor.on('keydown', (e: any) => {
              // Ctrl/Cmd + S 保存
              if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                if (onAutoSave) {
                  onAutoSave(editor.getContent())
                  toast.success('内容已保存')
                }
              }
            })
          }
        }}
      />
      {autoSave && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (editorRef.current && onAutoSave) {
                const content = editorRef.current.getContent()
                onAutoSave(content)
                toast.success('内容已保存')
              }
            }}
          >
            <Save className="w-3 h-3 mr-1" />
            保存
          </Button>
        </div>
      )}
    </div>
  )
}