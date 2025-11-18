## 目标概述
- 修复 `/blog/welcome-to-reading-life` 访问 404 问题，并确保线上可正常打开。
- 将 About 页面改为基于简历的真实信息展示（隐藏姓名、联系方式仅保留邮箱、工作经历仅公司/时间/三句话概述，禁止各类数据）。
- 在全站导航中增加管理后台入口，并补齐后台导航所指向的页面，使后台“可访问、可导航、不报错”。

## 原因与现状
- 404 触发点：`src/app/blog/[slug]/page.tsx:26-28` 在 `getPostBySlug` 返回空时调用 `notFound()`。
- 数据源为 Supabase：详情查询在 `src/lib/api.ts:97-136`；公开访问仅允许 `is_published=true`（`supabase/migrations/complete_setup.sql:88-92`）。线上 404 常见成因：目标 slug 未在生产库、文章未发布、或 Vercel 环境变量缺失。
- About 页面当前为静态占位文案与硬编码统计：统计区在 `src/app/about/page.tsx:171-199`，无任何真实数据接入。
- 管理后台仅有 `/admin` 页面（`src/app/admin/page.tsx`），未在主导航暴露入口（`src/components/navigation.tsx:10-31` 不含 `/admin`），且 `AdminNav` 组件未被使用（`src/components/admin-nav.tsx`）。后台子路由（posts/comments/settings）目前不存在。

## 实施方案
### 1) 修复博客 404
- 校验线上 Supabase：确保存在 `slug='welcome-to-reading-life'` 且 `is_published=true`，并在 Vercel 项目设置好 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 代码兜底：在 `src/app/blog/[slug]/page.tsx` 保持现有逻辑，同时为特定 slug 增加容错渲染（当 `getPostBySlug` 返回空且 `params.slug==='welcome-to-reading-life'`，渲染一个内置的“欢迎”文章内容而非 `notFound()`），避免线上偶发数据缺失导致 404。
- 保留 `generateMetadata`；当兜底渲染触发时，返回合理 SEO 元数据（`src/app/blog/[slug]/page.tsx:250-277`）。

### 2) 更新 About 真实信息
- 提取简历 `/Users/wangziyang/Library/Mobile Documents/com~apple~CloudDocs/运营负责人_10年+_王子洋.pdf` 内容，人工整理成：
  - 隐藏姓名；联系方式仅保留电子邮箱。
  - 工作经历按公司与时间列出，每段三句话概述（不含任何数据指标）。
- 修改 `src/app/about/page.tsx`：
  - 将 `AboutPage` 改为 `async` 服务器组件，从真实数据源读取统计。
  - 联系方式区仅保留邮箱按钮，移除 GitHub/Twitter（参考 `src/app/about/page.tsx:133-155`）。
  - 新增“工作经历”卡片块，按上方规范展示。
- 真实统计接入：
  - 在 `src/lib/api.ts` 新增 `getBlogStats()`：并发计算文章总数、分类总数、标签总数、阅读量总和（聚合 `posts.view_count`）。
  - About 页面调用该函数，替换硬编码数值（替换 `src/app/about/page.tsx:171-199`）。

### 3) 增加管理后台入口与完善后台
- 在主导航 `src/components/navigation.tsx` 新增“管理”入口，指向 `'/admin'`，桌面与移动端均显示（在 `navigation` 常量中新增项，并保持现有样式逻辑）。
- 在 `src/app/admin/page.tsx` 顶部或左侧集成 `AdminNav` 组件，使后台导航一致；同时将统计卡片改为真实数据（复用 `getBlogStats()`）。
- 补齐 `AdminNav` 指向的页面目录，创建占位但不报错的页面：
  - `src/app/admin/posts/page.tsx`
  - `src/app/admin/posts/new/page.tsx`
  - `src/app/admin/comments/page.tsx`
  - `src/app/admin/settings/page.tsx`
- 所有新页面为简单占位的服务器组件，带函数级注释，后续可按需接入鉴权与具体功能。

## 变更清单（含代码定位）
- `src/app/blog/[slug]/page.tsx:26-28`：为特定 slug 增加兜底渲染分支，减少 404。
- `src/lib/api.ts`：新增 `getBlogStats()`（紧随现有导出函数风格，复用 `supabase` 客户端）。
- `src/app/about/page.tsx:171-199`：将硬编码统计替换为真实数据；`133-155` 联系方式仅保留邮箱；新增“工作经历”卡片块。
- `src/components/navigation.tsx:10-31`：在导航数组中新增 `'/admin'` 项，桌面与移动端共用。
- `src/app/admin/page.tsx`：引入并渲染 `AdminNav`；将假数据统计改为真实数据。
- 新增 4 个后台子页面文件（各自含函数级注释与占位内容）。

## 验证步骤
- 本地启动后访问：
  - `/blog/welcome-to-reading-life` 不再 404，显示欢迎文章（来自 DB 或兜底）。
  - `/about` 展示简历整理后的真实信息与实时统计。
  - `/admin` 能通过主导航进入；侧边导航可点击到各子页面且不报错。
- 部署到 Vercel 后再次验证，并确认环境变量与 Supabase 数据完整。

## 注意事项
- 保持函数级注释，遵循现有代码风格与组件库（如 `Card/Button`）。
- 不提交任何敏感信息；不在 About 中展示姓名与除邮箱外的联系方式；工作经历不包含任何数据指标。
- iCloud Drive 路径包含空格与波浪号时进行正确处理（代码中不直接读取 PDF，采用人工整理后静态填充）。

请确认以上方案，确认后我将开始具体实现与验证。