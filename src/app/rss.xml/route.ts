import { generateRSSFeed } from '@/lib/sitemap'

/**
 * RSS Feed路由
 * 返回RSS格式的订阅源
 */
export async function GET() {
  try {
    const rss = await generateRSSFeed()
    
    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400'
      }
    })
  } catch (error) {
    console.error('生成RSS Feed失败:', error)
    return new Response('生成RSS Feed失败', { status: 500 })
  }
}