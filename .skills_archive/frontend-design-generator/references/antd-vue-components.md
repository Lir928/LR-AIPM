# Ant Design Vue 组件使用指南

## 常用组件使用示例

### 1. 表格组件 (a-table)

#### 1.1 基础表格
```vue
<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
]

const dataSource = ref([
  { key: '1', name: '张三', age: 32 },
  { key: '2', name: '李四', age: 28 }
])

const loading = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`
})

const handleTableChange = (pag, filters, sorter) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // 重新加载数据
}
</script>
```

#### 1.2 带选择功能的表格
```vue
<template>
  <a-table
    :row-selection="rowSelection"
    :columns="columns"
    :data-source="dataSource"
  />
</template>

<script setup>
const selectedRowKeys = ref([])

const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === '禁用用户'
  })
}
</script>
```

### 2. 表单组件 (a-form)

#### 2.1 基础表单
```vue
<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
    @finish="handleFinish"
  >
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="密码" name="password">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 14 }">
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive } from 'vue'

const formState = reactive({
  username: '',
  password: '',
  email: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

const handleFinish = (values) => {
  console.log('表单提交:', values)
}

const resetForm = () => {
  Object.keys(formState).forEach(key => {
    formState[key] = ''
  })
}
</script>
```

#### 2.2 动态表单
```vue
<template>
  <a-form :model="formState">
    <a-form-item
      v-for="(item, index) in formState.items"
      :key="index"
      :label="`项目 ${index + 1}`"
    >
      <a-input v-model:value="item.name" style="width: 60%; margin-right: 8px" />
      <a-button type="danger" @click="removeItem(index)">删除</a-button>
    </a-form-item>
    <a-form-item>
      <a-button type="dashed" @click="addItem">添加项目</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive } from 'vue'

const formState = reactive({
  items: [{ name: '' }]
})

const addItem = () => {
  formState.items.push({ name: '' })
}

const removeItem = (index) => {
  formState.items.splice(index, 1)
}
</script>
```

### 3. 弹窗组件 (a-modal)

#### 3.1 基础弹窗
```vue
<template>
  <a-button type="primary" @click="showModal">打开弹窗</a-button>

  <a-modal
    v-model:open="visible"
    title="标题"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>弹窗内容</p>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const showModal = () => {
  visible.value = true
}

const handleOk = () => {
  console.log('确认')
  visible.value = false
}

const handleCancel = () => {
  console.log('取消')
  visible.value = false
}
</script>
```

#### 3.2 表单弹窗
```vue
<template>
  <a-modal
    v-model:open="visible"
    title="编辑用户"
    @ok="handleOk"
    :confirm-loading="loading"
  >
    <a-form :model="formState" :label-col="{ span: 6 }">
      <a-form-item label="姓名">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="年龄">
        <a-input-number v-model:value="formState.age" :min="0" :max="150" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const loading = ref(false)

const formState = reactive({
  name: '',
  age: 0
})

const handleOk = async () => {
  loading.value = true
  try {
    // 提交表单
    await submitForm(formState)
    visible.value = false
  } finally {
    loading.value = false
  }
}
</script>
```

### 4. 消息提示 (message)

```javascript
import { message } from 'ant-design-vue'

// 成功提示
message.success('操作成功')

// 错误提示
message.error('操作失败')

// 警告提示
message.warning('请注意')

// 信息提示
message.info('提示信息')

// 加载提示
const hide = message.loading('加载中...', 0)
setTimeout(hide, 2500)
```

### 5. 确认对话框 (Modal.confirm)

```javascript
import { Modal } from 'ant-design-vue'

const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${record.name} 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteRecord(record.id)
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}
```

### 6. 下拉选择 (a-select)

```vue
<template>
  <a-select
    v-model:value="selectedValue"
    style="width: 200px"
    placeholder="请选择"
    :options="options"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref(undefined)

const options = ref([
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' }
])

const handleChange = (value) => {
  console.log('选中值:', value)
}
</script>
```

### 7. 日期选择 (a-date-picker)

```vue
<template>
  <a-date-picker
    v-model:value="dateValue"
    format="YYYY-MM-DD"
    placeholder="选择日期"
    @change="handleDateChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const dateValue = ref(null)

const handleDateChange = (date, dateString) => {
  console.log('日期对象:', date)
  console.log('日期字符串:', dateString)
}
</script>
```

### 8. 上传组件 (a-upload)

```vue
<template>
  <a-upload
    :action="uploadUrl"
    :headers="headers"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      点击上传
    </a-button>
  </a-upload>
</template>

<script setup>
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'

const uploadUrl = ref('/api/upload')
const headers = ref({
  Authorization: 'Bearer token'
})

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleChange = (info) => {
  if (info.file.status === 'done') {
    message.success('上传成功')
  } else if (info.file.status === 'error') {
    message.error('上传失败')
  }
}
</script>
```

### 9. 标签页 (a-tabs)

```vue
<template>
  <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
    <a-tab-pane key="1" tab="标签1">
      内容1
    </a-tab-pane>
    <a-tab-pane key="2" tab="标签2">
      内容2
    </a-tab-pane>
    <a-tab-pane key="3" tab="标签3" disabled>
      内容3
    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
import { ref } from 'vue'

const activeKey = ref('1')

const handleTabChange = (key) => {
  console.log('切换到标签:', key)
}
</script>
```

### 10. 分页组件 (a-pagination)

```vue
<template>
  <a-pagination
    v-model:current="current"
    v-model:page-size="pageSize"
    :total="total"
    :show-size-changer="true"
    :show-quick-jumper="true"
    :show-total="(total) => `共 ${total} 条`"
    @change="handlePageChange"
  />
</template>

<script setup>
import { ref } from 'vue'

const current = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handlePageChange = (page, size) => {
  console.log('页码:', page, '每页条数:', size)
}
</script>
```

## 组件配置规范

### 1. 全局配置

```javascript
// main.js
import { ConfigProvider } from 'ant-design-vue'

app.use(ConfigProvider, {
  theme: {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4
    }
  }
})
```

### 2. 主题定制

```vue
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1890ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        fontSize: 14,
        borderRadius: 4
      }
    }"
  >
    <App />
  </a-config-provider>
</template>
```

### 3. 国际化

```javascript
import zhCN from 'ant-design-vue/es/locale/zh_CN'

app.use(ConfigProvider, {
  locale: zhCN
})
```

## 最佳实践

1. **按需引入**：使用 unplugin-vue-components 自动引入组件
2. **表单验证**：使用 rules 进行表单验证
3. **响应式布局**：使用栅格系统 (a-row, a-col)
4. **加载状态**：使用 loading 属性显示加载状态
5. **错误处理**：使用 message 显示错误信息
6. **性能优化**：虚拟滚动处理大数据量表格
7. **样式定制**：使用 ConfigProvider 统一主题
8. **组件封装**：封装常用组件提高复用性
