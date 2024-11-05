---
date created: 2024-11-05 16:07
date updated: 2024-11-05 16:15
share: "true"
link: "false"
---

辣鸡小米手表不能识别flac格式的音乐，因此需要一个批量将falc格式的音乐转换成mp3的工具。网上找了下发现都是使用毒瘤软件格式工厂，就在git上搜了下，发现有个老外写了个类似的工具。

项目地址：<https://github.com/robinbowes/flac2mp3>

直接将项目clone下来

```shell
# wyq @ wangyq in ~ [15:48:24]
$ git clone https://github.com/robinbowes/flac2mp3.git
Cloning into 'flac2mp3'...
remote: Enumerating objects: 705, done.
remote: Counting objects: 100% (7/7), done.
remote: Compressing objects: 100% (7/7), done.
remote: Total 705 (delta 1), reused 1 (delta 0), pack-reused 698 (from 1)
Receiving objects: 100% (705/705), 469.71 KiB | 1.54 MiB/s, done.
Resolving deltas: 100% (364/364), done.
```

然后进入目录中，使用pl脚本

```she'l'l
# wyq @ wangyq in ~/flac2mp3 on git:master o [15:57:46] C:127
$ ./flac2mp3.pl /mnt/d/Music/flac/ /mnt/d/Music/mp3/
Using flac from: /usr/bin/flac
Using lame from: /usr/bin/lame
Processing directory: /mnt/d/Music/flac
Found 55 flac files
Using 1 transcoding processes.
```

等待结束
