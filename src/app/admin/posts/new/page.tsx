'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TinymceEditor from '@/components/tinymce-editor'
import { getCategories, getTags, createPost } from '@/lib/api'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 后台发布文章页面
 * 提供新文章创建入口（占位）
 */
export default function AdminNewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [readingTime, setReadingTime] = useState(5)
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)

  // 服务端数据获取（静态，后续可改为 SSR 或 SSG）
  const [categories] = useState(() => {
    // 占位，实际使用时通过 getCategories 获取
    return [
      { id: '1', name: '技术' },
      { id: '2', name: '文学' },
      { id: '3', name: '哲学' },
      { id: '4', name: '生活' }
    ]
  })
  const [tags] = useState(() => {
    // 占位，实际使用时通过 getTags 获取
    return [
      { id: '1', name: 'React' },
      { id: '2', name: 'Next.js' },
      { id: '3', name: 'TypeScript' },
      { id: '4', name: '读书' },
      { id: '5', name: '思考' },
      { id: '6', name: '成长' }
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('请填写标题、链接和内容')
      return
    }
    setLoading(true)
    try {
      await createPost({
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        cover_image: coverImage.trim() || undefined,
        category_id: categoryId || undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        is_published: isPublished,
        reading_time: readingTime
      })
      alert(isPublished ? '文章发布成功' : '文章已保存为草稿')
      router.push('/admin/posts')
    } catch (err: any) {
      alert('发布失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">发布新文章</h1>
        <Link href="/admin/posts">
          <Button variant="outline">返回文章管理</Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">文章标题 *</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">文章链接 *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="例如：my-first-post"
                required
              />
            </div>
            <div>
              <Label htmlFor="cover">封面图片</Label>
              <Input
                id="cover"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="readingTime">预计阅读时间（分钟）</Label>
              <Input
                id="readingTime"
                type="number"
                min={1}
                value={readingTime}
                onChange={e => setReadingTime(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="category">分类</Label>
              <select
                id="category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">选择分类</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="published"
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
              />
              <Label htmlFor="published" className="!mb-0">立即发布</Label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="简短摘要，用于文章列表与 SEO"
              rows={3}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>正文内容 *</CardTitle>
          </CardHeader>
          <CardContent>
            <TinymceEditor
              value={content}
              onChange={setContent}
              placeholder="在此撰写文章正文，支持富文本编辑"
              height={500}
              autoSave={true}
              autoSaveInterval={30000}
              onAutoSave={(savedContent) => {
                // 自动保存回调，可扩展本地存储或发送到后端
                console.log('自动保存:', new Date().toLocaleString())
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button
                  key={tag.id}
                  type="button"
                  variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>取消</Button>
          <Button type="submit" disabled={loading}>{loading ? '发布中...' : '发布文章'}</Button>
        </div>
      </form>
    </div>
  )
}