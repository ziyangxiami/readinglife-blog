import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

/**
 * NextAuth.js 配置
 * 提供企业级的身份验证解决方案
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.error("[Auth] 缺少用户名或密码")
            return null
          }

          // 获取环境变量中的管理员凭据
          const adminUsername = process.env.ADMIN_USERNAME
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

          if (!adminUsername || !adminPasswordHash) {
            console.error("[Auth] 管理员凭据未配置")
            return null
          }

          // 验证用户名
          if (credentials.username !== adminUsername) {
            console.error("[Auth] 用户名不匹配")
            return null
          }

          // 验证密码
          const isValid = await compare(credentials.password, adminPasswordHash)
          if (!isValid) {
            console.error("[Auth] 密码错误")
            return null
          }

          console.log("[Auth] 管理员登录成功")
          
          // 返回用户信息
          return {
            id: "admin",
            username: adminUsername,
            role: "admin",
            name: "管理员"
          }
        } catch (error) {
          console.error("[Auth] 认证过程出错:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24小时
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.username = token.username as string
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  debug: process.env.NODE_ENV === "development",
}