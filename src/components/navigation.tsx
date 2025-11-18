'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, BookOpen, Home, User, Search, Settings } from 'lucide-react'
import { SearchBox } from './search-box'
import Image from 'next/image'
import { ThemeToggleSimple } from './theme-toggle-simple'

const navigation = [
  {
    name: '首页',
    href: '/',
    icon: Home
  },
  {
    name: '文章',
    href: '/blog',
    icon: BookOpen
  },
  {
    name: '关于',
    href: '/about',
    icon: User
  },
  {
    name: '管理',
    href: '/admin',
    icon: Settings
  },
  {
    name: '搜索',
    href: '/search',
    icon: Search
  }
]

interface NavigationProps {
  className?: string
}

/**
 * 响应式导航栏组件
 * 在移动端显示汉堡菜单，桌面端显示水平导航
 */
export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className={cn('bg-white shadow-sm border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo-avatar-new.svg"
                  alt="Reading Life Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
            {/* 搜索框 */}
            <SearchBox />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}