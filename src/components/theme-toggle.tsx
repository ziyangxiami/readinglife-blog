'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 暗色模式切换组件
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const initialTheme = savedTheme || systemTheme
      setTheme(initialTheme)
      document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    } catch (error) {
      console.error('初始化主题失败:', error)
    }
  }, [])

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    } catch (error) {
      console.error('切换主题失败:', error)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="relative" disabled>
        <div className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  )
}