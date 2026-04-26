#!/usr/bin/env node

/**
 * theme-convert.mjs
 * 
 * 将 Chrome 扩展导出包中的 theme.json 转换为 Axhub Make 主题格式
 * 
 * Usage:
 *   node scripts/theme-convert.mjs <export-dir> <themeName>
 * 
 * Example:
 *   node scripts/theme-convert.mjs projects/demo-task/legacy-assets/任务详情页 restored-task-detail
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 获取命令行参数
const [, , exportDir, themeName] = process.argv;

if (!exportDir || !themeName) {
  console.error('Usage: node scripts/theme-convert.mjs <export-dir> <themeName>');
  console.error('Example: node scripts/theme-convert.mjs projects/demo-task/legacy-assets/任务详情页 restored-task-detail');
  process.exit(1);
}

// 完整的转换函数
function convertChromeTheme(themeJson) {
  // 解析主题数据
  const theme = typeof themeJson === 'string' ? JSON.parse(themeJson) : themeJson;
  
  // 分析颜色数据
  const { primaryColors, textColors, backgroundColors, borderColorCounts } = analyzeColors(theme.colors);
  
  // 转换为设计令牌格式
  const designTokens = convertToDesignTokens(theme, primaryColors, textColors, backgroundColors, borderColorCounts);
  
  // 生成 CSS 变量
  const cssVariables = generateCssVariables(theme.cssVariables);
  
  // 生成全局 CSS
  const globalCss = generateGlobalCss(designTokens, cssVariables);
  
  return {
    name: themeName,
    description: `基于 ${themeName} 导出数据还原的主题`,
    designTokens,
    globalCss
  };
}

// 分析颜色数据
function analyzeColors(colorsData) {
  const analyzed = {
    backgrounds: {},
    borders: {},
    texts: {},
    primaryCandidates: {}
  };

  for (const [colorType, colorEntries] of Object.entries(colorsData)) {
    for (const entry of colorEntries) {
      const { value, count, tags } = entry;
      
      if (colorType === 'background') {
        analyzed.backgrounds[value] = analyzed.backgrounds[value] || { count: 0, tags: [] };
        analyzed.backgrounds[value].count += count;
        analyzed.backgrounds[value].tags = [...new Set([...analyzed.backgrounds[value].tags, ...tags])];
        
        // 统计可能的主色调候选
        if (tags.some(tag => ['button', 'a', 'input'].includes(tag))) {
          analyzed.primaryCandidates[value] = analyzed.primaryCandidates[value] || 0;
          analyzed.primaryCandidates[value] += count;
        }
      } else if (colorType === 'border') {
        analyzed.borders[value] = analyzed.borders[value] || { count: 0, tags: [] };
        analyzed.borders[value].count += count;
        analyzed.borders[value].tags = [...new Set([...analyzed.borders[value].tags, ...tags])];
      } else if (colorType === 'text') {
        analyzed.texts[value] = analyzed.texts[value] || { count: 0, tags: [] };
        analyzed.texts[value].count += count;
        analyzed.texts[value].tags = [...new Set([...analyzed.texts[value].tags, ...tags])];
      }
    }
  }

  // 提取最频繁使用的颜色
  const sortEntries = (obj) => Object.entries(obj).sort((a, b) => b[1].count - a[1].count);

  const primaryColors = sortEntries(analyzed.primaryCandidates).slice(0, 5).map(([color]) => color);
  const textColors = sortEntries(analyzed.texts).slice(0, 5).map(([color, data]) => ({ color, count: data.count }));
  const backgroundColors = sortEntries(analyzed.backgrounds).slice(0, 10).map(([color, data]) => ({ color, count: data.count }));
  const borderColorCounts = sortEntries(analyzed.borders).slice(0, 5).map(([color, data]) => ({ color, count: data.count }));

  return { primaryColors, textColors, backgroundColors, borderColorCounts };
}

// 转换为设计令牌格式
function convertToDesignTokens(theme, primaryColors, textColors, backgroundColors, borderColorCounts) {
  const tokens = {
    name: themeName,
    description: `基于 ${themeName} 导出数据还原的主题`,
  };

  // 设置主色调（优先使用出现频率最高的蓝色系颜色）
  if (primaryColors.length > 0) {
    // 尝试找到最像蓝色的颜色作为主色（Element UI/类似系统通常是蓝色主色）
    const blueLikeColors = primaryColors.filter(color => 
      color.includes('24, 144, 255') || color.includes('64, 158, 255') || 
      color.includes('40, 98, 207') || color.toLowerCase().includes('blue')
    );
    
    tokens.colorPrimary = blueLikeColors[0] || primaryColors[0];
  }

  // 从文本颜色推断文本层级
  if (textColors.length > 0) {
    tokens.colorText = textColors[0].color; // 最常用的文字颜色
    
    // 推断次要文字颜色（较少使用的深灰类颜色）
    const secondaryText = textColors.slice(1).find(tc => 
      tc.color.includes('rgb(153') || tc.color.includes('rgba(0,0,0,0.65') || 
      tc.color.includes('rgb(144') || tc.count < textColors[0].count * 0.5
    );
    
    if (secondaryText) {
      tokens.colorTextSecondary = secondaryText.color;
    }
  }

  // 从背景色推断背景层级
  if (backgroundColors.length > 0) {
    tokens.colorBgContainer = backgroundColors[0].color; // 最常用的背景色
    
    // 推断次要背景色
    const secondaryBg = backgroundColors.slice(1).find(bc => 
      bc.color.includes('rgb(250') || bc.color.includes('rgb(248') || 
      bc.color.includes('rgb(245') || bc.count < backgroundColors[0].count * 0.7
    );
    
    if (secondaryBg) {
      tokens.colorBgLayout = secondaryBg.color;
    }
  }

  // 从边框色推断边框层级
  if (borderColorCounts.length > 0) {
    tokens.colorBorder = borderColorCounts[0].color;
    
    const secondaryBorder = borderColorCounts.slice(1).find(bc => 
      bc.color.includes('rgb(220') || bc.count < borderColorCounts[0].count * 0.5
    );
    
    if (secondaryBorder) {
      tokens.colorBorderSecondary = secondaryBorder.color;
    }
  }

  // 处理字体
  if (theme.typography?.families && theme.typography.families.length > 0) {
    // 选择最常用的字体族
    const mainFontFamily = theme.typography.families.sort((a, b) => b.count - a.count)[0];
    if (mainFontFamily) {
      tokens.fontFamily = mainFontFamily.value;
    }
  }

  // 处理字号
  if (theme.typography?.textStyles && theme.typography.textStyles.length > 0) {
    // 找到最常见的字号作为默认字号
    const commonSizes = theme.typography.textStyles
      .filter(style => style.size)
      .sort((a, b) => b.count - a.count);
    
    if (commonSizes.length > 0) {
      const defaultSize = parseInt(commonSizes[0].size.replace('px', ''), 10);
      tokens.fontSize = defaultSize;
      
      // 推断其他字号层级
      const sizes = [...new Set(commonSizes.map(s => parseInt(s.size.replace('px', ''), 10)))].sort((a, b) => b - a);
      
      if (sizes.length >= 3) {
        tokens.fontSizeLG = sizes[0];
        tokens.fontSizeHeading1 = sizes[0];
        tokens.fontSizeHeading2 = sizes[1];
        tokens.fontSizeHeading3 = sizes[2];
      }
    }
  }

  // 处理圆角
  if (theme.radius && Array.isArray(theme.radius)) {
    const radii = theme.radius.map(r => r.value).map(value => 
      value.includes('px') ? parseInt(value.replace('px', ''), 10) : value
    ).filter(r => typeof r === 'number');
    
    if (radii.length > 0) {
      const avgRadius = Math.round(radii.reduce((sum, r) => sum + r, 0) / radii.length);
      tokens.borderRadius = avgRadius;
      tokens.borderRadiusSM = Math.max(1, avgRadius - 1);
      tokens.borderRadiusLG = avgRadius + 1;
    }
  }

  // 处理阴影
  if (theme.shadow?.box && Array.isArray(theme.shadow.box) && theme.shadow.box.length > 0) {
    // 选择最常见的阴影作为默认阴影
    const commonShadow = theme.shadow.box.sort((a, b) => b.count - a.count)[0];
    if (commonShadow) {
      tokens.boxShadow = commonShadow.value;
    }
  }

  // 处理间距
  if (theme.spacing && Array.isArray(theme.spacing)) {
    const spacings = theme.spacing
      .map(s => s.value)
      .filter(value => value.includes('px'))
      .map(value => parseInt(value.replace('px', ''), 10))
      .filter(s => !isNaN(s))
      .sort((a, b) => a - b);
    
    if (spacings.length > 0) {
      // 创建间距层级
      const uniqueSpacings = [...new Set(spacings)].sort((a, b) => a - b);
      
      if (uniqueSpacings.length >= 5) {
        tokens.paddingXS = uniqueSpacings[0];
        tokens.paddingSM = uniqueSpacings[1];
        tokens.padding = uniqueSpacings[2]; 
        tokens.paddingMD = uniqueSpacings[3];
        tokens.paddingLG = uniqueSpacings[4];
      } else {
        // 简化方案
        tokens.padding = uniqueSpacings[0] || 12;
        tokens.paddingSM = Math.max(1, Math.floor(uniqueSpacings[0] / 2)) || 6;
        tokens.paddingLG = uniqueSpacings[0] * 2 || 24;
      }
    }
  }
  
  return tokens;
}

// 生成 CSS 变量
function generateCssVariables(cssVars) {
  if (!cssVars) return '';
  
  return ':root {\n' +
    Object.entries(cssVars).map(([key, value]) => `  ${key}: ${value};`).join('\n') +
    '\n}';
}

// 生成全局 CSS
function generateGlobalCss(tokens, cssVariables) {
  const cssLines = [];
  
  // 添加自定义 CSS 变量
  if (cssVariables) {
    cssLines.push(cssVariables);
    cssLines.push('');
  }
  
  // 生成主题相关的 CSS
  cssLines.push('.restored-theme {');
  
  if (tokens.colorText) {
    cssLines.push(`  color: ${tokens.colorText};`);
  }
  
  if (tokens.fontFamily) {
    cssLines.push(`  font-family: ${tokens.fontFamily};`);
  }
  
  if (tokens.fontSize) {
    cssLines.push(`  font-size: ${tokens.fontSize}px;`);
  }
  
  cssLines.push('}');
  
  // 添加一些通用样式规则
  cssLines.push('');
  cssLines.push('/* 通用元素样式 */');
  
  if (tokens.colorBgContainer) {
    cssLines.push('body {');
    cssLines.push(`  background: ${tokens.colorBgContainer};`);
    cssLines.push('}');
  }
  
  if (tokens.colorText) {
    cssLines.push('p, div, span, ul, ol, li {');
    cssLines.push(`  color: ${tokens.colorText};`);
    cssLines.push('}');
  }
  
  return cssLines.join('\n');
}

