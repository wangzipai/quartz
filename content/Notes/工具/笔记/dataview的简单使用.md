---
date: 2024-12-05 11:27
updated: 2024-12-05 11:34
tags:
  - 笔记
share: "true"
link: "false"
---

# 简介

Quartz 支持 Dataview 的使用，使用简单的 Dataview 语法就能让首页好看一点。Dataview提供了一种类似 SQL 的语法，用于从你的 Markdown 笔记中提取和显示结构化数据。通过 Dataview，你可以创建动态表格、任务列表、图表等，来管理和查询笔记内容。

# 示例

使用表格显示所有文件中包含share标签的文件和他的目录

```text
table file.folder as "Directory", file.name as "File Name"
from ""
where share
```

列出所有tag标签中包含TF-A的文件

```text
list file.name
from ""
where contains(file.tags, "TF-A")
```
