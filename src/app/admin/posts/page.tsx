'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Edit, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { Post } from '@/types/database'

/**
 * 文章管理列表页面
 * 提供文章的查看、编辑、删除功能
 */
export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('获取文章列表失败')
      }

      const data = await response.json()
      setPosts(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // 删除文章
  const handleDelete = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      // 从列表中移除已删除的文章
      setPosts(posts.filter(post => post.id !== postId))
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  // 切换发布状态
  const togglePublishStatus = async (post: Post) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_published: !post.is_published
        })
      })

      if (!response.ok) {
        throw new Error('更新状态失败')
      }

      // 更新本地状态
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, is_published: !post.is_published } : p
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新状态失败')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题和操作 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-600 mt-2">管理您的博客文章</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建文章
          </Button>
        </Link>
      </div>

      {/* 文章列表 */}
      <Card>
        <CardHeader>
          <CardTitle>文章列表</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无文章</p>
              <Link href="/admin/posts/new">
                <Button className="mt-4" variant="outline">
                  创建第一篇文章
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <Badge variant={post.is_published ? 'default' : 'secondary'}>
                          {post.is_published ? '已发布' : '草稿'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>Slug: {post.slug}</span>
                        <span>阅读时间: {post.reading_time}分钟</span>
                        <span>浏览: {post.view_count}</span>
                        <span>点赞: {post.likes}</span>
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-500">
                          创建: {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        {post.updated_at !== post.created_at && (
                          <span className="text-xs text-gray-500">
                            更新: {new Date(post.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          查看
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublishStatus(post)}
                        className="flex items-center gap-1"
                      >
                        {post.is_published ? '设为草稿' : '发布'}
                      </Button>
                      
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Edit className="w-4 h-4" />
                          编辑
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}