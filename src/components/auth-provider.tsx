'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * NextAuth.js 会话提供者
 * 为客户端组件提供会话上下文
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}