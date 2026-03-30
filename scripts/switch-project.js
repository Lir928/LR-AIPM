#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 获取命令行参数
const projectName = process.argv[2];

if (!projectName) {
  console.error('Error: Please provide a project name');
  console.log('Usage: node switch-project.js <project-name>');
  process.exit(1);
}

// 创建 active_project.json 文件
const activeProjectPath = path.join(__dirname, '..', 'active_project.json');
const activeProjectContent = {
  current: `projects/${projectName}`
};

fs.writeFileSync(activeProjectPath, JSON.stringify(activeProjectContent, null, 2));
console.log(`Switched to project: ${projectName}`);
console.log(`Active project file updated at: ${activeProjectPath}`);
