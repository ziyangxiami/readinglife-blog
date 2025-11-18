import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/sanity-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag, Folder, ArrowLeft, Share2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Navigation } from '@/components/navigation'
import { CommentsSection } from '@/components/comments-section'
import { PortableTextContent } from '@/components/portable-text-content'

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
  
  // 从Sanity获取文章数据
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  // 评论功能已移至客户端组件处理

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
              {new Date(post.publishedAt || post._createdAt).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readingTime} 分钟阅读
            </span>
            {post.author && typeof post.author === 'object' && 'name' in post.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {(post.author as any).name}
              </span>
            )}
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
              <Link href={`/blog?category=${(post.category as any).slug.current}`}>
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors">
                  <Folder className="w-4 h-4" />
                  {(post.category as any).title}
                </span>
              </Link>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag: any) => (
                  <Link key={tag._id} href={`/blog?tag=${tag.slug.current}`}>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm">
                      {tag.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 封面图片 */}
        {post.coverImage && (
          <div className="mb-8">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={urlFor(post.coverImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 文章内容 */}
        <div className="mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <PortableTextContent content={post.content as any} />
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
      <CommentsSection postId={post._id} />
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
    return {
      title: '文章未找到',
      description: '文章不存在或已被删除'
    }
  }

  // 从Portable Text中提取文本摘要
  const extractTextFromPortableText = (content: unknown[]): string => {
    if (!content || !Array.isArray(content)) return ''
    
    let text = ''
    const extractText = (blocks: unknown[]) => {
      for (const block of blocks) {
        if (typeof block === 'object' && block !== null) {
          const blockAny = block as any
          if (blockAny._type === 'block' && blockAny.children) {
            for (const child of blockAny.children) {
              if (child.text) {
                text += child.text + ' '
              }
            }
          }
        }
      }
    }
    
    extractText(content)
    return text.trim().slice(0, 160)
  }

  const description = post.excerpt || extractTextFromPortableText(post.content as unknown[]) || '文章详情'
  const coverImageUrl = post.coverImage ? urlFor(post.coverImage).url() : '/og-image.jpg'

  return {
    title: `${post.title} - Reading Life`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: [coverImageUrl],
      type: 'article',
      publishedTime: post.publishedAt || post._createdAt,
      modifiedTime: post._updatedAt
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [coverImageUrl]
    }
  }
}