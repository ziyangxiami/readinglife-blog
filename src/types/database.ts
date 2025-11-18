// 数据库表类型定义
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  cover_image: string | null
  category_id: string | null
  reading_time: number
  view_count: number
  likes: number
  is_published: boolean
  created_at: string
  updated_at: string
  category?: Category
  tags?: Tag[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  post_count: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  post_count: number
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  parent_id: string | null
  created_at: string
  replies?: Comment[]
}

export interface PostTag {
  post_id: string
  tag_id: string
  created_at: string
}