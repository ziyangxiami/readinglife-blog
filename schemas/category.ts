// schemas/category.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: '分类',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '分类名称',
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
      name: 'description',
      title: '描述',
      type: 'text',
      rows: 3,
      description: '分类的简要描述',
    }),
    defineField({
      name: 'color',
      title: '颜色',
      type: 'color',
      description: '分类的主题颜色',
      options: {
        disableAlpha: true,
      },
      validation: (Rule) => Rule.required(),
      initialValue: {
        hex: '#3B82F6'
      }
    }),
    defineField({
      name: 'image',
      title: '分类图片',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
  orderings: [
    {
      title: '分类名称 A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})