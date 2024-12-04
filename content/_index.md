---
date created: 2024-10-29 17:12
date updated: 2024-10-29 17:26
share: "true"
path: content
en-filename: index
title: 首页
updated: 2024-12-04 18:03
---

---

<strong>🆕 最近创建：</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "date" | reverse %}
  {% for note in recent_notes | limit: 6 %}
    <li>
      {{ note['date created']}} — <a class="internal-link" href="{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<strong>⏰ 最近更新：</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "updated" | reverse %}
  {% for note in recent_notes | limit: 6 %}
    <li>
      {{ note['date modified']}} — <a class="internal-link" href="{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>
