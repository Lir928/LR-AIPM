# 原型文件读取 Skill

## 简介

这是一个使用 chrome-devtools-mcp 工具读取原型文件(如墨刀Modao原型、腾讯CoDesign原型)并生成Vue组件代码的Skill。

## 功能特性

- 🌐 支持读取在线原型工具(墨刀、腾讯CoDesign、Figma等)的设计稿
- 📊 自动提取页面结构、表单元素、表格数据
- 💻 生成完整的Vue 3组件代码
- 🎨 支持Ant Design Vue组件库
- 📱 响应式设计支持
- 🔧 可自定义代码生成逻辑
- 🔐 支持密码保护的原型访问

## 快速开始

### 1. 前置条件

确保已安装并启动 chrome-devtools-mcp 服务:

```bash
# 安装 chrome-devtools-mcp
npm install -g chrome-devtools-mcp

# 启动服务
npx chrome-devtools-mcp
```

### 2. 使用Skill

在支持MCP的环境中激活此Skill:

```
激活技能: prototype-reader
```

### 3. 调用示例

#### 示例1: 读取墨刀原型

```
请使用 prototype-reader 读取墨刀原型地址 https://modao.cc/proto/qK6NsVt9lvnncIHnryM/sharing?view_mode=read_only 并生成页面代码
```

#### 示例2: 读取腾讯CoDesign原型

```
请使用 prototype-reader 读取腾讯CoDesign原型地址 https://codesign.qq.com/s/649970237319716，访问密码是 6JYU
```

## 使用场景

### 场景1: 从墨刀原型生成Vue页面

```javascript
// 1. 打开墨刀原型页面
await new_page({
  url: 'https://modao.cc/proto/qK6NsVt9lvnncIHnryM/sharing?view_mode=read_only',
});

// 2. 等待页面加载
await wait_for({ text: '页面标题', timeout: 15000 });

// 3. 提取页面结构
const structure = await extractPageStructure();

// 4. 生成Vue代码
const vueCode = generateVueCode(structure, '我的页面');

// 5. 保存代码
await builtin_create_new_file({
  filepath: 'src/views/my-page/index.vue',
  contents: vueCode,
});
```

### 场景2: 从腾讯CoDesign原型生成Vue页面

```javascript
// 1. 打开腾讯CoDesign原型页面
await new_page({
  url: 'https://codesign.qq.com/s/649970237319716',
});

// 2. 等待密码输入框出现
await wait_for({ text: '访问密码', timeout: 10000 });

// 3. 输入密码
const passwordInput = await evaluate_script({
  function: "() => document.querySelector('input[type=\"password\"]')"
});
if (passwordInput) {
  await fill({ uid: passwordInput.uid, value: '6JYU' });
  await press_key({ key: 'Enter' });
}

// 4. 等待原型加载完成
await wait_for({ text: '原型内容', timeout: 15000 });

// 5. 提取页面结构
const structure = await extractPageStructure();

// 6. 生成Vue代码
const vueCode = generateVueCode(structure, '腾讯CoDesign原型');

// 7. 保存代码
await builtin_create_new_file({
  filepath: 'src/views/codesign-page/index.vue',
  contents: vueCode,
});
```

### 场景3: 批量处理多个原型页面

```javascript
const prototypeUrls = [
  'https://modao.cc/proto/xxx/page1',
  'https://modao.cc/proto/xxx/page2',
  'https://modao.cc/proto/xxx/page3',
];

for (let i = 0; i < prototypeUrls.length; i++) {
  await new_page({ url: prototypeUrls[i] });
  await wait_for({ text: '加载完成', timeout: 15000 });

  const structure = await extractPageStructure();
  const vueCode = generateVueCode(structure, `页面${i + 1}`);

  await builtin_create_new_file({
    filepath: `src/views/page${i + 1}/index.vue`,
    contents: vueCode,
  });
}
```

## 工具说明

### 可用的浏览器工具

| 工具              | 说明         | 示例                                                         |
| ----------------- | ------------ | ------------------------------------------------------------ |
| `new_page`        | 打开新页面   | `new_page({ url: 'https://example.com' })`                   |
| `navigate_page`   | 导航到URL    | `navigate_page({ type: 'url', url: 'https://example.com' })` |
| `take_snapshot`   | 获取页面快照 | `take_snapshot()`                                            |
| `evaluate_script` | 执行JS代码   | `evaluate_script({ function: "() => document.title" })`      |
| `wait_for`        | 等待文本出现 | `wait_for({ text: '加载完成', timeout: 10000 })`             |
| `take_screenshot` | 截取截图     | `take_screenshot({ fullPage: true })`                        |
| `fill`            | 填写表单     | `fill({ uid: 'xxx', value: '内容' })`                        |
| `press_key`       | 按键         | `press_key({ key: 'Enter' })`                                |

