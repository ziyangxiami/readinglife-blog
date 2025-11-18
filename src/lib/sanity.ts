import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity客户端配置
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-12-03',
  useCdn: false, // 禁用CDN缓存以确保数据实时同步
})

// 图片URL构建器
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: { asset?: { _ref: string } } | string) {
  return builder.image(source)
}

// 博客文章类型定义
export interface BlogPost {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  content: unknown[]
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
  }
  tags: string[]
  category: {
    _ref: string
    _type: string
  }
  publishedAt: string
  featured: boolean
  readingTime: number
  author: {
    _ref: string
    _type: string
  }
}

// 分类类型定义
export interface Category {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  title: string
  slug: {
    current: string
  }
  description: string
  color: string
}

// 标签类型定义
export interface Tag {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  title: string
  slug: {
    current: string
  }
}

// 作者类型定义
export interface Author {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  slug: {
    current: string
  }
  bio: string
  avatar?: {
    asset: {
      _ref: string
      _type: string
    }
  }
  socialLinks: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}