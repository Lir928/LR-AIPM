---
name: modal-style-guide
description: 提供 Modal 弹窗样式设计规范，包括滚动行为、尺寸控制、布局结构等最佳实践。当用户开发或修改 Modal 弹窗组件、询问弹窗样式问题、或需要弹窗代码模板时触发。
---

# Modal 弹窗样式设计规范

## 概述

本文档总结了项目中 Modal 弹窗的样式设计规范，包括滚动行为、尺寸控制、布局结构等最佳实践。

## 核心原则

### 1. 滚动行为规范

#### 1.1 Modal 容器不滚动，内容区域滚动

**原则**: Modal 弹窗本身（`.ant-modal`）不应该有滚动条，只有内容区域（`.ant-modal-body`）在内容超出时才显示滚动条。

**实现方式**:

```vue
<a-modal
  v-model:open="visible"
  :title="标题"
  width="600px"
  :bodyStyle="{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }"
>
  <!-- 内容 -->
</a-modal>
```

**样式配置**:

```less
:deep(.modal-wrapper) {
  .ant-modal {
    // Modal 容器不滚动
    overflow: hidden;
  }

  .ant-modal-content {
    // 内容容器固定高度或最大高度
    max-height: 90vh;
    overflow: hidden;
  }

  .ant-modal-body {
    // 内容区域可滚动
    max-height: calc(90vh - 120px); // 减去 header 和 footer 高度
    overflow-y: auto;
    padding: 24px;
  }
}
```

#### 1.2 禁止页面滚动

**原则**: Modal 打开时，禁止页面滚动；Modal 关闭时，恢复页面滚动。

**实现方式**:

```javascript
import { watch } from 'vue';

const visible = ref(false);

watch(visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时，禁止页面滚动
    document.body.style.overflow = 'hidden';
  } else {
    // 弹窗关闭时，恢复页面滚动
    document.body.style.overflow = '';
  }
});
```

**样式配置**:

```less
body.modal-open {
  overflow: hidden !important;
}
```

### 2. 尺寸控制规范

#### 2.1 宽度规范

| 场景 | 宽度 | 说明 |
|------|------|------|
| 小型表单 | 400px - 500px | 简单表单、确认对话框 |
| 中型表单 | 500px - 700px | 标准表单、详情展示 |
| 大型表单 | 700px - 900px | 复杂表单、表格展示 |
| 超大弹窗 | 900px - 1200px | 复杂表格、多步骤表单 |

**示例**:

```vue
<!-- 小型表单 -->
<a-modal width="480px">

<!-- 中型表单 -->
<a-modal width="600px">

<!-- 大型表单 -->
<a-modal width="800px">

<!-- 超大弹窗 -->
<a-modal width="1080px">
```

#### 2.2 高度规范

| 场景 | 高度 | 说明 |
|------|------|------|
| 固定高度 | 600px - 800px | 内容固定，如 IM 聊天窗口 |
| 最大高度 | 70vh - 90vh | 内容可变，自适应屏幕 |
| 自适应高度 | auto | 根据内容自动调整 |

**示例**:

```vue
<!-- 固定高度 -->
<a-modal :bodyStyle="{ height: '800px', overflow: 'hidden' }">

<!-- 最大高度 -->
<a-modal :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto' }">

<!-- 自适应高度 -->
<a-modal>
```

### 3. 布局结构规范

#### 3.1 标准布局

```
.ant-modal-wrap (overflow: hidden)
└── .ant-modal (fixed, centered)
    └── .ant-modal-content (max-height: 90vh, overflow: hidden)
        ├── .ant-modal-header (fixed height: 55px)
        ├── .ant-modal-body (flex: 1, overflow-y: auto)
        └── .ant-modal-footer (fixed height: 53px)
```

**使用 `:centered="true"` 实现垂直居中**:

```vue
<a-modal
  v-model:open="visible"
  title="弹窗标题"
  width="600px"
  :centered="true"
  :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
>
  <!-- 内容 -->
</a-modal>
```

**样式配置**:

```less
:deep(.modal-wrapper) {
  .ant-modal {
    padding: 0;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .ant-modal-header {
    flex-shrink: 0;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .ant-modal-footer {
    flex-shrink: 0;
    padding: 10px 16px;
    border-top: 1px solid #f0f0f0;
  }
}
```

#### 3.2 复杂布局（带侧边栏）

