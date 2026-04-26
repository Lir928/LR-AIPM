# workbench

这是“工作台目录”：用来放短期、可随时丢弃但对当前迭代有用的材料，避免把大量噪音与大文件污染 `projects/` 的长期归档。

原则：

- workbench 里默认是“临时态”，归档后只把最小必要证据沉淀到 `projects/<project>/features/<pageId>/`
- workbench 里可以存导出包/还原产物/对比截图；但不要把它当成 PRD 正本或原型正本
- PRD/原型的“工作台正本”仍以 `axhub-make/src/docs/` 与 `axhub-make/src/prototypes/` 为准（便于在 Axhub Make 里预览与对齐）

推荐结构（按需建立）：

- `workbench/_incoming/`：外部输入材料（前端导出的 html/zip、接口文档、截图、录屏等）
- `workbench/_restore/`：还原/解包/清洗后的中间产物（可重复生成）
- `workbench/_compare/`：对比用证据（旧版 vs 新版截图、关键路径录屏）
- `workbench/_tmp/`：纯临时文件（随时删除）

升级页面的默认用法：

1. 把外部导出包放进 `workbench/_incoming/<date>/<source>/`
2. 在 `projects/<project>/features/<pageId>/iterations/` 里保留“输入材料索引 + 关键说明”（不要长期堆导出包）
3. 原型/PRD 迭代统一走 `axhub-make/src/prototypes/<pageId>/` 与 `axhub-make/src/docs/<pageId>-PRD.md`

推荐顺序：

1. 输入材料先进 `workbench/_incoming/`
2. 产出或更新工作台 PRD
3. 生成或修改工作台原型
4. 阶段完成后再归档到 `projects/<project>/features/<pageId>/`
