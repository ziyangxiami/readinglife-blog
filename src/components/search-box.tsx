'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBoxProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

/**
 * 响应式搜索框组件
 * 支持快捷键、自动完成、移动端适配
 */
export function SearchBox({ className, placeholder = "搜索文章...", onSearch }: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 快捷键支持 (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * 处理搜索提交
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
      setIsOpen(false)
      setQuery('')
    }
  }

  /**
   * 处理输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // 获取搜索建议
    if (value.trim().length > 1) {
      fetchSearchSuggestions(value.trim())
    } else {
      setSuggestions([])
    }
  }

  /**
   * 获取搜索建议
   */
  const fetchSearchSuggestions = async (searchTerm: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts?search=${encodeURIComponent(searchTerm)}&limit=5`)
      const data = await response.json()
      
      if (data.success && data.data.posts) {
        const titles = data.data.posts.map((post: any) => post.title)
        setSuggestions(titles)
      }
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 选择建议
   */
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    inputRef.current?.focus()
  }

  /**
   * 打开搜索框
   */
  const openSearch = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  /**
   * 关闭搜索框
   */
  const closeSearch = () => {
    setIsOpen(false)
    setQuery('')
    setSuggestions([])
  }

  // 移动端搜索框
  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
        <div ref={containerRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="flex-1 outline-none text-lg"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className="border-t">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* 加载状态 */}
          {isLoading && (
            <div className="px-4 py-3 text-center text-gray-500 border-t">
              搜索中...
            </div>
          )}
          
          {/* 提示信息 */}
          <div className="px-4 py-3 text-xs text-gray-500 border-t">
            按 Esc 键关闭搜索框
          </div>
        </div>
      </div>
    )
  }

  // 桌面端搜索按钮
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">搜索</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>
    </div>
  )
}