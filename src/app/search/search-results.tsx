'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  reading_time: number
  view_count: number
  created_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
}

/**
 * 搜索结果组件
 * 处理搜索逻辑并展示结果
 */
export function SearchResults() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (!query.trim()) {
      setPosts([])
      setLoading(false)
      return
    }

    const searchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
        const result = await response.json()

        if (result.success) {
          setPosts(result.data.posts)
        } else {
          setError(result.error || '搜索失败')
        }
      } catch (err) {
        setError('搜索请求失败')
        console.error('搜索失败:', err)
      } finally {
        setLoading(false)
      }
    }

    // 添加防抖
    const timeoutId = setTimeout(searchPosts, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">开始搜索</h3>
        <p className="text-gray-600">
          在上方搜索框中输入关键词来查找文章
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在搜索...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">搜索出错</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到结果</h3>
        <p className="text-gray-600 mb-6">
          没有找到与 "{query}" 相关的文章
        </p>
        <p className="text-sm text-gray-500 mb-4">
          建议：
        </p>
        <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-1">
          <li>• 检查关键词拼写</li>
          <li>• 尝试使用更简单的关键词</li>
          <li>• 尝试使用相关词汇</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          搜索结果 ({posts.length})
        </h2>
        <p className="text-gray-600">
          找到与 "{query}" 相关的文章
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {post.cover_image && (
                  <div className="md:w-48 h-32 flex-shrink-0">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      width={192}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.reading_time} 分钟
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.view_count} 次阅读
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt || post.content.slice(0, 200)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.category && (
                        <Link href={`/blog?category=${post.category.slug}`}>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors">
                            {post.category.name}
                          </span>
                        </Link>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        阅读全文
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}