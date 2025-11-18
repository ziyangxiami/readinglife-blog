# ReadingLife 博客 - Vercel 部署指南

## 🚀 部署步骤

### 步骤 1: 访问 Vercel
1. 打开 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录（推荐）或使用邮箱注册

### 步骤 2: 导入 GitHub 仓库
1. 登录后点击 "New Project"
2. 选择 "Import Git Repository"
3. 在 Git 提供程序中选择 "GitHub"
4. 授权 Vercel 访问你的 GitHub 账户
5. 找到并选择 `ziyangxiami/readinglife-blog` 仓库

### 步骤 3: 配置项目
1. **项目名称**: 保持默认或修改为 `readinglife-blog`
2. **框架预设**: Vercel 会自动检测到 Next.js
3. **根目录**: 保持默认（根目录）
4. **构建和输出设置**: 保持默认设置

### 步骤 4: 配置环境变量
在 "Environment Variables" 部分添加：
```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 步骤 5: 部署
1. 点击 "Deploy" 按钮
2. 等待构建完成（通常需要 1-3 分钟）
3. 部署成功后，Vercel 会提供默认的 `.vercel.app` 域名

## 🎯 部署成功后的配置

### 自定义域名（可选）
1. 在项目仪表板中选择 "Settings" → "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

### 环境变量管理
1. 在项目仪表板中选择 "Settings" → "Environment Variables"
2. 可以随时添加、修改或删除环境变量
3. 修改后需要重新部署才能生效

### 自动部署
- 每次推送到 GitHub 的 main 分支，Vercel 会自动重新部署
- 可以在 "Deployments" 标签页查看部署历史

## 📊 监控和分析

### 性能监控
1. 在 Vercel 仪表板查看性能指标
2. 监控 Core Web Vitals
3. 查看错误日志和警告

### 分析工具
- Vercel Analytics: 网站访问分析
- 集成 Google Analytics（可选）

## 🔧 常见问题解决

### 构建失败
1. 检查 package.json 中的依赖版本
2. 确保所有环境变量都已正确配置
3. 查看构建日志了解具体错误

### 环境变量问题
- 确保环境变量名拼写正确
- 不要在代码中硬编码敏感信息
- 使用 `NEXT_PUBLIC_` 前缀的变量会在客户端可用

### 数据库连接
- 确保 Supabase 项目正常运行
- 检查网络连接和防火墙设置
- 验证数据库权限配置

## 🎉 部署验证

部署成功后，你应该能够：
1. 访问提供的 Vercel 域名
2. 看到博客首页
3. 浏览文章列表和详情页
4. 使用搜索功能
5. 发表评论

## 📞 技术支持

如果遇到问题：
1. 检查 Vercel 部署日志
2. 查看 GitHub 上的项目 Issues
3. 确认 Supabase 配置正确
4. 重新检查环境变量设置