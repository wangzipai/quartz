---
created: "2024-10-29T17:12:00+08:00"
updated: "2024-10-29T17:26:00+08:00"
share: 'true'
path: content
en-filename: index
title: 首页
updated: 2024-12-05 15:48
publish: true
---

# 目录

[[Obsidian/|目录]]

# 最近更新

```dataview
table file.folder as "目录",file.mtime as "更新时间"
from ""
where share and file.name != "_index"
sort file.mtime desc
limit 15
```
