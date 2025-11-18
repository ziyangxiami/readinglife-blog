'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogIn, User, Lock } from 'lucide-react'
import { toast } from 'sonner'

/**
 * 管理员登录页面
 * 现在直接跳转到Sanity Studio进行身份验证
 */
export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      toast.success("正在跳转到Sanity Studio...")
      // 直接跳转到Sanity Studio，由Sanity处理身份验证
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      console.error("登录过程出错:", error)
      toast.error("登录过程出错")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">管理员登录</CardTitle>
          <CardDescription className="text-center">
            点击登录将跳转到Sanity Studio进行身份验证
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>Sanity Studio 提供安全的身份验证</p>
              <p className="mt-2">您将被重定向到 Sanity 进行登录</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  跳转中...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  跳转到 Sanity Studio
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <Link href="/" className="text-blue-600 hover:underline">
                返回首页
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}