try {
  // 读取导出目录下的 theme.json
  const themePath = join(exportDir, 'theme.json');
  if (!existsSync(themePath)) {
    throw new Error(`theme.json not found at ${themePath}`);
  }
  
  const themeJson = readFileSync(themePath, 'utf-8');
  
  // 转换主题
  const result = convertChromeTheme(themeJson);
  
  // 确保主题目录存在
  const themeDir = join(projectRoot, 'src', 'themes', themeName);
  if (!existsSync(themeDir)) {
    mkdirSync(themeDir, { recursive: true });
  }
  
  // 写入设计令牌文件
  const designTokenPath = join(themeDir, 'designToken.json');
  writeFileSync(designTokenPath, JSON.stringify(result.designTokens, null, 2), 'utf-8');
  
  // 写入全局 CSS 文件
  const cssPath = join(themeDir, 'style.css');
  writeFileSync(cssPath, result.globalCss, 'utf-8');
  
  // 创建基础的 index.tsx 文件
  const indexTsx = `/**
 * ${themeName} 主题
 * 从导出数据还原的精确主题
 */

import './style.css';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ThemeShell, NavGroup, NavItem, MarkdownViewer } from '../../common/ThemeShell';
import tokens from './designToken.json';

const LoadingFallback = () => (
  <div className="text-center py-12" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>加载中...</div>
);

// Navigation Groups
const NAV_GROUPS: NavGroup[] = [
  { id: 'docs', title: '说明', order: 1 },
];

// Navigation Items  
const NAV_ITEMS: NavItem[] = [
  { id: 'design-spec', label: '设计规范 Design Spec', groupId: 'docs' },
];

const Component: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design-spec');
  const [designSpec, setDesignSpec] = useState<string>('');

  const baseTokens = tokens as Record<string, any>;

  useEffect(() => {
    fetch(new URL('./DESIGN-SPEC.md', import.meta.url).href)
      .then(res => res.text())
      .then(text => setDesignSpec(text))
      .catch(err => console.error('Failed to load Design Spec:', err));
  }, []);

  const renderContent = () => {
    if (activeTab === 'design-spec') {
      return designSpec ? <MarkdownViewer content={designSpec} /> : (
        <LoadingFallback />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl font-mono">;</span>
        </div>
        <h2 className="mt-0 text-xl font-semibold mb-2">此主题基于还原数据生成</h2>
        <p>该主题是从旧页面导出包中精确提取的设计令牌生成的</p>
      </div>
    );
  };

  return (
    <ThemeShell
      brand={{
        name: '${themeName}',
        subtitle: '还原主题',
        logoBgColor: baseTokens.colorPrimary || '#1890ff',
        logoTextColor: '#ffffff',
      }}
      groups={NAV_GROUPS}
      items={NAV_ITEMS}
      activeId={activeTab}
      onNavigate={setActiveTab}
      sidebar={{
        defaultOpen: true,
        collapsible: true,
        width: 256,
      }}
      className="restored-theme"
    >
      <div className="max-w-5xl mx-auto p-6">
        {renderContent()}
      </div>
    </ThemeShell>
  );
};

export default Component;
`;

  const indexPath = join(themeDir, 'index.tsx');
  writeFileSync(indexPath, indexTsx, 'utf-8');
  
  // 创建 DESIGN.md 文件
  const designMd = `# ${themeName} 主题规范

> 本文档定义了 ${themeName} 主题的设计价值、能力边界与使用指南，帮助开发者和 AI 正确理解和应用该设计系统。

## 设计系统价值

### 为什么使用此主题？

${themeName} 是从现有系统中精确提取的设计令牌集合，旨在**完全还原原系统视觉风格**。其核心价值在于：

1. **精确还原** - 保留原有系统的精确颜色、字体、间距等设计值
2. **视觉一致性** - 确保还原原型与原系统外观完全一致
3. **开发效率** - 提供一套完整的、可复用的设计令牌

### 设计原则

此主题的设计原则基于原始系统：

| 原始系统特点 | 体现方式 |
|------|------|
| **视觉一致性** | 统一的颜色、字体、间距系统 |
| **用户体验** | 符合用户对原系统的操作习惯 |
| **品牌延续** | 保持原系统的视觉识别 |

---

## 能力边界

### ✅ 适合的场景

- 老系统原型还原
- 保持与原系统视觉一致的改造项目
- 需要精确匹配原系统样式的设计需求

### ❌ 不适合的场景

- 完全新建的设计项目
- 需要使用不同设计语言的场景

---

## 设计令牌（Design Tokens）

### 颜色系统

根据原系统数据提取的主要颜色：

- **主色调**: \`${result.designTokens.colorPrimary || 'N/A'}\`
- **文字色**: \`${result.designTokens.colorText || 'N/A'}\`
- **背景色**: \`${result.designTokens.colorBgContainer || 'N/A'}\`
- **边框色**: \`${result.designTokens.colorBorder || 'N/A'}\`

### 间距系统

基于原系统的常见间距值：

- **小间距**: \`${result.designTokens.paddingXS || 'N/A'}px\`
- **标准间距**: \`${result.designTokens.padding || 'N/A'}px\`
- **大间距**: \`${result.designTokens.paddingLG || 'N/A'}px\`

### 排版系统

- **字体族**: \`${result.designTokens.fontFamily || 'N/A'}\`
- **基础字号**: \`${result.designTokens.fontSize || 'N/A'}px\`

### 圆角与阴影

- **圆角**: \`${result.designTokens.borderRadius || 'N/A'}px\`
- **阴影**: \`${result.designTokens.boxShadow ? '已定义' : 'N/A'}\`

---

## 使用说明

此主题是根据 Chrome 扩展导出的原始系统数据自动生成的，所有的设计值都尽可能地保持与原始系统一致，用于精确还原原始页面的外观。

`;
  
  const designMdPath = join(themeDir, 'DESIGN.md');
  writeFileSync(designMdPath, designMd, 'utf-8');

  // 创建 DESIGN-SPEC.md 文件
  const designSpecMd = `# ${themeName} - 设计规范详情

## 颜色 Color

### 主要颜色
- 主色调: ${result.designTokens.colorPrimary || 'N/A'}
- 成功色: N/A (从原系统中未识别)
- 警告色: N/A (从原系统中未识别)
- 错误色: N/A (从原系统中未识别)

### 文字颜色层级
- 主要文字: ${result.designTokens.colorText || 'N/A'}
- 次要文字: ${result.designTokens.colorTextSecondary || 'N/A'}

### 背景色
- 容器背景: ${result.designTokens.colorBgContainer || 'N/A'}
- 布局背景: ${result.designTokens.colorBgLayout || 'N/A'}

### 边框颜色
- 主要边框: ${result.designTokens.colorBorder || 'N/A'}
- 次要边框: ${result.designTokens.colorBorderSecondary || 'N/A'}

## 字体 Typography

### 字体族
\`\`\`
${result.designTokens.fontFamily || 'N/A'}
\`\`\`

### 字号系统
- 基础字号: ${result.designTokens.fontSize || 'N/A'}px
- 大号字体: ${result.designTokens.fontSizeLG || 'N/A'}px
- 标题1: ${result.designTokens.fontSizeHeading1 || 'N/A'}px

## 间距 Spacing

### 间距层级
- 微小间距: ${result.designTokens.paddingXS || 'N/A'}px
- 小间距: ${result.designTokens.paddingSM || 'N/A'}px
- 标准间距: ${result.designTokens.padding || 'N/A'}px
- 大间距: ${result.designTokens.paddingLG || 'N/A'}px

## 圆角 Radius

### 圆角值
- 小圆角: ${result.designTokens.borderRadiusSM || 'N/A'}px
- 标准圆角: ${result.designTokens.borderRadius || 'N/A'}px
- 大圆角: ${result.designTokens.borderRadiusLG || 'N/A'}px

## 阴影 Shadow

### 阴影效果
\`\`\`
${result.designTokens.boxShadow || 'N/A'}
\`\`\`

## 其他设计令牌

### 动效
- 动效快: N/A
- 动效中: N/A
- 动效慢: N/A

### 边框
- 边框宽度: ${result.designTokens.lineWidth ? `${result.designTokens.lineWidth}px` : 'N/A'}

### 透明度
- 蒙层透明度: N/A

## CSS 自定义属性

${cssVariables || '无额外 CSS 变量'}

---
*此文档由 Chrome 扩展导出数据自动生成*
`;

  const designSpecPath = join(themeDir, 'DESIGN-SPEC.md');
  writeFileSync(designSpecPath, designSpecMd, 'utf-8');

  console.log(`✅ 主题转换完成！`);
  console.log(`📁 主题已保存至: ${themeDir}`);
  console.log(`📋 生成文件:`);
  console.log(`   - designToken.json (设计令牌)`);
  console.log(`   - style.css (全局样式)`);
  console.log(`   - index.tsx (主题组件)`);
  console.log(`   - DESIGN.md (主题说明)`);
  console.log(`   - DESIGN-SPEC.md (详细设计规范)`);
  console.log(`\n🎨 主要设计值:`);
  console.log(`   - 主色: ${result.designTokens.colorPrimary || 'N/A'}`);
  console.log(`   - 字体: ${result.designTokens.fontFamily || 'N/A'}`);
  console.log(`   - 基础字号: ${result.designTokens.fontSize || 'N/A'}px`);

} catch (error) {
  console.error('❌ 主题转换失败:', error.message);
  process.exit(1);
}