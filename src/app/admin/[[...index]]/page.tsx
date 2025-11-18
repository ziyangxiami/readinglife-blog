// src/app/admin/[[...index]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

// 内联配置，避免schema导入问题
const config = defineConfig({
  name: 'default',
  title: 'ReadingLife Blog',
  basePath: '/admin',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema: {
    types: [
      {
        name: 'post',
        title: '文章',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: '标题',
            type: 'string',
          },
          {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'title',
              maxLength: 96,
            },
          },
          {
            name: 'content',
            title: '内容',
            type: 'text',
          },
          {
            name: 'publishedAt',
            title: '发布时间',
            type: 'datetime',
          },
        ],
      },
    ],
  },
})

export default function StudioPage() {
  return <NextStudio config={config} />
}