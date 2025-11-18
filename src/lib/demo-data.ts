import { supabase } from '@/lib/supabase'

/**
 * 创建演示数据
 * 用于展示网站功能
 */
export async function createDemoData() {
  try {
    // 检查是否已有数据
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('id')
      .limit(1)

    if (existingPosts && existingPosts.length > 0) {
      console.log('数据已存在，跳过创建演示数据')
      return
    }

    // 创建演示文章
    const demoPosts = [
      {
        title: '《人类简史》读后感：从认知革命到智人统治',
        slug: 'sapiens-book-review',
        content: `# 《人类简史》读后感

最近读完了尤瓦尔·赫拉利的《人类简史》，这本书给了我很多思考。从认知革命到农业革命，再到科学革命，人类的历史充满了戏剧性的转折。

## 认知革命

大约7万年前，智人开始形成更加复杂的语言和文化。这种认知能力的飞跃让我们能够合作、创造神话、建立制度。

> "智人之所以能够征服世界，是因为我们是唯一能够大规模灵活合作的物种。"

## 农业革命

农业革命看似让人类过上了更好的生活，但作者认为这可能是历史上最大的骗局。农民的生活质量反而下降了。

## 科学革命

科学革命开启了人类历史的新篇章。我们开始承认自己的无知，并通过观察和数学来探索世界。

## 我的思考

这本书让我重新思考了人类文明的发展轨迹。我们真的是在进步吗？还是只是在不同的牢笼中转换？

---

*推荐指数：★★★★★*
*阅读时间：3天*`,
        cover_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=A%20minimalist%20book%20cover%20for%20%22Sapiens%22%20by%20Yuval%20Noah%20Harari%2C%20featuring%20a%20stylized%20human%20silhouette%20evolving%20from%20ape%20to%20modern%20human%2C%20clean%20white%20background%2C%20modern%20typography%2C%20intellectual%20and%20thought-provoking%20design&image_size=portrait_4_3',
        category_id: 'literature',
        reading_time: 15,
        view_count: 156,
        likes: 23
      },
      {
        title: 'TypeScript 5.0 新特性详解',
        slug: 'typescript-5-new-features',
        content: `# TypeScript 5.0 新特性详解

TypeScript 5.0带来了许多令人兴奋的新特性，让我们一起来看看这些改进。

## 装饰器

TypeScript 5.0终于支持了标准的ECMAScript装饰器，这是一个巨大的进步。

\`\`\`typescript
@logged
class Person {
  @log
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}
\`\`\`

## const类型参数

现在我们可以使用const类型参数来确保类型推断更加精确。

\`\`\`typescript
function createArray<const T>(items: readonly T[]): T[] {
  return [...items];
}
\`\`\`

## 性能提升

TypeScript 5.0在性能方面也有显著提升，特别是在大型项目中的类型检查速度。

## 总结

这些新特性让TypeScript变得更加强大和易用。我特别喜欢装饰器的改进，这让代码更加优雅。

---

*发布时间：2024年3月*
*标签：TypeScript, 前端开发*`,
        cover_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20TypeScript%20logo%20design%20with%20clean%20blue%20and%20white%20colors%2C%20programming%20code%20snippets%20in%20background%2C%20tech%20and%20modern%20aesthetic%2C%20professional%20developer%20style&image_size=portrait_4_3',
        category_id: 'technology',
        reading_time: 10,
        view_count: 89,
        likes: 15
      },
      {
        title: '读书方法论：如何高效阅读一本书',
        slug: 'effective-reading-methods',
        content: `# 读书方法论：如何高效阅读一本书

在这个信息爆炸的时代，如何高效地阅读一本书变得越来越重要。今天我想分享一些我的读书方法。

## 1. 明确阅读目的

在开始阅读之前，先问自己：
- 我为什么要读这本书？
- 我希望从中获得什么？
- 这本书适合精读还是泛读？

## 2. 预览全书结构

不要急于从头开始阅读，先：
- 阅读目录和前言
- 浏览章节标题
- 查看图表和总结

## 3. 主动阅读

阅读时要保持思考：
- 与作者对话
- 做笔记和批注
- 联系已有知识

## 4. 输出是最好的输入

读完之后要：
- 写读书笔记
- 与他人讨论
- 应用到实践中

> "读书是在别人思想的帮助下，建立起自己的思想。" - 鲁巴金

## 我的读书工具

- **MarginNote**: 适合做思维导图
- **Obsidian**: 知识管理
- **Anki**: 间隔重复记忆

---

*希望这些方法对你有帮助！*`,
        cover_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Cozy%20reading%20corner%20with%20books%2C%20notebook%2C%20and%20coffee%2C%20warm%20lighting%2C%20minimalist%20style%2C%20peaceful%20and%20inspiring%20atmosphere%2C%20study%20and%20learning%20theme&image_size=portrait_4_3',
        category_id: 'reading',
        reading_time: 12,
        view_count: 234,
        likes: 31
      }
    ]

    // 插入文章
    for (const post of demoPosts) {
      const { error } = await supabase.from('posts').insert(post)
      if (error) {
        console.error('创建演示文章失败:', error)
      } else {
        console.log('创建演示文章成功:', post.title)
      }
    }

    console.log('演示数据创建完成！')
  } catch (error) {
    console.error('创建演示数据失败:', error)
  }
}