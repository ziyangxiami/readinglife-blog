// src/lib/sanity-queries.ts
import { groq } from 'next-sanity'
import { sanityClient } from './sanity'
import type { BlogPost, Category, Tag, Author, Trip } from './sanity'
import { mockPosts, mockCategories, mockTags, mockAuthors, mockSiteSettings } from './mock-data'

// 判断是否有真实的Sanity项目配置
const hasRealSanityProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo-project-id'

// 辅助函数：将 mock data 转换为 Sanity 原始格式
function convertToSanityFormat(post: any): any {
  if (!post) return null;
  return {
    ...post,
    _id: post.id,
    _createdAt: post.created_at,
    _updatedAt: post.updated_at,
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image ? {
      // Mocking Sanity Image object format to avoid urlFor crashes,
      // but actually urlFor doesn't like fake refs. We can just return the raw string 
      // or modify urlFor. Since urlFor crashes on bad _ref, let's use a valid looking ref
      asset: {
        _ref: 'image-mock-1x1-png',
        url: post.cover_image
      }
    } : null,
    tags: post.tags?.map((tag: any) => ({
      _id: tag.id,
      title: tag.name,
      slug: { current: tag.slug }
    })),
    category: post.category ? {
      _id: post.category.id,
      title: post.category.name,
      slug: { current: post.category.slug },
      color: post.category.color
    } : null,
    author: post.author ? {
      _id: post.author.id,
      name: post.author.name,
      slug: { current: post.author.slug },
      avatar: post.author.avatar ? {
        asset: {
          _ref: 'image-mock',
          url: post.author.avatar
        }
      } : null,
      bio: post.author.bio
    } : null,
    publishedAt: post.published_at,
    featured: post.featured,
    readingTime: post.reading_time
  };
}

// 获取所有足迹数据
export async function getAllTrips(): Promise<Trip[]> {
  if (!hasRealSanityProject) {
    // For local mock testing, return a few dummy trips
    return [
      {
        _id: 'trip-1',
        _createdAt: new Date().toISOString(),
        title: '北京长城之行',
        locationName: 'Beijing',
        country: 'China',
        visitDate: '2023-10',
      },
      {
        _id: 'trip-2',
        _createdAt: new Date().toISOString(),
        title: '京都赏樱',
        locationName: 'Kyoto',
        country: 'Japan',
        visitDate: '2024-04',
      }
    ] as unknown as Trip[]
  }
  
  const query = groq`
    *[_type == "trip"] | order(visitDate desc) {
      _id,
      _createdAt,
      title,
      locationName,
      country,
      visitDate,
      coverImage,
      gallery,
      notes
    }
  `
  return sanityClient.fetch(query)
}

// 获取所有已发布的博客文章
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const query = groq`
    *[_type == "blogPost" && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(query)
}

// 获取推荐文章
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => post.featured).map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const query = groq`
    *[_type == "blogPost" && featured == true && publishedAt <= now()] | order(publishedAt desc) [0...5] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(query)
}

// 根据slug获取文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasRealSanityProject) {
    const post = mockPosts.find(post => post.slug === slug)
    return convertToSanityFormat(post) as unknown as BlogPost | null
  }
  const query = groq`
    *[_type == "blogPost" && slug.current == $slug && publishedAt <= now()][0] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio,
        socialLinks
      },
      metaTitle,
      metaDescription
    }
  `
  return sanityClient.fetch(query, { slug })
}

// 获取所有分类
export async function getAllCategories(): Promise<Category[]> {
  if (!hasRealSanityProject) {
    return mockCategories as unknown as Category[]
  }
  const query = groq`
    *[_type == "category"] | order(title asc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      description,
      color,
      image,
      "post_count": count(*[_type == "blogPost" && references(^._id) && publishedAt <= now()])
    }
  `
  return sanityClient.fetch(query)
}

// 根据slug获取分类
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!hasRealSanityProject) {
    return (mockCategories.find(category => category.slug === slug) || null) as unknown as Category | null
  }
  const query = groq`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      description,
      color,
      image
    }
  `
  return sanityClient.fetch(query, { slug })
}

