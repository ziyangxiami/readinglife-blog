import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Mail, Github, Twitter, Coffee, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

/**
 * 关于页面
 * 展示个人介绍、联系方式、技能等信息
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 个人介绍 */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-white shadow-xl">
              <AvatarImage src="/avatar.svg" alt="个人头像" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                RL
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              关于我
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              欢迎来到我的个人博客！这里记录着我的读书心得、学习历程和生活感悟。
            </p>
          </div>
        </section>

        <div className="grid gap-8">
          {/* 个人简介 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                个人简介
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>
                  我是一名热爱读书和学习的程序员，相信知识的力量能够改变人生。
                  在这个信息爆炸的时代，我希望通过阅读和思考，在纷繁复杂的世界中找到属于自己的方向。
                </p>
                <p>
                  我的阅读兴趣广泛，涵盖技术、文学、哲学、历史等多个领域。
                  我相信每一本书都是作者智慧的结晶，每一次阅读都是与智者的对话。
                </p>
                <p>
                  通过这个博客，我希望能够：
                </p>
                <ul className="space-y-2">
                  <li>记录自己的读书心得和学习笔记</li>
                  <li>分享有价值的书籍和知识</li>
                  <li>与志同道合的朋友交流讨论</li>
                  <li>保持终身学习的态度和习惯</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 读书理念 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                读书理念
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">为什么选择读书？</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                      <span>读书是与智者对话的最佳方式</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                      <span>每一本书都是一个新的世界</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                      <span>知识是改变命运的钥匙</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                      <span>阅读培养深度思考的能力</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">我的读书方法</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                      <span>精读与泛读相结合</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                      <span>做笔记，记录思考</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                      <span>定期回顾和总结</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                      <span>与他人分享讨论</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 联系方式 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                联系方式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">社交媒体</h3>
                  <div className="space-y-3">
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    </Link>
                    <Link href="mailto:contact@readinglife.com">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        邮箱联系
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">支持我</h3>
                  <p className="text-gray-600 mb-4">
                    如果这个博客对你有帮助，欢迎请我喝杯咖啡 ☕
                  </p>
                  <Button className="w-full">
                    <Coffee className="w-4 h-4 mr-2" />
                    请我喝咖啡
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 博客统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                博客统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">文章数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">10+</div>
                  <div className="text-sm text-gray-600">分类数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">100+</div>
                  <div className="text-sm text-gray-600">标签数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">1000+</div>
                  <div className="text-sm text-gray-600">总阅读量</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * 生成页面元数据
 */
export const metadata = {
  title: '关于我 - Reading Life',
  description: '了解我的读书理念、学习历程和联系方式，一起探索知识的无限可能',
  openGraph: {
    title: '关于我 - Reading Life',
    description: '了解我的读书理念、学习历程和联系方式，一起探索知识的无限可能',
    type: 'profile',
  }
}