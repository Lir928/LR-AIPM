---
name: word-to-markdown
description: 将 Word (.docx) 文档转换为 Markdown (.md) 格式，支持表格转换、图片提取保存到本地、样式保留（标题层级、粗体、斜体等）。当用户需要把 Word 文档转为 Markdown 时触发，例如："把这个 Word 转成 Markdown"、"帮我把 docx 转成 md"。
---

# Word 转 Markdown

## 快速开始

使用 `scripts/docx_to_md.py` 脚本进行转换：

```bash
python scripts/docx_to_md.py <input.docx> [output.md]
```

- 第一个参数：输入的 .docx 文件路径
- 第二个参数（可选）：输出的 .md 文件路径，默认与原文件同名

## 功能特性

### 支持的转换

- **段落**：普通文本、缩进文本
- **标题**：H1-H6 层级转换
- **样式**：粗体、斜体、下划线、删除线
- **表格**：完整转换，包括合并单元格
- **图片**：提取并保存到本地文件夹，Markdown 中使用相对路径引用
- **列表**：有序列表、无序列表
- **超链接**：保留链接文本和 URL

### 输出结构

转换后的文件结构：
```
document.docx
document.md
document_media/
    image1.png
    image2.jpg
```

## 使用方式

### 命令行调用

```bash
# 基本转换
python scripts/docx_to_md.py input.docx

# 指定输出路径
python scripts/docx_to_md.py input.docx output.md

# 指定图片保存目录
python scripts/docx_to_md.py input.docx output.md --media-folder custom_media
```

### 依赖安装

```bash
pip install python-docx markdownify Pillow
```

## 转换规则

| Word 元素 | Markdown 输出 |
|-----------|---------------|
| 标题 1 | # 标题 |
| 标题 2 | ## 标题 |
| 粗体 | **文本** |
| 斜体 | *文本* |
| 超链接 | [文本](url) |
| 图片 | ![](media/image.png) |
| 表格 | \| 表格 \| 格式 \| |

详见 [REFERENCES.md](references/REFERENCES.md)