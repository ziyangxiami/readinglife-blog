// src/lib/sanity-api.ts
import { 
  getAllPosts, 
  getFeaturedPosts, 
  getPostsByPage,
  getAllCategories, 
  getAllTags,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getAllAuthors,
  getAuthorBySlug,
  getPostsByAuthor,
  getSiteSettings,
  searchPosts
} from './sanity-queries'
import { urlFor } from './sanity'
import { mockPosts, mockCategories, mockTags, mockAuthors, mockSiteSettings } from './mock-data'

// 检查是否配置了真实的Sanity项目
const hasRealSanityProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo-project-id'

// 格式化文章数据
function formatPost(post: any) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage ? urlFor(post.coverImage).url() : null,
    tags: post.tags?.map((tag: any) => ({
      id: tag._id,
      name: tag.title,
      slug: tag.slug.current
    })) || [],
    category: post.category ? {
      id: post.category._id,
      name: post.category.title,
      slug: post.category.slug.current,
      color: post.category.color || '#3B82F6'
    } : null,
    author: post.author ? {
      id: post.author._id,
      name: post.author.name,
      slug: post.author.slug.current,
      avatar: post.author.avatar ? urlFor(post.author.avatar).url() : null,
      bio: post.author.bio
    } : null,
    published_at: post.publishedAt,
    created_at: post._createdAt,
    updated_at: post._updatedAt,
    featured: post.featured || false,
    reading_time: post.readingTime || 5,
    view_count: Math.floor(Math.random() * 1000) + 100, // 模拟阅读数
    meta_title: post.metaTitle || post.title,
    meta_description: post.metaDescription || post.excerpt
  }
}

// 格式化分类数据
function formatCategory(category: any) {
  return {
    id: category._id,
    name: category.title,
    slug: category.slug.current,
    description: category.description,
    color: category.color || '#3B82F6',
    image: category.image ? urlFor(category.image).url() : null,
    post_count: Math.floor(Math.random() * 50) + 5 // 模拟文章数
  }
}

// 格式化标签数据
function formatTag(tag: any) {
  return {
    id: tag._id,
    name: tag.title,
    slug: tag.slug.current,
    post_count: Math.floor(Math.random() * 30) + 2 // 模拟文章数
  }
}

// 获取文章列表（带分页）
export async function getPosts(page = 1, pageSize = 10) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = mockPosts.slice(start, end)
    
    return {
      posts: paginatedPosts,
      total: mockPosts.length,
      totalPages: Math.ceil(mockPosts.length / pageSize),
      currentPage: page
    }
  }
  
  try {
    const result = await getPostsByPage(page, pageSize)
    return {
      posts: result.posts.map(formatPost),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

// 获取推荐文章
export async function getFeaturedPostsList() {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => post.featured)
  }
  
  try {
    const posts = await getFeaturedPosts()
    return posts.map(formatPost)
  } catch (error) {
    console.error('获取推荐文章失败:', error)
    return []
  }
}

// 获取分类列表
export async function getCategories() {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockCategories
  }
  
  try {
    const categories = await getAllCategories()
    return categories.map(formatCategory)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return []
  }
}

// 获取标签列表
export async function getTags() {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockTags
  }
  
  try {
    const tags = await getAllTags()
    return tags.map(formatTag)
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return []
  }
}

// 根据slug获取文章
export async function getPost(slug: string) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockPosts.find(post => post.slug === slug) || null
  }
  
  try {
    const post = await getPostBySlug(slug)
    return post ? formatPost(post) : null
  } catch (error) {
    console.error('获取文章失败:', error)
    return null
  }
}

