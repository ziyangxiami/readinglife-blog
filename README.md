# ReadingLife 个人博客

一个基于 Next.js + Sanity CMS 的现代个人博客系统。

## 功能特性

- 📝 文章管理 - 使用 Sanity CMS 进行内容管理
- 🏷️ 分类和标签 - 灵活的内容组织方式
- 💬 评论系统 - 读者可以发表评论
- 🔍 搜索功能 - 全文搜索文章内容
- 📱 响应式设计 - 适配各种设备
- 🎨 现代化 UI - 简洁优雅的设计风格
- ⚡ 统一管理 - 前后端部署在同一个 Vercel 项目中

## 技术栈

- **前端框架**: Next.js 16.0.3 (App Router)
- **编程语言**: TypeScript
- **样式框架**: Tailwind CSS
- **内容管理**: Sanity CMS
- **Markdown 渲染**: react-markdown + rehype-highlight + remark-gfm
- **图标库**: lucide-react

## 本地开发

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 环境变量配置

创建 `.env.local` 文件，添加以下内容：

```env
# Sanity CMS 配置
NEXT_PUBLIC_SANITY_PROJECT_ID=你的Sanity项目ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=你的Sanity API令牌（用于服务器端）

# 可选：Supabase 配置（用于评论功能）
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看博客前端，访问 http://localhost:3000/admin 查看 Sanity Studio 管理后台。

## 部署到 Vercel

1. 在 Vercel 官网注册账号并登录
2. 导入 GitHub 仓库
3. 配置环境变量：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `NEXT_PUBLIC_SUPABASE_URL`（可选）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（可选）
4. 点击部署按钮

部署完成后，您将拥有一个统一的域名，如 `your-project.vercel.app`，其中：
- `your-project.vercel.app` - 博客前端
- `your-project.vercel.app/admin` - Sanity Studio 管理后台

## 项目结构

```
readinglife-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/[[...index]]/ # Sanity Studio 管理后台
│   │   ├── api/               # API 路由
│   │   ├── blog/              # 博客页面
│   │   ├── about/             # 关于页面
│   │   ├── search/            # 搜索页面
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   └── blog/             # 博客相关组件
│   ├── lib/                   # 工具函数和配置
│   │   ├── sanity.ts         # Sanity 客户端配置
│   │   └── sanity-api.ts     # Sanity API 封装
│   └── types/                 # TypeScript 类型定义
├── sanity.config.ts           # Sanity Studio 配置
├── sanity/                   # Sanity schema 定义
├── public/                   # 静态资源
└── vercel.json              # Vercel 配置文件
```

## 主要页面

- **首页** (`/`) - 博客文章列表
- **文章详情** (`/blog/[slug]`) - 显示单篇文章和评论
- **关于** (`/about`) - 个人介绍
- **搜索** (`/search`) - 文章搜索
- **管理后台** (`/admin`) - Sanity Studio 内容管理系统

## API 接口

- `GET /api/posts` - 获取文章列表（支持分页、搜索、过滤）
- `GET /api/categories` - 获取分类列表
- `GET /api/tags` - 获取标签列表
- `POST /api/comments` - 创建评论

## Sanity Studio 使用

Sanity Studio 已经集成到项目中，访问 `/admin` 路径即可进入管理后台。

### 主要功能

- **内容编辑**: 可视化编辑文章、分类等内容
- **实时预览**: 编辑时实时查看内容效果
- **富文本支持**: 支持 Markdown 和各种富文本格式
- **媒体管理**: 上传和管理图片、文件等媒体资源
- **协作编辑**: 支持多人协作编辑内容

### 配置步骤

1. 访问 [Sanity 官网](https://www.sanity.io/) 注册账号
2. 创建新项目，获取项目 ID
3. 在 Vercel 环境变量中配置 `NEXT_PUBLIC_SANITY_PROJECT_ID`
4. 配置 CORS 设置，允许你的域名访问 Sanity API

## 许可证

MIT License
