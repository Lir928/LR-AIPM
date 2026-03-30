---
name: prototype-to-code
description: 使用Playwright打开在线链接(包括墨刀Modao原型、腾讯CoDesign原型、蓝湖、Figma等设计稿链接，或任何在线网页地址)，提取页面结构并生成前端代码。当用户需要：(1) 打开在线原型链接生成前端代码，(2) 将设计稿转换为Vue/React代码，(3) 根据在线页面生成前端项目时触发此skill。必须使用Playwright工具，绝对不要通过MCP方式打开链接。
---

# Prototype to Code Skill

## ⚠️ 重要提示：使用Playwright而非MCP

**绝对不要使用MCP工具打开在线地址**，必须使用Playwright MCP工具：
- ✅ 使用 `browser_navigate` 打开链接
- ✅ 使用 `browser_snapshot` 获取页面快照
- ✅ 使用 `browser_click`, `browser_type` 进行交互
- ❌ 不要使用 `new_page`, `navigate_page` 等MCP工具

## 功能描述

将在线原型设计工具中的页面自动转换为前端代码，支持以下流程：
1. 使用Playwright打开原型链接
2. 提取页面结构和组件信息
3. 询问用户需要生成哪些页面
4. 检测项目代码规范(AGENTS.md)
5. 生成符合规范的前端代码

## 支持的链接类型

- 墨刀(Modao)原型链接：`https://modao.cc/axbox/share/xxx`
- 腾讯CoDesign链接：`https://codesign.qq.com/xxx`
- 蓝湖(Lanhu)链接：`https://lanhuapp.com/xxx`
- Figma链接：`https://www.figma.com/xxx`
- 即时设计链接：`https://js.design/xxx`
- 任何可访问的在线网页地址

## 使用流程

### 1. 打开原型链接

使用 **Playwright的 browser_navigate 工具** 打开用户提供的URL：

```javascript
await browser_navigate({ url: 'https://modao.cc/axbox/share/xxx' });
```

### 2. 处理密码保护

如果原型需要密码，使用 Playwright 工具输入密码：

```javascript
// 获取页面快照找到密码输入框
await browser_snapshot();
// 输入密码
await browser_type({ ref: 'password_input_ref', text: '密码' });
// 点击确定
await browser_click({ ref: 'submit_button_ref' });
```

### 3. 提取页面列表

获取页面快照，分析左侧页面导航树，提取所有页面名称：

```javascript
const snapshot = await browser_snapshot();
// 从快照中提取页面列表
```

### 4. 询问用户输入页面

提取页面列表后，**向用户展示所有可用页面名称**，然后请用户输入需要生成代码的页面：

**示例交互：**

```
原型中发现的页面：
1. 首页 - 应用首页
2. 政策列表 - 政策列表页
3. 政策详情 - 政策详情页
4. 活动 - 活动列表页
5. 我的 - 个人中心
...

请告诉我需要生成哪些页面的代码？
可以输入："全部"、"首页和政策页"、"1,2,3" 或具体的页面名称
```

等待用户输入：
- 如果用户输入 "全部" 或 "所有" - 生成所有页面
- 如果用户输入页面序号 - 如 "1,3,5" 或 "1-5"
- 如果用户输入页面名称 - 如 "首页和政策页"
- 解析用户输入，确定需要生成的页面列表

### 5. 检查代码规范

检查工作目录是否存在 AGENTS.md 文件：

```javascript
// 检查 AGENTS.md 是否存在
const fs = require('fs');
const hasAgentsMd = fs.existsSync('./AGENTS.md');
```

如果存在，读取并遵循其中的代码规范；如果不存在，使用默认的 Vue3 + Pinia 技术栈。

### 6. 遍历选中页面

对于用户选中的每个页面：

1. 点击页面链接导航到该页面
2. 截取页面截图
3. 提取页面元素结构
4. 生成对应的前端代码

```javascript
// 点击页面链接
await browser_click({ ref: pageLinkRef });
// 等待页面加载
await browser_wait_for({ time: 2 });
// 截图
await browser_take_screenshot({ filename: `${pageName}.png` });
```

### 7. 生成代码

根据页面结构和代码规范生成代码：

#### 默认技术栈 (Vue3 + Pinia)

- 框架: Vue 3 + Vite
- 状态管理: Pinia
- 路由: Vue Router 4
- UI库: 根据项目需要选择(Element Plus / Ant Design Vue / Vant)

#### 代码生成原则

1. **组件拆分**：识别可复用组件，生成独立组件文件
2. **响应式布局**：使用 flex/grid 实现适配
3. **类型定义**：为数据定义 TypeScript 类型
4. **样式隔离**：使用 scoped CSS 或 CSS Modules
5. **路由配置**：自动生成路由配置

