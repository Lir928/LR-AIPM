# Vue 3 最佳实践

## Composition API 使用规范

### 1. script setup 语法

```vue
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const user = reactive({
  name: '',
  age: 0
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 2. 组件设计模式

#### 2.1 单一职责原则
- 每个组件只负责一个功能
- 组件名称应清晰表达其用途
- 避免组件过于复杂，必要时拆分

#### 2.2 Props 定义规范
```javascript
const props = defineProps({
  // 基础类型检查
  title: String,
  // 多种类型
  value: [String, Number],
  // 必填字段
  userId: {
    type: Number,
    required: true
  },
  // 带默认值
  pageSize: {
    type: Number,
    default: 10
  },
  // 自定义验证
  email: {
    type: String,
    validator: (value) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  }
})
```

#### 2.3 Emits 定义规范
```javascript
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// 使用
const handleSubmit = () => {
  emit('submit', formData.value)
}
```

### 3. 响应式数据管理

#### 3.1 ref vs reactive
- **ref**: 用于基本类型、需要重新赋值的对象
- **reactive**: 用于对象、数组，不需要重新赋值

```javascript
// 推荐：基本类型使用 ref
const count = ref(0)
const loading = ref(false)

// 推荐：对象使用 reactive
const form = reactive({
  username: '',
  password: ''
})

// 注意：解构 reactive 会丢失响应性
// 错误
const { username } = form

// 正确：使用 toRefs
import { toRefs } from 'vue'
const { username } = toRefs(form)
```

#### 3.2 计算属性
```javascript
// 只读计算属性
const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`
})

// 可写计算属性
const fullName = computed({
  get() {
    return `${user.value.firstName} ${user.value.lastName}`
  },
  set(value) {
    const [firstName, lastName] = value.split(' ')
    user.value.firstName = firstName
    user.value.lastName = lastName
  }
})
```

### 4. 生命周期钩子

```javascript
import { onMounted, onUpdated, onUnmounted, onBeforeMount } from 'vue'

onBeforeMount(() => {
  // 组件挂载前
})

onMounted(() => {
  // 组件挂载后，可以访问 DOM
})

onUpdated(() => {
  // 组件更新后
})

onUnmounted(() => {
  // 组件卸载前，清理工作
  // 清除定时器、事件监听器等
})
```

### 5. 组件通信

#### 5.1 父子组件通信
```vue
<!-- 父组件 -->
<template>
  <ChildComponent
    :message="parentMessage"
    @update="handleUpdate"
  />
</template>

<!-- 子组件 -->
<script setup>
const props = defineProps(['message'])
const emit = defineEmits(['update'])
</script>
```

#### 5.2 v-model 双向绑定
```vue
<!-- 父组件 -->
<ChildComponent v-model:title="pageTitle" />

<!-- 子组件 -->
<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['update:title'])

const updateTitle = (newTitle) => {
  emit('update:title', newTitle)
}
</script>
```

#### 5.3 Provide/Inject
```javascript
// 父组件
import { provide } from 'vue'
provide('theme', 'dark')

// 子组件
import { inject } from 'vue'
const theme = inject('theme')
```

### 6. 组件复用

#### 6.1 Composables
```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    increment,
    decrement,
    doubleCount
  }
}

// 使用
import { useCounter } from './useCounter'

const { count, increment, decrement, doubleCount } = useCounter(10)
```

### 7. 性能优化

#### 7.1 v-memo
```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    {{ item.name }}
  </div>
</template>
```

#### 7.2 v-once
```vue
<template>
  <div v-once>
    {{ staticContent }}
  </div>
</template>
```

#### 7.3 异步组件
```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)
```

### 8. 样式处理

#### 8.1 Scoped CSS
```vue
<style scoped>
.container {
  padding: 20px;
}
</style>
```

#### 8.2 CSS Modules
```vue
<template>
  <div :class="$style.container">
    Content
  </div>
</template>

<style module>
.container {
  padding: 20px;
}
</style>
```

### 9. TypeScript 支持

```vue
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

const user = ref<User>({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}>()
</script>
```

### 10. 最佳实践总结

1. **使用 `<script setup>`**：更简洁的语法
2. **合理使用 ref 和 reactive**：根据场景选择
3. **组件拆分**：保持组件简单和可维护
4. **Props 验证**：定义清晰的 props 类型
5. **事件命名**：使用 kebab-case
6. **避免直接修改 props**：使用 emit 通知父组件
7. **使用 Composables**：复用逻辑代码
8. **性能优化**：合理使用 v-memo、v-once 等
9. **TypeScript**：提供类型安全
10. **代码组织**：按功能组织代码，保持清晰结构
