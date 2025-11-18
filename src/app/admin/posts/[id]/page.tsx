'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  Eye, 
  Send, 
  Calendar, 
  Clock, 
  Tag, 
  Folder,
  Image,
  RotateCcw,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

// 动态导入Markdown编辑器
const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">加载编辑器中...</div>
})

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

/**
 * 文章编辑页面
 * 支持创建和编辑文章，包含富文本Markdown编辑器
 */
export default function AdminPostEditPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params?.id as string
  const isEditing = postId && postId !== 'new'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  
  // 文章数据
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [readingTime, setReadingTime] = useState(0)
  const [isPublished, setIsPublished] = useState(false)

  // 选项数据
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // 错误处理
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    checkAuth()
    fetchCategoriesAndTags()
    if (isEditing) {
      fetchPost()
    } else {
      setLoading(false)
    }
  }, [isEditing, postId])

  /**
   * 检查管理员权限
   */
  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
  }

  /**
   * 获取分类和标签数据
   */
  const fetchCategoriesAndTags = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // 获取分类
      const categoriesResponse = await fetch('/api/admin/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.data)
      }

      // 获取标签
      const tagsResponse = await fetch('/api/admin/tags', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        setTags(tagsData.data)
      }
    } catch (error) {
      console.error('获取分类和标签失败:', error)
      toast.error('获取分类和标签失败')
    }
  }

  /**
   * 获取文章数据
   */
  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const post = data.data
        
        setTitle(post.title)
        setSlug(post.slug)
        setExcerpt(post.excerpt || '')
        setContent(post.content)
        setCoverImage(post.cover_image || '')
        setCategoryId(post.category_id || '')
        setSelectedTags(post.tags?.map((tag: Tag) => tag.id) || [])
        setReadingTime(post.reading_time || 0)
        setIsPublished(post.is_published)
      } else if (response.status === 404) {
        toast.error('文章不存在')
        router.push('/admin/posts')
      } else if (response.status === 401) {
        router.push('/admin/login')
      } else {
        toast.error('获取文章失败')
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      toast.error('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 自动生成slug
   */
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * 自动计算阅读时间
   */
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').length
    return Math.ceil(words / wordsPerMinute)
  }

  /**
   * 处理标题变化
   */
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEditing && !slug) {
      setSlug(generateSlug(value))
    }
    
    // 自动生成摘要
    if (!excerpt && value) {
      const autoExcerpt = value.slice(0, 200).replace(/[#*`_\[\]()]/g, '')
      setExcerpt(autoExcerpt)
    }
  }

  /**
   * 处理内容变化
   */
  const handleContentChange = (value: string) => {
    setContent(value)
    const time = calculateReadingTime(value)
    setReadingTime(time)
  }

  /**
   * 验证表单
   */
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!title.trim()) {
      newErrors.title = '标题不能为空'
    }

    if (!slug.trim()) {
      newErrors.slug = 'slug不能为空'
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'slug只能包含小写字母、数字和连字符'
    }

    if (!content.trim()) {
      newErrors.content = '内容不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * 保存文章（草稿）
   */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('请检查表单错误')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const method = isEditing ? 'PATCH' : 'POST'
      const url = isEditing ? `/api/admin/posts/${postId}` : '/api/admin/posts'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || content.slice(0, 200).replace(/[#*`_\[\]()]/g, ''),
          content,
          cover_image: coverImage,
          category_id: categoryId,
          tags: selectedTags,
          reading_time: readingTime,
          is_published: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(isEditing ? '文章已保存' : '文章已创建')
        if (!isEditing) {
          router.push(`/admin/posts/${data.data.post.id}/edit`)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || '保存失败')
      }
    } catch (error) {
      console.error('保存文章失败:', error)
      toast.error('保存文章失败')
    } finally {
      setSaving(false)
    }
  }

  /**
   * 发布文章
   */
  const handlePublish = async () => {
    if (!validateForm()) {
      toast.error('请检查表单错误')
      return
    }

    setPublishing(true)
    try {
      const token = localStorage.getItem('admin_token')
      const method = isEditing ? 'PATCH' : 'POST'
      const url = isEditing ? `/api/admin/posts/${postId}` : '/api/admin/posts'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || content.slice(0, 200).replace(/[#*`_\[\]()]/g, ''),
          content,
          cover_image: coverImage,
          category_id: categoryId,
          tags: selectedTags,
          reading_time: readingTime,
          is_published: true
        })
      })

      if (response.ok) {
        toast.success(isEditing ? '文章已更新并发布' : '文章已发布')
        router.push('/admin/posts')
      } else {
        const error = await response.json()
        toast.error(error.error || '发布失败')
      }
    } catch (error) {
      console.error('发布文章失败:', error)
      toast.error('发布文章失败')
    } finally {
      setPublishing(false)
    }
  }

  /**
   * 处理标签选择
   */
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  /**
   * 上传封面图片
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 这里可以实现图片上传功能
    // 暂时使用占位符
    const imageUrl = URL.createObjectURL(file)
    setCoverImage(imageUrl)
    toast.success('封面图片已设置')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <FileText className="w-6 h-6" />
                Reading Life Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/posts">
                <Button variant="outline" size="sm">
                  返回列表
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/blog/${slug}`)}
                disabled={!isPublished}
              >
                <Eye className="w-4 h-4 mr-1" />
                预览
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? '保存中...' : '保存草稿'}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={publishing}
              >
                <Send className="w-4 h-4 mr-1" />
                {publishing ? '发布中...' : (isPublished ? '更新发布' : '发布')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">文章标题 *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="请输入文章标题"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="slug">文章链接 *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="请输入文章链接（如：my-first-post）"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  <p className="text-gray-500 text-sm mt-1">/blog/{slug}</p>
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <Label htmlFor="excerpt">文章摘要</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="请输入文章摘要（可选，不填写将自动生成）"
                    rows={3}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    摘要将用于SEO和文章列表展示，建议长度50-200字
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 文章内容 */}
            <Card>
              <CardHeader>
                <CardTitle>文章内容 *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={errors.content ? 'border border-red-500 rounded-lg' : ''}>
                  <MarkdownEditor
                    value={content}
                    onChange={handleContentChange}
                    placeholder="开始写作..."
                  />
                </div>
                {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-500 text-sm">
                    预计阅读时间: {readingTime} 分钟
                  </p>
                  <p className="text-gray-500 text-sm">
                    字数: {content.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 发布设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">分类</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>标签</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          className="mr-2"
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">已选择:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.map(tagId => {
                          const tag = tags.find(t => t.id === tagId)
                          return tag ? (
                            <Badge key={tagId} variant="secondary">
                              {tag.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 封面图片 */}
            <Card>
              <CardHeader>
                <CardTitle>封面图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt="封面图片"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2"
                    >
                      删除
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">上传封面图片</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <Label htmlFor="cover-image-upload">
                      <Button type="button">
                        选择图片
                      </Button>
                    </Label>
                  </div>
                )}
                <Input
                  placeholder="或输入图片URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* 文章信息 */}
            <Card>
              <CardHeader>
                <CardTitle>文章信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">状态</span>
                  <Badge variant={isPublished ? 'default' : 'secondary'}>
                    {isPublished ? '已发布' : '草稿'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">阅读时间</span>
                  <span>{readingTime} 分钟</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">字数</span>
                  <span>{content.length}</span>
                </div>
                {isEditing && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">创建时间</span>
                      <span className="text-sm">2024-01-01</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">更新时间</span>
                      <span className="text-sm">2024-01-01</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}