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
export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // 增加阅读量（在服务端执行）
  try {
    await incrementViewCount(post.id)
  } catch (error) {
    console.error('增加阅读量失败:', error)
  }

  const comments = await getComments(post.id)

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
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
      description: '文章不存在或已被删除'
    }
  }

  return {
    title: `${post.title} - Reading Life`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: [post.cover_image || '/og-image.jpg'],
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: [post.cover_image || '/twitter-image.jpg']
    }
  }
}