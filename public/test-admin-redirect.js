// 自动测试跳转功能
console.log("=== 开始测试管理页面跳转功能 ===");

// 测试1: 检查页面元素是否存在
setTimeout(() => {
  const button = document.querySelector('button');
  if (button) {
    console.log("✅ 找到按钮元素:", button.textContent);
    
    // 测试2: 模拟点击事件
    console.log("🔄 模拟点击按钮...");
    button.click();
    
    // 测试3: 检查是否在3秒后跳转
    setTimeout(() => {
      console.log("📍 当前URL:", window.location.href);
      if (window.location.pathname === '/admin/login') {
        console.log("✅ 跳转成功！已到达登录页面");
      } else {
        console.log("❌ 跳转失败，当前路径:", window.location.pathname);
      }
    }, 3000);
    
  } else {
    console.log("❌ 未找到按钮元素");
  }
}, 1000);