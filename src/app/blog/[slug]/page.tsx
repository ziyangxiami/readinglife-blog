import { notFound } from 'next/navigation'
import { getPostBySlug, getComments, incrementViewCount } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag, Folder, ArrowLeft, Share2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { CommentsList } from '@/components/comments-list'
import { CommentForm } from '@/components/comment-form'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

/**
 * 文章详情页面
 * 展示单篇文章的完整内容
 */
/**
 * 文章详情页面
 * 展示单篇文章的完整内容
 * 特殊处理：当 slug 为 'welcome-to-reading-life' 且数据库无记录时，提供兜底渲染以避免 404
 */
export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let post = await getPostBySlug(slug)
  let isFallback = false

  if (!post) {
    if (slug === 'welcome-to-reading-life') {
      const fallbackCreatedAt = new Date().toISOString()
      const fallbackContent = `# 欢迎来到 Reading Life\n\n这是我的个人博客，专注于技术、文学、哲学和生活感悟的分享。\n\n## 关于这个博客\n\n这个博客使用现代化的技术栈构建：\n- 前端: Next.js 14 + React 18 + TypeScript\n- 样式: Tailwind CSS\n- 数据库: Supabase (PostgreSQL)\n- 部署: Vercel\n\n## 功能特性\n\n- 文章管理系统\n- 分类和标签系统\n- 评论功能\n- 搜索功能\n- 响应式设计\n- 深色模式支持\n\n## 开始探索\n\n点击顶部导航栏开始浏览文章，或者使用搜索功能找到你感兴趣的内容。\n\n感谢你的访问！`
      post = {
        id: 'fallback-welcome',
        title: '欢迎来到 Reading Life',
        slug: 'welcome-to-reading-life',
        content: fallbackContent,
        excerpt: '欢迎来到我的个人博客，这里分享技术、文学、哲学与生活感悟。',
        cover_image: null,
        category_id: null,
        category: null,
        tags: [],
        reading_time: 3,
        view_count: 0,
        likes: 0,
        is_published: true,
        created_at: fallbackCreatedAt,
        updated_at: fallbackCreatedAt
      } as any
      isFallback = true
    } else {
      notFound()
    }
  }

  // 此时 post 一定存在（要么是数据库中的，要么是兜底的）
  if (!post) {
    notFound()
  }

  // 增加阅读量（在服务端执行；兜底文章不计入）
  if (!isFallback && post) {
    try {
      await incrementViewCount(post.id)
    } catch (error) {
      console.error('增加阅读量失败:', error)
    }
  }

  const comments = isFallback ? [] : await getComments(post.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* 文章头部 */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回文章列表
            </Button>
          </Link>
        </div>

        {/* 文章标题区 */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} 分钟阅读
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.view_count} 次阅读
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* 分类和标签 */}
          <div className="flex flex-wrap items-center gap-4">
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`}>
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors">
                  <Folder className="w-4 h-4" />
                  {post.category.name}
                </span>
              </Link>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag: any) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm">
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 封面图片 */}
        {post.cover_image && (
          <div className="mb-8">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => (
                  <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm font-mono`}>
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <div className="my-6">
                    <img
                      src={src}
                      alt={alt}
                      className="rounded-lg shadow-md max-w-full h-auto"
                    />
                    {alt && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        {alt}
                      </p>
                    )}
                  </div>
                )
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* 分享和编辑按钮 */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享文章
            </Button>
          </div>
          
          <Button variant="ghost" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            编辑文章
          </Button>
        </div>
      </article>

      {/* 评论区 */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            评论 ({comments.length})
          </h2>
          
          {/* 评论表单 */}
          <div className="mb-8">
            <CommentForm postId={post.id} onCommentCreated={() => window.location.reload()} />
          </div>

          {/* 评论列表 */}
          <CommentsList postId={post.id} initialComments={comments} />
        </div>
      </section>
    </div>
  )
}

/**
 * 生成页面元数据
 */
/**
 * 生成页面元数据
 * 当为欢迎兜底文章时，返回静态的合理 SEO 元数据
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    if (slug === 'welcome-to-reading-life') {
      return {
        title: '欢迎来到 Reading Life - Reading Life',
        description: '欢迎来到我的个人博客，这里分享技术、文学、哲学与生活感悟。',
        openGraph: {
          title: '欢迎来到 Reading Life',
          description: '欢迎来到我的个人博客，这里分享技术、文学、哲学与生活感悟。',
          images: ['/og-image.jpg'],
          type: 'article',
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString()
        },
        twitter: {
          card: 'summary_large_image',
          title: '欢迎来到 Reading Life',
          description: '欢迎来到我的个人博客，这里分享技术、文学、哲学与生活感悟。',
          images: ['/twitter-image.jpg']
        }
      }
    }
    return {
      title: '文章未找到',
      description: '文章不存在或已被删除'
    }
  }

  return {
    title: `${post.title} - Reading Life`,
    description: post.excerpt || (post.content ? post.content.slice(0, 160) : ''),
    openGraph: {
      title: post.title,
      description: post.excerpt || (post.content ? post.content.slice(0, 160) : ''),
      images: [post.cover_image || '/og-image.jpg'],
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || (post.content ? post.content.slice(0, 160) : ''),
      images: [post.cover_image || '/twitter-image.jpg']
    }
  }
}