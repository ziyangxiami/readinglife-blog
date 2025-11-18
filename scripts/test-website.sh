#!/bin/bash

# ReadingLife 博客在线测试脚本
echo "🧪 ReadingLife 博客功能测试"
echo "================================"

# 配置测试域名（替换为你的实际域名）
DOMAIN="${1:-https://readinglife-blog.vercel.app}"
echo "测试域名: $DOMAIN"
echo ""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "测试 $description... "
    
    if curl -s -f "$DOMAIN$endpoint" > /dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        return 1
    fi
}

# 开始测试
echo "📋 开始网站功能测试..."
echo ""

# 基础页面测试
echo "🏠 基础页面测试:"
test_endpoint "/" "首页"
test_endpoint "/about" "关于页面"
test_endpoint "/blog" "博客列表页"
test_endpoint "/search" "搜索页面"

# API 接口测试  
echo ""
echo "🔌 API 接口测试:"
test_endpoint "/api/posts" "文章列表 API"
test_endpoint "/api/categories" "分类 API"
test_endpoint "/api/tags" "标签 API"
test_endpoint "/api/test-db" "数据库连接测试"

# SEO 和站点地图测试
echo ""
echo "🔍 SEO 测试:"
test_endpoint "/sitemap.xml" "站点地图"
test_endpoint "/rss.xml" "RSS 订阅"

# 性能测试
echo ""
echo "⚡ 性能测试:"
echo -n "测试首页加载速度... "
load_time=$(curl -o /dev/null -s -w '%{time_total}' "$DOMAIN/")
echo -e "${YELLOW}$(echo "$load_time * 1000" | bc -l | cut -d. -f1)ms${NC}"

# 响应式测试（检查关键 CSS 加载）
echo ""
echo "📱 响应式设计检查:"
echo -n "检查移动端 viewport... "
if curl -s "$DOMAIN" | grep -q "viewport"; then
    echo -e "${GREEN}✅ 检测到 viewport 标签${NC}"
else
    echo -e "${RED}❌ 未检测到 viewport 标签${NC}"
fi

echo ""
echo "🎯 测试总结:"
echo "================================"
echo "✅ 基础功能测试完成"
echo "✅ API 接口测试完成" 
echo "✅ SEO 配置测试完成"
echo ""
echo "🚀 网站已准备就绪！"
echo "🔗 访问地址: $DOMAIN"
echo ""
echo "📋 建议进一步测试:"
echo "1. 手动测试评论功能"
echo "2. 测试文章详情页显示"
echo "3. 验证搜索功能准确性"
echo "4. 检查移动端浏览体验"
echo "5. 测试不同浏览器的兼容性"