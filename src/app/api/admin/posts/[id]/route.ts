import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 获取单个文章详情（管理员）
 * 注意：现在使用Sanity Studio进行身份验证，不再使用Next Auth
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 获取文章详情，包含分类和标签信息
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name, slug),
        tags:post_tags!inner(
          tag:tags(id, name, slug)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('获取文章详情失败:', error)
      return NextResponse.json({
        success: false,
        message: '获取文章详情失败'
      }, { status: 500 })
    }

    if (!post) {
      return NextResponse.json({
        success: false,
        message: '文章不存在'
      }, { status: 404 })
    }

    // 格式化标签数据
    const formattedPost = {
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag) || []
    }

    return NextResponse.json({
      success: true,
      data: formattedPost
    })

  } catch (error) {
    console.error('获取文章详情错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}

/**
 * 更新文章（管理员）
 * 注意：现在使用Sanity Studio进行身份验证，不再使用Next Auth
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // 只允许更新特定字段
    const allowedFields = ['title', 'slug', 'content', 'excerpt', 'cover_image', 'category_id', 'is_published', 'reading_time']
    const updateData: Record<string, any> = {}
    
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: false,
        message: '没有有效的更新字段'
      }, { status: 400 })
    }

    // 更新文章
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('更新文章失败:', error)
      return NextResponse.json({
        success: false,
        message: '更新文章失败'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '文章更新成功',
      data
    })

  } catch (error) {
    console.error('更新文章错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}

/**
 * 删除文章（管理员）
 * 注意：现在使用Sanity Studio进行身份验证，不再使用Next Auth
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 首先删除相关的标签关联
    const { error: tagsError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id)

    if (tagsError) {
      console.error('删除标签关联失败:', tagsError)
      // 继续删除文章，即使标签关联删除失败
    }

    // 删除文章
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除文章失败:', error)
      return NextResponse.json({
        success: false,
        message: '删除文章失败'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    })

  } catch (error) {
    console.error('删除文章错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}