# Vue3 + Pinia 项目模板

## 项目结构

```
project/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── StatusBar.vue   # 状态栏组件
│   │   ├── BottomNav.vue   # 底部导航组件
│   │   ├── SearchBar.vue   # 搜索栏组件
│   │   └── PolicyCard.vue  # 政策卡片组件
│   ├── views/              # 页面组件
│   │   ├── Home.vue
│   │   └── policy/
│   │       ├── PolicyList.vue
│   │       └── PolicyDetail.vue
│   ├── stores/             # Pinia状态管理
│   │   ├── index.js
│   │   └── policy.js
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── assets/             # 静态资源
│   │   ├── images/
│   │   └── styles/
│   └── utils/              # 工具函数
│       └── request.js
├── package.json
├── vite.config.js
├── index.html
└── jsconfig.json
```

## package.json

```json
{
  "name": "generated-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

## vite.config.js

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

## jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## 组件模板

### StatusBar.vue

```vue
<template>
  <div class="status-bar">
    <span class="time">{{ time }}</span>
    <div class="icons">
      <span class="signal">📶</span>
      <span class="wifi">📡</span>
      <span class="battery">🔋</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  time: {
    type: String,
    default: '12:00'
  }
});
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
}

.time {
  font-size: 15px;
  font-weight: 600;
}

.icons {
  display: flex;
  gap: 4px;
}
</style>
```

### BottomNav.vue

```vue
<template>
  <div class="bottom-nav">
    <div 
      v-for="item in navItems" 
      :key="item.name"
      class="nav-item"
      :class="{ active: active === item.name }"
      @click="$emit('change', item.name)"
    >
      <span class="icon">{{ item.icon }}</span>
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: String,
    default: 'home'
  }
});

defineEmits(['change']);

const navItems = [
  { name: 'home', label: '首页', icon: '🏠' },
  { name: 'policy', label: '政策', icon: '📋' },
  { name: 'match', label: '匹配', icon: '💕' },
  { name: 'profile', label: '我的', icon: '👤' }
];
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  background: #fff;
  border-top: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
}

.nav-item.active {
  color: #ff6b6b;
}

.icon {
  font-size: 20px;
}

.label {
  font-size: 12px;
}
</style>
```

### SearchBar.vue

```vue
<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>
    <input 
      type="text" 
      :placeholder="placeholder"
      v-model="searchText"
      @input="$emit('search', searchText)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  placeholder: {
    type: String,
    default: '搜索'
  }
});

defineEmits(['search']);

const searchText = ref('');
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 20px;
  margin: 12px 16px;
}

.search-icon {
  margin-right: 8px;
  color: #999;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}
</style>
```

## Store 模板

### stores/index.js

```javascript
import { createPinia } from 'pinia';

export default createPinia();
```

### stores/policy.js

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
  const getPolicyById = computed(() => (id) => {
    return policies.value.find(p => p.id === id);
  });
  
  // Actions
  async function fetchPolicies() {
    loading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      policies.value = [
        { id: 1, title: '军婚家庭专项补贴', content: '每月1000元', icon: '💰' },
        { id: 2, title: '育儿支持', content: '育儿假政策', icon: '👶' }
      ];
    } finally {
      loading.value = false;
    }
  }
  
  function setCurrentPolicy(policy) {
    currentPolicy.value = policy;
  }
  
  return {
    policies,
    currentPolicy,
    loading,
    policyList,
    getPolicyById,
    fetchPolicies,
    setCurrentPolicy
  };
});
```

## 路由模板

### router/index.js

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

## 入口文件

### main.js

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
```

### App.vue

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

#app {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
}
</style>
```

### index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Generated App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```
