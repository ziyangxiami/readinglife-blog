// sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'ReadingLife Blog',
  basePath: '/admin', // 关键配置：告诉Studio它的基础路径是/admin

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})