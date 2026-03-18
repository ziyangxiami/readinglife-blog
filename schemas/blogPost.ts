// schemas/blogPost.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: '博客文章',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'content',
      title: '内容',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: '封面图片',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文本',
          description: '图片无法显示时的替代文本',
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: '分类',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: '推荐文章',
      type: 'boolean',
      description: '是否在首页推荐此文章',
      initialValue: false,
    }),
    defineField({
      name: 'readingTime',
      title: '阅读时间（分钟）',
      type: 'number',
      description: '预计阅读时间',
      initialValue: 5,
    }),
    defineField({
      name: 'author',
      title: '作者',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO标题',
      type: 'string',
      description: '搜索引擎显示的标题（留空则使用文章标题）',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO描述',
      type: 'text',
      rows: 2,
      description: '搜索引擎显示的描述（留空则使用文章摘要）',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      category: 'category.title',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, author, category, publishedAt } = selection
      return {
        title,
        subtitle: `${author ? `作者: ${author}` : ''} ${category ? `| 分类: ${category}` : ''} ${publishedAt ? `| ${new Date(publishedAt).toLocaleDateString('zh-CN')}` : ''}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: '发布时间，从新到旧',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: '发布时间，从旧到新',
      name: 'publishedAtAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: '标题 A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})