```
.ant-modal-body
├── .modal-sidebar (fixed width: 200px, overflow-y: auto)
└── .modal-main (flex: 1, overflow-y: auto)
```

**样式配置**:

```less
:deep(.modal-wrapper) {
  .ant-modal-body {
    display: flex;
    padding: 0;
    height: 600px;
    overflow: hidden;

    .modal-sidebar {
      width: 200px;
      border-right: 1px solid #f0f0f0;
      overflow-y: auto;
      padding: 16px;
    }

    .modal-main {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
  }
}
```

### 4. 滚动条样式规范

#### 4.1 标准滚动条

```less
:deep(.modal-wrapper) {
  .ant-modal-body::-webkit-scrollbar {
    width: 6px;
  }

  .ant-modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .ant-modal-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .ant-modal-body::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
}
```

#### 4.2 隐藏滚动条（保留滚动功能）

```less
:deep(.modal-wrapper) {
  .ant-modal-body {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }

  .ant-modal-body::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
}
```

### 5. 响应式设计规范

#### 5.1 移动端适配

```less
@media (max-width: 768px) {
  :deep(.modal-wrapper) {
    .ant-modal {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      top: 0 !important;
      left: 0 !important;
      transform: none !important;
    }

    .ant-modal-content {
      height: 100vh !important;
      max-height: 100vh !important;
      border-radius: 0 !important;
    }
  }
}
```

#### 5.2 平板适配

```less
@media (min-width: 769px) and (max-width: 1024px) {
  :deep(.modal-wrapper) {
    .ant-modal {
      width: 90% !important;
      max-width: 800px !important;
    }
  }
}
```

### 6. 性能优化规范

#### 6.1 使用 transform 定位

**推荐方式**: 使用 Ant Design Vue 提供的 `:centered="true"` 属性

```vue
<a-modal
  v-model:open="visible"
  title="弹窗标题"
  width="600px"
  :centered="true"
>
  <!-- 内容 -->
</a-modal>
```

**备选方式**: 使用 CSS transform 进行定位

```less
:deep(.modal-wrapper) {
  .ant-modal {
    // 使用 transform 进行定位，性能更好
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
```

#### 6.2 使用 overflow: hidden 而非 position: fixed

```less
// 推荐：使用 overflow: hidden
body.modal-open {
  overflow: hidden !important;
}

// 不推荐：使用 position: fixed（会导致页面跳动）
body.modal-open {
  position: fixed;
  width: 100%;
}
```

#### 6.3 及时清理样式

```javascript
watch(visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  } else {
    // 及时清理样式
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
  }
});
```

### 7. 常见场景规范

#### 7.1 表单弹窗

```vue
<a-modal
  v-model:open="visible"
  title="表单标题"
  width="600px"
  :centered="true"
  :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto' }"
  @ok="handleOk"
>
  <a-form layout="vertical">
    <!-- 表单内容 -->
  </a-form>
</a-modal>
```

#### 7.2 表格弹窗

```vue
<a-modal
  v-model:open="visible"
  title="表格标题"
  width="1080px"
  :bodyStyle="{ height: '600px', overflow: 'hidden' }"
>
  <div class="modal-content">
    <div class="modal-search">
      <!-- 搜索区域 -->
    </div>
    <div class="modal-table">
      <a-table :scroll="{ y: 400 }">
        <!-- 表格内容 -->
      </a-table>
    </div>
  </div>
</a-modal>

<style lang="less" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-search {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-table {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}
</style>
```

#### 7.3 详情弹窗

```vue
<a-modal
  v-model:open="visible"
  title="详情标题"
  width="800px"
  :centered="true"
  :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
  :footer="null"
>
  <a-descriptions bordered :column="2">
    <!-- 详情内容 -->
  </a-descriptions>
</a-modal>
```

#### 7.4 固定高度弹窗（如 IM 聊天）

```vue
<a-modal
  v-model:open="visible"
  :footer="null"
  :closable="false"
  width="900px"
  :centered="true"
  :maskClosable="false"
  wrap-class-name="im-modal-wrapper"
  :bodyStyle="{ padding: 0, height: '800px', overflow: 'hidden' }"
>
  <IMComponent />
</a-modal>

<style lang="less" scoped>
:deep(.im-modal-wrapper) {
  .ant-modal {
    padding: 0;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
    height: 800px;
    max-height: 800px;
  }

  .ant-modal-body {
    padding: 0;
    height: 800px;
    overflow: hidden;
  }
}
</style>
```

### 8. 最佳实践总结

