# Vercel 部署数据同步问题修复指南

## 问题描述

在 Sanity Studio 中创建/更新文章后，Vercel 部署的网站没有显示最新内容，显示"没有找到文章"。

## 根本原因

1. **CDN缓存问题**：Sanity客户端配置启用了CDN缓存，导致Vercel在构建时获取到的是缓存数据而非最新数据
2. **环境变量配置**：当前使用的是演示项目ID，需要配置真实的Sanity项目

## 修复步骤

### 步骤1：修复CDN缓存（已完成）

✅ **已修复**：在 `/src/lib/sanity.ts` 中将 `useCdn: false` 禁用CDN缓存

### 步骤2：配置真实的Sanity项目

1. 访问 [Sanity官网](https://www.sanity.io) 创建项目或获取现有项目信息
2. 在 Vercel 项目设置中添加以下环境变量：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: 你的Sanity项目ID
   - `NEXT_PUBLIC_SANITY_DATASET`: 数据集名称（通常是 `production`）
   - `SANITY_API_TOKEN`: Sanity API令牌（用于获取草稿内容）

3. 本地开发环境：复制 `.env.local.example` 为 `.env.local` 并填入真实值

### 步骤3：验证数据查询

在 Sanity Studio 的 Vision 工具中测试以下查询：

```groq
*[_type == "blogPost"]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  featured
}
```

### 步骤4：重新部署

1. 提交代码更改到Git仓库
2. Vercel会自动触发新的部署
3. 检查部署日志确认构建时获取到了数据

## 验证要点

- [ ] Sanity Studio 中能正常创建和发布文章
- [ ] Vercel 环境变量配置正确
- [ ] 构建日志显示获取到了文章数据
- [ ] 部署后的网站显示最新文章内容

## 常见问题

1. **数据延迟**：即使禁用CDN，Sanity数据更新可能有短暂延迟（通常几秒）
2. **权限问题**：确保API令牌有正确的数据访问权限
3. **查询过滤**：检查GROQ查询是否有额外的过滤条件（如发布状态）

## 测试建议

1. 在Sanity中创建一篇明显不同的测试文章
2. 观察Vercel部署过程
3. 检查构建日志中的数据获取情况
4. 验证部署后的网站内容