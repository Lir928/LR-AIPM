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

// 验证项目目录是否存在
const repoRoot = path.join(__dirname, '..');
const projectDir = path.join(repoRoot, 'projects', projectName);

if (!fs.existsSync(projectDir)) {
  console.error(`Error: Project "${projectName}" not found at ${projectDir}`);
  console.log('Available projects:');
  const projectsDir = path.join(repoRoot, 'projects');
  if (fs.existsSync(projectsDir)) {
    const projects = fs.readdirSync(projectsDir)
      .filter(name => !name.startsWith('.'))
      .filter(name => fs.statSync(path.join(projectsDir, name)).isDirectory());
    projects.forEach(name => console.log(`  - ${name}`));
  }
  process.exit(1);
}

// 创建 active_project.json 文件
const activeProjectPath = path.join(repoRoot, 'active_project.json');
const activeProjectContent = {
  current: `projects/${projectName}`,
  switchedAt: new Date().toISOString()
};

fs.writeFileSync(activeProjectPath, JSON.stringify(activeProjectContent, null, 2));
console.log(`Switched to project: ${projectName}`);
console.log(`Active project file updated at: ${activeProjectPath}`);