#### 8.1 必须遵守的原则

1. ✅ Modal 容器不滚动，只有内容区域滚动
2. ✅ Modal 打开时禁止页面滚动，关闭时恢复
3. ✅ 使用 `max-height` 而非固定 `height`（除非有特殊需求）
4. ✅ 使用 `overflow-y: auto` 而非 `overflow: auto`（避免水平滚动）
5. ✅ 使用 `:centered="true"` 属性或 `transform: translate(-50%, -50%)` 进行垂直居中
6. ✅ 及时清理样式，避免内存泄漏

#### 8.2 推荐的做法

1. ✅ 使用 `:bodyStyle` 属性设置 body 样式
2. ✅ 使用 `wrap-class-name` 自定义包裹层 class
3. ✅ 使用 `:deep()` 修改 Ant Design 组件样式
4. ✅ 使用 `:centered="true"` 实现弹窗垂直居中
5. ✅ 使用 `flex` 布局实现复杂结构
6. ✅ 使用 `calc()` 计算高度（考虑 header 和 footer）
7. ✅ 添加滚动条样式，提升用户体验

#### 8.3 不推荐的做法

1. ❌ 使用 `position: fixed` 禁止页面滚动（会导致页面跳动）
2. ❌ 使用 `overflow: auto`（可能导致水平滚动）
3. ❌ 使用固定 `height`（内容少时留白过多）
4. ❌ 直接修改 `.ant-modal` 样式（影响全局）
5. ❌ 忘记清理样式（导致样式污染）
6. ❌ 使用 `!important` 覆盖样式（除非必要）

### 9. 代码模板

#### 9.1 标准表单弹窗模板

```vue
<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    width="600px"
    :centered="true"
    :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto' }"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <!-- 表单内容 -->
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';

const visible = ref(false);
const loading = ref(false);
const formRef = ref();

const formState = ref({});

// 监听弹窗状态，控制页面滚动
watch(visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const handleOk = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;
    // 提交逻辑
    visible.value = false;
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-modal-body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.ant-modal-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.ant-modal-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.ant-modal-body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}
</style>
```

#### 9.2 标准表格弹窗模板

```vue
<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    width="1080px"
    :centered="true"
    :bodyStyle="{ height: '600px', overflow: 'hidden' }"
    @cancel="handleCancel"
    :footer="null"
  >
    <div class="modal-content">
      <div class="modal-search">
        <a-form layout="inline">
          <!-- 搜索表单 -->
        </a-form>
      </div>
      <div class="modal-table">
        <a-table
          :scroll="{ y: 400 }"
          :dataSource="dataSource"
          :columns="columns"
        >
          <!-- 表格内容 -->
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';

const visible = ref(false);
const dataSource = ref([]);
const columns = ref([]);

// 监听弹窗状态，控制页面滚动
watch(visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="less" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-search {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-table {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

:deep(.ant-table-body)::-webkit-scrollbar {
  width: 6px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
```

### 10. 检查清单

在开发 Modal 弹窗时，请检查以下项目：

- [ ] Modal 容器不滚动（`.ant-modal` 无滚动条）
- [ ] 内容区域可滚动（`.ant-modal-body` 有滚动条）
- [ ] Modal 打开时禁止页面滚动
- [ ] Modal 关闭时恢复页面滚动
- [ ] 使用 `max-height` 或固定 `height`
- [ ] 使用 `overflow-y: auto` 而非 `overflow: auto`
- [ ] 使用 `:centered="true"` 或 `transform` 进行垂直居中
- [ ] 及时清理样式
- [ ] 添加滚动条样式
- [ ] 响应式适配（移动端、平板）
- [ ] 性能优化（避免重排重绘）

## 更新日志

### v1.1.0 (2026-03-05)
- ✅ 添加 `:centered="true"` 属性作为弹窗垂直居中的推荐方式
- ✅ 更新所有代码示例，添加 `:centered="true"` 属性
- ✅ 更新布局结构规范，添加居中实现示例
- ✅ 更新最佳实践总结和检查清单

### v1.0.0 (2026-03-05)
- ✅ 初始版本
- ✅ 总结滚动行为规范
- ✅ 总结尺寸控制规范
- ✅ 总结布局结构规范
- ✅ 总结滚动条样式规范
- ✅ 总结响应式设计规范
- ✅ 总结性能优化规范
- ✅ 提供常见场景示例
- ✅ 提供代码模板
- ✅ 提供检查清单

