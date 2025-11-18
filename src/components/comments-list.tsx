'use client'

import { useState } from 'react'
import { User, MessageCircle, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommentForm } from './comment-form'

interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  parent_id: string | null
  created_at: string
  replies?: Comment[]
}

interface CommentsListProps {
  postId: string
  initialComments: Comment[]
}

/**
 * 评论列表组件
 * 展示评论列表和回复功能
 */
export function CommentsList({ postId, initialComments }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleCommentCreated = () => {
    // 重新加载评论
    window.location.reload()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const [showReplyForm, setShowReplyForm] = useState(false)

    return (
      <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{comment.author_name}</span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <div className="text-gray-700 leading-relaxed mb-2">
              {comment.content}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Reply className="w-3 h-3" />
              回复
            </Button>
          </div>
        </div>

        {/* 回复表单 */}
        {showReplyForm && (
          <div className="ml-11 mb-4 p-4 bg-gray-50 rounded-lg">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCommentCreated={handleCommentCreated}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(false)}
              className="mt-2"
            >
              取消回复
            </Button>
          </div>
        )}

        {/* 嵌套回复 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 评论表单 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          发表评论
        </h4>
        <CommentForm
          postId={postId}
          onCommentCreated={handleCommentCreated}
        />
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无评论，快来发表第一条评论吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}