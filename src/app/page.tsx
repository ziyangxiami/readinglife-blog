import { getPosts, getCategories, getTags, getFeaturedPostsList } from '@/lib/sanity-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag, Folder } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'

/**
 * 首页组件
 * 展示个人介绍、最新文章、分类导航
 */
export default async function HomePage() {
  const [{ posts }, categories, tags] = await Promise.all([
    getPosts(1, 5), // 获取最新的5篇文章
    getCategories(),
    getTags()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* 个人介绍区域 */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-white shadow-xl">
              <AvatarImage src="/avatar.svg" alt="个人头像" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                RL
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Reading Life
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              分享读书心得，记录学习历程，探索知识的无限可能
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                读书爱好者
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                终身学习者
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 分类导航 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            文章分类
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {category.description || `${category.post_count} 篇文章`}
                    </CardDescription>
                    <div className="mt-3 text-sm text-gray-500">
                      {category.post_count} 篇文章
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2">
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 标签云 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            热门标签
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {tags.slice(0, 15).map((tag: any) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors cursor-pointer text-sm">
                  <Tag className="w-3 h-3" />
                  {tag.name}
                  <span className="text-blue-500 text-xs">({tag.post_count})</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * 文章卡片组件
 */
function ArticleCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{post.reading_time} 分钟</span>
          </div>
          <CardTitle className="line-clamp-2 text-lg">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 mb-4">
            {post.content ? post.content.slice(0, 150) : post.excerpt}...
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {post.category.name}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {post.reading_time} 分钟阅读
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
