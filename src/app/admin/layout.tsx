// src/app/admin/layout.tsx
// Sanity Studio 布局 - 移除 NextAuth 验证，让 Studio 自己处理认证

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sanity Studio 有自己的认证机制，不需要额外的布局包装
  // 直接渲染子组件（即 Studio）
  return <>{children}</>
}