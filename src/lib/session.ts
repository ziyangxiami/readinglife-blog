import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * 获取当前会话
 * 在服务端组件中使用
 */
export async function getCurrentSession() {
  const session = await getServerSession(authOptions)
  return session
}

/**
 * 验证管理员权限
 * 在服务端组件中使用，无权限时重定向到登录页
 */
export async function requireAdminAuth() {
  const session = await getCurrentSession()
  
  if (!session || session.user?.role !== "admin") {
    console.error("[Auth] 管理员权限验证失败")
    redirect("/admin/login")
  }
  
  return session
}

/**
 * 检查是否为管理员
 * 返回布尔值，不执行重定向
 */
export async function isAdmin() {
  const session = await getCurrentSession()
  return session && session.user?.role === "admin"
}