# 前端详细设计文档模板

## 文档结构说明

本文档是前端详细设计文档的标准模板，包含所有必需章节和内容规范。每个功能模块的设计文档都应遵循此结构。

---

# [模块名称] 详细设计文档

## 1. 模块概述

### 1.1 模块信息
- **模块名称**: [模块名称]
- **模块编号**: [模块编号，如：M001]
- **版本**: [版本号，如：v1.0]
- **创建日期**: [YYYY-MM-DD]
- **负责人**: [负责人姓名]

### 1.2 功能描述
[简要描述模块的主要功能和业务目标]

### 1.3 业务价值
[说明该模块为用户带来的价值和解决的问题]

### 1.4 依赖关系
- **前置依赖**: [依赖的其他模块或服务]
- **被依赖模块**: [依赖此模块的其他模块]
- **外部依赖**: [依赖的外部API或服务]

### 1.5 技术栈
- **框架**: Vue 3
- **UI组件库**: Ant Design Vue 4.x
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **构建工具**: Vite

---

## 2. 页面布局设计

### 2.1 整体布局
```
[使用ASCII或Mermaid图示展示页面整体布局结构]

示例：
┌─────────────────────────────────────────┐
│           页面标题区                      │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────────────────┐  │
│  │  侧边栏  │  │     主内容区         │  │
│  │         │  │                     │  │
│  │  导航   │  │  ┌───────────────┐  │  │
│  │  菜单   │  │  │   表格/表单    │  │  │
│  │         │  │  └───────────────┘  │  │
│  └─────────┘  └─────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2.2 布局组件
- **外层容器**: [使用的布局组件，如：a-layout]
- **侧边栏**: [侧边栏组件和宽度]
- **内容区**: [内容区组件和布局]
- **页脚**: [页脚组件（如有）]

### 2.3 响应式设计
- **桌面端**: [≥1200px 的布局说明]
- **平板端**: [768px-1199px 的布局说明]
- **移动端**: [<768px 的布局说明]

### 2.4 关键区域尺寸
- **页面宽度**: [最小/最大宽度]
- **侧边栏宽度**: [固定/自适应宽度]
- **内容区宽度**: [计算方式]
- **间距规范**: [各区域间距]

---

## 3. 组件设计

### 3.1 组件层次结构
```
[使用树状图展示组件层次]

示例：
Page (页面组件)
├── Header (头部组件)
├── Sidebar (侧边栏组件)
├── Content (内容区组件)
│   ├── SearchBar (搜索栏组件)
│   ├── DataTable (数据表格组件)
│   └── Pagination (分页组件)
└── Footer (页脚组件)
```

### 3.2 核心组件设计

#### 3.2.1 [组件名称1]
**组件职责**: [组件的主要职责]

**Props定义**:
```typescript
interface Props {
  // 属性名: 类型 - 说明
  title: string        // 标题
  data: DataType[]     // 数据列表
  loading: boolean     // 加载状态
  pageSize: number     // 每页条数
}
```

**Events定义**:
```typescript
interface Emits {
  // 事件名: 参数 - 说明
  (e: 'update', value: string): void  // 更新事件
  (e: 'delete', id: number): void     // 删除事件
}
```

**Slots定义**:
```typescript
// 插槽名称 - 说明
// default: 默认内容
// header: 头部内容
// footer: 底部内容
```

**复用组件**: [引用的现有组件]

#### 3.2.2 [组件名称2]
[重复上述结构]

### 3.3 组件通信方式
- **父子通信**: [props/emit]
- **跨组件通信**: [provide/inject 或 Pinia]
- **事件总线**: [如使用mitt等]

---

## 4. 数据流设计

### 4.1 状态管理 (Pinia Store)

#### 4.1.1 Store定义
```typescript
// stores/[moduleName].ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const use[ModuleName]Store = defineStore('[moduleName]', () => {
  // State
  const dataList = ref<DataType[]>([])
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // Getters
  const totalCount = computed(() => pagination.value.total)

  // Actions
  const fetchData = async (params: any) => {
    loading.value = true
    try {
      const res = await api.getDataList(params)
      dataList.value = res.data.list
      pagination.value.total = res.data.total
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item: DataType) => {
    await api.addItem(item)
    await fetchData()
  }

  const updateItem = async (id: number, item: DataType) => {
    await api.updateItem(id, item)
    await fetchData()
  }

  const deleteItem = async (id: number) => {
    await api.deleteItem(id)
    await fetchData()
  }

  return {
    dataList,
    loading,
    pagination,
    totalCount,
    fetchData,
    addItem,
    updateItem,
    deleteItem
  }
})
```

### 4.2 API接口定义

#### 4.2.1 接口列表
| 接口名称 | 请求方式 | 路径 | 说明 |
|---------|---------|------|------|
| 获取列表 | GET | /api/[module]/list | 获取数据列表 |
| 获取详情 | GET | /api/[module]/detail/:id | 获取单条详情 |
| 新增 | POST | /api/[module]/add | 新增数据 |
| 修改 | PUT | /api/[module]/update/:id | 修改数据 |
| 删除 | DELETE | /api/[module]/delete/:id | 删除数据 |

#### 4.2.2 请求参数
```typescript
// 获取列表参数
interface ListParams {
  pageNum: number
  pageSize: number
  keyword?: string
  [key: string]: any
}

