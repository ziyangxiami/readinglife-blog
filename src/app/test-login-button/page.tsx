'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function TestLoginButton() {
  const router = useRouter()
  const [clickCount, setClickCount] = useState(0)
  const [currentUrl, setCurrentUrl] = useState('加载中...')
  
  useEffect(() => {
    setCurrentUrl(window.location.pathname)
  }, [])
  
  const handleClick = () => {
    console.log("[TestLoginButton] 点击测试按钮，计数:", clickCount + 1)
    setClickCount(prev => prev + 1)
    
    try {
      console.log("[TestLoginButton] 准备跳转到登录页面")
      router.push("/admin/login")
    } catch (error) {
      console.error("[TestLoginButton] 跳转失败:", error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">测试登录按钮</h2>
        <p className="text-gray-600 mb-6">点击下面的按钮测试跳转到登录页面</p>
        
        <div className="space-y-4">
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            测试跳转到登录页面 (点击次数: {clickCount})
          </button>
          
          <button
            onClick={() => {
              console.log("[TestLoginButton] 直接访问登录页面")
              window.location.href = "/admin/login"
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            使用window.location直接跳转
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">调试信息：</h3>
          <p className="text-sm text-gray-600">点击次数: {clickCount}</p>
          <p className="text-sm text-gray-600">当前URL: {currentUrl}</p>
        </div>
      </div>
    </div>
  )
}