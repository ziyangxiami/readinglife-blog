'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, FileText, MessageSquare, Users, Eye, TrendingUp, Calendar, Clock } from 'lucide-react'

/**
 * 管理后台仪表板
 * 展示网站数据统计和管理功能入口
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    totalCategories: 0,
    totalTags: 0,
    todayViews: 0,
    pendingComments: 0
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  /**
   * 检查管理员权限
   */
  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
  }

  /**
   * 获取仪表板数据
   */
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // 获取统计数据
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // 获取最近文章
      const postsResponse = await fetch('/api/admin/posts?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setRecentPosts(postsData.data.posts)
      }

      // 获取最近评论
      const commentsResponse = await fetch('/api/admin/comments?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setRecentComments(commentsData.data.comments)
      }

    } catch (error) {
      console.error('获取仪表板数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 格式化数字
   */
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statCards = [
    {
      title: '总文章数',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/posts'
    },
    {
      title: '总评论数',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/comments'
    },
    {
      title: '总访问量',
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/analytics'
    },
    {
      title: '待审核评论',
      value: stats.pendingComments,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/comments?status=pending'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RL</span>
                </div>
                Reading Life Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  查看网站
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('admin_token')
                  localStorage.removeItem('admin_info')
                  router.push('/admin/login')
                }}
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-2">欢迎回来！这里是您的网站概览。</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} href={card.href}>
                <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最近文章 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">最近文章</h2>
                <Link href="/admin/posts/new">
                  <Button size="sm">新建文章</Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">加载中...</div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post: any) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 truncate">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.view_count}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            查看
                          </Button>
                        </Link>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="outline" size="sm">
                            编辑
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无文章</p>
                  <Link href="/admin/posts/new">
                    <Button variant="outline" className="mt-4">
                      创建第一篇文章
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 最近评论 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">最近评论</h2>
                <Link href="/admin/comments">
                  <Button variant="outline" size="sm">管理评论</Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">加载中...</div>
              ) : recentComments.length > 0 ? (
                <div className="space-y-4">
                  {recentComments.map((comment: any) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.author_name}</span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2">{comment.content}</p>
                          {comment.post_title && (
                            <p className="text-xs text-gray-500 mt-1">
                              文章: {comment.post_title}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {comment.status === 'pending' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              待审核
                            </span>
                          )}
                          <Link href={`/admin/comments/${comment.id}`}>
                            <Button variant="ghost" size="sm">
                              管理
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无评论</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/posts/new">
              <Button className="w-full flex items-center gap-2">
                <FileText className="w-4 h-4" />
                新建文章
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                管理分类
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                管理标签
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}