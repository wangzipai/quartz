---
date: 2025-03-12 21:29
updated: "2025-03-12T21:42:00+08:00"
tags:
  - Everest
updated: 2025-04-02T14:32:00+08:00
link: "false"
share: "true"
---

由于 Everest 是高度模块化的，需要多个存储库，这些存储库可以在 GitHub 上找到。为了根据需要获得正确的存储库，可以使用EVerest管理器(edm)。

# 安装

## 下载并安装

```sh
git clone https://github.com/EVerest/everest-dev-environment
cd everest-dev-environment/dependency_manager
python3 -m pip install .
```

Everest 依赖管理器使用 [CPM](https://github.com/cpm-cmake/CPM.cmake)用于 CMake 集成。设置CPM_SOURCE_CACHE环境变量，确保不在工作区中管理的依赖项没有重新下载多次。

## 设置 PATH 变量

```sh
export CPM_SOURCE_CACHE=$HOME/.cache/CPM
export PATH=$PATH:/home/$(whoami)/.local/bin
```

## 设置工作空间目录

这里不使用官网的/home目录下，而是直接放到git创建的目录

```sh
# wyq @ wangyq in ~/everest-dev-environment/dependency_manager on git:main o [21:36:04]
$ mkdir ../checkout

# wyq @ wangyq in ~/everest-dev-environment/dependency_manager on git:main o [21:36:41]
$ mkdir ../checkout/everest-workspace

# wyq @ wangyq in ~/everest-dev-environment/dependency_manager on git:main o [21:36:58]
$ edm init --workspace ../checkout/everest-workspace/
```

此时，可以看到edm创建一个 YAML 文件 workspace-config.yaml 来描述创建的工作区。如果想将工作区应用于其他场景，可以更改该 YAML 文件。
