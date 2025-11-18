// src/lib/mock-data.ts
// 模拟数据，用于在没有Sanity项目配置时测试

export const mockPosts = [
  {
    id: '1',
    title: '欢迎来到ReadingLife博客',
    slug: 'welcome-to-readinglife',
    excerpt: '这是一个使用Sanity CMS构建的个人博客，分享读书心得和学习历程。',
    content: '欢迎来到ReadingLife博客！这里将记录我的读书心得、学习历程和技术探索。',
    cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    tags: [
      { id: '1', name: '博客', slug: 'blog' },
      { id: '2', name: '读书', slug: 'reading' }
    ],
    category: {
      id: '1',
      name: '随笔',
      slug: 'essay',
      color: '#3B82F6'
    },
    author: {
      id: '1',
      name: '博主',
      slug: 'blogger',
      avatar: '/logo-avatar.svg',
      bio: '终身学习者，读书爱好者'
    },
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    featured: true,
    reading_time: 5,
    view_count: 128,
    meta_title: '欢迎来到ReadingLife博客',
    meta_description: '这是一个使用Sanity CMS构建的个人博客，分享读书心得和学习历程。'
  },
  {
    id: '2',
    title: '如何构建现代化的博客系统',
    slug: 'building-modern-blog-system',
    excerpt: '探讨如何使用Next.js、Sanity CMS和现代技术栈构建高性能的博客系统。',
    content: '本文将详细介绍如何使用Next.js App Router、Sanity CMS和Tailwind CSS构建现代化的博客系统。',
    cover_image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop',
    tags: [
      { id: '3', name: '技术', slug: 'tech' },
      { id: '4', name: 'Next.js', slug: 'nextjs' },
      { id: '5', name: 'Sanity', slug: 'sanity' }
    ],
    category: {
      id: '2',
      name: '技术',
      slug: 'tech',
      color: '#10B981'
    },
    author: {
      id: '1',
      name: '博主',
      slug: 'blogger',
      avatar: '/logo-avatar.svg',
      bio: '终身学习者，读书爱好者'
    },
    published_at: '2024-01-15T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    featured: false,
    reading_time: 10,
    view_count: 89,
    meta_title: '如何构建现代化的博客系统',
    meta_description: '探讨如何使用Next.js、Sanity CMS和现代技术栈构建高性能的博客系统。'
  }
]

export const mockCategories = [
  {
    id: '1',
    name: '随笔',
    slug: 'essay',
    description: '生活感悟和随笔记录',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    post_count: 15
  },
  {
    id: '2',
    name: '技术',
    slug: 'tech',
    description: '技术分享和开发经验',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=200&fit=crop',
    post_count: 8
  },
  {
    id: '3',
    name: '读书',
    slug: 'reading',
    description: '读书心得和书评',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=200&fit=crop',
    post_count: 12
  }
]

export const mockTags = [
  { id: '1', name: '博客', slug: 'blog', post_count: 20 },
  { id: '2', name: '读书', slug: 'reading', post_count: 15 },
  { id: '3', name: '技术', slug: 'tech', post_count: 12 },
  { id: '4', name: 'Next.js', slug: 'nextjs', post_count: 8 },
  { id: '5', name: 'Sanity', slug: 'sanity', post_count: 5 },
  { id: '6', name: 'TypeScript', slug: 'typescript', post_count: 6 },
  { id: '7', name: 'React', slug: 'react', post_count: 10 },
  { id: '8', name: 'CSS', slug: 'css', post_count: 4 },
  { id: '9', name: 'JavaScript', slug: 'javascript', post_count: 7 },
  { id: '10', name: 'Web开发', slug: 'webdev', post_count: 9 }
]

export const mockAuthors = [
  {
    id: '1',
    name: '博主',
    slug: 'blogger',
    bio: '终身学习者，读书爱好者，专注于技术分享和知识传播。',
    avatar: '/logo-avatar.svg',
    social_links: {
      twitter: 'https://twitter.com/example',
      github: 'https://github.com/example',
      linkedin: 'https://linkedin.com/in/example'
    },
    post_count: 35
  }
]

export const mockSiteSettings = {
  title: 'ReadingLife Blog',
  description: '分享读书心得，记录学习历程，探索知识的无限可能',
  keywords: ['读书', '学习', '技术', '博客', '分享'],
  author: mockAuthors[0],
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  social_links: {
    twitter: 'https://twitter.com/readinglife',
    github: 'https://github.com/readinglife',
    linkedin: 'https://linkedin.com/company/readinglife'
  },
  analytics: {
    googleAnalytics: 'G-XXXXXXXXXX'
  },
  comments: {
    provider: 'none'
  }
}