// 根据分类slug获取文章
export async function getPostsByCategorySlug(categorySlug: string, page = 1, pageSize = 10) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    const filteredPosts = mockPosts.filter(post => post.category.slug === categorySlug)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = filteredPosts.slice(start, end)
    
    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / pageSize),
      currentPage: page
    }
  }
  
  try {
    const posts = await getPostsByCategory(categorySlug)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = posts.slice(start, end)
    
    return {
      posts: paginatedPosts.map(formatPost),
      total: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取分类文章失败:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

// 根据标签slug获取文章
export async function getPostsByTagSlug(tagSlug: string, page = 1, pageSize = 10) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    const filteredPosts = mockPosts.filter(post => 
      post.tags.some((tag: any) => tag.slug === tagSlug)
    )
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = filteredPosts.slice(start, end)
    
    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / pageSize),
      currentPage: page
    }
  }
  
  try {
    const posts = await getPostsByTag(tagSlug)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = posts.slice(start, end)
    
    return {
      posts: paginatedPosts.map(formatPost),
      total: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取标签文章失败:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

// 获取作者列表
export async function getAuthors() {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockAuthors
  }
  
  try {
    const authors = await getAllAuthors()
    return authors.map((author: any) => ({
      id: author._id,
      name: author.name,
      slug: author.slug.current,
      bio: author.bio,
      avatar: author.avatar ? urlFor(author.avatar).url() : null,
      social_links: author.socialLinks || {},
      post_count: Math.floor(Math.random() * 20) + 1 // 模拟文章数
    }))
  } catch (error) {
    console.error('获取作者列表失败:', error)
    return []
  }
}

// 根据slug获取作者
export async function getAuthor(slug: string) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockAuthors.find(author => author.slug === slug) || null
  }
  
  try {
    const author = await getAuthorBySlug(slug)
    return author ? {
      id: author._id,
      name: author.name,
      slug: author.slug.current,
      bio: author.bio,
      avatar: author.avatar ? urlFor(author.avatar).url() : null,
      social_links: author.socialLinks || {}
    } : null
  } catch (error) {
    console.error('获取作者失败:', error)
    return null
  }
}

// 获取作者的文章
export async function getAuthorPosts(authorSlug: string, page = 1, pageSize = 10) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    const filteredPosts = mockPosts.filter(post => post.author.slug === authorSlug)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = filteredPosts.slice(start, end)
    
    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / pageSize),
      currentPage: page
    }
  }
  
  try {
    const posts = await getPostsByAuthor(authorSlug)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = posts.slice(start, end)
    
    return {
      posts: paginatedPosts.map(formatPost),
      total: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取作者文章失败:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

// 搜索文章
export async function searchPostsList(query: string, page = 1, pageSize = 10) {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    const filteredPosts = mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    )
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = filteredPosts.slice(start, end)
    
    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / pageSize),
      currentPage: page
    }
  }
  
  try {
    const posts = await searchPosts(query)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPosts = posts.slice(start, end)
    
    return {
      posts: paginatedPosts.map(formatPost),
      total: posts.length,
      totalPages: Math.ceil(posts.length / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('搜索文章失败:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

// 获取站点设置
export async function getSiteSettingsData() {
  // 如果没有配置真实的Sanity项目，返回模拟数据
  if (!hasRealSanityProject) {
    return mockSiteSettings
  }
  
  try {
    const settings = await getSiteSettings()
    if (!settings) return null
    
    return {
      title: settings.title,
      description: settings.description,
      keywords: settings.keywords || [],
      author: settings.author ? {
        id: settings.author._id,
        name: settings.author.name,
        slug: settings.author.slug.current,
        avatar: settings.author.avatar ? urlFor(settings.author.avatar).url() : null,
        bio: settings.author.bio
      } : null,
      logo: settings.logo ? urlFor(settings.logo).url() : null,
      favicon: settings.favicon ? urlFor(settings.favicon).url() : null,
      social_links: settings.socialLinks || {},
      analytics: settings.analytics || {},
      comments: settings.comments || { provider: 'none' }
    }
  } catch (error) {
    console.error('获取站点设置失败:', error)
    return null
  }
}