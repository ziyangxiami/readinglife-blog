'use client'

import { useState, useEffect } from 'react'
import { testDatabaseConnection, initializeDatabaseData } from '@/lib/db-test'

/**
 * 数据库初始化测试页面
 * 用于测试Supabase连接并初始化数据
 */
export default function DatabaseInitPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [initResult, setInitResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await testDatabaseConnection()
      setTestResult(result)
      console.log('数据库测试结果:', result)
    } catch (error) {
      console.error('测试失败:', error)
      setTestResult({ success: false, error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  const handleInitializeData = async () => {
    setInitLoading(true)
    try {
      const result = await initializeDatabaseData()
      setInitResult(result)
      console.log('数据初始化结果:', result)
    } catch (error) {
      console.error('初始化失败:', error)
      setInitResult({ success: false, error: error instanceof Error ? error.message : String(error) })
    } finally {
      setInitLoading(false)
    }
  }

  useEffect(() => {
    // 页面加载时自动测试连接
    handleTestConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            数据库初始化测试
          </h1>

          {/* 连接测试部分 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                数据库连接测试
              </h2>
              <button
                onClick={handleTestConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '测试中...' : '重新测试'}
              </button>
            </div>

            {testResult && (
              <div className={`p-4 rounded-md ${
                testResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {testResult.success ? (
                  <div>
                    <p className="text-green-800 font-medium mb-2">✅ 数据库连接成功</p>
                    
                    {testResult.results && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">表状态:</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(testResult.results).map(([table, result]: [string, any]) => (
                            <div key={table} className={`p-2 rounded text-sm ${
                              result.success 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {table}: {result.success ? '✅ 正常' : '❌ 错误'}
                              {result.success && result.count !== undefined && (
                                <span className="ml-1">({result.count}条记录)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {testResult.categories && testResult.categories.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">分类数据:</h3>
                        <div className="flex flex-wrap gap-2">
                          {testResult.categories.map((category: any) => (
                            <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {testResult.tags && testResult.tags.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">标签数据:</h3>
                        <div className="flex flex-wrap gap-2">
                          {testResult.tags.map((tag: any) => (
                            <span key={tag.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-red-800 font-medium">❌ 数据库连接失败</p>
                    {testResult.error && (
                      <p className="text-red-600 mt-2 text-sm">{testResult.error}</p>
                    )}
                    {testResult.details && (
                      <p className="text-red-600 mt-1 text-sm">{testResult.details}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 数据初始化部分 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                数据初始化
              </h2>
              <button
                onClick={handleInitializeData}
                disabled={initLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initLoading ? '初始化中...' : '初始化数据'}
              </button>
            </div>

            {initResult && (
              <div className={`p-4 rounded-md ${
                initResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {initResult.success ? (
                  <p className="text-green-800 font-medium">✅ 数据初始化成功</p>
                ) : (
                  <div>
                    <p className="text-red-800 font-medium">❌ 数据初始化失败</p>
                    {initResult.error && (
                      <p className="text-red-600 mt-2 text-sm">{initResult.error}</p>
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
              <li>• 页面加载时会自动测试数据库连接</li>
              <li>• 如果连接失败，请检查环境变量配置</li>
              <li>• 如果表不存在，需要在Supabase控制台运行SQL迁移脚本</li>
              <li>• 点击"初始化数据"可以插入初始的分类和标签数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}