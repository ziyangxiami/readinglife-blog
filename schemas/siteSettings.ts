// schemas/siteSettings.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: '站点设置',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '站点标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '站点描述',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: '关键词',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'SEO关键词，用逗号分隔',
    }),
    defineField({
      name: 'author',
      title: '默认作者',
      type: 'reference',
      to: [{ type: 'author' }],
      description: '默认文章作者',
    }),
    defineField({
      name: 'logo',
      title: '站点Logo',
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
      name: 'favicon',
      title: '站点图标',
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
      name: 'socialLinks',
      title: '社交媒体链接',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
        }),
        defineField({
          name: 'email',
          title: '邮箱',
          type: 'email',
        }),
      ],
    }),
    defineField({
      name: 'analytics',
      title: '分析工具',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalytics',
          title: 'Google Analytics ID',
          type: 'string',
          description: '例如: G-XXXXXXXXXX',
        }),
        defineField({
          name: 'baiduAnalytics',
          title: '百度统计 ID',
          type: 'string',
          description: '例如: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        }),
      ],
    }),
    defineField({
      name: 'comments',
      title: '评论系统',
      type: 'object',
      fields: [
        defineField({
          name: 'provider',
          title: '评论提供商',
          type: 'string',
          options: {
            list: [
              { title: '无', value: 'none' },
              { title: 'Disqus', value: 'disqus' },
              { title: 'Gitalk', value: 'gitalk' },
              { title: 'Valine', value: 'valine' },
            ],
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'disqusShortname',
          title: 'Disqus Shortname',
          type: 'string',
          hidden: ({ parent }) => parent?.provider !== 'disqus',
        }),
        defineField({
          name: 'gitalkClientId',
          title: 'Gitalk Client ID',
          type: 'string',
          hidden: ({ parent }) => parent?.provider !== 'gitalk',
        }),
        defineField({
          name: 'gitalkClientSecret',
          title: 'Gitalk Client Secret',
          type: 'string',
          hidden: ({ parent }) => parent?.provider !== 'gitalk',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})