import { NextRequest, NextResponse } from 'next/server'
import { getPostsByPage, searchPosts } from '@/lib/sanity-queries'

/**
 * 获取文章列表API
 * 支持分页、分类、标签、搜索筛选
 * 使用 Sanity 作为数据源
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined

    // 验证参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '页码和每页数量必须为正数，且每页数量不超过100' },
        { status: 400 }
      )
    }

    let result

    if (search) {
      // 如果有搜索关键词，使用搜索功能
      const posts = await searchPosts(search)
      result = {
        posts: posts.slice((page - 1) * limit, page * limit),
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        currentPage: page
      }
    } else {
      // 否则使用分页获取
      result = await getPostsByPage(page, limit)
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}