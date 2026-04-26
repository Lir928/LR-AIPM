# 还原专用规则

## 核心原则

### 1. 还原不是重做
- **目标**：1:1 像素级还原原页面的视觉与布局
- **不允许**：主动改版、擅自简化、自由发挥设计创意
- **对比**：
  - `04-原型生成流水线`：从 PRD + Prompt 创造新页面（可以发挥创意）
  - `10-老项目还原流水线`：从导出数据包还原旧页面（必须忠实原貌）

### 2. 数据优先级
当数据冲突时，以以下优先级为准：

| 优先级 | 数据源 | 说明 |
|--------|--------|------|
| ⭐⭐⭐⭐⭐ | `screenshot.png` | 截图是最终真相，所有冲突以截图为准 |
| ⭐⭐⭐⭐ | `theme.json` | 精确的颜色/字体/间距值 |
| ⭐⭐⭐ | `skeleton.json` + `index.json` | DOM 层级与语义标签 |
| ⭐⭐ | `content.md` | 文本内容校准 |
| ⭐ | `nodes/*.json` + `styles/*.json` | 逐节点精确样式（按需查取） |

### 3. 颜色精确性
- 所有颜色值必须使用 `theme.json` 中的原始值（如 `rgb(24,144,255)`）
- 禁止用 Element UI 或 Ant Design 默认值猜测替换
- 所有 CSS 变量必须从 `theme.json` 的 `cssVariables` 字段提取

## CSS 属性校验清单

### 颜色
- [ ] 主色 (primary color): 与 `theme.json` 中的主色调值一致
- [ ] 文字色层级: `colorText`, `colorTextSecondary`, `colorTextTertiary` 等与 `theme.json` 一致
- [ ] 背景色: `colorBgContainer`, `colorBgLayout` 等与 `theme.json` 一致
- [ ] 边框色: `colorBorder`, `colorBorderSecondary` 等与 `theme.json` 一致

### 字体
- [ ] 字体族: `fontFamily` 必须与 `theme.json` 的 `typography.families` 第一项一致
- [ ] 基础字号: `fontSize` 必须与 `theme.json` 的 `typography.textStyles` 主要尺寸一致
- [ ] 字号层级: 各层级字体大小与 `theme.json` 中的 `size` 值一致
- [ ] 行高: 与 `theme.json` 的 `lineHeight` 值一致
- [ ] 字重: 与 `theme.json` 的 `weight` 值一致

### 间距
- [ ] 内外边距: `padding`, `margin` 等值与 `theme.json` 中的 `spacing` 值一致
- [ ] 布局间距: 区域间距离与原截图匹配
- [ ] 组件间距: 与 `theme.json` 中的间距令牌一致

### 圆角与阴影
- [ ] 圆角: `borderRadius` 值与 `theme.json` 中的 `radius` 值一致
- [ ] 阴影: `boxShadow` 值与 `theme.json` 中的 `shadow` 值一致

### 交互态
- [ ] Hover 样式: 与原页面交互态一致
- [ ] Focus 样式: 与原页面焦点态一致
- [ ] Active 样式: 与原页面激活态一致
- [ ] Disabled 样式: 与原页面禁用态一致

## 还原验证步骤

### 1. 主题转换验证
- [ ] 运行 `node scripts/theme-convert.mjs <export-dir> <themeName>`
- [ ] 检查生成的 `designToken.json` 是否包含精确的设计值
- [ ] 检查 `style.css` 是否包含了正确的 CSS 变量
- [ ] 确认主题已正确集成到 Axhub Make 中

### 2. 分段还原验证
- [ ] 将页面按 `sections/` 目录分割为多个部分
- [ ] 每个部分单独还原，并对照 `screenshot.png` 验证
- [ ] 使用 `query.mjs` 检查特定部分的 DOM 结构与样式
- [ ] 逐部分验证颜色、间距、字体与原图一致

### 3. 整体校验
- [ ] 启动预览 `npm run dev:axhub-make`
- [ ] 访问生成的原型页面，与 `screenshot.png` 逐项对比
- [ ] 运行 `node scripts/visual-diff.mjs <export-dir> <prototype-url>` 进行自动化视觉对比

### 4. 功能校验
- [ ] 原页面的所有交互元素（下拉菜单、弹窗、Tab 切换、表单控件）都已还原
- [ ] 原页面使用 Element UI / VXE Table 等组件库的样式特征都已保留
- [ ] 原页面的数据表格包含完整列结构，mock 数据多样化

## 常见陷阱

### 1. 避免默认值
❌ 错误：使用 Ant Design 的默认蓝色 (#1677ff) 替代原始主色
✅ 正确：从 `theme.json` 提取原始主色 (如 rgb(24,144,255))

### 2. 避免省略交互
❌ 错误：忽略原页面的下拉菜单、弹窗等交互元素
✅ 正确：逐一还原所有可见交互行为，即使逻辑简化也要保留 UI 样式

### 3. 避免整页生成
❌ 错误：一次性生成整个页面的代码
✅ 正确：按 header → sidebar → main-content → footer 的顺序，逐段生成代码

### 4. 避免上下文溢出
❌ 错误：一次性传输整个 DOM 结构给 AI
✅ 正确：使用 `query.mjs section <name>` 分批获取数据，避免上下文限制

## 技术要求

### 1. 样式精确性
- 使用 CSS-in-JS 或 Tailwind 的精确值，而非抽象类名
- 确保所有视觉属性都来自 `theme.json` 数据
- 避免使用手写的近似值

### 2. 组件兼容性
- 原页面使用 Element UI 的地方，用 CSS 手写模拟其视觉效果
- 不引入实际的 Element UI 组件，而是生成对应的 CSS 样式
- 确保还原后的组件在 Axhub Make 中正常显示

### 3. 数据映射
- 内容必须与 `content.md` 中的文本一致
- 结构必须与 `skeleton.json` 的 DOM 结构一致
- 样式必须与 `theme.json` 的设计令牌一致

## 还原完成标准

- [ ] 视觉相似度 ≥ 85%（通过 `visual-diff.mjs` 验证）
- [ ] 所有设计令牌都已从 `theme.json` 正确提取
- [ ] 所有交互元素都已还原
- [ ] 所有文本内容都已准确映射
- [ ] 主题已正确应用，样式与原图一致