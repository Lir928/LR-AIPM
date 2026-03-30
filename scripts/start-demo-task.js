#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

// 更新 active_project.json 文件为 demo-task
const activeProjectPath = path.join(__dirname, '..', 'active_project.json');
const activeProjectContent = {
  current: 'projects/demo-task'
};

fs.writeFileSync(activeProjectPath, JSON.stringify(activeProjectContent, null, 2));
console.log('Switched to project: demo-task');
console.log('Active project file updated at:', activeProjectPath);

// 检查是否已经有 axhub-make 进程在运行
try {
  const result = execSync('ps aux | grep "vite --open" | grep -v grep', { stdio: 'pipe' });
  if (result.toString().trim()) {
    console.log('✅ axhub-make application is already running!');
    console.log('The application is running at: http://localhost:51720/');
    console.log('Opening the application in your browser...');
    
    // 打开浏览器
    exec('open http://localhost:51720/');
    process.exit(0);
  }
} catch (error) {
  // 没有进程在运行，继续启动
}

// 启动 axhub-make 应用
console.log('Starting axhub-make application...');

// 切换到 axhub-make 目录并启动开发服务器
try {
  const axhubMakePath = path.join(__dirname, '..', 'axhub-make');
  console.log('Changing directory to:', axhubMakePath);
  
  // 使用 exec 执行启动命令，在后台运行
  exec('cd "' + axhubMakePath + '" && npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting axhub-make:', error.message);
      process.exit(1);
    }
  });
  
  console.log('✅ demo-task has been started successfully!');
  console.log('The application is running at: http://localhost:51720/');
  console.log('You can now access the full axhub-make application with demo-task loaded.');
  
  // 等待几秒钟让服务器启动，然后打开浏览器
  setTimeout(() => {
    exec('open http://localhost:51720/');
  }, 3000);
} catch (error) {
  console.error('Error starting axhub-make:', error.message);
  process.exit(1);
}
