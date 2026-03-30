# Prototype Reader Skill - 使用说明

## Skill 概述

已成功创建 `prototype-reader` skill，该 skill 使用 chrome-devtools-mcp 工具读取原型文件（如墨刀Modao原型、腾讯CoDesign原型等），提取页面结构、表单元素、表格数据等信息，并生成对应的Vue组件代码。

## 文件结构

```
.trae/skills/prototype-reader/
├── SKILL.md          # Skill 定义文件（包含 YAML frontmatter）
├── README.md         # 详细使用说明
├── example.js        # 示例脚本
├── package.json      # NPM 包配置
└── USAGE.md          # 本文件 - 快速使用指南
```

## Skill 配置

### SKILL.md Frontmatter

```yaml
---
name: 'prototype-reader'
description: '使用 chrome-devtools-mcp 读取原型文件(如墨刀Modao原型、腾讯CoDesign原型等),提取页面结构、表单元素、表格数据等信息,并生成对应的Vue组件代码。当用户需要将原型设计转换为Vue代码时调用。'
---
```

## 使用方法

### 1. 激活 Skill

在支持 MCP 的环境中，使用以下命令激活 skill：

```
激活技能: prototype-reader
```

### 2. 调用示例

#### 示例 1: 读取墨刀原型

```
请使用 prototype-reader 读取墨刀原型地址 https://modao.cc/proto/qK6NsVt9lvnncIHnryM/sharing?view_mode=read_only 并生成页面代码
```

#### 示例 2: 读取腾讯CoDesign原型（带密码）

```
请使用 prototype-reader 读取腾讯CoDesign原型地址 https://codesign.qq.com/s/649970237319716，访问密码是 6JYU
```

### 3. 直接使用浏览器工具

如果 skill 激活失败，可以直接使用浏览器工具：

```javascript
// 1. 打开原型页面
await new_page({ url: 'https://codesign.qq.com/s/649970237319716' });

// 2. 等待密码输入框
await wait_for({ text: '访问密码', timeout: 10000 });

// 3. 输入密码
const passwordInput = await evaluate_script({
  function: "() => document.querySelector('input[type=\"password\"]')"
});
if (passwordInput) {
  await fill({ uid: passwordInput.uid, value: '6JYU' });
  await press_key({ key: 'Enter' });
}

// 4. 等待页面加载
await wait_for({ text: '原型内容', timeout: 15000 });

// 5. 获取页面快照
const snapshot = await take_snapshot();

// 6. 提取页面结构
const pageStructure = await evaluate_script({
  function: `() => {
    // 提取页面元素的 JavaScript 代码
  }`
});

// 7. 生成 Vue 代码
const vueCode = generateVueCode(pageStructure, '页面标题');

// 8. 保存代码
await builtin_create_new_file({
  filepath: 'src/views/generated-page/index.vue',
  contents: vueCode
});
```

## 功能特性

### 支持的原型工具

- ✅ 墨刀 (Modao)
- ✅ 腾讯CoDesign
- ✅ Figma（理论上支持）
- ✅ 其他在线原型工具

### 提取的页面元素

- 📦 容器元素（.container, .section, .module等）
- 📝 表单元素（input, select, textarea, button）
- 📊 表格结构（table, th, td）
- 🎴 卡片/面板（.card, .panel, .box）
- 🧭 导航元素（nav, .nav, .navigation, .menu）
- 📄 文本元素（所有可见的文本节点）

### 生成的代码特性

- ✅ Vue 3 Composition API (`<script setup>`)
- ✅ Ant Design Vue 组件
- ✅ 响应式设计
- ✅ 表单验证支持
- ✅ 表格分页支持
- ✅ 搜索筛选功能
- ✅ 模态框支持

## 前置条件

### 1. 安装 chrome-devtools-mcp

```bash
npm install -g chrome-devtools-mcp
```

### 2. 启动 chrome-devtools-mcp 服务

