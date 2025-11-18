import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 数据库连接测试API
 * 用于验证Supabase数据库连接状态
 */
export async function GET() {
  try {
    // 测试数据库连接
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '数据库连接正常',
      data: {
        connection: 'success',
        timestamp: new Date().toISOString(),
        test_result: data
      }
    })
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '数据库连接失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}