---
name: swagger-api-generator
description: 使用Playwright打开Swagger接口文档地址，自动提取接口信息并生成符合Vue3项目规范的API联调代码。当用户需要：(1) 根据Swagger文档生成前端接口代码，(2) 联调后端接口并生成对应API文件，(3) 批量生成接口调用代码时使用此skill。必须使用Playwright工具操作浏览器，绝对不要通过MCP方式打开Swagger链接。
---

# Swagger API 代码生成器

根据Swagger接口文档自动生成符合项目规范的API调用代码。

## 项目接口规范

### 请求封装
- 统一从 `@/utils/request` 导入 `request` 函数
- 请求格式：`request(url, method, data)`
- GET请求通过第三个参数传参
- POST请求通过第三个参数传参（请求体）

### 代码风格
- 使用箭头函数定义API
- 函数名使用 camelCase（小驼峰）
- 添加JSDoc注释说明接口用途
- 路径参数使用模板字符串 `${params.xxx}`

### 示例代码
```javascript
import { request } from '@/utils/request';

// 列表查询 - GET请求
export const getUserList = params => request('/system/user/page', 'get', params);

// 新增 - POST请求
export const createUser = params => request('/system/user/create', 'post', params);

// 详情 - 路径参数
export const getUserDetail = params => request(`/system/user/${params.id}`, 'get');

// 编辑 - POST请求
export const updateUser = params => request('/system/user/update', 'post', params);

// 删除
export const deleteUser = params => request('/system/user/delete', 'post', params);
```

## 工作流程

### 1. 获取Swagger地址
询问用户Swagger接口文档的URL地址。

### 2. 打开Swagger页面
使用 `browser_navigate` 工具打开Swagger地址，等待页面加载完成。

### 3. 询问模块
使用 `AskUserQuestion` 工具询问用户需要联调哪个模块的接口，例如：
- 用户管理
- 组织管理
- 角色管理
- 其他模块...

### 4. 提取接口信息
使用Playwright工具操作Swagger页面：
- 使用 `browser_snapshot` 获取页面结构
- 找到对应模块的接口分组
- 提取接口的以下信息：
  - 接口路径（path）
  - 请求方法（method：get/post/put/delete）
  - 接口名称/描述（summary）
  - 请求参数（parameters）
  - 路径参数（path parameters）

### 5. 生成API代码
根据提取的接口信息，生成符合项目规范的API代码：

```javascript
import { request } from '@/utils/request';

// {接口描述}
export const {函数名} = params => request('{接口路径}', '{请求方法}', params);
```

### 6. 输出代码
将生成的代码输出给用户，并说明如何使用。

## 函数命名规则

根据接口路径和描述生成函数名：

| 接口路径模式 | HTTP方法 | 函数名前缀 | 示例 |
|------------|---------|-----------|------|
| `/xxx/page` 或 `/xxx/list` | GET | `get` | `getUserList` |
| `/xxx/{id}` | GET | `get` | `getUserDetail` |
| `/xxx/create` 或 `/xxx` | POST | `create` | `createUser` |
| `/xxx/update` | POST/PUT | `update` | `updateUser` |
| `/xxx/delete` | POST/DELETE | `delete` | `deleteUser` |
| `/xxx/enable` 或状态相关 | POST | `change` | `changeStatus` |
| `/xxx/tree` | GET | `get` | `getOrgTree` |
| `/xxx/import` | POST | `import` | `importUser` |
| `/xxx/export` | POST | `export` | `exportUser` |

## 完整示例

### 生成的API文件示例

```javascript
import { request } from '@/utils/request';

// 获取用户列表
export const getUserList = params => request('/system/user/page', 'get', params);

// 获取用户详情
export const getUserDetail = params => request(`/system/user/${params.id}`, 'get');

// 新增用户
export const createUser = params => request('/system/user/create', 'post', params);

// 编辑用户
export const updateUser = params => request('/system/user/update', 'post', params);

// 删除用户
export const deleteUser = params => request('/system/user/delete', 'post', params);

// 修改用户状态
export const changeUserStatus = params => request('/system/user/update/status', 'post', params);

// 重置密码
export const resetPassword = params => request('/system/user/update/password', 'post', params);

// 导入用户
export const importUser = params => request('/system/user/batch/importFile', 'post', params);

// 导出用户
export const exportUser = params => request('/system/user/batch/exportFile', 'post', params);
```

## 注意事项

1. **路径处理**：如果接口路径以 `/system` 开头，不需要额外添加前缀（request拦截器会自动处理）
2. **路径参数**：使用模板字符串 `${params.xxx}` 拼接路径参数
3. **请求方法**：统一使用小写（'get', 'post', 'put', 'delete'）
4. **注释规范**：每个接口函数上方添加简洁的中文注释说明接口用途
