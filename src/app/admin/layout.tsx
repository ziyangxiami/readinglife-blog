'use client'

import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Navigation } from '@/components/navigation'
import { Loader2 } from 'lucide-react'

/**
 * 管理员布局组件
 * 使用NextAuth.js进行身份验证
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated } = useAdminAuth()

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">验证中...</p>
        </div>
      </div>
    )
  }

  // 未认证时会自动重定向，这里可以显示null或加载状态
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在跳转到登录页...</p>
        </div>
      </div>
    )
  }

  // 已认证，显示管理界面
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}