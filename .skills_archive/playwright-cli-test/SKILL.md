---
name: playwright-cli-test
description: |
  Playwright CLI 自动化测试工作流技能。根据需求文档或描述自动生成测试用例、模拟评审会议、执行测试、生成报告的完整流程。
  适用于：(1) 根据需求创建自动化测试用例 (2) 执行 Playwright CLI 有头模式测试 (3) 生成测试报告和日志
---

# Playwright CLI 自动化测试工作流

## 快速开始

### 1. 生成测试用例

根据用户输入的需求文档或描述，在 `docs/test/{TRACKING_ID}/` 目录下生成测试用例文档。

详细用例格式见 [references/test-case-template.md](references/test-case-template.md)

### 2. 模拟评审会议

生成评审会议记录文档，评估维度：
- 用例覆盖度
- 步骤可执行性
- 预期结果准确性
- 边界场景缺失

**输出**: `docs/test/{TRACKING_ID}/discuss-{时间}.md`

### 3. 修改测试用例

- 备份原测试用例文件
- 根据讨论问题修改测试用例
- 记录修改点数量

### 4. 人工审查

等待用户确认测试用例，收集审查意见：
- 通过：继续执行测试
- 驳回：修改后重新提交审查

### 5. 执行测试

使用 Playwright CLI 有头模式执行测试：
```bash
npx playwright test --headed
```

**异常处理**: 用例执行失败时自动重试 1 次

### 6. 生成测试报告

**输出**: `docs/test/{TRACKING_ID}/{需求}-测试报告-{时间}.md`

详细报告格式见 [references/test-report-template.md](references/test-report-template.md)

### 7. 日志记录

所有步骤的日志保存在：`docs/test/{TRACKING_ID}/log/`

## 目录结构

```
docs/test/{TRACKING_ID}/
├── {需求}-测试用例-{时间}.md
├── discuss-{时间}.md
├── {需求}-测试用例-backup-{时间}.md
├── {需求}-测试报告-{时间}.md
└── log/
    └── workfl[]()ow-{时间}.log
```

## 使用示例

```
用户: 为用户登录功能创建测试用例并执行测试
-> 创建测试用例 -> 模拟评审 -> 等待人工确认 -> 执行测试 -> 生成报告
```