## 提取的页面元素

### 1. 容器元素

- `.container`, `.section`, `.module`, `.page`, `.screen`
- 包含ID、标签名、文本内容、子元素信息

### 2. 表单元素

- `input`, `select`, `textarea`, `button`
- 包含类型、ID、类名、占位符、值等信息

### 3. 表格元素

- `table` 标签
- 包含表头和行数据

### 4. 卡片/面板

- `.card`, `.panel`, `.box`
- 包含标题和内容

### 5. 导航元素

- `nav`, `.nav`, `.navigation`, `.menu`
- 包含导航项列表

### 6. 文本元素

- 所有可见的文本节点
- 包含文本内容、标签名、类名

## 生成的Vue代码特性

- ✅ Vue 3 Composition API (`<script setup>`)
- ✅ Ant Design Vue 组件
- ✅ 响应式设计
- ✅ 表单验证支持
- ✅ 表格分页支持
- ✅ 搜索筛选功能
- ✅ 模态框支持

## 常见问题

### Q: 连接失败怎么办?

**A:** 检查以下几点:

1. chrome-devtools-mcp 服务是否已启动
2. 端口是否正确(默认8088或9222)
3. 防火墙是否阻止连接

### Q: 页面加载超时?

**A:**

1. 增加超时时间配置
2. 使用 `wait_for` 等待特定元素出现
3. 检查网络连接

### Q: 提取不到元素?

**A:**

1. 使用 `take_snapshot` 查看实际DOM结构
2. 调整选择器以匹配实际元素
3. 确保页面已完全加载

### Q: 生成的代码不完整?

**A:**

1. 根据实际页面结构调整生成逻辑
2. 手动补充缺失的部分
3. 自定义 `generateVueCode` 函数

### Q: 腾讯CoDesign原型需要密码怎么办?

**A:**

1. 使用 `fill` 工具输入密码
2. 使用 `press_key` 工具按 Enter 键提交
3. 等待原型加载完成后再提取内容

## 扩展功能

### 1. 组件提取

识别可复用的组件并生成独立文件:

```javascript
function extractComponents(structure) {
  const components = [];
  // 提取可复用组件的逻辑
  return components;
}
```

### 2. 样式提取

提取CSS样式并生成样式文件:

```javascript
function extractStyles() {
  const styles = await evaluate_script({
    function: "() => Array.from(document.styleSheets).map(sheet => sheet.cssRules)"
  });
  return styles;
}
```

### 3. 路由配置

自动生成路由配置:

```javascript
function generateRouteConfig(pages) {
  return pages.map(page => ({
    path: `/${page.name}`,
    component: () => import(`@/views/${page.name}/index.vue`),
  }));
}
```

### 4. API接口定义

根据表单元素生成API接口:

```javascript
function generateApiInterface(formElements) {
  const fields = formElements.map(el => el.id || 'field');
  return {
    create: `POST /api/resource`,
    update: `PUT /api/resource/:id`,
    delete: `DELETE /api/resource/:id`,
    fields,
  };
}
```

## 最佳实践

1. **使用只读模式链接**: 避免登录验证,确保可访问性
2. **合理设置超时**: 根据页面复杂度调整超时时间
3. **验证生成代码**: 生成后检查代码质量,必要时手动调整
4. **版本控制**: 将生成的代码纳入版本控制
5. **持续优化**: 根据使用反馈优化生成逻辑
6. **密码安全**: 不要在代码中硬编码密码,使用环境变量或配置文件

## 相关资源

- [chrome-devtools-mcp 文档](https://github.com/modelcontextprotocol/servers/tree/main/src/chrome-devtools)
- [墨刀官网](https://modao.cc/)
- [腾讯CoDesign官网](https://codesign.qq.com/)
- [Vue 3 文档](https://vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/)

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request!

## 更新日志

### v1.0.0 (2026-02-13)

- 初始版本发布
- 支持墨刀原型读取
- 支持腾讯CoDesign原型读取
- 支持密码保护的原型访问
- 支持Vue 3代码生成
- 支持Ant Design Vue组件
