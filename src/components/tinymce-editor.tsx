'use client'

import { useRef, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

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
 */
export default function TinymceEditor({
  value,
  onChange,
  height = 500,
  placeholder = '开始写作...',
  autoSave = true,
  autoSaveInterval = 30000, // 30秒
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
      
      // 添加认证头 - 从localStorage获取token
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      
      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100)
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success && response.data?.url) {
              resolve(response.data.url)
            } else {
              reject(new Error('上传失败'))
            }
          } catch (e) {
            reject(new Error('解析响应失败'))
          }
        } else if (xhr.status === 401) {
          reject(new Error('未授权：请先登录管理员账户'))
        } else {
          reject(new Error('上传失败'))
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

  const handleManualSave = () => {
    if (editorRef.current && onAutoSave) {
      const content = editorRef.current.getContent()
      onAutoSave(content)
    }
  }

  return (
    <div className="relative">
      {/* 手动保存按钮 */}
      {autoSave && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={handleManualSave}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存草稿
          </Button>
        </div>
      )}

      <Editor
        apiKey="your-tinymce-api-key" // 需要申请免费 API Key
        onInit={(_evt, editor) => {
          editorRef.current = editor
        }}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          placeholder,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image link codesample | removeformat | help',
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'TypeScript', value: 'typescript' },
            { text: 'JSON', value: 'json' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C++', value: 'cpp' },
            { text: 'SQL', value: 'sql' },
            { text: 'Bash', value: 'bash' }
          ],
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #374151;
            }
            pre[class*="language-"] {
              background: #1e293b !important;
              color: #e2e8f0 !important;
              padding: 1rem !important;
              border-radius: 0.5rem !important;
              overflow-x: auto !important;
            }
            code[class*="language-"] {
              color: #e2e8f0 !important;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
            }
          `,
          setup: (editor) => {
            editor.on('keydown', (e) => {
              // Ctrl/Cmd + S 手动保存
              if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                handleManualSave()
              }
            })
          }
        }}
      />
    </div>
  )
}