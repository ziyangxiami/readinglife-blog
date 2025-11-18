import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Tag, Folder, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ArticleCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    content?: string
    cover_image?: string | null
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
    reading_time?: number
    view_count?: number
    created_at: string
  }
  showExcerpt?: boolean
  showTags?: boolean
  showCategory?: boolean
  layout?: 'vertical' | 'horizontal'
}

/**
 * 响应式文章卡片组件
 * 支持多种布局和显示选项
 */
export function ArticleCard({ 
  post, 
  showExcerpt = true, 
  showTags = true, 
  showCategory = true,
  layout = 'vertical'
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateExcerpt = (content?: string, maxLength: number = 150) => {
    if (!content) return post.excerpt || ''
    const text = content.replace(/[#*`_\[\]()]/g, '')
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  if (layout === 'horizontal') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 封面图片 */}
            {post.cover_image && (
              <div className="md:w-48 md:h-32 w-full h-48 flex-shrink-0">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* 内容区域 */}
            <div className="flex-1 min-w-0">
              <Link href={`/blog/${post.slug}`}>
                <CardTitle className="text-xl mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </Link>
              
              {showExcerpt && (
                <CardDescription className="mb-4 line-clamp-3">
                  {generateExcerpt(post.content)}
                </CardDescription>
              )}
              
              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.created_at)}
                </span>
                {post.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.reading_time} 分钟
                  </span>
                )}
                {post.view_count && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.view_count} 次
                  </span>
                )}
              </div>
              
              {/* 分类和标签 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {showCategory && post.category && (
                  <Link href={`/category/${post.category.slug}`}>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors">
                      <Folder className="w-3 h-3" />
                      {post.category.name}
                    </span>
                  </Link>
                )}
                
                {showTags && post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-400" />
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors">
                          {tag.name}
                        </span>
                      </Link>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* 阅读更多按钮 */}
              <Link href={`/blog/${post.slug}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  阅读全文
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 垂直布局（默认）
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* 封面图片 */}
      {post.cover_image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardHeader className="flex-grow">
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="text-lg mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
        
        {showExcerpt && (
          <CardDescription className="mb-4 line-clamp-3">
            {generateExcerpt(post.content)}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4">
        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.created_at)}
          </span>
          {post.reading_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} 分钟
            </span>
          )}
        </div>
        
        {/* 分类和标签 */}
        <div className="flex flex-wrap items-center gap-2">
          {showCategory && post.category && (
            <Link href={`/category/${post.category.slug}`}>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors">
                <Folder className="w-3 h-3" />
                {post.category.name}
              </span>
            </Link>
          )}
          
          {showTags && post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              {post.tags.slice(0, 2).map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors">
                    {tag.name}
                  </span>
                </Link>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
        
        {/* 阅读更多按钮 */}
        <Link href={`/blog/${post.slug}`} className="mt-auto">
          <Button variant="ghost" size="sm" className="w-full flex items-center justify-center gap-1">
            阅读全文
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}