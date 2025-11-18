import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * 管理员登录API
 * 验证用户名密码并签发JWT令牌
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: '用户名和密码不能为空'
      }, { status: 400 })
    }

    // 简单的管理员账户验证（生产环境应该使用数据库和加密密码）
    // 这里使用环境变量存储管理员凭据
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401 })
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        username,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时过期
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: { token }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}