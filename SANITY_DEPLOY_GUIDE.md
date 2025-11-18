# Sanity CMS 部署配置指南

## 环境变量设置

在部署到 Vercel 之前，需要在 Vercel 控制台中配置以下环境变量：

### 必需的环境变量

```bash
# Sanity CMS 配置
NEXT_PUBLIC_SANITY_PROJECT_ID=你的_sanity_项目_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=你的_sanity_api_令牌

# 站点配置
NEXT_PUBLIC_SITE_URL=https://readinglife-blog.vercel.app
```

### 获取 Sanity 项目信息

1. **创建 Sanity 项目**:
   - 访问 [sanity.io](https://www.sanity.io/)
   - 创建新项目或获取现有项目ID

2. **获取项目ID**:
   - 在 Sanity 管理面板中找到你的项目
   - 复制项目ID（通常是类似 `abc123def` 的字符串）

3. **创建 API 令牌**:
   - 进入项目设置 → API → 添加新令牌
   - 给予读写权限
   - 复制生成的令牌

### Vercel 部署步骤

1. **连接 GitHub 仓库**:
   - 在 Vercel 控制台添加新项目
   - 选择 `ziyangxiami/readinglife-blog` 仓库

2. **配置环境变量**:
   - 在 Vercel 项目设置 → Environment Variables
   - 添加上述所有必需的环境变量

3. **部署**:
   - 点击 Deploy 按钮
   - 等待构建完成

### 验证部署

部署完成后，访问以下URL进行验证：

- **前端博客**: `https://readinglife-blog.vercel.app`
- **Sanity Studio**: `https://readinglife-blog.vercel.app/admin`

### Sanity Studio 首次访问

首次访问 `/admin` 时，Sanity Studio 会要求你登录。你可以：

1. 使用 Sanity 账号登录
2. 或者配置公共访问（仅推荐用于演示）

### 后续配置

1. **CORS 设置**:
   - 在 Sanity 项目设置中添加你的 Vercel 域名到 CORS 白名单

2. **Webhook**（可选）:
   - 配置 Sanity webhook 在内容更新时自动重新部署站点

### 注意事项

- 确保 `NEXT_PUBLIC_SANITY_PROJECT_ID` 只包含字母、数字和连字符
- `SANITY_API_TOKEN` 应该保密，不要暴露在客户端代码中
- 生产环境建议使用更严格的权限配置

### 故障排除

如果部署失败：
1. 检查环境变量是否正确设置
2. 确认 Sanity 项目ID格式正确
3. 查看 Vercel 构建日志获取详细错误信息
4. 确保 Sanity 项目中已创建必要的数据集