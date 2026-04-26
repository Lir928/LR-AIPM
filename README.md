# AIPM Workflows - 下一代 AI 驱动的产研自动化底座

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-LR--AIPM-blue.svg)](https://github.com/Lir928/LR-AIPM)

> 从一句话需求到高保真原型的全流程自动化解决方案，让产研效率提升 10 倍

## 项目概述

AIPM Workflows 是一个革命性的 AI 驱动产研自动化平台，旨在打通从需求到原型的完整自动化链路。其核心哲学是「AI 驱动，一键生成」，通过构建从一句话需求到高保真原型的端到端闭环，彻底改变传统产品研发模式。

**核心流程：**
需求输入 → 结构化PRD → Axhub Prompt → 自动原型生成 → 实时预览

项目采用独特的 All-in-Axhub 架构，代码交付物即为 Axhub 原型页面，使所有研发技能直接在 Axhub 引擎内实现。

## 快速开始

### 环境准备

1. 确保已安装 Node.js (v18+) 和 Git
2. 获取项目代码：

```bash
git clone https://github.com/Lir928/LR-AIPM
cd LR-AIPM
```

3. 安装依赖：

```bash
npm install
```

### 启动项目

AIPM Workflows 包含两个主要服务：

**启动原型引擎 (Axhub Make)**:
```bash
npm run dev:axhub-make
```

启动后访问浏览器输出的 Local URL，例如：
- 项目介绍页：`http://localhost:{port}/prototypes/project-intro`
- 原型页面：`http://localhost:{port}/prototypes/[页面ID]`

**启动示例项目 (demo-task)**:
```bash
npm run dev:project -- demo-task --install
```

### 核心使用流程

**新增页面**（最简单的方式）：
1. 在 Trae IDE 中输入：`执行需求梳理`
2. AI 自动生成 PRD 和 Prompt
3. 输入：`执行原型生成`
4. AI 自动生成可交互原型
5. 在浏览器中查看实时效果

**升级旧页面**（从外部材料）：
1. 将材料放入 `workbench/_incoming/YYYY-MM-DD/<页面名>/`
2. 执行 `执行需求梳理` 生成 PRD
3. 执行 `执行原型生成` 生成原型
4. 根据需要调整原型并归档

## 核心流水线体系

AIPM Workflows 提供 10 条核心自动化流水线（编号不连续，06 号保留待扩展）：

### 主线必经（必须执行）
- **00** - 统一页面开发：总导航页，统一处理新增/升级/迭代
- **02** - 需求转PRD：AI 生成 PRD 和 Prompt
- **07** - 启动预览：启动 Axhub Make 预览环境
- **04** - 原型生成：AI 生成含交互的原型
- **09** - 归档升级：完成时归档，需要时恢复
- **10** - 页面还原：精确还原旧页面（Chrome扩展导出包）

### 可选流程（按需执行）
- **01** - 资产盘点：复杂旧系统资产分析
- **03** - Prompt同步：PRD 修改后同步 Prompt
- **05** - 代码审查：交付前形式化审查
- **08** - 原型增强：添加复杂交互功能

## 目录结构

```
LR-AIPM/
├── axhub-make/              # Axhub 原型引擎
│   └── src/
│       ├── prototypes/      # 原型页面（工作台）
│       └── docs/           # 工作文档
├── projects/               # 业务项目归档
│   └── [projectName]/
│       ├── features/       # 功能正本归档
│       ├── docs/          # 项目文档
│       └── legacy-assets/ # 遗留资产
├── workbench/              # 工作台目录
│   ├── _incoming/          # 外部输入材料
│   ├── _restore/           # 还原/解包中间产物
│   ├── _compare/           # 对比用证据
│   └── _tmp/               # 纯临时文件
├── .skills/               # AI 技能库
└── scripts/               # 开发脚本
```

## 核心特性

- **全流程自动化**：从需求到原型完全自动化
- **高保真交互原型**：包含复杂交互和状态管理
- **AI 驱动**：通过 Trae IDE 实现智能处理
- **实时预览**：即时查看原型变更效果
- **版本管理**：完善的归档与恢复机制
- **All-in-Axhub 架构**：统一的研发交付模式

## 技术栈

- **前端框架**：React 18 + TypeScript
- **原型引擎**：Axhub Make
- **AI 驱动**：Trae IDE
- **构建工具**：Node.js + npm
- **版本控制**：Git

## 常见问题 (FAQ)

**Q: 项目启动失败怎么办？**
A: 确保 Node.js 版本 >= 18，并检查 axhub-make 目录下是否已安装依赖。

**Q: 如何添加新的流水线？**
A: 在 `.workflows/` 目录下创建新的 Markdown 文件，并在 `.workflows/README.md` 中注册。

**Q: 原型页面如何归档？**
A: 使用 `npm run archive:prototype -- <projectName> <pageId>` 命令。如果 dev server 未启动，可添加 `--offline` 参数进行离线归档。

**Q: 归档后如何恢复？**
A: 使用 `npm run restore:prototype -- <projectName> <pageId>` 命令。如工作台已有同名原型，添加 `--force` 覆盖。

**Q: 如何查看流水线状态？**
A: 使用 `npm run workflow:status` 命令查看所有页面的当前状态。

**Q: 如何验证项目完整性？**
A: 使用 `npm run validate` 命令检查项目结构和文件完整性。

## 贡献

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解项目的版本历史。

## 许可证

本项目采用 MIT 许可证。

## 致谢

特别感谢 [Axhub Make](https://axhub.im/make/) 提供的原型引擎支持和 [Trae IDE](https://tracelabs.org) 提供的 AI 能力，使本项目成为可能。
