import { NextResponse } from 'next/server'
import { getAllCategories } from '@/lib/sanity-queries'

/**
 * 获取分类列表API
 * 使用 Sanity 作为数据源
 */
export async function GET() {
  try {
    const categories = await getAllCategories()
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取分类列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}