'use client'

import { useSession } from "next-auth/react"
import { Navigation } from '@/components/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * 管理员布局组件
 * 使用NextAuth.js进行身份验证
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  console.log("[AdminLayout] 当前状态:", { status, session: !!session, role: session?.user?.role })
  
  // 添加调试信息
  useEffect(() => {
    console.log("[AdminLayout] 组件挂载完成")
    return () => console.log("[AdminLayout] 组件卸载")
  }, [])

  // 加载状态
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">验证中...</p>
        </div>
      </div>
    )
  }

  // 未认证状态 - 显示登录提示而不是卡住
  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">需要管理员权限</h2>
            <p className="text-gray-600 mb-6">您需要登录管理员账户才能访问此页面</p>
            <button
              onClick={() => {
                console.log("[AdminLayout] 点击前往登录页面")
                // 使用window.location直接跳转，绕过Next.js路由问题
                window.location.href = "/admin/login"
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              type="button"
            >
              前往登录页面
            </button>
          </div>
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