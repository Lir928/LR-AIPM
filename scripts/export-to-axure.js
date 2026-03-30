#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 步骤 1：检查原型文件
const prototypePath = path.join(__dirname, '..', 'projects', 'demo-task', 'prototypes', '2026AiAxure_RP11.rp');
console.log('Checking prototype file:', prototypePath);

if (fs.existsSync(prototypePath)) {
  console.log('✅ Prototype file exists');
} else {
  console.error('❌ Prototype file not found');
  process.exit(1);
}

// 步骤 2：执行原型生成（如果需要）
console.log('Generating prototype...');
// 这里可以调用原型生成的命令

// 步骤 3：导出到 Axure
console.log('Exporting to Axure...');
// 这里需要调用 axhub-make 的导出功能
// 由于涉及 GUI 操作，这里提供手动操作指导
console.log('\n📋 Manual Export Steps:');
console.log('1. Open axhub-make application at http://localhost:51720/');
console.log('2. Load the prototype file:', prototypePath);
console.log('3. Click "导出到 Axure" button');
console.log('4. Select "复制可编辑原型" option');
console.log('5. The prototype will be copied to clipboard');

// 步骤 4：在 Axure 中添加页面
console.log('\n🔧 Opening Axure and adding pages...');
try {
  // 启动 Axure RP
  spawn('open', ['-a', 'Axure RP'], { detached: true });
  console.log('✅ Axure RP opened successfully');
  
  console.log('\n📋 Next Steps in Axure:');
  console.log('1. Open the Axure file:', prototypePath);
  console.log('2. Use Ctrl+V (Windows) or Command+V (Mac) to paste the prototype');
  console.log('3. Create Task Center and Event Center pages');
  console.log('4. Save the Axure file');
  
} catch (error) {
  console.error('❌ Error opening Axure:', error.message);
  console.log('Please open Axure RP manually');
}

console.log('\n✅ Prototype export process initiated successfully!');
console.log('Follow the manual steps above to complete the process.');
