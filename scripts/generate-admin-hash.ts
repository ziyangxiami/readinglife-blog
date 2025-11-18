import bcrypt from "bcryptjs"

/**
 * 生成管理员密码哈希
 * 使用方法: npm run generate-admin-hash 你的密码
 */
async function generateAdminHash() {
  const password = process.argv[2]
  
  if (!password) {
    console.error("请提供密码参数: npm run generate-admin-hash 你的密码")
    process.exit(1)
  }
  
  try {
    const hash = await bcrypt.hash(password, 10)
    console.log("管理员密码哈希:")
    console.log(hash)
    console.log("\n请将这个哈希值复制到 .env.local 文件中的 ADMIN_PASSWORD_HASH 变量")
  } catch (error) {
    console.error("生成哈希失败:", error)
    process.exit(1)
  }
}

generateAdminHash()