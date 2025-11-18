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

            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gray-100 rounded-full overflow-hidden">
                <Image
                  src="/logo-avatar-new.svg"
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



        {/* Experience Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 mb-8">工作经历</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">作业帮（海外） | 运营负责人</h3>
                <span className="text-sm text-gray-500">2025 - 至今</span>
              </div>
              <p className="text-gray-600 mb-2">负责全球化运营体系、AI内容生态与安全建设。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">快手（海外） | 策略产品&产品运营</h3>
                <span className="text-sm text-gray-500">2020 - 2025</span>
              </div>
              <p className="text-gray-600 mb-2">负责海外用户增长、内容生态及商业化变现。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">阿里巴巴（海外） | 产品专家</h3>
                <span className="text-sm text-gray-500">2019 - 2020</span>
              </div>
              <p className="text-gray-600 mb-2">负责海外短视频体验优化、本地化及新方向探索。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">小米科技（海外） | 产品经理</h3>
                <span className="text-sm text-gray-500">2018 - 2019</span>
              </div>
              <p className="text-gray-600 mb-2">负责海外应用商业化变现及短视频业务战略孵化。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">京东金融 | 产品管理</h3>
                <span className="text-sm text-gray-500">2017 - 2018</span>
              </div>
              <p className="text-gray-600 mb-2">负责微信生态下的用户增长产品设计与项目管理。</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">迅雷网络 | 产品经理</h3>
                <span className="text-sm text-gray-500">2014 - 2017</span>
              </div>
              <p className="text-gray-600 mb-2">负责工具转社区的产品设计及短视频分发策略。</p>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 mb-8">教育背景</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">中国科学院大学</h3>
                <span className="text-sm text-gray-500">2019 - 2022</span>
              </div>
              <p className="text-gray-600 mb-2">在职研究生 - 大数据与用户研究</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">武汉大学</h3>
                <span className="text-sm text-gray-500">2010 - 2014</span>
              </div>
              <p className="text-gray-600 mb-2">本科 - 金融学（辅修法语）</p>
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