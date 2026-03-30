# 原型元素到Vue组件映射表

## 基础元素映射

| 原型元素 | HTML标签 | Vue组件 | 说明 |
|---------|---------|---------|------|
| 文本 | `<p>`, `<span>` | - | 普通文本内容 |
| 标题 | `<h1>` - `<h6>` | - | 根据层级选择 |
| 按钮 | `<button>` | `<BaseButton>` | 可封装通用按钮组件 |
| 图片 | `<img>` | `<BaseImage>` | 支持懒加载 |
| 输入框 | `<input>` | `<SearchBar>`, `<InputField>` | 根据类型选择 |
| 文本域 | `<textarea>` | `<TextArea>` | 多行输入 |
| 选择框 | `<select>` | `<BaseSelect>` | 下拉选择 |

## 复合组件映射

| 原型元素 | 推荐组件 | 实现方案 |
|---------|---------|---------|
| 搜索栏 | `<SearchBar>` | 输入框 + 搜索图标 |
| 轮播图/Banner | `<SwipeCarousel>` | 使用 Swiper 或自定义 |
| 卡片 | `<PolicyCard>`, `<InfoCard>` | 图片 + 标题 + 描述 |
| 列表项 | `<ListItem>` | 可点击的列表行 |
| 底部导航 | `<BottomNav>` | 固定底部，4-5个选项 |
| 顶部导航栏 | `<NavBar>` | 标题 + 返回/操作按钮 |
| 状态栏 | `<StatusBar>` | 时间 + 状态图标 |
| 标签/徽章 | `<Tag>`, `<Badge>` | 彩色小标签 |
| 分割线 | `<Divider>` | 视觉分隔 |
| 加载更多 | `<LoadMore>` | 列表底部加载 |

## 布局映射

| 原型布局 | CSS方案 | 说明 |
|---------|---------|------|
| 垂直堆叠 | `flex-direction: column` | 默认布局 |
| 水平排列 | `flex-direction: row` | 横向排列 |
| 网格布局 | `display: grid` | 规则网格 |
| 两栏布局 | `flex: 1` + 固定宽度 | 左侧固定右侧自适应 |
| 居中布局 | `margin: 0 auto` / flex居中 | 内容居中 |

## 样式映射

| 原型样式 | CSS属性 | 备注 |
|---------|---------|------|
| 圆角 | `border-radius` | 小:4px, 中:8px, 大:16px |
| 阴影 | `box-shadow` | 卡片常用 |
| 背景色 | `background-color` | 主色、辅色、背景色 |
| 文字颜色 | `color` | 主文字、次要文字 |
| 字体大小 | `font-size` | 标题、正文、辅助文字 |
| 间距 | `padding`, `margin` | 8px基准倍数 |
| 边框 | `border` | 分割线、输入框边框 |

## 颜色规范 (默认)

```css
:root {
  /* 主色调 */
  --primary-color: #ff6b6b;
  --primary-light: #ff8e8e;
  --primary-dark: #e55a5a;
  
  /* 文字颜色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  
  /* 背景颜色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #fafafa;
  
  /* 边框颜色 */
  --border-color: #eeeeee;
  
  /* 功能色 */
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --info-color: #1890ff;
}
```

## 字体规范 (默认)

```css
:root {
  /* 字体大小 */
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-xxl: 20px;
  --font-size-title: 24px;
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  
  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-loose: 1.75;
}
```

## 间距规范 (默认)

```css
:root {
  /* 基础间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-xxl: 24px;
  --spacing-xxxl: 32px;
}
```