// 新增/修改参数
interface FormData {
  name: string
  age: number
  email: string
  [key: string]: any
}
```

#### 4.2.3 响应数据
```typescript
// 列表响应
interface ListResponse {
  code: number
  message: string
  data: {
    list: DataType[]
    total: number
  }
}

// 详情响应
interface DetailResponse {
  code: number
  message: string
  data: DataType
}
```

### 4.3 数据流向图
```
[使用Mermaid图示展示数据流向]

示例：
用户操作 → 组件事件 → Store Action → API请求 → 后端处理
                                              ↓
Store State ← 响应数据 ← API响应 ← ← ← ← ← ← ←
     ↓
组件渲染 ← 响应式数据 ← ← ← ← ← ← ← ← ← ← ← ←
```

### 4.4 表单验证规则
```typescript
const rules = {
  // 字段名: 验证规则
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}
```

---

## 5. 交互设计

### 5.1 用户操作流程
```
[使用流程图展示主要操作流程]

示例：
开始 → 打开页面 → 加载数据 → 显示列表
                    ↓
              点击新增按钮 → 打开弹窗 → 填写表单 → 提交 → 刷新列表
                    ↓
              点击编辑按钮 → 打开弹窗 → 修改数据 → 提交 → 刷新列表
                    ↓
              点击删除按钮 → 确认对话框 → 确认 → 删除 → 刷新列表
```

### 5.2 交互反馈机制

#### 5.2.1 Loading状态
- **页面加载**: [全屏loading或骨架屏]
- **表格加载**: [表格内部loading]
- **按钮加载**: [按钮loading状态]

#### 5.2.2 成功反馈
```javascript
// 操作成功提示
message.success('操作成功')
```

#### 5.2.3 错误反馈
```javascript
// 操作失败提示
message.error('操作失败，请重试')

// 表单验证错误
// Ant Design Vue自动显示
```

#### 5.2.4 警告反馈
```javascript
// 警告提示
message.warning('请注意')
```

### 5.3 动画和过渡效果
- **页面切换**: [过渡动画类型和时长]
- **弹窗打开/关闭**: [动画效果]
- **列表加载**: [动画效果]
- **按钮点击**: [反馈效果]

### 5.4 异常处理流程
```
[使用流程图展示异常处理]

示例：
API请求失败 → 检查错误类型
                    ↓
              网络错误 → 提示网络异常 → 重试按钮
                    ↓
              业务错误 → 提示错误信息 → 关闭弹窗
                    ↓
              未知错误 → 提示系统错误 → 联系管理员
```

---

## 6. 样式规范

### 6.1 主题色和配色方案
```less
// 主题色
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #ff4d4f;
@info-color: #1890ff;

// 中性色
@text-color: rgba(0, 0, 0, 0.85);
@text-color-secondary: rgba(0, 0, 0, 0.65);
@border-color: #d9d9d9;
@background-color: #f0f2f5;
```

### 6.2 字体和排版
```less
// 字体
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif;

// 字号
@font-size-base: 14px;
@font-size-lg: 16px;
@font-size-sm: 12px;

// 行高
@line-height-base: 1.5715;
```

### 6.3 间距和布局
```less
// 间距
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;

