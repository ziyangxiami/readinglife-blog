'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CommentFormProps {
  postId: string
  parentId?: string
  onCommentCreated: () => void
}

/**
 * 评论表单组件
 * 处理评论的创建和提交
 */
export function CommentForm({ postId, parentId, onCommentCreated }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
      toast.error('请填写所有必填字段')
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.author_email)) {
      toast.error('请输入有效的邮箱地址')
      return
    }

    // 验证内容长度
    if (formData.content.length < 2 || formData.content.length > 1000) {
      toast.error('评论内容长度应在2-1000字符之间')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId || null,
          author_name: formData.author_name.trim(),
          author_email: formData.author_email.trim(),
          content: formData.content.trim()
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('评论发表成功！')
        setFormData({ author_name: '', author_email: '', content: '' })
        onCommentCreated()
      } else {
        toast.error(result.error || '评论发表失败，请稍后重试')
      }
    } catch (error) {
      console.error('发表评论失败:', error)
      toast.error('网络错误，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            昵称 *
          </label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            value={formData.author_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入您的昵称"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            邮箱 *
          </label>
          <input
            type="email"
            id="author_email"
            name="author_email"
            value={formData.author_email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入您的邮箱"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          <MessageCircle className="w-4 h-4 inline mr-1" />
          评论内容 *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={parentId ? '写下您的回复...' : '写下您的评论...'}
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        {isSubmitting ? '发表中...' : (parentId ? '回复评论' : '发表评论')}
      </Button>
    </form>
  )
}