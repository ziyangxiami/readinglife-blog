import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 获取文章列表（管理员）
 * 支持分页和筛选
 * 注意：现在使用Sanity Studio进行身份验证，不再使用Next Auth
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // 获取文章列表，包含分类信息
    const { data: posts, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name, slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('获取文章列表失败:', error)
      return NextResponse.json({
        success: false,
        message: '获取文章列表失败'
      }, { status: 500 })
    }

    // 获取文章的标签信息
    const postIds = posts?.map(post => post.id) || []
    let tagsMap: Record<string, any[]> = {}

    if (postIds.length > 0) {
      const { data: postTags } = await supabase
        .from('post_tags')
        .select(`
          post_id,
          tag:tags(id, name, slug)
        `)
        .in('post_id', postIds)

      if (postTags) {
        tagsMap = postTags.reduce((acc, item) => {
          if (!acc[item.post_id]) {
            acc[item.post_id] = []
          }
          if (item.tag) {
            acc[item.post_id].push(item.tag)
          }
          return acc
        }, {} as Record<string, any[]>)
      }
    }

    // 合并标签数据
    const postsWithTags = posts?.map(post => ({
      ...post,
      tags: tagsMap[post.id] || []
    })) || []

    return NextResponse.json({
      success: true,
      data: postsWithTags,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('获取文章列表错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}