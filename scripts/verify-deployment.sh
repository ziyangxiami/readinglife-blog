#!/bin/bash

# ReadingLife 博客部署验证脚本
echo "🔍 ReadingLife 博客部署验证"
echo "================================"

# 检查本地构建
echo "📦 检查本地构建状态..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 本地构建成功"
else
    echo "❌ 本地构建失败，请检查错误信息"
    exit 1
fi

# 检查环境变量
echo "🔧 检查环境变量配置..."
if [ -f ".env.local" ]; then
    echo "✅ 环境变量文件存在"
    
    # 检查关键变量
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ Supabase URL 已配置"
    else
        echo "❌ Supabase URL 未配置"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Supabase Anon Key 已配置"
    else
        echo "❌ Supabase Anon Key 未配置"
    fi
else
    echo "❌ 环境变量文件不存在"
fi

# 测试数据库连接
echo "🗄️ 测试数据库连接..."
curl -s -X GET "http://localhost:3000/api/test-db" | grep -q "connected"

if [ $? -eq 0 ]; then
    echo "✅ 数据库连接正常"
else
    echo "⚠️  数据库连接测试失败，请检查 Supabase 配置"
fi

echo ""
echo "🚀 部署准备就绪！"
echo "📋 下一步："
echo "1. 访问 Vercel 控制台查看部署状态"
echo "2. 检查部署日志确认无错误"
echo "3. 测试线上功能"
echo "4. 验证所有页面正常加载"
echo ""
echo "🔗 GitHub 仓库: https://github.com/ziyangxiami/readinglife-blog"
echo "🌐 Vercel 控制台: https://vercel.com/dashboard"