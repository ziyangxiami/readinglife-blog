import { supabase } from '@/lib/supabase'

/**
 * 测试Supabase数据库连接
 * 检查数据库表是否存在并且可以访问
 */
export async function testDatabaseConnection() {
  try {
    console.log('正在测试Supabase数据库连接...')
    
    // 测试基础连接
    const { data, error } = await supabase.from('posts').select('id').limit(1)
    
    if (error) {
      console.error('数据库连接失败:', error.message)
      return {
        success: false,
        error: error.message,
        details: '无法连接到posts表'
      }
    }
    
    console.log('✅ 数据库连接成功')
    
    // 测试各个表
    const tables = ['posts', 'categories', 'tags', 'comments']
    const results: Record<string, any> = {}
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (tableError) {
          results[table] = {
            success: false,
            error: tableError.message
          }
        } else {
          results[table] = {
            success: true,
            count: tableData?.length || 0
          }
        }
      } catch (tableErr) {
        results[table] = {
          success: false,
          error: tableErr instanceof Error ? tableErr.message : String(tableErr)
        }
      }
    }
    
    // 测试分类数据
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    console.log('📊 分类数据:', categories)
    
    // 测试标签数据
    const { data: tags } = await supabase
      .from('tags')
      .select('*')
      .limit(5)
    
    console.log('🏷️ 标签数据:', tags)
    
    return {
      success: true,
      results,
      categories: categories || [],
      tags: tags || []
    }
    
  } catch (err) {
    console.error('数据库测试异常:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      details: '数据库测试过程中发生异常'
    }
  }
}

/**
 * 初始化数据库数据
 * 如果表为空，插入初始数据
 */
export async function initializeDatabaseData() {
  try {
    console.log('正在检查数据库初始数据...')
    
    // 检查分类数据
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (!existingCategories || existingCategories.length === 0) {
      console.log('插入初始分类数据...')
      const { error: categoryError } = await supabase
        .from('categories')
        .insert([
          { name: '技术', slug: 'technology', description: '技术相关文章' },
          { name: '文学', slug: 'literature', description: '文学作品读后感' },
          { name: '哲学', slug: 'philosophy', description: '哲学思考与感悟' },
          { name: '生活', slug: 'life', description: '生活随笔与感悟' }
        ])
      
      if (categoryError) {
        console.error('插入分类数据失败:', categoryError)
      } else {
        console.log('✅ 分类数据插入成功')
      }
    }
    
    // 检查标签数据
    const { data: existingTags } = await supabase
      .from('tags')
      .select('*')
      .limit(1)
    
    if (!existingTags || existingTags.length === 0) {
      console.log('插入初始标签数据...')
      const { error: tagError } = await supabase
        .from('tags')
        .insert([
          { name: 'React', slug: 'react' },
          { name: 'Next.js', slug: 'nextjs' },
          { name: 'TypeScript', slug: 'typescript' },
          { name: '读书', slug: 'reading' },
          { name: '思考', slug: 'thinking' },
          { name: '成长', slug: 'growth' }
        ])
      
      if (tagError) {
        console.error('插入标签数据失败:', tagError)
      } else {
        console.log('✅ 标签数据插入成功')
      }
    }
    
    console.log('✅ 数据库初始化完成')
    return { success: true }
    
  } catch (err) {
    console.error('数据库初始化失败:', err)
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}