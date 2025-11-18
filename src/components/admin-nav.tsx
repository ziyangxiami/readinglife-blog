'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, Edit, MessageSquare, Settings, BarChart3, Home } from 'lucide-react'

const navigation = [
  {
    name: '概览',
    href: '/admin',
    icon: BarChart3
  },
  {
    name: '文章管理',
    href: '/admin/posts',
    icon: BookOpen
  },
  {
    name: '发布文章',
    href: '/admin/posts/new',
    icon: Edit
  },
  {
    name: '评论管理',
    href: '/admin/comments',
    icon: MessageSquare
  },
  {
    name: '系统设置',
    href: '/admin/settings',
    icon: Settings
  }
]

interface AdminNavProps {
  className?: string
}

/**
 * 管理后台导航组件
 * 提供侧边栏导航菜单
 */
export function AdminNav({ className }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('space-y-1', className)}>
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}