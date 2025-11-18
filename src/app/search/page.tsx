import { Suspense } from 'react'
import { SearchResults } from './search-results'
import { Navigation } from '@/components/navigation'
import { SearchBox } from '@/components/search-box'

/**
 * 搜索页面
 * 展示搜索结果
 */
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            搜索文章
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            输入关键词，找到你感兴趣的文章
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-12">
          <SearchBox />
        </div>

        {/* 搜索结果 */}
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}

/**
 * 搜索加载状态
 */
function SearchLoading() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">正在搜索...</p>
    </div>
  )
}

/**
 * 生成页面元数据
 */
export const metadata = {
  title: '搜索 - Reading Life',
  description: '搜索Reading Life博客中的文章，找到你感兴趣的内容',
}