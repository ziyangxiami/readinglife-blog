# ReadingLife 博客 - GitHub 仓库创建和推送指南

## 步骤 1: 在 GitHub 上创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `readinglife-blog` (或你喜欢的名字)
   - **Description**: 基于 Next.js + Supabase 的个人博客
   - **Public/Private**: 根据需要选择
   - **Initialize repository**: 不要勾选任何选项（不要添加 README、.gitignore 或 license）
4. 点击 "Create repository"

## 步骤 2: 连接到 GitHub 仓库

创建仓库后，GitHub 会显示几种连接方式。选择 "…or push an existing repository from the command line" 部分，复制其中的命令。

通常的命令格式是：
```bash
git remote add origin https://github.com/YOUR_USERNAME/readinglife-blog.git
git branch -M main
git push -u origin main
```

## 步骤 3: 执行推送命令

将上面的命令中的 `YOUR_USERNAME` 替换为你的 GitHub 用户名，然后执行：

```bash
# 示例（请替换为你的实际仓库地址）:
git remote add origin https://github.com/yourusername/readinglife-blog.git
git branch -M main
git push -u origin main
```

## 验证

推送成功后，刷新 GitHub 仓库页面，你应该能看到所有的代码文件。

## 常见问题

1. **认证问题**: 如果提示需要用户名密码，建议使用 GitHub Personal Access Token
2. **分支名称**: 如果默认分支是 master 而不是 main，可以执行 `git branch -m master main` 来重命名

## 下一步

代码推送到 GitHub 后，就可以直接在 Vercel 上导入这个仓库进行部署了！

## 快速命令参考

```bash
# 如果你还没有配置 Git 用户信息
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 查看当前 Git 状态
git status

# 查看远程仓库
git remote -v

# 如果需要删除远程仓库重新添加
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/readinglife-blog.git
```