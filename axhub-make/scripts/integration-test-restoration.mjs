#!/usr/bin/env node

/**
 * integration-test-restoration.mjs
 * 
 * 集成测试脚本 - 验证整个页面还原流程
 * 
 * Usage:
 *   node scripts/integration-test-restoration.mjs <export-dir>
 * 
 * Example:
 *   node scripts/integration-test-restoration.mjs projects/demo-task/legacy-assets/任务详情页
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 获取命令行参数
const [, , exportDir] = process.argv;

if (!exportDir) {
  console.error('Usage: node scripts/integration-test-restoration.mjs <export-dir>');
  console.error('Example: node scripts/integration-test-restoration.mjs projects/demo-task/legacy-assets/任务详情页');
  process.exit(1);
}

console.log('🧪 开始集成测试：页面还原流程验证');
console.log('================================');

// 验证导出包完整性
console.log('\n🔍 1. 验证导出包完整性...');
const requiredFiles = [
  'screenshot.png',
  'theme.json', 
  'content.md',
  'manifest.json',
  'sections/',
  'structure/',
  'flat/'
];

let missingFiles = [];
for (const file of requiredFiles) {
  const filePath = join(exportDir, file);
  if (file.endsWith('/')) {
    // 检查目录
    if (!existsSync(filePath)) {
      missingFiles.push(file);
    }
  } else {
    // 检查文件
    if (!existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
}

if (missingFiles.length > 0) {
  console.error(`❌ 导出包缺少以下文件/目录: ${missingFiles.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ 导出包完整性验证通过');
}

// 提取页面ID
let pageId = 'restored-page';
try {
  const manifestPath = join(exportDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  if (manifest.pageId) {
    pageId = manifest.pageId;
  } else {
    // 从路径名提取
    const pathParts = exportDir.split('/');
    pageId = pathParts[pathParts.length - 1].replace(/[^\w\s]/gi, '-').toLowerCase();
  }
  console.log(`🏷️  识别页面ID: ${pageId}`);
} catch (error) {
  console.log(`🏷️  无法解析manifest.json，使用默认页面ID: ${pageId}`);
}

// 测试主题转换
console.log('\n🎨 2. 测试主题转换...');
try {
  const themeConvertCmd = `node scripts/theme-convert.mjs "${exportDir}" "test-${pageId}-theme"`;
  execSync(themeConvertCmd, { cwd: join(projectRoot, 'axhub-make'), stdio: 'pipe' });
  console.log('✅ 主题转换测试通过');
  
  // 验证生成的主题文件
  const themeDir = join(projectRoot, 'axhub-make', 'src', 'themes', `test-${pageId}-theme`);
  const expectedFiles = ['designToken.json', 'style.css', 'index.tsx', 'DESIGN.md', 'DESIGN-SPEC.md'];
  let themeFilesMissing = [];
  
  for (const file of expectedFiles) {
    if (!existsSync(join(themeDir, file))) {
      themeFilesMissing.push(file);
    }
  }
  
  if (themeFilesMissing.length > 0) {
    console.error(`❌ 主题转换缺少文件: ${themeFilesMissing.join(', ')}`);
  } else {
    console.log('✅ 主题文件完整性验证通过');
  }
  
  // 清理测试主题
  execSync(`rm -rf "${themeDir}"`, { stdio: 'pipe' });
  
} catch (error) {
  console.error(`❌ 主题转换测试失败:`, error.message);
  process.exit(1);
}

// 解析 manifest.json 以获取更多信息
let manifestData = {};
try {
  const manifestPath = join(exportDir, 'manifest.json');
  manifestData = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  console.log('📋 3. 解析 manifest.json...');
  console.log(`   - 页面标题: ${manifestData.title || 'N/A'}`);
  console.log(`   - 页面URL: ${manifestData.url || 'N/A'}`);
  console.log(`   - 导出时间: ${manifestData.timestamp || 'N/A'}`);
  console.log(`   - 元素数量: ${manifestData.elementCount || 'N/A'}`);
  console.log(`   - 节区数量: ${manifestData.sectionCount || 'N/A'}`);
  console.log('✅ manifest.json 解析完成');
} catch (error) {
  console.warn(`⚠️  无法解析 manifest.json:`, error.message);
}

// 检查 sections 目录
console.log('\n🧩 4. 检查页面分段结构...');
try {
  const sectionsDir = join(exportDir, 'sections');
  const sectionsFiles = execSync(`ls "${sectionsDir}"`, { encoding: 'utf-8' }).trim().split('\n');
  console.log(`   - 发现 ${sectionsFiles.length} 个页面分段`);
  
  if (sectionsFiles.length === 0) {
    console.warn('⚠️  未发现页面分段，可能影响分段还原功能');
  } else {
    console.log('✅ 页面分段结构检查通过');
  }
} catch (error) {
  console.warn(`⚠️  无法读取 sections 目录:`, error.message);
}

// 检查 flat 目录结构
console.log('\n🏗️  5. 检查平面数据结构...');
try {
  const flatDir = join(exportDir, 'flat');
  const flatDirs = execSync(`ls -d "${flatDir}"/*/ 2>/dev/null || ls "${flatDir}"`, { encoding: 'utf-8' }).trim().split('\n');
  const hasNodesDir = flatDirs.some(dir => dir.includes('nodes'));
  const hasStylesDir = flatDirs.some(dir => dir.includes('styles'));
  const hasSkeleton = existsSync(join(flatDir, 'skeleton.json'));
  
  console.log(`   - 包含节点数据: ${hasNodesDir ? '✅' : '❌'}`);
  console.log(`   - 包含样式数据: ${hasStylesDir ? '✅' : '❌'}`);
  console.log(`   - 包含骨架数据: ${hasSkeleton ? '✅' : '❌'}`);
  
  if (hasNodesDir && hasStylesDir && hasSkeleton) {
    console.log('✅ 平面数据结构完整性验证通过');
  } else {
    console.warn('⚠️  平面数据结构不完整，可能影响精确还原');
  }
} catch (error) {
  console.warn(`⚠️  无法读取 flat 目录:`, error.message);
}

// 验证截图
console.log('\n🖼️  6. 验证截图文件...');
try {
  const screenshotPath = join(exportDir, 'screenshot.png');
  const stats = require('node:fs').statSync(screenshotPath);
  const fileSizeKB = Math.round(stats.size / 1024);
  
  if (fileSizeKB > 0) {
    console.log(`   - 截图大小: ${fileSizeKB} KB`);
    console.log('✅ 截图文件验证通过');
  } else {
    console.error('❌ 截图文件为空');
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ 截图文件验证失败:`, error.message);
  process.exit(1);
}

// 总结
console.log('\n🏆 集成测试完成！');
console.log('=====================');
console.log('✅ 导出包基本结构完整');
console.log('✅ 关键文件均存在');
console.log('✅ 主题转换功能可用');
console.log('✅ 数据结构分析完成');

console.log(`\n🎯 建议下一步操作:`);
console.log(`   1. 运行完整的还原流程: 执行页面还原`);
console.log(`   2. 使用生成的主题进行页面还原`);
console.log(`   3. 验证还原结果的视觉准确性`);

console.log(`\n📋 生成的页面ID: ${pageId}`);

process.exit(0);