import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * 验证管理员身份的中间件函数
 */
export async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        valid: false,
        error: '未提供认证令牌'
      }
    }

    const token = authHeader.substring(7)
    
    if (!token) {
      return {
        valid: false,
        error: '认证令牌不能为空'
      }
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string
      email: string
      role: string
    }

    // 检查是否为管理员
    if (decoded.role !== 'admin') {
      return {
        valid: false,
        error: '权限不足，需要管理员权限'
      }
    }

    return {
      valid: true,
      admin: decoded
    }

  } catch (error) {
    console.error('管理员认证失败:', error)
    return {
      valid: false,
      error: '认证失败，请重新登录'
    }
  }
}

/**
 * 创建需要管理员权限的API路由包装器
 */
export function withAdminAuth(handler: (request: NextRequest, admin: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await verifyAdmin(request)
    
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      )
    }

    return handler(request, auth.admin)
  }
}