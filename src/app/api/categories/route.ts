import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/api'

/**
 * 获取分类列表API
 */
export async function GET() {
  try {
    const categories = await getCategories()
    
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