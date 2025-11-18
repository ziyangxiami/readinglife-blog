import { generateSitemapXML } from '@/lib/sitemap'

/**
 * 网站地图路由
 * 返回XML格式的网站地图
 */
export async function GET() {
  try {
    const xml = await generateSitemapXML()
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400'
      }
    })
  } catch (error) {
    console.error('生成网站地图失败:', error)
    return new Response('生成网站地图失败', { status: 500 })
  }
}