import { supabase } from '@/lib/supabase'
import { Post, Category, Tag, Comment } from '@/types/database'

/**
 * 获取文章列表
 * @param page 页码
 * @param limit 每页数量
 * @param category 分类筛选
 * @param tag 标签筛选
 * @param search 搜索关键词
 */
export async function getPosts(
  page: number = 1,
  limit: number = 10,
  category?: string,
  tag?: string,
  search?: string
): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
  // 基础查询
  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // 搜索过滤
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  // 分页
  const { data: postsData, error: postsError, count } = await query.range(
    (page - 1) * limit,
    page * limit - 1
  )

  if (postsError) throw postsError

  // 获取关联数据
  const posts = postsData || []
  
  // 获取分类信息
  const categoryIds = posts.map(p => p.category_id).filter(Boolean)
  let categories: Category[] = []
  if (categoryIds.length > 0) {
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds)
    categories = categoriesData || []
  }

  // 获取标签信息
  const postIds = posts.map(p => p.id)
  let tags: Tag[] = []
  if (postIds.length > 0) {
    const { data: postTagsData } = await supabase
      .from('post_tags')
      .select('post_id, tag:tags(*)')
      .in('post_id', postIds)
    
    // 组织标签数据
    const postTagsMap = new Map<string, Tag[]>()
    postTagsData?.forEach(item => {
      const postId = item.post_id
      const tag = (item as any).tag
      if (!postTagsMap.has(postId)) {
        postTagsMap.set(postId, [])
      }
      postTagsMap.get(postId)!.push(tag)
    })
    
    // 为每篇文章添加标签
    posts.forEach(post => {
      post.tags = postTagsMap.get(post.id) || []
    })
  }

  // 为每篇文章添加分类
  posts.forEach(post => {
    if (post.category_id) {
      post.category = categories.find(c => c.id === post.category_id)
    }
  })

  return {
    posts,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * 获取单篇文章
 * @param slug 文章链接
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 获取文章基本信息
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (postError) {
    if (postError.code === 'PGRST116') return null
    throw postError
  }

  if (!post) return null

  // 获取分类信息
  let category = null
  if (post.category_id) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .eq('id', post.category_id)
      .single()
    category = categoryData
  }

  // 获取标签信息
  const { data: postTags } = await supabase
    .from('post_tags')
    .select('tag:tags(*)')
    .eq('post_id', post.id)

  const tags = postTags?.map(item => (item as any).tag) || []

  return {
    ...post,
    category,
    tags
  }
}

/**
 * 增加文章阅读量
 * @param postId 文章ID
 */
export async function incrementViewCount(postId: string): Promise<void> {
  // 首先获取当前阅读量
  const { data: currentPost, error: selectError } = await supabase
    .from('posts')
    .select('view_count')
    .eq('id', postId)
    .single()

  if (selectError) throw selectError

  // 更新阅读量
  const { error } = await supabase
    .from('posts')
    .update({ view_count: (currentPost?.view_count || 0) + 1 })
    .eq('id', postId)

  if (error) throw error
}

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

/**
 * 获取标签列表
 */
export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

/**
 * 获取文章评论
 * @param postId 文章ID
 */
export async function getComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error

  // 构建评论树结构
  const comments = data || []
  const commentMap = new Map<string, Comment>()
  const rootComments: Comment[] = []

  comments.forEach(comment => {
    comment.replies = []
    commentMap.set(comment.id, comment)
  })

  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(comment)
      }
    } else {
      rootComments.push(comment)
    }
  })

  return rootComments
}

/**
 * 创建评论
 * @param comment 评论数据
 */
export async function createComment(comment: {
  post_id: string
  author_name: string
  author_email: string
  content: string
  parent_id?: string
}): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 创建文章（管理员功能）
 * @param post 文章数据
 */
export async function createPost(post: {
  title: string
  slug: string
  content: string
  cover_image?: string
  category_id?: string
  tags?: string[]
}): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}