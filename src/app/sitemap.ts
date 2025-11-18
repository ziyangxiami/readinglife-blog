// src/app/sitemap.ts
import { getPosts, getCategories, getTags } from '@/lib/sanity-api'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [{ posts }, categories, tags] = await Promise.all([
      getPosts(1, 100), // 获取所有文章
      getCategories(),
      getTags()
    ])

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://readinglife-blog.vercel.app'

    // 基础页面
    const routes = [
      '',
      '/blog',
      '/about'
    ].map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8
    }))

    // 文章页面
    const postRoutes = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }))

    // 分类页面
    const categoryRoutes = categories.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))

    // 标签页面
    const tagRoutes = tags.map(tag => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))

    return [
      ...routes,
      ...postRoutes,
      ...categoryRoutes,
      ...tagRoutes
    ]
  } catch (error) {
    console.error('生成网站地图失败:', error)
    // 返回基础页面
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://readinglife-blog.vercel.app'
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.8
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8
      }
    ]
  }
}