import { NextRequest, NextResponse } from 'next/server'
import { getPosts } from '@/lib/api'

/**
 * 获取文章列表API
 * 支持分页、分类、标签、搜索筛选
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const search = searchParams.get('search') || undefined

    const result = await getPosts(page, limit, category, tag, search)
    
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