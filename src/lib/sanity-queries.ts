// src/lib/sanity-queries.ts
import { groq } from 'next-sanity'
import { sanityClient } from './sanity'
import type { BlogPost, Category, Tag, Author } from './sanity'

// 获取所有已发布的博客文章
export async function getAllPosts(): Promise<BlogPost[]> {
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

// 根据slug获取文章详情
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
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