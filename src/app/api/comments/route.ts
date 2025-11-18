import { NextRequest, NextResponse } from 'next/server'
import { createComment } from '@/lib/api'

/**
 * 创建评论API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, author_name, author_email, content, parent_id } = body

    // 验证必要字段
    if (!post_id || !author_name || !author_email || !content) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少必要字段',
          message: '请填写完整的评论信息'
        },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱格式错误',
          message: '请输入有效的邮箱地址'
        },
        { status: 400 }
      )
    }

    // 验证内容长度
    if (content.length < 2 || content.length > 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: '内容长度不符合要求',
          message: '评论内容长度应在2-1000个字符之间'
        },
        { status: 400 }
      )
    }

    const comment = await createComment({
      post_id,
      author_name: author_name.trim(),
      author_email: author_email.trim(),
      content: content.trim(),
      parent_id: parent_id || undefined
    })

    return NextResponse.json({
      success: true,
      data: comment
    })
  } catch (error) {
    console.error('创建评论失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '创建评论失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}