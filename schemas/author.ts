// schemas/author.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: '作者',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '姓名',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: '简介',
      type: 'text',
      rows: 4,
      description: '作者简介',
    }),
    defineField({
      name: 'avatar',
      title: '头像',
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
          name: 'website',
          title: '个人网站',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
              allowRelative: false,
            }),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: '邮箱',
      type: 'email',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio',
      media: 'avatar',
    },
  },
  orderings: [
    {
      title: '姓名 A-Z',
      name: 'nameAsc',
      by: [
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
})