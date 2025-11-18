'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * 管理员权限验证钩子
 * 在客户端组件中使用
 */
export function useAdminAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session && session.user?.role === "admin"
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[Auth] 未认证，重定向到登录页")
      router.push("/admin/login")
    }
  }, [isLoading, isAuthenticated, router])
  
  return {
    session,
    isLoading,
    isAuthenticated
  }
}