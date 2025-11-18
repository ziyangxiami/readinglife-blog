# ReadingLife 个人博客

一个基于 Next.js + Supabase 的现代个人博客系统。

## 功能特性

- 📝 文章管理 - 支持 Markdown 编辑和语法高亮
- 🏷️ 分类和标签 - 灵活的内容组织方式
- 💬 评论系统 - 读者可以发表评论
- 🔍 搜索功能 - 全文搜索文章内容
- 📱 响应式设计 - 适配各种设备
- 🎨 现代化 UI - 简洁优雅的设计风格

## 技术栈

- **前端框架**: Next.js 16.0.3 (App Router)
- **编程语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
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
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 部署到 Vercel

1. 在 Vercel 官网注册账号并登录
2. 导入 GitHub 仓库
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 点击部署按钮

## 项目结构

```
readinglife-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   ├── blog/              # 博客页面
│   │   ├── about/             # 关于页面
│   │   ├── search/            # 搜索页面
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   └── blog/             # 博客相关组件
│   ├── lib/                   # 工具函数和配置
│   ├── types/                 # TypeScript 类型定义
│   └── middleware.ts          # Next.js 中间件
├── public/                    # 静态资源
└── vercel.json               # Vercel 配置文件
```

## 主要页面

- **首页** (`/`) - 博客文章列表
- **文章详情** (`/blog/[slug]`) - 显示单篇文章和评论
- **关于** (`/about`) - 个人介绍
- **搜索** (`/search`) - 文章搜索

## API 接口

- `GET /api/posts` - 获取文章列表（支持分页、搜索、过滤）
- `GET /api/categories` - 获取分类列表
- `GET /api/tags` - 获取标签列表
- `POST /api/comments` - 创建评论

## 许可证

MIT License
