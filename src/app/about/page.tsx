import { Navigation } from '@/components/navigation'
import Image from 'next/image'
import Link from 'next/link'

/**
 * 极简About页面
 * 参考Sanity个人网站模板的极简设计风格
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                关于我
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                我是一名热爱读书和学习的程序员，相信知识的力量能够改变人生。在这个信息爆炸的时代，通过阅读和思考，在纷繁复杂的世界中找到属于自己的方向。
              </p>
              <div className="flex gap-4">
                <Link 
                  href="mailto:contact@readinglife.com" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  联系我 →
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gray-100 rounded-full overflow-hidden">
                <Image
                  src="/avatar.svg"
                  alt="个人头像"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 mb-8">读书理念</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">为什么选择读书？</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>读书是与智者对话的最佳方式</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>每一本书都是一个新的世界</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>知识是改变命运的钥匙</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">我的读书方法</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>精读与泛读相结合</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>做笔记，记录思考</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">→</span>
                  <span>定期回顾和总结</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 mb-8">工作经历</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">某互联网科技公司</h3>
                <span className="text-sm text-gray-500">2022 - 至今</span>
              </div>
              <p className="text-gray-600 mb-2">负责前端架构设计与核心功能开发，提升用户体验。参与团队协作流程优化，提高开发效率和代码质量。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">某软件开发公司</h3>
                <span className="text-sm text-gray-500">2020 - 2022</span>
              </div>
              <p className="text-gray-600 mb-2">参与多个Web应用项目的全周期开发，负责前端性能优化，显著提升页面加载速度和响应性能。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">某初创科技公司</h3>
                <span className="text-sm text-gray-500">2018 - 2020</span>
              </div>
              <p className="text-gray-600 mb-2">参与产品从0到1的开发过程，负责移动端适配和响应式设计，确保跨平台兼容性。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">让我们一起读书</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            通过这个博客，我希望能够记录读书心得、分享有价值的书籍、与志同道合的朋友交流讨论，保持终身学习的态度和习惯。
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            阅读我的文章
            <span className="ml-2">→</span>
          </Link>
        </section>
      </main>
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