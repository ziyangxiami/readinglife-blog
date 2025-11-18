import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * 管理员文件上传 API
 * POST /api/admin/upload
 * 支持图片上传到 Supabase Storage
 */
export const POST = withAdminAuth(async (request: NextRequest, admin: any) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '未找到上传文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制 (最大 5MB)' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExtension}`
    const filePath = `blog-images/${fileName}`

    // 上传到 Supabase Storage
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '存储服务配置错误' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin.storage
      .from('blog-assets')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('上传失败:', error)
      return NextResponse.json(
        { error: '上传失败', details: error.message },
        { status: 500 }
      )
    }

    // 获取公开 URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('blog-assets')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        name: fileName,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('上传处理失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '上传处理失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
})