### 8. 项目结构

生成的项目结构：

```
project/
├── src/
│   ├── components/       # 可复用组件
│   ├── views/           # 页面组件
│   ├── stores/          # Pinia状态管理
│   ├── router/          # 路由配置
│   ├── assets/          # 静态资源
│   └── utils/           # 工具函数
├── package.json
├── vite.config.js
└── index.html
```

## 页面元素映射

将原型元素映射为前端组件：

| 原型元素 | Vue组件 |
|---------|---------|
| 文本 | `<p>`, `<span>`, `<h1-h6>` |
| 按钮 | `<button>` 或组件库Button |
| 输入框 | `<input>`, `<el-input>`, `<a-input>` |
| 列表 | `<ul>`, `<li>` 或组件库List |
| 卡片 | `<el-card>`, `<a-card>` 或自定义 |
| 轮播图 | `<el-carousel>`, `<a-carousel>` 或自定义 |
| 底部导航 | 自定义组件 |
| 顶部导航栏 | 自定义组件 |
| 搜索框 | 带图标的输入框组件 |

## 注意事项

### ⚠️ 工具选择（重要！）

- **必须使用 Playwright MCP 工具**：`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type` 等
- **不要使用 MCP 方式**：避免使用 `new_page`, `navigate_page` 等工具
- 原因：Playwright MCP 提供了完整的浏览器自动化能力，更适合原型分析和截图

### 处理用户输入示例

解析用户输入的页面选择：

```javascript
// 示例：用户输入解析
function parseUserInput(input, pageList) {
  const selectedPages = [];
  
  // 处理 "全部" 或 "所有"
  if (input.includes('全部') || input.includes('所有')) {
    return pageList;
  }
  
  // 处理逗号分隔的序号，如 "1,3,5"
  if (/^\d+(,\d+)*$/.test(input.replace(/\s/g, ''))) {
    const indices = input.split(',').map(n => parseInt(n.trim()) - 1);
    indices.forEach(i => {
      if (pageList[i]) selectedPages.push(pageList[i]);
    });
    return selectedPages;
  }
  
  // 处理范围，如 "1-5"
  if (/^\d+-\d+$/.test(input.replace(/\s/g, ''))) {
    const [start, end] = input.split('-').map(n => parseInt(n.trim()));
    for (let i = start - 1; i < end && i < pageList.length; i++) {
      selectedPages.push(pageList[i]);
    }
    return selectedPages;
  }
  
  // 处理页面名称匹配
  const keywords = input.split(/[,，和、]/);
  keywords.forEach(keyword => {
    const page = pageList.find(p => p.name.includes(keyword.trim()));
    if (page) selectedPages.push(page);
  });
  
  return selectedPages;
}
```

### 其他注意事项

1. **页面加载时间**：原型页面可能需要较长时间加载，设置合理的超时时间
2. **iframe处理**：墨刀等工具使用iframe嵌套，需要处理iframe内的元素
3. **图片资源**：原型中的图片使用占位符，需要替换为实际资源
4. **交互逻辑**：原型只展示静态效果，交互逻辑需要根据需求补充
5. **响应式**：移动端原型需要适配不同屏幕尺寸

## 示例代码模板

### Vue3 单文件组件模板

```vue
<template>
  <div class="page-container">
    <!-- 状态栏 -->
    <StatusBar :time="currentTime" />
    
    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 根据原型生成的内容 -->
    </div>
    
    <!-- 底部导航 -->
    <BottomNav :active="currentRoute" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatusBar from '@/components/StatusBar.vue';
import BottomNav from '@/components/BottomNav.vue';

const currentTime = ref('');
const currentRoute = ref('policy');

onMounted(() => {
  // 更新时间
  currentTime.value = new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8f8f8;
}
</style>
```

### 路由配置模板

```javascript
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/policy/PolicyList.vue')
  },
  {
    path: '/policy/:id',
    name: 'PolicyDetail',
    component: () => import('@/views/policy/PolicyDetail.vue')
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
```

### Pinia Store 模板

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePolicyStore = defineStore('policy', () => {
  // State
  const policies = ref([]);
  const currentPolicy = ref(null);
  const loading = ref(false);
  
  // Getters
  const policyList = computed(() => policies.value);
  
  // Actions
  async function fetchPolicies() {
    loading.value = true;
    try {
      // API调用
      const response = await fetch('/api/policies');
      policies.value = await response.json();
    } finally {
      loading.value = false;
    }
  }
  
  return {
    policies,
    currentPolicy,
    loading,
    policyList,
    fetchPolicies
  };
});
```
