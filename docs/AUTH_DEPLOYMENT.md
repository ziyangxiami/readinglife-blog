# 身份验证系统部署指南

## 概述
本项目已重构为使用NextAuth.js进行身份验证，提供企业级的安全保障。

## 环境变量配置

### 必需的环境变量

```bash
# NextAuth.js配置
NEXTAUTH_URL=https://your-domain.com  # 你的域名
NEXTAUTH_SECRET=your-secret-key       # 至少32位随机字符串

# 管理员账户配置
ADMIN_USERNAME=admin                    # 管理员用户名
ADMIN_PASSWORD_HASH=$2b$10$...        # 管理员密码哈希

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 生成管理员密码哈希

```bash
npm run generate-admin-hash 你的密码
```

## Vercel部署配置

1. 在Vercel项目设置中添加以下环境变量：
   - `NEXTAUTH_URL`: 你的域名
   - `NEXTAUTH_SECRET`: 随机生成的密钥
   - `ADMIN_USERNAME`: 管理员用户名
   - `ADMIN_PASSWORD_HASH`: 生成的密码哈希
   - Supabase相关配置

2. 确保域名正确配置，NextAuth.js需要正确的URL进行会话管理

## 特性

✅ **企业级安全**
- 使用NextAuth.js框架
- HttpOnly Cookie会话管理
- CSRF保护
- 安全的密码哈希存储

✅ **单管理员模式**
- 仅支持一个管理员账户
- 基于环境变量的凭据验证
- 会话过期管理

✅ **完整的错误处理**
- 详细的错误日志
- 用户友好的错误提示
- 状态管理

✅ **优化的用户体验**
- 清晰的加载状态
- 流畅的页面过渡
- 响应式设计

## 测试账户

开发环境默认管理员账户：
- 用户名: `admin`
- 密码: `admin123`

**重要**: 生产环境务必修改默认密码！

## 故障排除

### "验证中..."状态卡住
- 检查浏览器控制台是否有错误
- 确认环境变量配置正确
- 检查网络连接

### 登录失败
- 确认用户名和密码正确
- 检查控制台错误日志
- 验证密码哈希是否正确生成

### 图片上传失败
- 确认已登录管理员账户
- 检查Supabase存储配置
- 查看浏览器网络请求

## 安全建议

1. **使用强密码**: 管理员密码应包含大小写字母、数字和特殊字符
2. **定期更换密码**: 建议每3-6个月更换一次管理员密码
3. **监控登录**: 定期检查是否有异常登录尝试
4. **HTTPS**: 生产环境务必使用HTTPS
5. **环境变量**: 不要在代码中硬编码敏感信息