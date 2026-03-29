---
name: 'prototype-reader'
description: '使用 chrome-devtools-mcp 读取原型文件(如墨刀Modao原型、腾讯CoDesign原型等),提取页面结构、表单元素、表格数据等信息,并生成对应的Vue组件代码。当用户需要将原型设计转换为Vue代码时调用。'
---

# 原型文件读取 Skill

## 描述

使用 chrome-devtools-mcp 工具读取原型文件(如墨刀Modao原型),提取页面结构、表单元素、表格数据等信息,并生成对应的Vue组件代码。

## 适用场景

- 需要从在线原型工具(如墨刀)读取设计稿
- 需要将原型设计转换为Vue代码
- 需要分析原型页面的结构和元素
- 需要自动化原型到代码的转换流程

## 前置条件

1. **chrome-devtools-mcp 服务已启动**
   - 确保 chrome-devtools-mcp 服务在本地运行
   - 默认端口: 8088 或 9222
   - 启动命令示例: `npx chrome-devtools-mcp`

2. **原型URL可访问**
   - 确保原型链接是公开可访问的
   - 建议使用只读模式链接

3. **Node.js 环境**
   - Node.js 版本 >= 16
   - 已安装必要的依赖包

## 使用步骤

### 1. 连接到 chrome-devtools-mcp 服务

使用可用的浏览器工具连接到 chrome-devtools-mcp 服务:

```javascript
// 打开新页面
await new_page({ url: 'https://modao.cc/proto/xxx/sharing?view_mode=read_only' });
```

### 2. 等待页面加载完成

```javascript
// 等待页面加载
await wait_for({ text: '页面加载完成的关键文本', timeout: 10000 });
```

### 3. 提取页面内容

使用 `take_snapshot` 获取页面快照,分析页面结构:

```javascript
// 获取页面快照
const snapshot = await take_snapshot();
```

### 4. 提取页面元素

使用 `evaluate_script` 执行JavaScript提取页面元素:

```javascript
// 提取页面标题
const title = await evaluate_script({
  function: '() => document.title',
});

// 提取表单元素
const formElements = await evaluate_script({
  function: `() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
      type: el.type || el.tagName,
      id: el.id,
      className: el.className,
      placeholder: el.placeholder || '',
      value: el.value || ''
    }));
  }`,
});

// 提取表格结构
const tables = await evaluate_script({
  function: `() => {
    return Array.from(document.querySelectorAll('table')).map(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
      const rows = Array.from(table.querySelectorAll('tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
      );
      return { headers, rows: rows.slice(0, 3) };
    });
  }`,
});
```

### 5. 生成Vue代码

根据提取的页面结构生成Vue组件代码:

```javascript
function generateVueCode(pageStructure, title) {
  return `
<template>
  <div class="page-container">
    <h1>${title || '页面标题'}</h1>
    <!-- 根据提取的元素生成对应的Vue组件 -->
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
// 根据页面结构生成相应的逻辑
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
  `;
}
```

### 6. 保存生成的代码

将生成的Vue代码保存到指定文件:

```javascript
// 使用 builtin_create_new_file 保存代码
await builtin_create_new_file({
  filepath: 'src/views/your-page/index.vue',
  contents: vueCode,
});
```

## 工具使用说明

### 可用的浏览器工具

1. **new_page** - 打开新页面
   - 参数: `url` (必需)
   - 示例: `new_page({ url: 'https://example.com' })`

2. **navigate_page** - 导航到指定URL
   - 参数: `url` (必需)
   - 示例: `navigate_page({ type: 'url', url: 'https://example.com' })`

3. **take_snapshot** - 获取页面快照
   - 返回页面的可访问性树结构

4. **evaluate_script** - 执行JavaScript代码
   - 参数: `function` (必需)
   - 返回: 执行结果

5. **wait_for** - 等待特定文本出现
   - 参数: `text` (必需), `timeout` (可选)

6. **take_screenshot** - 截取页面截图
   - 参数: `fullPage` (可选), `format` (可选)

## 示例流程

### 完整示例: 读取墨刀原型并生成Vue代码

```javascript
// 1. 打开原型页面
await new_page({
  url: 'https://modao.cc/proto/qK6NsVt9lvnncIHnryM/sharing?view_mode=read_only&screen=rbpVAL0VDMwSt5VnP',
});

// 2. 等待页面加载
await wait_for({ text: '页面主要内容', timeout: 15000 });

// 3. 获取页面标题
const title = await evaluate_script({
  function: '() => document.title',
});

// 4. 提取页面结构
const pageStructure = await evaluate_script({
  function: `() => {
    // 提取容器
    const containers = Array.from(document.querySelectorAll('.container, .section, .module')).map(el => ({
      id: el.id || el.className,
      tagName: el.tagName,
      textContent: el.textContent.trim().substring(0, 100)
    }));
    
    // 提取表单元素
    const formElements = Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
      type: el.type || el.tagName,
      id: el.id,
      className: el.className,
      placeholder: el.placeholder || ''
    }));
    
    // 提取表格
    const tables = Array.from(document.querySelectorAll('table')).map(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
      const rows = Array.from(table.querySelectorAll('tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
      );
      return { headers, rows: rows.slice(0, 3) };
    });
    
    return { containers, formElements, tables };
  }`,
});

// 5. 生成Vue代码
const vueCode = generateVueCode(pageStructure, title);

// 6. 保存代码
await builtin_create_new_file({
  filepath: 'src/views/generated-page/index.vue',
  contents: vueCode,
});
```

## 注意事项

1. **页面加载时间**: 原型页面可能需要较长时间加载,建议设置合理的超时时间(10-30秒)

2. **动态内容**: 某些原型工具使用动态渲染,可能需要等待特定元素出现

3. **权限问题**: 确保原型链接是公开可访问的,避免登录验证

4. **元素选择器**: 不同原型工具的DOM结构不同,需要根据实际情况调整选择器

5. **代码生成**: 生成的代码是基础模板,可能需要根据实际需求进行调整

6. **错误处理**: 建议添加适当的错误处理逻辑,捕获可能的异常

## 常见问题

### Q: 连接失败怎么办?

A: 检查 chrome-devtools-mcp 服务是否已启动,端口是否正确

### Q: 页面加载超时?

A: 增加超时时间,或使用 `wait_for` 等待特定元素出现

### Q: 提取不到元素?

A: 检查选择器是否正确,使用 `take_snapshot` 查看实际DOM结构

### Q: 生成的代码不完整?

A: 根据实际页面结构调整生成逻辑,或手动补充缺失部分

## 扩展功能

1. **多页面支持**: 可以遍历原型的多个页面,批量生成代码
2. **组件提取**: 识别可复用的组件,生成独立的组件文件
3. **样式提取**: 提取CSS样式,生成对应的样式文件
4. **路由配置**: 自动生成路由配置
5. **API接口**: 根据表单元素生成API接口定义

## 相关文件

- `read-prototype.js` - 使用 chrome-devtools-mcp 客户端的示例
- `read-prototype-with-mcp.js` - 使用 mcp-client 的示例
- `read-prototype-websocket.js` - 使用原生 WebSocket 的示例
