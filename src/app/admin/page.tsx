import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, MessageSquare, TrendingUp, Edit, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { AdminNav } from '@/components/admin-nav'
import { getBlogStats } from '@/lib/api'
import { supabase } from '@/lib/supabase'

/**
 * 管理后台主页面
 * 提供文章管理、评论管理、统计信息等功能的入口
 */
/**
 * 管理后台主页面
 * 集成侧边导航与真实统计数据
 */
export default async function AdminDashboardPage() {
  // 获取基础博客统计
  const blogStats = await getBlogStats()

  // 获取总评论数
  const { count: commentCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .range(0, 0)

  // 统计本月新增文章数
  const firstDayOfMonth = new Date()
  firstDayOfMonth.setDate(1)
  firstDayOfMonth.setHours(0, 0, 0, 0)
  const { count: monthlyNew } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .gte('created_at', firstDayOfMonth.toISOString())
    .range(0, 0)

  const stats = [
    {
      title: '总文章数',
      value: String(blogStats.posts),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '总评论数',
      value: String(commentCount || 0),
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '总访问量',
      value: String(blogStats.views),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '本月新增',
      value: String(monthlyNew || 0),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const quickActions = [
    {
      title: '发布新文章',
      description: '创建新的博客文章',
      icon: Plus,
      href: '/admin/posts/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: '管理文章',
      description: '查看和编辑现有文章',
      icon: Edit,
      href: '/admin/posts',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: '评论管理',
      description: '审核和管理评论',
      icon: MessageSquare,
      href: '/admin/comments',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: '系统设置',
      description: '配置博客设置',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
        <p className="text-gray-600 mt-2">欢迎回来，管理员</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 最近文章 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>最近文章</CardTitle>
            <Link href="/admin/posts">
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 这里应该显示最近的文章列表 */}
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无文章数据</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}