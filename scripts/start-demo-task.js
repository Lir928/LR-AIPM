#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// 更新 active_project.json 文件为 demo-task
const activeProjectPath = path.join(__dirname, '..', 'active_project.json');
const activeProjectContent = {
  current: 'projects/demo-task'
};

fs.writeFileSync(activeProjectPath, JSON.stringify(activeProjectContent, null, 2));
console.log('Switched to project: demo-task');
console.log('Active project file updated at:', activeProjectPath);

// 停止可能存在的旧进程
console.log('Checking for existing axhub-make processes...');
try {
  const result = execSync('ps aux | grep "vite --open" | grep -v grep', { stdio: 'pipe' });
  const processes = result.toString().trim().split('\n');
  processes.forEach(processLine => {
    const pid = processLine.split(/\s+/)[1];
    if (pid) {
      console.log('Stopping existing process with PID:', pid);
      execSync('kill ' + pid);
    }
  });
} catch (error) {
  // 没有进程在运行，继续启动
}

// 启动 axhub-make 应用
console.log('Starting axhub-make application...');

// 切换到 axhub-make 目录并启动开发服务器
try {
  const axhubMakePath = path.join(__dirname, '..', 'axhub-make');
  console.log('Changing directory to:', axhubMakePath);
  
  // 使用 spawn 执行启动命令，在后台运行
  const child = spawn('npm', ['run', 'dev'], {
    cwd: axhubMakePath,
    detached: true,
    stdio: 'ignore'
  });
  
  // 让子进程独立运行
  child.unref();
  
  console.log('✅ demo-task has been started successfully!');
  console.log('The application is running at: http://localhost:51720/');
  console.log('You can now access the full axhub-make application with demo-task loaded.');
  
  // 等待几秒钟让服务器启动，然后打开浏览器
  setTimeout(() => {
    try {
      execSync('open http://localhost:51720/', { stdio: 'ignore' });
    } catch (error) {
      // 浏览器打开失败，忽略错误
    }
  }, 3000);
  
  // 立即退出脚本，避免终端卡住
  process.exit(0);
} catch (error) {
  console.error('Error starting axhub-make:', error.message);
  process.exit(1);
}
