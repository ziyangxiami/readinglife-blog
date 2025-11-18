import { NextResponse } from 'next/server'
import { getTags } from '@/lib/api'

/**
 * 获取标签列表API
 */
export async function GET() {
  try {
    const tags = await getTags()
    
    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取标签列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}