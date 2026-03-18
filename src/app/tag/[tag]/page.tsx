import { getPosts, getTags } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface TagPageProps {
  params: {
    tag: string
  }
  searchParams: {
    page?: string
  }
}

/**
 * 标签页面
 * 展示特定标签下的所有文章
 */
export default async function TagPage({ params, searchParams }: TagPageProps) {
  const page = Number(searchParams.page) || 1
  const { tag } = params

  const [{ posts, total, totalPages }, tags] = await Promise.all([
    getPosts(page, 10, undefined, tag),
    getTags()
  ])

  const currentTag = tags.find(t => t.slug === tag)

  if (!currentTag) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600">文章</Link>
            <span>/</span>
            <span className="text-gray-900">标签: {currentTag.name}</span>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">标签: {currentTag.name}</h1>
                <p className="text-gray-600">{total} 篇文章</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区域 */}
          <main className="flex-1">
            {/* 文章列表 */}
            <div className="space-y-6">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Link
                  href={`/tag/${tag}?page=${Math.max(1, page - 1)}`}
                  className={`px-4 py-2 rounded-lg border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  上一页
                </Link>
                <span className="px-4 py-2 text-gray-600">
                  {page} / {totalPages}
                </span>
                <Link
                  href={`/tag/${tag}?page=${Math.min(totalPages, page + 1)}`}
                  className={`px-4 py-2 rounded-lg border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  下一页
                </Link>
              </div>
            )}
          </main>

          {/* 侧边栏 - 其他标签 */}
          <aside className="w-full lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  其他标签
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.filter(t => t.slug !== tag).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag.name}
                      <span className="text-gray-500 text-xs ml-1">({tag.post_count})</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

/**
 * 文章卡片组件
 */
function ArticleCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex flex-col md:flex-row">
          {post.cover_image && (
            <div className="relative w-full md:w-48 h-48 md:h-32 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time} 分钟
              </span>
              {post.category && (
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {post.category.name}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 line-clamp-3 mb-4">
              {post.content.slice(0, 200)}...
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {post.tags?.slice(0, 3).map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {post.view_count} 次阅读
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}