import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 后台系统设置页面
 * 提供系统配置入口（占位）
 */
export default async function AdminSettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">系统设置</h1>
      <Card>
        <CardHeader>
          <CardTitle>配置项</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-gray-500">功能建设中，敬请期待</div>
        </CardContent>
      </Card>
    </div>
  )
}