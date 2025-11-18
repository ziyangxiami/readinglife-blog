import { getPosts, getCategories, getTags } from '@/lib/sanity-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, ArrowRight, Tag, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'

/**
 * 极简首页设计
 * 重点突出文章内容，弱化分类标签
 */
export default async function HomePage() {
  const [{ posts }, categories, tags] = await Promise.all([
    getPosts(1, 6), // 获取最新的6篇文章
    getCategories(),
    getTags()
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero区域 - 极简设计 */}
      <section className="relative py-16 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6">
              <Image
                src="/logo-avatar-new.svg"
                alt="Reading Life"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
              Reading Life
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              分享读书心得，记录学习历程，探索知识的无限可能
            </p>
          </div>
        </div>
      </section>

      {/* 主要内容区域 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 文章标题区域 */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-light text-gray-900">
              最新文章
            </h2>
            <Link href="/blog">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* 文章网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post: any) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {/* 简化的分类和标签区域 */}
          <div className="border-t border-gray-100 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* 分类 - 极简展示 */}
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-6">
                  分类
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.slice(0, 6).map((category: any) => (
                    <Link key={category.id} href={`/blog?category=${category.slug}`}>
                      <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        {category.name}
                        <span className="text-xs text-gray-400">({category.post_count})</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 标签 - 极简展示 */}
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-6">
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag: any) => (
                    <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <Tag className="w-3 h-3" />
                        {tag.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * 文章卡片组件 - 极简设计
 */
function ArticleCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-sm bg-white">
        {post.cover_image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.published_at).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} 分钟</span>
            </div>
          </div>
          <CardTitle className="line-clamp-2 text-lg font-medium text-gray-900">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 mb-4 text-gray-600">
            {post.content ? post.content.slice(0, 150) : post.excerpt}...
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.author && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3" />
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.category && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                  {post.category.name}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
