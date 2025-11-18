import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * NextAuth.js API 路由处理器
 * 处理所有身份验证请求
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }