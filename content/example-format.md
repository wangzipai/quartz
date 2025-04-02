---
title: "正确日期格式示例"
created: "2024-10-10T10:28:00+08:00"
updated: "2024-10-31T17:05:00+08:00"
tags:
  - example
---

# 正确日期格式示例

这个文件演示了正确的日期格式。

## 格式要点：

1. 使用 ISO 8601 格式：YYYY-MM-DDTHH:MM:SS+时区
2. 字段名称必须是 `created` 而不是 `date created`
3. 字段名称必须是 `updated` 而不是 `date updated`

这样 Quartz 就能正确解析日期了。 