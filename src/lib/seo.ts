import { Metadata } from 'next'

/**
 * 默认SEO配置
 */
export const defaultSEO: Metadata = {
  title: {
    default: 'Reading Life - 个人读书学习分享平台',
    template: '%s | Reading Life'
  },
  description: '分享读书心得，记录学习历程，探索知识的无限可能。个人博客平台，专注于技术、文学、哲学和生活感悟的分享。',
  keywords: ['读书', '学习', '博客', '技术', '文学', '哲学', '生活感悟', '读书笔记'],
  authors: [{ name: 'Reading Life', url: 'https://readinglife.fun' }],
  creator: 'Reading Life',
  publisher: 'Reading Life',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://readinglife.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Reading Life - 个人读书学习分享平台',
    description: '分享读书心得，记录学习历程，探索知识的无限可能',
    url: 'https://readinglife.fun',
    siteName: 'Reading Life',
    images: [
      {
        url: 'https://readinglife.fun/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reading Life - 个人读书学习分享平台',
      }
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reading Life - 个人读书学习分享平台',
    description: '分享读书心得，记录学习历程，探索知识的无限可能',
    images: ['https://readinglife.fun/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * 文章页面SEO配置
 */
export function getPostSEO(post: {
  title: string
  content: string
  cover_image?: string | null
  slug: string
  created_at: string
  updated_at: string
}): Metadata {
  const excerpt = post.content.slice(0, 200).replace(/[#*`\[\]()]/g, '')
  const imageUrl = post.cover_image || 'https://readinglife.fun/default-post-image.jpg'
  
  return {
    title: `${post.title} | Reading Life`,
    description: excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://readinglife.fun/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      authors: ['Reading Life'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      images: [imageUrl],
    },
  }
}

/**
 * 分类页面SEO配置
 */
export function getCategorySEO(category: {
  name: string
  description?: string | null
  slug: string
}): Metadata {
  return {
    title: `${category.name} 分类 | Reading Life`,
    description: category.description || `查看 ${category.name} 分类下的所有文章`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} 分类`,
      description: category.description || `查看 ${category.name} 分类下的所有文章`,
      url: `https://readinglife.fun/category/${category.slug}`,
      type: 'website',
    },
  }
}

/**
 * 标签页面SEO配置
 */
export function getTagSEO(tag: {
  name: string
  slug: string
}): Metadata {
  return {
    title: `${tag.name} 标签 | Reading Life`,
    description: `查看所有包含 "${tag.name}" 标签的文章`,
    alternates: {
      canonical: `/tag/${tag.slug}`,
    },
    openGraph: {
      title: `${tag.name} 标签`,
      description: `查看所有包含 "${tag.name}" 标签的文章`,
      url: `https://readinglife.fun/tag/${tag.slug}`,
      type: 'website',
    },
  }
}

/**
 * 搜索页面SEO配置
 */
export function getSearchSEO(query?: string): Metadata {
  const title = query 
    ? `搜索 "${query}" 的结果 | Reading Life`
    : '搜索文章 | Reading Life'
    
  const description = query
    ? `搜索 "${query}" 的相关文章`
    : '搜索Reading Life博客中的所有文章'

  return {
    title,
    description,
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    },
    openGraph: {
      title,
      description,
      url: query 
        ? `https://readinglife.fun/search?q=${encodeURIComponent(query)}`
        : 'https://readinglife.fun/search',
      type: 'website',
    },
  }
}