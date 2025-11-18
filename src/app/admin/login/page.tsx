'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
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
 * 使用NextAuth.js进行身份验证
 */
export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[Auth] 开始登录流程")
      
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false, // 手动处理重定向
      })

      console.log("[Auth] 登录结果:", result)

      if (result?.error) {
        console.error("[Auth] 登录失败:", result.error)
        setError(result.error)
        toast.error("登录失败: " + result.error)
      } else if (result?.ok) {
        console.log("[Auth] 登录成功，准备跳转")
        toast.success("登录成功！")
        
        // 延迟跳转，确保用户看到成功消息
        setTimeout(() => {
          router.replace('/admin')  // 使用replace而不是push，避免登录页面留在历史记录中
          router.refresh() // 刷新页面状态
        }, 1000)
      }
    } catch (error) {
      console.error("[Auth] 登录过程出错:", error)
      setError("登录过程出错，请稍后重试")
      toast.error("登录过程出错")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 清除错误状态
    if (error) setError(null)
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
            请输入您的管理员凭据
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  用户名
                </div>
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  密码
                </div>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
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
                  登录中...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  登录
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