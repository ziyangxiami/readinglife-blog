'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * 管理员权限验证钩子
 * 在客户端组件中使用
 */
export function useAdminAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session && session.user?.role === "admin"
  
  useEffect(() => {
    console.log("[useAdminAuth] 当前状态:", { status, session: !!session, role: session?.user?.role })
    
    // 如果已经确定未认证，立即跳转
    if (!isLoading && !isAuthenticated) {
      console.log("[useAdminAuth] 未认证，准备跳转")
      // 延迟跳转，避免在组件渲染过程中立即跳转导致的卡顿
      const timer = setTimeout(() => {
        router.replace("/admin/login")
      }, 100)
      
      return () => clearTimeout(timer)
    } else if (!isLoading && isAuthenticated) {
      console.log("[useAdminAuth] 认证通过")
    }
    
    // 清理检查状态
    if (!isLoading) {
      setIsChecking(false)
    }
  }, [isLoading, isAuthenticated, router])
  
  return {
    session,
    isLoading: isLoading || isChecking,
    isAuthenticated
  }
}