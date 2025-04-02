---
date: 2025-03-12 21:44
updated: 2025-03-12 21:47
tags:
  - Everest
date updated: 2025-04-02 11:42
link: "false"
share: "true"
---

# 官方文档

<https://everest.github.io/nightly/tutorials/run_sil/index.html>

# 安装 edm 环境

```shell
git clone https://github.com/EVerest/everest-dev-environment
cd everest-dev-environment/dependency_manager
python3 -m pip install .
```

mac环境下，需要zsh 的 mac 环境变量配置

# 设置 CMP 环境变量

EVerest 依赖管理器使用 [CPM](https://github.com/cpm-cmake/CPM.cmake)用于其 CMake 集成。这意味着您可以并且应该设置 `CPM_SOURCE_CACHE` 环境变量。 这确保了你未在工作区中管理的依赖项 无需多次重新下载。

```shell
export CPM_SOURCE_CACHE=$HOME/.cache/CPM
export PATH=$PATH:/home/$(whoami)/.local/bin
```

# 配置工作区

直接在上级目录创建工作区

```shell
mkdir ../workspace
edm init --workspace ../workspace
```

此时，edm创建了一个默认的配置文件，`Successfully saved edm config "/Users/wyq/.config/everest/edm.yaml"`，可以更改该 YAML 文件，用于其他场景。

# EVerest 命令行界面

 `ev-cli`通过生成模块模板提供支持。是构建 EVerest 必要的。已通过在构建过程中自动安装在 python venv 中来满足。可以在 HOME 目录中的.local/bin/中找到二进制文件。

# 构建 EVerest

```sh
cd {EVerest Workspace Directory}/everest-core
mkdir build
cd build
cmake ..
make -j8 install
```

mac环境下，cmake 的时候会缺少 libcap 环境，无法正常构建。~~参考mac下构建 Everest~~      docker 环境构建 Everest。
