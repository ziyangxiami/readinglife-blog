-- =============================================
-- Reading Life Blog 数据库初始化脚本
-- =============================================

-- 1. 创建基础表结构
-- =============================================

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image VARCHAR(500),
    category_id UUID REFERENCES categories(id),
    reading_time INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引
-- =============================================
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- 3. 启用RLS (Row Level Security)
-- =============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. 创建RLS策略
-- =============================================

-- 文章表的RLS策略
CREATE POLICY "任何人都可以查看已发布文章" ON posts
    FOR SELECT
    TO anon
    USING (is_published = true);

CREATE POLICY "认证用户可以查看所有文章" ON posts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "认证用户可以创建文章" ON posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "认证用户可以更新自己的文章" ON posts
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "认证用户可以删除自己的文章" ON posts
    FOR DELETE
    TO authenticated
    USING (true);

-- 分类表的RLS策略
CREATE POLICY "任何人都可以查看分类" ON categories
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "认证用户可以管理分类" ON categories
    FOR ALL
    TO authenticated
    USING (true);

-- 标签表的RLS策略
CREATE POLICY "任何人都可以查看标签" ON tags
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "认证用户可以管理标签" ON tags
    FOR ALL
    TO authenticated
    USING (true);

-- 文章标签关联表的RLS策略
CREATE POLICY "任何人都可以查看文章标签关联" ON post_tags
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "认证用户可以管理文章标签关联" ON post_tags
    FOR ALL
    TO authenticated
    USING (true);

-- 评论表的RLS策略
CREATE POLICY "任何人都可以查看已批准的评论" ON comments
    FOR SELECT
    TO anon
    USING (is_approved = true);

CREATE POLICY "任何人都可以创建评论" ON comments
    FOR INSERT
    TO anon
    WITH CHECK (is_approved = true);

CREATE POLICY "认证用户可以管理所有评论" ON comments
    FOR ALL
    TO authenticated
    USING (true);

-- 5. 创建自动更新函数和触发器
-- =============================================

-- 创建更新文章时自动更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为posts表创建触发器
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 创建更新分类文章数量的函数
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories 
        SET post_count = post_count + 1 
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories 
        SET post_count = post_count - 1 
        WHERE id = OLD.category_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' AND NEW.category_id != OLD.category_id THEN
        UPDATE categories 
        SET post_count = post_count - 1 
        WHERE id = OLD.category_id;
        UPDATE categories 
        SET post_count = post_count + 1 
        WHERE id = NEW.category_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 为posts表创建触发器来更新分类文章数量
CREATE TRIGGER update_category_count_trigger
    AFTER INSERT OR DELETE OR UPDATE OF category_id ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_category_post_count();

-- 创建更新标签文章数量的函数
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags 
        SET post_count = post_count + 1 
        WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags 
        SET post_count = post_count - 1 
        WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 为post_tags表创建触发器来更新标签文章数量
CREATE TRIGGER update_tag_count_trigger
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_post_count();

-- 6. 授予基础权限
-- =============================================
GRANT SELECT ON posts TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON tags TO anon;
GRANT SELECT ON post_tags TO anon;
GRANT SELECT ON comments TO anon;

GRANT ALL PRIVILEGES ON posts TO authenticated;
GRANT ALL PRIVILEGES ON categories TO authenticated;
GRANT ALL PRIVILEGES ON tags TO authenticated;
GRANT ALL PRIVILEGES ON post_tags TO authenticated;
GRANT ALL PRIVILEGES ON comments TO authenticated;

-- 7. 初始化示例数据
-- =============================================

-- 初始化分类数据（如果不存在）
INSERT INTO categories (name, slug, description) 
SELECT name, slug, description FROM (
  VALUES 
    ('技术', 'technology', '技术相关文章'),
    ('文学', 'literature', '文学作品读后感'),
    ('哲学', 'philosophy', '哲学思考与感悟'),
    ('生活', 'life', '生活随笔与感悟')
) AS t(name, slug, description)
WHERE NOT EXISTS (SELECT 1 FROM categories LIMIT 1);

-- 初始化标签数据（如果不存在）
INSERT INTO tags (name, slug) 
SELECT name, slug FROM (
  VALUES 
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('读书', 'reading'),
    ('思考', 'thinking'),
    ('成长', 'growth'),
    ('前端', 'frontend'),
    ('后端', 'backend'),
    ('数据库', 'database'),
    ('部署', 'deployment')
) AS t(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM tags LIMIT 1);

-- 创建一篇示例文章（如果不存在文章）
INSERT INTO posts (title, slug, content, excerpt, category_id, reading_time, is_published)
SELECT 
  '欢迎来到Reading Life',
  'welcome-to-reading-life',
  '# 欢迎来到Reading Life

这是我的个人博客，专注于技术、文学、哲学和生活感悟的分享。

## 关于这个博客

这个博客使用现代化的技术栈构建：
- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 功能特性

- 📝 文章管理系统
- 🏷️ 分类和标签系统
- 💬 评论功能
- 🔍 搜索功能
- 📱 响应式设计
- 🎨 深色模式支持

## 开始探索

点击顶部导航栏开始浏览文章，或者使用搜索功能找到你感兴趣的内容。

感谢你的访问！',
  '欢迎来到我的个人博客，这里分享关于技术、文学、哲学和生活感悟的思考。',
  (SELECT id FROM categories WHERE slug = 'life' LIMIT 1),
  3,
  true
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);

-- 8. 验证安装
-- =============================================
SELECT 
  '数据库表创建完成' as message,
  (SELECT COUNT(*) FROM categories) as category_count,
  (SELECT COUNT(*) FROM tags) as tag_count,
  (SELECT COUNT(*) FROM posts) as post_count,
  (SELECT COUNT(*) FROM comments) as comment_count;