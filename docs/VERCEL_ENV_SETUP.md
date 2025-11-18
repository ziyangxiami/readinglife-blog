# Vercel环境变量配置指南

## 必需的环境变量

在Vercel项目设置中添加以下环境变量：

### NextAuth.js配置
```
NEXTAUTH_URL=https://your-domain.com  # 替换为你的实际域名
NEXTAUTH_SECRET=your-32-character-secret-key-here  # 至少32位随机字符串
```

### 管理员账户配置
```
ADMIN_USERNAME=admin  # 管理员用户名
ADMIN_PASSWORD_HASH=$2b$10$MQVzV1zPYVQ2NtH8j083ueB70Jt338xFvkRNfqYoJCsrpi11J3APO  # 管理员密码哈希
```

### Supabase配置（已存在）
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 如何生成NEXTAUTH_SECRET

在终端运行以下命令生成安全的随机密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 如何生成新的管理员密码哈希

```bash
npm run generate-admin-hash 你的新密码
```

## 配置步骤

1. 登录Vercel控制台
2. 选择你的项目
3. 进入"Settings" -> "Environment Variables"
4. 添加上述所有环境变量
5. 重新部署项目

## 注意事项

- **NEXTAUTH_URL** 必须与你的实际域名匹配
- **NEXTAUTH_SECRET** 必须是安全的随机字符串
- **ADMIN_PASSWORD_HASH** 生产环境务必修改默认密码
- 所有环境变量添加后需要重新部署才能生效