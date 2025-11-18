import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * 验证管理员token的API
 * 用于前端检查登录状态
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '未提供认证令牌'
      }, { status: 401 })
    }

    const token = authHeader.substring(7) // 移除 'Bearer ' 前缀
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
      
      // 检查是否为管理员
      if ((decoded as any).role !== 'admin') {
        return NextResponse.json({
          success: false,
          message: '权限不足'
        }, { status: 403 })
      }

      return NextResponse.json({
        success: true,
        message: '验证成功',
        data: { username: (decoded as any).username }
      })

    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        message: '令牌无效或已过期'
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 })
  }
}