# Supabase 数据库设置指南

## 1. 环境配置已更新
✅ `.env.local` 文件已更新为新的Supabase配置：
- URL: `https://wshomqwcyvufgshlpifb.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaG9tcXdjeXZ1ZmdzaGxwaWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTE4MTMsImV4cCI6MjA3ODk2NzgxM30.FJB0qVOZ8bnYlZsioukpxz6RPGB7Qt9rBzfYqCcFRS4`

## 2. 数据库表结构

### 需要在Supabase控制台中运行的SQL脚本：

#### 第一步：创建基础表结构
请在Supabase控制台中运行 `/Users/wangziyang/Claude_Zhipu/readinglife-blog/supabase/migrations/001_initial_schema.sql` 中的内容。

#### 第二步：配置RLS策略
请在Supabase控制台中运行 `/Users/wangziyang/Claude_Zhipu/readinglife-blog/supabase/migrations/002_rls_policies.sql` 中的内容。

## 3. 测试连接

### 方法1：访问测试页面
访问 `http://localhost:3000/database-init` 来测试数据库连接和初始化数据。

### 方法2：API测试
访问 `http://localhost:3000/api/test-db` 来测试数据库API连接。

## 4. 数据库结构说明

### 表结构
- **posts** - 文章表
- **categories** - 分类表  
- **tags** - 标签表
- **post_tags** - 文章标签关联表
- **comments** - 评论表

### 主要功能
- ✅ 文章CRUD操作
- ✅ 分类管理
- ✅ 标签系统
- ✅ 评论功能
- ✅ RLS权限控制
- ✅ 自动时间戳更新
- ✅ 文章数量统计

## 5. 下一步操作

1. **登录Supabase控制台**：https://app.supabase.com
2. **选择你的项目**：wshomqwcyvufgshlpifb
3. **进入SQL编辑器**：左侧菜单 → SQL Editor
4. **运行SQL脚本**：依次运行001和002迁移脚本
5. **测试连接**：访问测试页面确认连接成功

## 6. 注意事项

- 确保Supabase项目已启用数据库功能
- 检查网络连接是否正常
- 验证API密钥是否正确配置
- 确认RLS策略已正确设置

如果遇到问题，请检查：
1. 环境变量是否正确设置
2. Supabase项目是否正常运行
3. 网络连接是否稳定
4. SQL脚本是否成功执行