# 更新日志

所有 notable changes 将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 修复
- 修复 package.json 与 README/License 不一致问题
- 修复 archive-prototype.js 跨平台兼容性问题（移除 macOS 专有 ditto 命令）
- 修复 demo-task 项目结构完整性
- 修复根目录 tsconfig.json 配置不当
- 修复 workspace 配置，将 axhub-make 纳入 workspaces

### 新增
- 添加 CONTRIBUTING.md 贡献指南
- 添加 CHANGELOG.md 更新日志
- 添加 workbench 推荐子目录结构
- 添加 .github 目录模板

## [1.0.0] - 2026-04-26

### 新增
- 初始版本发布
- 10 条核心自动化流水线
- Axhub Make 原型引擎集成
- AI 驱动的工作流系统
