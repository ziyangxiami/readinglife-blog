import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * 管理员权限验证包装器
 * 用于保护需要管理员权限的API路由
 */
export async function withAdminAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>,
  req: NextRequest
) {
  try {
    console.log("[Auth] 验证管理员权限")
    
    const session = await getServerSession(authOptions)
    
    if (!session) {
      console.error("[Auth] 未找到会话")
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      )
    }
    
    if (session.user?.role !== "admin") {
      console.error("[Auth] 非管理员用户")
      return NextResponse.json(
        { error: "权限不足" },
        { status: 403 }
      )
    }
    
    console.log("[Auth] 管理员权限验证通过")
    return await handler(req, session)
  } catch (error) {
    console.error("[Auth] 权限验证出错:", error)
    return NextResponse.json(
      { error: "认证失败" },
      { status: 401 }
    )
  }
}