// 布局
@layout-header-height: 64px;
@layout-footer-height: 48px;
@layout-sider-width: 256px;
```

### 6.4 Less/CSS类命名规范
- **BEM命名法**: `.block__element--modifier`
- **语义化命名**: 使用有意义的类名
- **避免过度嵌套**: 最多3层嵌套

```less
// 示例
.user-list {
  &__header {
    margin-bottom: @spacing-md;
  }

  &__table {
    margin-top: @spacing-sm;
  }

  &__item {
    &--active {
      color: @primary-color;
    }
  }
}
```

---

## 7. 代码实现指导

### 7.1 文件结构建议
```
src/views/[module]/
├── index.vue              # 主页面
├── components/            # 组件目录
│   ├── SearchBar.vue     # 搜索栏
│   ├── DataTable.vue     # 数据表格
│   └── FormModal.vue     # 表单弹窗
├── hooks/                 # 组合式函数
│   └── useTable.ts       # 表格逻辑
└── types/                 # 类型定义
    └── index.ts          # 类型定义

src/api/[module].ts        # API接口
src/stores/[module].ts     # Pinia Store
```

### 7.2 关键代码示例

#### 7.2.1 主页面组件
```vue
<template>
  <div class="[module]-page">
    <SearchBar @search="handleSearch" />
    <DataTable
      :data="store.dataList"
      :loading="store.loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <Pagination
      v-model:current="store.pagination.current"
      v-model:page-size="store.pagination.pageSize"
      :total="store.pagination.total"
      @change="store.fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { use[ModuleName]Store } from '@/stores/[module]'
import SearchBar from './components/SearchBar.vue'
import DataTable from './components/DataTable.vue'

const store = use[ModuleName]Store()

onMounted(() => {
  store.fetchData()
})

const handleSearch = (params: any) => {
  store.fetchData(params)
}

const handleEdit = (record: DataType) => {
  // 打开编辑弹窗
}

const handleDelete = (id: number) => {
  // 删除确认
}
</script>

<style scoped lang="less">
.[module]-page {
  padding: @spacing-md;
}
</style>
```

#### 7.2.2 API接口封装
```typescript
// api/[module].ts
import request from '@/utils/request'

export const api = {
  // 获取列表
  getList: (params: ListParams) => {
    return request.get<ListResponse>('/api/[module]/list', { params })
  },

  // 获取详情
  getDetail: (id: number) => {
    return request.get<DetailResponse>(`/api/[module]/detail/${id}`)
  },

  // 新增
  add: (data: FormData) => {
    return request.post('/api/[module]/add', data)
  },

  // 修改
  update: (id: number, data: FormData) => {
    return request.put(`/api/[module]/update/${id}`, data)
  },

  // 删除
  delete: (id: number) => {
    return request.delete(`/api/[module]/delete/${id}`)
  }
}
```

### 7.3 注意事项和最佳实践

1. **组件拆分**: 保持组件单一职责，避免组件过大
2. **代码复用**: 使用Composables复用逻辑代码
3. **类型安全**: 使用TypeScript提供类型检查
4. **错误处理**: 统一的错误处理机制
5. **性能优化**: 合理使用computed、watch等
6. **代码规范**: 遵循ESLint和Prettier规范
7. **注释规范**: 关键逻辑添加注释说明
8. **命名规范**: 使用有意义的变量和函数名

### 7.4 测试要点

#### 7.4.1 单元测试
- [ ] 组件渲染测试
- [ ] Props传递测试
- [ ] Events触发测试
- [ ] 计算属性测试
- [ ] 方法调用测试

#### 7.4.2 集成测试
- [ ] 页面加载测试
- [ ] 表单提交测试
- [ ] 数据加载测试
- [ ] 错误处理测试

#### 7.4.3 E2E测试
- [ ] 完整业务流程测试
- [ ] 跨页面交互测试
- [ ] 异常场景测试

---

## 8. 附录

### 8.1 术语表
| 术语 | 说明 |
|-----|------|
| [术语1] | [说明] |
| [术语2] | [说明] |

### 8.2 参考文档
- [Vue 3官方文档](https://vuejs.org/)
- [Ant Design Vue文档](https://antdv.com/)
- [Pinia文档](https://pinia.vuejs.org/)
- [项目内部文档链接]

### 8.3 变更记录
| 版本 | 日期 | 变更内容 | 变更人 |
|-----|------|---------|--------|
| v1.0 | 2024-01-01 | 初始版本 | [姓名] |

---

**文档结束**
