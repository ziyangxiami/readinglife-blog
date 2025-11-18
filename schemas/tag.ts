// schemas/tag.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tag',
  title: '标签',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标签名称',
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
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
  orderings: [
    {
      title: '标签名称 A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})