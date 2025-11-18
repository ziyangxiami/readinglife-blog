import { getPosts, getCategories, getTags, getPostsByCategorySlug, getPostsByTagSlug, searchPostsList } from '@/lib/sanity-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag, Folder, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { SearchBox } from '@/components/search-box'

/**
 * 文章列表页面
 * 展示所有文章，支持分类和标签筛选
 */
export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = parseInt(params.page as string) || 1
  const category = params.category as string
  const tag = params.tag as string
  const search = params.search as string

  // 根据查询参数获取不同类型的文章列表
  let postData
  if (search) {
    postData = await searchPostsList(search, page, 10)
  } else if (category) {
    postData = await getPostsByCategorySlug(category, page, 10)
  } else if (tag) {
    postData = await getPostsByTagSlug(tag, page, 10)
  } else {
    postData = await getPosts(page, 10)
  }
  
  const { posts, total, totalPages } = postData
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ])

  const currentCategory = category ? categories.find(c => c.slug === category) : null
  const currentTag = tag ? tags.find(t => t.slug === tag) : null

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 页面标题 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
            {search ? `搜索结果: "${search}"` : currentCategory ? currentCategory.name : currentTag ? currentTag.name : '所有文章'}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {search ? `找到 ${total} 篇相关文章` : currentCategory ? currentCategory.description : currentTag ? `标签 "${currentTag.name}" 下的文章` : '分享读书心得，记录学习历程'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区 */}
          <main className="flex-1">
            {/* 搜索框 */}
            <div className="mb-6">
              <SearchBox />
            </div>

            {/* 文章列表 */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到文章</h3>
                <p className="text-gray-600 mb-6">
                  {search ? '尝试其他关键词搜索' : '该分类下暂无文章'}
                </p>
                <Link href="/blog">
                  <Button>查看所有文章</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <article key={post.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
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
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.author.name}
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {post.category && (
                                <Link href={`/blog?category=${post.category.slug}`}>
                                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs hover:bg-gray-100 transition-colors">
                                    <Folder className="w-3 h-3" />
                                    {post.category.name}
                                  </span>
                                </Link>
                              )}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {post.tags.slice(0, 3).map((tag: any) => (
                                    <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs hover:bg-gray-100 transition-colors">
                                        <Tag className="w-3 h-3" />
                                        {tag.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="outline" size="sm">
                                阅读全文
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Link href={`/blog?page=${Math.max(1, page - 1)}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" disabled={page <= 1}>
                    上一页
                  </Button>
                </Link>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}
                    >
                      <Button
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  ))}
                </div>

                <Link href={`/blog?page=${Math.min(totalPages, page + 1)}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" disabled={page >= totalPages}>
                    下一页
                  </Button>
                </Link>
              </div>
            )}
          </main>

          {/* 侧边栏 */}
          <aside className="lg:w-80">
            {/* 分类 */}
            <Card className="mb-6 border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Folder className="w-5 h-5" />
                  文章分类
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {categories.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors ${
                        currentCategory?.id === category.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-400">({category.post_count})</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 热门标签 */}
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Tag className="w-5 h-5" />
                  热门标签
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag: any) => (
                    <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                        currentTag?.id === tag.id 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}>
                        {tag.name}
                        <span className="text-gray-400">({tag.post_count})</span>
                      </span>
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