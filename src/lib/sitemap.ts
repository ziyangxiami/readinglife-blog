import { getAllPosts, getAllCategories, getAllTags } from '@/lib/sanity-queries'

/**
 * 生成网站地图
 * 包含所有文章、分类和标签页面的URL
 */
export async function generateSitemap() {
  const baseUrl = 'https://readinglife.fun'
  
  try {
    // 获取所有数据
    const [posts, categories, tags] = await Promise.all([
      getAllPosts(), // 获取所有文章
      getAllCategories(),
      getAllTags()
    ])

    // 基础URL
    const urls = [
      { url: '/', lastModified: new Date().toISOString(), priority: 1.0 },
      { url: '/blog', lastModified: new Date().toISOString(), priority: 0.8 },
      { url: '/about', lastModified: new Date().toISOString(), priority: 0.6 },
      { url: '/search', lastModified: new Date().toISOString(), priority: 0.5 },
    ]

    // 文章URL
    posts.forEach(post => {
      urls.push({
        url: `/blog/${post.slug.current}`,
        lastModified: post._updatedAt,
        priority: 0.7
      })
    })

    // 分类URL
    categories.forEach(category => {
      urls.push({
        url: `/category/${category.slug.current}`,
        lastModified: new Date().toISOString(),
        priority: 0.6
      })
    })

    // 标签URL
    tags.forEach(tag => {
      urls.push({
        url: `/tag/${tag.slug.current}`,
        lastModified: new Date().toISOString(),
        priority: 0.5
      })
    })

    return urls
  } catch (error) {
    console.error('生成网站地图失败:', error)
    return []
  }
}

/**
 * 生成XML格式的Sitemap
 */
export async function generateSitemapXML() {
  const urls = await generateSitemap()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>https://readinglife.fun${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
}

/**
 * 生成RSS Feed
 */
export async function generateRSSFeed() {
  const posts = await getAllPosts() // 获取所有文章
  
  // 提取文本摘要函数
  const extractTextFromPortableText = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return ''
    
    let text = ''
    const extractText = (blocks: any[]) => {
      for (const block of blocks) {
        if (typeof block === 'object' && block !== null) {
          if (block._type === 'block' && block.children) {
            for (const child of block.children) {
              if (child.text) {
                text += child.text + ' '
              }
            }
          }
        }
      }
    }
    
    extractText(content)
    return text.trim().slice(0, 500)
  }
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Reading Life - 个人读书学习分享平台</title>
    <link>https://readinglife.fun</link>
    <description>分享读书心得，记录学习历程，探索知识的无限可能</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://readinglife.fun/rss.xml" rel="self" type="application/rss+xml" />
${posts.slice(0, 20).map(post => {
  const description = post.excerpt || extractTextFromPortableText(post.content as any[]) || ''
  const pubDate = new Date(post.publishedAt || post._createdAt).toUTCString()
  return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://readinglife.fun/blog/${post.slug.current}</link>
      <guid>https://readinglife.fun/blog/${post.slug.current}</guid>
      <description><![CDATA[${description}...]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
}).join('\n')}
  </channel>
</rss>`

  return rss
}