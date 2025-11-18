'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Info } from 'lucide-react'

/**
 * 数据库初始化页面（已迁移到 Sanity）
 * 
 * 注意：此页面已从 Supabase 迁移到 Sanity
 * 项目现在使用 Sanity Studio 进行内容管理
 */
export default function DatabaseInitPage() {
  const [sanityStatus, setSanityStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSanityConnection = async () => {
    setLoading(true)
    try {
      // 简单的 Sanity 连接测试
      // 在实际项目中，这里应该调用 Sanity API 来验证连接
      const response = await fetch('/api/sanity-test')
      
      if (response.ok) {
        setSanityStatus({ 
          success: true, 
          message: 'Sanity 连接正常',
          details: '可以通过 Sanity Studio 管理内容'
        })
      } else {
        setSanityStatus({ 
          success: false, 
          message: 'Sanity 连接测试失败',
          details: '请检查环境变量配置'
        })
      }
    } catch (error) {
      console.error('Sanity 连接测试失败:', error)
      setSanityStatus({ 
        success: false, 
        message: 'Sanity 连接测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 页面加载时自动测试连接
    checkSanityConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            系统状态检查
          </h1>

          {/* 系统迁移通知 */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">系统已升级</h3>
                <p className="text-blue-700 text-sm">
                  项目已从 Supabase 迁移到 Sanity CMS。现在您可以通过 Sanity Studio 管理所有内容。
                </p>
              </div>
            </div>
          </div>

          {/* Sanity 连接测试 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Sanity 连接状态
              </h2>
              <button
                onClick={checkSanityConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '测试中...' : '重新测试'}
              </button>
            </div>

            {sanityStatus && (
              <div className={`p-4 rounded-md ${
                sanityStatus.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {sanityStatus.success ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium">✅ {sanityStatus.message}</p>
                      {sanityStatus.details && (
                        <p className="text-green-600 mt-1 text-sm">{sanityStatus.details}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-800 font-medium">❌ {sanityStatus.message}</p>
                    {sanityStatus.details && (
                      <p className="text-red-600 mt-2 text-sm">{sanityStatus.details}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800 mb-2">使用说明:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 项目已迁移到 Sanity，内容管理更加便捷</li>
              <li>• 访问 <code className="bg-blue-100 px-1 rounded">/admin</code> 进入 Sanity Studio</li>
              <li>• 在 Sanity Studio 中可以创建和管理文章、分类、标签等内容</li>
              <li>• 确保在 .env.local 文件中配置了正确的 Sanity 环境变量</li>
            </ul>
          </div>

          {/* 下一步操作 */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">下一步:</h3>
            <p className="text-green-700 text-sm mb-2">
              开始使用 Sanity Studio 创建您的第一篇博客文章！
            </p>
            <a 
              href="/admin" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              进入 Sanity Studio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}