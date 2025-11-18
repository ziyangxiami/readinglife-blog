'use client'

import { useState } from 'react'
import { CommentsList } from './comments-list'
import { CommentForm } from './comment-form'

interface CommentsSectionProps {
  postId: string
}

/**
 * 评论区客户端组件
 * 处理评论的交互功能
 */
export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([])

  const handleCommentCreated = () => {
    // 重新加载页面以获取最新评论
    window.location.reload()
  }

  return (
    <section className="max-w-4xl mx-auto px-4 pb-16">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          评论 ({comments.length})
        </h2>
        
        {/* 评论表单 */}
        <div className="mb-8">
          <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
        </div>

        {/* 评论列表 */}
        <CommentsList postId={postId} initialComments={comments} />
      </div>
    </section>
  )
}