```bash
npx chrome-devtools-mcp
```

默认端口：8088 或 9222

### 3. Node.js 环境

Node.js 版本 >= 16

## 可用的浏览器工具

| 工具 | 说明 | 示例 |
|------|------|------|
| `new_page` | 打开新页面 | `new_page({ url: 'https://example.com' })` |
| `navigate_page` | 导航到URL | `navigate_page({ type: 'url', url: 'https://example.com' })` |
| `take_snapshot` | 获取页面快照 | `take_snapshot()` |
| `evaluate_script` | 执行JS代码 | `evaluate_script({ function: "() => document.title" })` |
| `wait_for` | 等待文本出现 | `wait_for({ text: '加载完成', timeout: 10000 })` |
| `take_screenshot` | 截取截图 | `take_screenshot({ fullPage: true })` |
| `fill` | 填写表单 | `fill({ uid: 'xxx', value: '内容' })` |
| `press_key` | 按键 | `press_key({ key: 'Enter' })` |

## 注意事项

1. **页面加载时间**: 原型页面可能需要较长时间加载，建议设置合理的超时时间（10-30秒）

2. **动态内容**: 某些原型工具使用动态渲染，可能需要等待特定元素出现

3. **权限问题**: 确保原型链接是公开可访问的，避免登录验证

4. **元素选择器**: 不同原型工具的DOM结构不同，需要根据实际情况调整选择器

5. **代码生成**: 生成的代码是基础模板，可能需要根据实际需求进行调整

6. **错误处理**: 建议添加适当的错误处理逻辑，捕获可能的异常

7. **密码保护**: 对于需要密码的原型，需要先输入密码才能访问内容

## 常见问题

### Q: Skill 激活失败怎么办？

A: 如果 skill 激活失败，可以直接使用浏览器工具。参考上面的"直接使用浏览器工具"部分。

### Q: 连接失败怎么办？

A: 检查以下几点：
1. chrome-devtools-mcp 服务是否已启动
2. 端口是否正确（默认8088或9222）
3. 防火墙是否阻止连接

### Q: 页面加载超时？

A:
1. 增加超时时间配置
2. 使用 `wait_for` 等待特定元素出现
3. 检查网络连接

### Q: 提取不到元素？

A:
1. 使用 `take_snapshot` 查看实际DOM结构
2. 调整选择器以匹配实际元素
3. 确保页面已完全加载

### Q: 生成的代码不完整？

A:
1. 根据实际页面结构调整生成逻辑
2. 手动补充缺失的部分
3. 自定义 `generateVueCode` 函数

### Q: 腾讯CoDesign原型需要密码怎么办？

A:
1. 使用 `fill` 工具输入密码
2. 使用 `press_key` 工具按 Enter 键提交
3. 等待原型加载完成后再提取内容

## 扩展功能

1. **多页面支持**: 可以遍历原型的多个页面，批量生成代码
2. **组件提取**: 识别可复用的组件，生成独立的组件文件
3. **样式提取**: 提取CSS样式，生成对应的样式文件
4. **路由配置**: 自动生成路由配置
5. **API接口**: 根据表单元素生成API接口定义
6. **密码处理**: 自动处理需要密码访问的原型

## 相关资源

- [chrome-devtools-mcp 文档](https://github.com/modelcontextprotocol/servers/tree/main/src/chrome-devtools)
- [墨刀官网](https://modao.cc/)
- [腾讯CoDesign官网](https://codesign.qq.com/)
- [Vue 3 文档](https://vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/)

## 更新日志

### v1.0.0 (2026-02-13)

- ✅ 初始版本发布
- ✅ 支持墨刀原型读取
- ✅ 支持腾讯CoDesign原型读取
- ✅ 支持密码保护的原型访问
- ✅ 支持Vue 3代码生成
- ✅ 支持Ant Design Vue组件
- ✅ 完整的文档和示例

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
