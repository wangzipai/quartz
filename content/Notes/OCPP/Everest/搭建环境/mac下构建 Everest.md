---
date created: 2025-03-19 10:10
date updated: 2025-04-02 11:46
tags:
  - Everest
share: "true"
link: "false"
---

失败了，文档应该是很早之前的，没人维护， 用 [[/content/Notes/OCPP/Everest/搭建环境/docker 环境构建 Everest|docker 环境]] 吧。

# 下载 Everest-utils 仓库

```shell
# wyq @ wyqs-MBP in ~/Code/github [10:36:34] C:128
$ git clone https://github.com/EVerest/everest-utils.git
正克隆到 'everest-utils'...
remote: Enumerating objects: 2475, done.
remote: Counting objects: 100% (1087/1087), done.
remote: Compressing objects: 100% (521/521), done.
remote: Total 2475 (delta 821), reused 611 (delta 548), pack-reused 1388 (from 2)
接收对象中: 100% (2475/2475), 552.90 KiB | 2.13 MiB/s, 完成.
处理 delta 中: 100% (1343/1343), 完成.
```

[Everest-utils](https://github.com/EVerest/everest-utils) 存储库包含Mac 上开发所需的开发容器。

# 建立开发 Docker 环境

## 建立后台Docker网络和容器

从 everest-utils 的项目根目录创建 infranet_network Docker 网络：

```shell
docker network create --driver bridge --ipv6  --subnet fd00::/80 infranet_network --attachable || true
```

启动 Everest MQTT 和 Node-RED Docker 容器：

这里教程没写清楚，按照教程来的话，docker下只有everest-docker-image目录，这个目录下才有 yml 配置文件，但是修改教程的路径使用这个的话，该docker目录下缺少mosquitto.conf文件，他会自动创建一个同名的文件夹。原本以为是版本问题，切换到 tag 分支发现也是一样的。

按照教程说的，这个步骤是启动 Everest MQTT 和 Node-RED Docker 这两个容器，倾向于认为是在[[/content/Notes/OCPP/Everest/搭建环境/构建EVerest#安装 edm 环境|edm]]的路径下执行 docker 命令。

```shell
docker compose -f "./docker/docker-compose.yml" up -d mqtt-server
docker compose -f "./docker/docker-compose.yml" up -d nodered
```

EVerest Utilities 存储库中还有此脚本的版本。

```shell
bin/devup
```

这 TM 写的是啥呀。
