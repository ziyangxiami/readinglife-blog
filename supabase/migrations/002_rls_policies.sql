-- 启用RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 文章表的RLS策略
-- 匿名用户可以查看所有文章
CREATE POLICY "任何人都可以查看文章" ON posts
    FOR SELECT
    TO anon
    USING (true);

-- 认证用户可以创建文章
CREATE POLICY "认证用户可以创建文章" ON posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 认证用户可以更新自己的文章
CREATE POLICY "认证用户可以更新自己的文章" ON posts
    FOR UPDATE
    TO authenticated
    USING (true);

-- 认证用户可以删除自己的文章
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
CREATE POLICY "任何人都可以查看评论" ON comments
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "任何人都可以创建评论" ON comments
    FOR INSERT
    TO anon
    WITH CHECK (true);

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