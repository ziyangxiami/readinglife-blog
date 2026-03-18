import { getPostsByCategorySlug, getCategories } from '@/lib/sanity-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Folder, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

/**
 * 分类页面
 * 展示特定分类下的所有文章
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { category } = resolvedParams

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPostsByCategorySlug(category, page, 10),
    getCategories()
  ])

  const currentCategory = categories.find(c => c.slug === category)

  if (!currentCategory) {
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
            <span className="text-gray-900">{currentCategory.name}</span>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentCategory.name}</h1>
                <p className="text-gray-600">{total} 篇文章</p>
              </div>
            </div>
            
            {currentCategory.description && (
              <p className="text-gray-700 leading-relaxed">{currentCategory.description}</p>
            )}
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
                  href={`/category/${category}?page=${Math.max(1, page - 1)}`}
                  className={`px-4 py-2 rounded-lg border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  上一页
                </Link>
                <span className="px-4 py-2 text-gray-600">
                  {page} / {totalPages}
                </span>
                <Link
                  href={`/category/${category}?page=${Math.min(totalPages, page + 1)}`}
                  className={`px-4 py-2 rounded-lg border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  下一页
                </Link>
              </div>
            )}
          </main>

          {/* 侧边栏 - 其他分类 */}
          <aside className="w-full lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  其他分类
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.filter(c => c.slug !== category).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        <div className="text-sm text-gray-500">{cat.post_count} 篇文章</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
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
                {new Date(post.published_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time} 分钟
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 line-clamp-3 mb-4">
              {post.content ? (typeof post.content === 'string' ? post.content.slice(0, 200) : '') : post.excerpt}...
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
                {post.views} 次阅读
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}