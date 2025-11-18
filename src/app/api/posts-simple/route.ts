import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 获取文章列表 API - 简化版
 * GET /api/posts
 * 
 * 查询参数:
 * - page: 页码 (默认: 1)
 * - limit: 每页数量 (默认: 10)
 * - category: 分类筛选
 * - tag: 标签筛选
 * - search: 搜索关键词
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const search = searchParams.get('search') || undefined

    // 验证参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '页码和每页数量必须为正数，且每页数量不超过100' },
        { status: 400 }
      )
    }

    // 基础查询 - 使用更简单的查询
    let query = supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    // 搜索功能 - 简化处理
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // 获取总数
    const { count } = await query
    
    // 获取分页数据
    const { data: posts, error } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    )

    if (error) throw error

    // 获取关联数据
    const postsWithRelations = await Promise.all(
      (posts || []).map(async (post) => {
        // 获取分类信息
        const { data: category } = await supabase
          .from('categories')
          .select('id, name, slug, description')
          .eq('id', post.category_id)
          .single()

        // 获取标签信息
        const { data: postTags } = await supabase
          .from('post_tags')
          .select('tag:tags(id, name, slug, post_count)')
          .eq('post_id', post.id)

        return {
          ...post,
          category: category || null,
          tags: postTags?.map(pt => pt.tag) || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        posts: postsWithRelations,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: '获取文章列表失败，请稍后重试' },
      { status: 500 }
    )
  }
}