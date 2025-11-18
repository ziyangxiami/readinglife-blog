-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建管理员表索引
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

-- 文章草稿表（用于保存草稿）
CREATE TABLE IF NOT EXISTS post_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  reading_time INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 文章草稿标签关联表
CREATE TABLE IF NOT EXISTS draft_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id UUID REFERENCES post_drafts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draft_id, tag_id)
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认管理员（密码: admin123）
INSERT INTO admins (email, password_hash, name, role) VALUES (
  'admin@readinglife.fun',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'password'
  '管理员',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- 插入默认系统设置
INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'Reading Life', '网站名称'),
  ('site_description', '个人读书学习分享平台', '网站描述'),
  ('site_url', 'https://readinglife.fun', '网站URL'),
  ('posts_per_page', '10', '每页文章数量'),
  ('comments_per_page', '20', '每页评论数量'),
  ('enable_comments', 'true', '是否启用评论'),
  ('enable_registration', 'false', '是否启用用户注册'),
  ('default_category', '3dcc2951-b35f-484b-848d-bdfb4e73b1f0', '默认分类ID')
ON CONFLICT (key) DO NOTHING;

-- 启用RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 管理员权限策略
CREATE POLICY "管理员可以查看所有管理员" ON admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "超级管理员可以管理所有管理员" ON admins FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');
CREATE POLICY "管理员可以更新自己的信息" ON admins FOR UPDATE TO authenticated USING (auth.jwt() ->> 'id' = id::text);

-- 草稿权限策略
CREATE POLICY "管理员可以查看所有草稿" ON post_drafts FOR SELECT TO authenticated USING (true);
CREATE POLICY "管理员可以创建草稿" ON post_drafts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "管理员可以更新自己的草稿" ON post_drafts FOR UPDATE TO authenticated USING (author_id = (auth.jwt() ->> 'id')::uuid);
CREATE POLICY "管理员可以删除自己的草稿" ON post_drafts FOR DELETE TO authenticated USING (author_id = (auth.jwt() ->> 'id')::uuid);

-- 设置权限策略
CREATE POLICY "管理员可以查看设置" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "超级管理员可以管理设置" ON settings FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();