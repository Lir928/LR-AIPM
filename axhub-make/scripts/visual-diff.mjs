#!/usr/bin/env node

/**
 * visual-diff.mjs
 * 
 * 视觉差异检测脚本 - 比较原始截图与生成原型的视觉相似度
 * 
 * Usage:
 *   node scripts/visual-diff.mjs <export-dir> <prototype-url>
 * 
 * Example:
 *   node scripts/visual-diff.mjs projects/demo-task/legacy-assets/任务详情页 http://localhost:51720/prototypes/task-detail
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const [, , exportDir, prototypeUrl] = process.argv;

if (!exportDir || !prototypeUrl) {
  console.error('Usage: node scripts/visual-diff.mjs <export-dir> <prototype-url>');
  console.error('Example: node scripts/visual-diff.mjs projects/demo-task/legacy-assets/任务详情页 http://localhost:51720/prototypes/task-detail');
  process.exit(1);
}

async function compareScreenshots(originalPath, generatedPath) {
  try {
    // 读取两个图像
    const originalBuffer = await sharp(originalPath).raw().toBuffer();
    const generatedBuffer = await sharp(generatedPath).raw().toBuffer();
    
    // 获取图像元数据
    const origMeta = await sharp(originalPath).metadata();
    const genMeta = await sharp(generatedPath).metadata();
    
    // 如果尺寸不同，调整到相同尺寸
    let origProcessedImage = sharp(originalPath);
    let genProcessedImage = sharp(generatedPath);
    
    if (origMeta.width !== genMeta.width || origMeta.height !== genMeta.height) {
      console.log(`⚠️  图像尺寸不同，调整到相同尺寸: ${genMeta.width}x${genMeta.height}`);
      origProcessedImage = origProcessedImage.resize(genMeta.width, genMeta.height);
      genProcessedImage = genProcessedImage.resize(genMeta.width, genMeta.height);
    }
    
    // 将图像转换为相同格式进行比较
    const resizedOrigBuffer = await origProcessedImage.raw().toBuffer();
    const resizedGenBuffer = await genProcessedImage.raw().toBuffer();
    
    // 简单的像素差值计算（仅RGB通道）
    let diffPixels = 0;
    let totalDiff = 0;
    const minLen = Math.min(resizedOrigBuffer.length, resizedGenBuffer.length);
    
    for (let i = 0; i < minLen; i += 4) { // += 4 因为我们只关心 RGB，跳过 Alpha
      const origR = resizedOrigBuffer[i];
      const origG = resizedOrigBuffer[i + 1];
      const origB = resizedOrigBuffer[i + 2];
      
      const genR = resizedGenBuffer[i];
      const genG = resizedGenBuffer[i + 1];
      const genB = resizedGenBuffer[i + 2];
      
      // 计算 RGB 差值
      const dr = Math.abs(origR - genR);
      const dg = Math.abs(origG - genG);
      const db = Math.abs(origB - genB);
      
      // 认为像素不同的阈值（允许轻微差异）
      if (dr > 30 || dg > 30 || db > 30) {
        diffPixels++;
      }
      
      totalDiff += dr + dg + db;
    }
    
    const totalPixels = Math.min(
      origMeta.width * origMeta.height, 
      genMeta.width * genMeta.height
    );
    const diffPercentage = (diffPixels / totalPixels) * 100;
    const avgPixelDiff = totalDiff / (totalPixels * 3); // 3 for RGB channels
    
    return {
      diffPercentage: parseFloat(diffPercentage.toFixed(2)),
      avgPixelDiff: parseFloat(avgPixelDiff.toFixed(2)),
      totalPixels,
      diffPixels
    };
    
  } catch (error) {
    console.error('❌ 图像比较失败:', error.message);
    return null;
  }
}

async function capturePrototypeScreenshot(url, outputPath) {
  try {
    // 使用 Playwright 截图（假设环境中已安装）
    const script = `
      const { chromium } = require('playwright');
      
      (async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('${url}', { waitUntil: 'networkidle' });
        
        // 等待页面渲染完成
        await page.waitForTimeout(2000);
        
        // 截图
        await page.screenshot({ 
          path: '${outputPath}',
          fullPage: true
        });
        
        await browser.close();
        console.log('Screenshot saved to ${outputPath}');
      })();
    `;
    
    // 将脚本写入临时文件并执行
    const tempScript = join(process.cwd(), 'temp_screenshot.js');
    await import('node:fs').then(fs => {
      fs.writeFileSync(tempScript, script);
    });
    
    execSync(`node ${tempScript}`, { stdio: 'inherit' });
    
    // 删除临时文件
    await import('node:fs').then(fs => {
      fs.unlinkSync(tempScript);
    });
    
  } catch (error) {
    console.error('❌ 截图捕获失败:', error.message);
    // 尝试使用 Puppeteer 作为备选方案
    try {
      const puppeteerScript = `
        const puppeteer = require('puppeteer');
        
        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto('${url}', { waitUntil: 'networkidle2' });
          
          await page.waitForTimeout(2000);
          
          await page.screenshot({ 
            path: '${outputPath}',
            fullPage: true
          });
          
          await browser.close();
        })();
      `;
      
      const tempPuppeteerScript = join(process.cwd(), 'temp_puppeteer_screenshot.js');
      await import('node:fs').then(fs => {
        fs.writeFileSync(tempPuppeteerScript, puppeteerScript);
      });
      
      execSync(`node ${tempPuppeteerScript}`, { stdio: 'inherit' });
      
      await import('node:fs').then(fs => {
        fs.unlinkSync(tempPuppeteerScript);
      });
      
    } catch (puppeteerError) {
      console.error('❌ 备选截图方法也失败:', puppeteerError.message);
      throw new Error('无法捕获原型截图');
    }
  }
}

async function runVisualDiff() {
  console.log('🔍 开始视觉差异检测...');
  
  // 检查原始截图是否存在
  const originalScreenshotPath = join(exportDir, 'screenshot.png');
  if (!existsSync(originalScreenshotPath)) {
    console.error('❌ 原始截图未找到:', originalScreenshotPath);
    process.exit(1);
  }
  
  console.log(`📸 原始截图: ${originalScreenshotPath}`);
  console.log(`🌐 原型URL: ${prototypeUrl}`);
  
  // 创建临时目录存储生成的截图
  const tempDir = join(process.cwd(), '.temp-visual-diff');
  if (!existsSync(tempDir)) {
    await import('node:fs').then(fs => {
      fs.mkdirSync(tempDir, { recursive: true });
    });
  }
  
  const generatedScreenshotPath = join(tempDir, 'generated-prototype.png');
  
  console.log('📷 捕获原型截图...');
  try {
    await capturePrototypeScreenshot(prototypeUrl, generatedScreenshotPath);
  } catch (error) {
    console.error('❌ 无法捕获原型截图');
    process.exit(1);
  }
  
  console.log('📊 比较图像差异...');
  const comparisonResult = await compareScreenshots(originalScreenshotPath, generatedScreenshotPath);
  
  if (!comparisonResult) {
    console.error('❌ 图像比较失败');
    process.exit(1);
  }
  
  // 输出结果
  console.log('\n📈 视觉差异分析报告');
  console.log('=======================');
  console.log(`📊 总像素数: ${comparisonResult.totalPixels.toLocaleString()}`);
  console.log(`🔴 差异像素数: ${comparisonResult.diffPixels.toLocaleString()}`);
  console.log(`📈 差异百分比: ${comparisonResult.diffPercentage}%`);
  console.log(`📏 平均像素差异: ${comparisonResult.avgPixelDiff}`);
  
  // 计算相似度
  const similarity = 100 - comparisonResult.diffPercentage;
  console.log(`🎯 视觉相似度: ${similarity.toFixed(2)}%`);
  
  // 基于相似度给出评估
  let assessment = '';
  if (similarity >= 95) {
    assessment = '🎉 优秀 - 视觉还原度极高，几乎完全一致';
  } else if (similarity >= 85) {
    assessment = '👍 良好 - 视觉还原度较高，符合预期';
  } else if (similarity >= 70) {
    assessment = '⚠️ 一般 - 存在明显差异，需要检查还原精度';
  } else {
    assessment = '🚨 较差 - 差异过大，需要重新检查还原过程';
  }
  
  console.log(`📋 评估结果: ${assessment}`);
  
  // 详细分析
  console.log('\n🔍 差异分析详情:');
  if (comparisonResult.diffPercentage < 5) {
    console.log('- 颜色、布局基本一致');
  } else if (comparisonResult.diffPercentage < 15) {
    console.log('- 颜色可能有细微差异，布局基本一致');
  } else {
    console.log('- 可能存在颜色、布局或元素缺失问题');
  }
  
  if (comparisonResult.avgPixelDiff < 20) {
    console.log('- 像素级别差异较小');
  } else {
    console.log('- 像素级别差异较大，可能存在样式问题');
  }
  
  console.log('\n💡 建议:');
  if (similarity < 85) {
    console.log('- 检查主题是否正确应用了从 theme.json 转换的样式');
    console.log('- 确认所有组件按照原始截图进行了精确还原');
    console.log('- 对比 sections 是否完整还原');
    console.log('- 验证 CSS 变量和设计令牌是否正确应用');
  } else {
    console.log('- 还原质量良好，可进一步验证功能完整性');
  }
  
  // 保存结果到文件
  const results = {
    originalScreenshot: originalScreenshotPath,
    generatedScreenshot: generatedScreenshotPath,
    comparison: comparisonResult,
    similarity,
    assessment,
    timestamp: new Date().toISOString()
  };
  
  const resultsPath = join(tempDir, 'visual-diff-results.json');
  await import('node:fs').then(fs => {
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  });
  
  console.log(`\n💾 报告已保存至: ${resultsPath}`);
  console.log(`📄 生成截图已保存至: ${generatedScreenshotPath}`);
  
  return similarity;
}

// 执行视觉差异检测
runVisualDiff()
  .then(similarity => {
    if (similarity < 80) {
      console.log('\n🚨 视觉相似度较低，建议改进还原精度');
      process.exit(1); // 返回错误码以便 CI/CD 使用
    } else {
      console.log('\n✅ 视觉还原质量达标');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('❌ 视觉差异检测过程出错:', error.message);
    process.exit(1);
  });