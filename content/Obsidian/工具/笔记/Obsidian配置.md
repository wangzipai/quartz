---
tags:
  - obsidian
date updated: 2024-12-03 11:46
share: "true"
link: "true"
---

## 设置

### 语言

在「设置->关于」中进行语言的切换：
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319142233.png)

### 删除文件设置

在「设置->文件与链接」中进行配置，我设置为移至软件回收站，这样删除的文件会在 Obsidian 的库目录下的一个隐藏目录中，如果发现误删还能找回来。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319142458.png)

## 主题

目前使用 NORD 主题，在「设置->外观->主题」界面点击「管理」按钮，在弹出的界面中选择使用喜欢的主题即可。

## 字体

正文的界面字体使用雅黑
代码字体使用source code pro

## 快捷键设置

按照之前的typora的使用习惯

### 标题

> 设置 > 快捷键 > 设置为小标题 1-6 > 依次设置为 [ctrl + 1-6]

### 高亮

> 在「设置->快捷键」中进行配置，高亮->[ctrl+q]

### 格式化

[[Obsidian配置#Markdown prettifier|Obsidian配置 > Markdown prettifier]]

### 代码块

[[Obsidian配置#Code block from selection|Obsidian配置 > Code block from selection]]
使用这个插件，设置快捷键为[ctrl + shift + K]，默认C语言

## 插件

在「设置->第三方插件」中进行插件的安装，点击「社区插件」后面的「浏览」按钮打开插件列表界面进行安装即可。安装插件前，需要先将安全模式的开关关闭。

### 同步

安装插件【Remotely Save】，Remotely Save 支持：

- S3 或兼容S3的服务
- Dropbox
- Webdav
- Onedrive个人版

最终选择是 Webdav（infinicloud），S3或S3兼容因为paypal账户被限制暂时无法使用，后面可以尝试下。（Cloudflare每个月免费10G的流量看起来还是比infinicloud要香一点）

WebDav 是非常简单、使用广泛的网盘协议，服务商也非常多。这里推荐 [infinicloud](https://infini-cloud.net/en/)，免费层提供 20GB存储，没有其他限制。

注册后在 My Page 页面打开 Apps Connection，生成 Password，就有了 服务器地址、用户名、密码。

注意，例如 Remotely Save 里的基文件夹名为 “ROOT”，你要先在 infinicloud 的 File Browser 页面根目录下建立 “ROOT”文件夹。

infinicloud 是一家日本服务商，在中国访问速度大概 400KB/s~2MB/s，对于笔记这样的大量小文件很够用了。

#### 为什么不使用坚果云？

坚果云対用户 webdav api 的调用限制是 500次/30分钟，即使每30分钟同步1次，也会轻易超额报错。

### 床图

1. 安装插件【image auto upload】
   ![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319150102.png)
2. 安装picgo
   下面是GitHub的下载点，也可以直接在浏览器搜索picgo。 <https://github.com/Molunerfinn/PicGo/releases/> 
   ![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319150444.png)
3. github新建仓库
   ![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319150651.png)
4. 获取gitbub token, settings->developer settings
   ![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319150948.png)
5. 回到picgo，填写github相关内容
   ![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319151059.png)

### file-explorer-note-count

用于查看文件夹下文件个数

### Highlightr

高亮插件

### note-refactor

笔记重构插件，能够让一篇长文，按照指定的分割标志切割成链接引用风格的文章。

此插件是隐藏功能插件，在我们需要使用的时候，通过调用命令面板进行应用。如下图：![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20240319152439.png)
如截图所见，我们可以通过选择插件提供的一些切分依据对一篇文章进行打碎重构，比如你的一篇文章标题非常严谨，全部都是通过二级标题作为只是点归类，那么就可以直接选择`Split note by headings - H2`，笔记就会自动基于h2标记对当前文章进行拆分，每个二级标题为一篇文章，笔记新建之后，标题会自动被当前笔记链接，那么一篇完整的笔记，就能够基于二级标题拆分成标准的双链笔记了。

这款插件可以应用在我们日常写作当中，我们新学习一个知识，在编写笔记的时候不必过多考虑链接之类的概念，只需要在一篇笔记中，利用标题层级做好归类划分，不断完善这个知识点即可，等到觉得差不多的时候，可以利用此插件，一键将一篇笔记拆分成诸多知识点。

### Editor Syntax Highlight

提供了在编辑模式中一些代码语法高亮的效果。

### Tag Wrangler

- 选项一：更改标签名称
  可批量更改此标签及其嵌套标签的名称。
- 选项二：打开标签页面
  点击就会自动创建一个带 YAML 语法的笔记，“别名”对应标签名。
  具体用法稍后介绍。
- 选项三：基于标签搜索相关内容
- 选项四：搜索不带该标签的其他内容

除此之外，直接拖拽标签，可将该标签快速插入到文中任意位置。

### Outliner

增强大纲

### Obsidian-text generator

在 Obsidian 中使用本地 LLM

### Code block from selection

将选中的段落设置为代码段，需设置快捷键和默认语言

### Markdown prettifier

排版自动美化，设置快捷键为ctrl+s

### Image Toolkit

点击图片放大

### ~~floating -toc~~

~~悬浮目录~~，不好用，直接使用系统侧栏的目录

### mousewheel-image-zoom

鼠标滚动调整图片大小

### Excalidraw

流程图，all in one

字体设置:Excalidraw字体设置

### 多窗口支持

Hover Editor

### 代码块折叠

Codeblock Customizer