// 获取分类下的文章
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => post.category?.slug === categorySlug).map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const query = groq`
    *[_type == "blogPost" && category->slug.current == $categorySlug && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(query, { categorySlug })
}

// 获取所有标签
export async function getAllTags(): Promise<Tag[]> {
  if (!hasRealSanityProject) {
    return mockTags as unknown as Tag[]
  }
  const query = groq`
    *[_type == "tag"] | order(title asc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      "post_count": count(*[_type == "blogPost" && references(^._id) && publishedAt <= now()])
    }
  `
  return sanityClient.fetch(query)
}

// 根据slug获取标签
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  if (!hasRealSanityProject) {
    return (mockTags.find(tag => tag.slug === slug) || null) as unknown as Tag | null
  }
  const query = groq`
    *[_type == "tag" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug
    }
  `
  return sanityClient.fetch(query, { slug })
}

// 获取标签下的文章
export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => post.tags?.some((t: any) => t.slug === tagSlug)).map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const query = groq`
    *[_type == "blogPost" && $tagSlug in tags[]->slug.current && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(query, { tagSlug })
}

// 获取所有作者
export async function getAllAuthors(): Promise<Author[]> {
  if (!hasRealSanityProject) {
    return mockAuthors as unknown as Author[]
  }
  const query = groq`
    *[_type == "author"] | order(name asc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      bio,
      avatar,
      socialLinks
    }
  `
  return sanityClient.fetch(query)
}

// 根据slug获取作者
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!hasRealSanityProject) {
    return (mockAuthors.find(author => author.slug === slug) || null) as unknown as Author | null
  }
  const query = groq`
    *[_type == "author" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      bio,
      avatar,
      socialLinks
    }
  `
  return sanityClient.fetch(query, { slug })
}

// 获取作者的文章
export async function getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => post.author?.slug === authorSlug).map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const query = groq`
    *[_type == "blogPost" && author->slug.current == $authorSlug && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(query, { authorSlug })
}

// 获取站点设置
export async function getSiteSettings() {
  if (!hasRealSanityProject) {
    return mockSiteSettings
  }
  const query = groq`
    *[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      keywords,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      },
      logo,
      favicon,
      socialLinks,
      analytics,
      comments
    }
  `
  return sanityClient.fetch(query)
}

// 搜索文章
export async function searchPosts(query: string): Promise<BlogPost[]> {
  if (!hasRealSanityProject) {
    return mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    ).map(convertToSanityFormat) as unknown as BlogPost[]
  }
  const searchQuery = groq`
    *[_type == "blogPost" && (
      title match $searchQuery + "*" || 
      excerpt match $searchQuery + "*" || 
      pt::text(content) match $searchQuery + "*"
    ) && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  return sanityClient.fetch(searchQuery, { searchQuery: query })
}

// 获取分页文章
export async function getPostsByPage(page: number, pageSize: number = 10): Promise<{
  posts: BlogPost[]
  total: number
  totalPages: number
  currentPage: number
}> {
  if (!hasRealSanityProject) {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      posts: mockPosts.slice(start, end).map(convertToSanityFormat) as unknown as BlogPost[],
      total: mockPosts.length,
      totalPages: Math.ceil(mockPosts.length / pageSize),
      currentPage: page
    }
  }

  const start = (page - 1) * pageSize
  
  const postsQuery = groq`
    *[_type == "blogPost" && publishedAt <= now()] | order(publishedAt desc) [$start...$end] {
      _id,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      excerpt,
      coverImage,
      tags[]->{
        _id,
        title,
        slug
      },
      category->{
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      featured,
      readingTime,
      author->{
        _id,
        name,
        slug,
        avatar,
        bio
      }
    }
  `
  
  const countQuery = groq`
    count(*[_type == "blogPost" && publishedAt <= now()])
  `
  
  const [posts, total] = await Promise.all([
    sanityClient.fetch(postsQuery, { start, end: start + pageSize }),
    sanityClient.fetch(countQuery)
  ])
  
  return {
    posts,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page
  }
}