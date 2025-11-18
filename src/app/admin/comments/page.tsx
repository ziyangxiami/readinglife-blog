import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 后台评论管理页面
 * 展示与审核评论的入口（占位）
 */
export default async function AdminCommentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">评论管理</h1>
      <Card>
        <CardHeader>
          <CardTitle>评论列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-gray-500">功能建设中，敬请期待</div>
        </CardContent>
      </Card>
    </div>
  )
}