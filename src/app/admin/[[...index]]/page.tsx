// src/app/admin/[[...index]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

/**
 * Sanity Studio 页面入口
 * 使用外部 `sanity.config.ts` 提供的完整配置与 schema
 */
export default function StudioPage() {
  return <NextStudio config={config} />
}