---
date: 2024-10-29 12:11
updated: 2024-12-03 21:45
tags:
  - 笔记
  - 分享
share: "true"
link: "false"
---

最近想整一个obsidian的笔记分享，[参考](https://lazyjoy.12123123.xyz/%E5%85%B6%E5%AE%83%E8%B5%84%E6%BA%90/Obsidian/Quartz%E4%B8%8EEnveloppe%E6%8F%92%E4%BB%B6%E7%BB%93%E5%90%88%E5%8A%A9%E5%8A%9BObsidian%E6%90%AD%E5%BB%BA%E6%95%B0%E5%AD%97%E8%8A%B1%E5%9B%AD/)

## Quartz部署

Quartz是一款快速静态站点生成器，可将Markdown内容转换为功能齐全的网站。Quartz 4现在使用基于节点的静态站点生成过程，这应该会带来更有用的错误消息和更流畅的用户体验。Quartz 4使用名为JSX的JavaScript语法扩展，它允许您在JavaScript中编写看起来像HTML的布局代码，这更容易理解和维护。Quartz最大的特点是与Obsidian结合良好，原生支持Obsidian的双链特性，在Obsidian中编辑的笔记几乎可以无改动直接发布到Quartz中。

### Quartz相关信息

Quartz相关信息：

- 项目地址：[GitHub - jackyzha0/quartz: a fast, batteries-included static-site generator that transforms Markdown content into fully functional websites](https://link.zhihu.com/?target=https%3A//github.com/jackyzha0/quartz)
- 官方文档：[Welcome to Quartz 4](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/)

### 创建项目分支

在Github中fork[原项目](https://link.zhihu.com/?target=https%3A//github.com/jackyzha0/quartz)，在自己的Github中创建原项目的分支。（也可以使用模板生成新的存储库，fork可以直接在github上同步原项目的更新）。

### 部署上线

[官方文档](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/hosting)很贴心地介绍了在各种免费提供静态网站托管服务的服务商上部署Quartz页面的流程。这里以[Cloudflare Pages](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/hosting%23cloudflare-pages)为例介绍下配置流程：

1. 登录[Cloudflare仪表板](https://link.zhihu.com/?target=https%3A//dash.cloudflare.com/)。
2. 在左侧帐户主页中，选择**Workers 和 Pages** > **创建** > **Pages**> **连接到Git**。
3. 选择刚才在自己Github账户中创建的分支存储库，点击**开始设置**，根据提示配置以下信息（以官方文档为准）：

| 配置选项   | 值                |
| ------ | ---------------- |
| 生产分支   | v4（即存储库中的主分支）    |
| 框架预设   | 无                |
| 构建命令   | npx quartz build |
| 构建输出目录 | public           |

其它参数保持默认即可。点击**保持并部署**。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241029121413.png)

Cloudflare应该会在大约一分钟内为我们的网站部署一个版本。然后，每次将Quartz更改同步到GitHub时，我们的网站都应该更新。

- Cloudflare Pages默认执行浅层克隆，因此如果您依赖 `git` 作为时间戳，建议您在构建命令的开头添加 `git fetch --unshallow &&` （例如 `git fetch --unshallow && npx quartz build` ）。
- 这里的时间戳主要用于表示笔记的**发布/修改**时间。在**不修改构建命令**并且**笔记中不含指示笔记日期的元数据**时，由于构建过程中拉取的文件的时间戳会被置为构建时的时间，这个时间会被拿来作为笔记的发布日期，导致文章的发布时间变为最后一次部署的时间，违背了使用者的本意。因此在不使用元数据表示发布日期的情况下，可以通过这个操作临时回避这个问题。
- 可以通过指定额外的元数据来表示笔记的发布时间等不同的属性，具体参考[官方文档](https://link.zhihu.com/?target=https%3A//developers.cloudflare.com/pages/platform/custom-domains/)。

可选的，如有有自己的域名，可以为部署的网站绑定自己的域名，在项目页面下**自定义域**标签中进行添加，具体操作请查看[Cloudflare的文档](https://link.zhihu.com/?target=https%3A//developers.cloudflare.com/pages/platform/custom-domains/)。

### 部署后说明

部署完毕后，直接访问生成的网站，会发现`404 not found`，因为我们还没有向网站中放入笔记内容。这里有必要介绍一下Quartz预设的使用方式和工作流。

打开存储仓库，在根目录中，存在一个名为`content`的文件夹，这个文件夹便是==存放个人笔记的目录==，是笔记的**根目录**。官方预设的工作流是，我们将存储仓库拉取到本地后，将`content`的文件夹作为Obsidian的仓库根目录，并在软件中新建或修改笔记，Quartz将所有笔记按照此目录下的结构进行发布，当然，可以通过设置元数据，指定笔记在网站上的标题或要求特定笔记不在网站上显示。

Obsidian充当了Quartz的功能强大的内容编辑器。 在Quartz存储库的`.gitignore`文件中，可以发现其中有`.obsidian`和`private`，前者是忽略Obsidian配置及插件相关的文件，后者大概是暗示我们可以将一些私密的笔记放在`private`目录下，避免在上传到Github上时不小心把隐私相关的笔记也传上去了，防止在存储库具有公开访问权限时引起不必要的麻烦。 此种工作流要求我们把笔记空间当作Quartz项目的一部分，并且笔记的结构和网站上保持一致。

此外，该项目在本地[安装](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/upgrading)、[编译](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/build)、[部署](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/hosting%23self-hosting)以及本地与远程存储库之间进行[同步](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/setting-up-your-GitHub-repository)以及从官方存储库[获取代码更新](https://link.zhihu.com/?target=https%3A//quartz.jzhao.xyz/upgrading)方面做的比较完善，感兴趣的可以参考官方文档在本地进行尝试，本文工作流涉及不到本地处理，如果不需要对项目代码进行较大修改，可以暂时略过这方面的操作。 借助Obsidian插件Enveloppe可以实现笔记库与网站的分离。

## Enveloppe配置

### 说明

插件相关信息：

- 插件名：Enveloppe
- - 项目地址：[GitHub - Enveloppe/obsidian-enveloppe: Enveloppe helps you to publish your notes on a GitHub repository from your Obsidian Vault, for free!](https://link.zhihu.com/?target=https%3A//github.com/Enveloppe/obsidian-enveloppe) 
- - 官方文档：[Home](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/)

Enveloppe是一款Obsidian的第三方插件，原名Github Publisher，貌似是原作者为了避免被误解为是由Obsidian或者Github团队制作的，不过只是改了下名字，功能没有发生变化。

该插件的主要用途是==将本地的笔记进行处理，发送到静态网站托管在GitHub上的存储库中，实现对分享内容的“投递”==。配合Github> Action，在存储库内容发送变化时自动触发编译操作，生成对应的静态页面，从而实现一键分享笔记的效果。不过Envelope只负责将笔记进行一定处理后上传到Github中的指定目录下，不关心用户以什么样的方式组织网站，网站的源码及所支持的功能由用户完全把控。理论上，只要能把笔记能转换成纯markdown文件，就可以通过Enveloppe将笔记一键发送到任意一种支持markdown语法的静态网站中去。 前文我们已经搭建了Quartz数字花园，下面就通过对Enveloppe进行配置，实现将笔记完美发布到Quartz中去。

> 注意：不要直接在网站的存储库中使用vault！此插件不适用于此类工作流。

下文或者官方文档中，所提的文档属性、元数据、frontmatter等，均为同一概念，请提前在**设置**-**核心插件**中，开启**文档属性视图**。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241029123501.png)

### Github Configuration

此部分的详细说明参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Settings/Github)。

- API Type：Free/Pro/Team (default)。
- - GitHub username：Github登录的账户名。
- Repository name：静态网站的存储库名字。
- GitHub token：具有操作存储库权限的token，[点此生成](https://link.zhihu.com/?target=https%3A//github.com/settings/tokens/new%3Fscopes%3Drepo%2Cworkflow)。其中，**scopes**保持链接默认选中的即可，**Expiration**设置过期时间，如果不想定期更换，可以选择**No expiration**。
- Main branch：上传笔记的分支，默认为main，目前Quartz的主分支是**v4**。
- GitHub Workflow：此标题下的选项保持默认即可。

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241029124233.png)

### File paths

此部分的详细说明参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Settings/Upload)。

- File tree in repository：推荐选**Obsidian Path**，保持本地笔记路径结构。如果想全部手动指定路径，可以选择 property key。

- Root folder：远程存储库中存放笔记的根目录，这里填**content**。

- Set the key where to get the value of the filename：可以通过设置自定义元数据指定上传后文件的名字，默认使用title为键。**_可开可不开_**。

- Apply edit on the folder path or the filename (automatically)：通用的路径和文件名替换规则，有的时候本地目录结构较复杂，而分享到远程存储库时没必要保持原有结构，可以使用此功能将复杂的路径映射到简单的路径上。注意此处一般是设置通用替换规则的，如果仅要特别指定某个文件的路径，可以使用其它方式实现，参考下文。**_可根据实际需求添加规则_**。

- Folder note：可以为目录指定笔记。在Quartz中，每个目录下的`index.md`文件会被当作目录笔记。开启该选项后，在上传笔记时把与目录同名的笔记自动更名为`index.md`（也可以指定修改后的文件名）。**_可开启，也可以通过其它方式手动指定_**，参考下文。

- Automatically add the "title" key with the file name：开启Folder note选项后，由于上传的文件名被改为`index.md`，笔记的默认标题也会变为index，开启此选项可以将原本的文件名添加到元数据中，让笔记在网站上可以正确显示。

- Auto clean up：自动从远程存储库中删除未发布的笔记，在笔记改名或者取消分享后很方便。如果远程存储库中的所有笔记只通过本地的Enveloppe插件进行分享，**没有其它途径上传的笔记时**，**_可以（推荐）开启_**。

- Excluded files and folder：排除的文件或文件夹，在清理时不会删除远程存储库中对应的目录或文件。我暂时没有特别排除的目录或文件，所以没填。

- Self-cleaning of attachments：删除笔记时自动删除对应的附件。**_可以开启_**，但是要注意多个笔记共享同一附件时可能会引发问题，使用时特别注意一下即可。

### Content

此部分的详细说明参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Settings/Content)。这些选项不会更改Obsidian Vault中文件的内容，但会更改GitHub中文件的属性。

#### Links

把 `links: false` 放在笔记的元数据中，可以防止链接被转换，并保留alt文本(或文件名)。

- Internals links：开启后，会将内链的路径转换为相对路径。使用dataview插件生成链接的话必须开启此选项。**_推荐开启_**，但是开启后需要修改Quartz中相关配置，确保笔记之间跳转行为正常。
- Convert internal links pointing to unpublished notes：对于指向的没有发布的文件，是否进行链接转换，关闭后只以链接的形式显示未分享文件的文件名。_**保持关闭即可**_，开启的话也只会跳转到404页面。如果链接指向的未发布文件也是有计划发布的，对于这种场景建议开启。
- Unlink：Convert internal links pointing to unpublished notes选项保持关闭时才能设置，开启后会把未发布的文件链接形式显示的文件名的链接格式去掉，以纯文本的形式显示文件名。
- `[[Wikilinks]]` to `[MDlinks](links)`：开启后将双链格式的链接转换为传统markdown格式的链接。由于Quartz支持双链格式，**_保持关闭即可_**。对于不支持双链的网站来说，开启此选项非常有用。
- Sluglify anchor in markdown links：markdown格式链接内容转换，可以选择将空格和非英文字符转换为兼容的格式。obsidian中不太会用到markdown链接，可以不用管。

#### Main text

- Markdown hard line break：严格换行模式，在标准markdown格式中必须两个换行才能实现分段。obsidian默认是不开启此模式的，开启后自动帮你转换，在使用严格换行模式的网站中兼容性会更好。Quartz可以通过配置关闭严格换行模式，参考下文。为了与obsidian中的渲染效果保持统一，_**我选择关闭此选项，并且在Quartz配置中关闭严格换行模式**_。
- Dataview：装了Dataview插件后才会显示此选项。将Dataview查询转换为markdown。_**强烈建议开启**_。
- Text replacer：可以添加自定义的文本替换规则，比如通过正则将一些隐私文本替换掉，不过我没有此类需求，没有配置。

#### Tags

Quartz对Obsidian的tag支持较好，此部分内容保持默认即可。

### Attachment & embeds

此部分的详细说明参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Settings/Embed)。

Send linked files：发送被链接的文件，**_保持开启_**，发布笔记时会自动上传链接的笔记和媒体文件。

> 注意：被链接的文件如果是笔记的话，只有符合设置的分享条件（标记为分享的笔记）才会被上传。

#### Attachments

- Transfer attachments：发送附件，**_开启_**。
- Structure：使用本地Obsidian的附件目录结构，**_开启_**。关闭的话需要手动设定上传存储库中媒体文件的路径，对于一些将静态资源和博客内容分离的网站系统来说比较有用。

后面的一些选项可以不用管，有需求参考官方文档配置即可。

#### Embed notes

- Transfer embedded notes：发送内嵌笔记，只有被设置为可分享的笔记才会被发送，**_开启_**。
- Change embed markup：更改嵌入笔记的行为，因为Quartz完全支持Obsidian的嵌入语法，这里保持**_No change_**即可。

### Plugin settings

此部分的详细说明参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Settings/Plugin)。

#### Sharing config

- Share all files：允许在不使用共享标记的情况下自动发送每个文件（除非它们被排除在外）。启用后即为黑名单模式，可以排除名称以DRAFT开头的所有文件。**_建议关闭_**，如有黑名单模式需求个人建议用Quartz官方推荐的工作流。
- Share key：分享标记，为要发布的笔记设置元数据信息，**_默认的键为share_**，即在文档属性中设置键值对`share: true`的笔记才会被发送到远程存储库。
- Excluded folders：排除文件夹列表，即使在排除文件夹内的笔记中将分享属性设置为 `true` ，它们也不会被共享。按需配置，适合排除特别隐私的文件夹。
- Set of options：我暂时没有搞清楚，应该用不到。

#### Menu

该模块是在界面中添加分享笔记选项菜单的，按需设置，不设置可以通过命令执行，或者使用cmdr插件自定义按钮执行。

#### Link building & copy

这一部分主要负责为发布的笔记生成分享链接并复制到剪切板中。注意此处的生成链接是指按照一定规则计算出所分享的笔记链接，计算规则需要和你所部署的网站在发布笔记时生成链接的规则一致才有使用意义。Quartz默认是按照分享的路径并对特殊字符进行处理产生链接的，此处可以稍微设置下便可与Quartz的笔记链接保持一致。

- Copy link：开启后分享单个链接后会自动将链接复制到剪切板中，_**建议开启**_。
- Base link：笔记网站的域名，填写服务商为你分配的域名，或者你自己绑定的域名地址。
- Deleting part of the link：删除生成的链接中多余的部分，使用Quartz的话填写**_content,index.md_**。
- Encode to URI：_**可开可不开**_，开启的话网址中的中文和空格都会被编码。
- Link slugify：**_Disiable_**。
- Add a text transformation to the URL：添加自定义的转换规则，我添加的如下：

| 匹配规则     | 替换内容 |
| -------- | ---- |
| /.\w+/$/ |      |
|          | -    |

解释：第一个规则是去掉文件末尾的拓展名和斜杠，（替换内容为空）；第二个规则是将路径中的空格替换为`-`。 注意如果开启了URI编码，则空格应该改为`%20`。

- Add a command to copy the link of the note (need reloading the plugin to take effect)：增加复制链接命令，**_建议开启_**，需要重启生效。

#### Others

- Show what files are edited, added, or deleted after uploaded：上传完毕后显示详细面板，**_可以开启_**，显示内容更详细。
- Save tab：开启后，下次打开插件会处在上传关闭时的页面，**_可开可不开_**。

#### Logs

调试或反馈问题用，不用管。

### 简易使用说明

- 写好笔记后，在想要分享的笔记的文档属性区，添加键值对`share: true`，然后`ctrl+P`打开命令面板，执行`Upload single current active note`命令即可发布。
- 笔记发生修改后，执行`Refresh all published note`检查发生修改的笔记并上传。
- 启用Auto clean up功能后，执行`Purge depublished and deleted files`可删除撤销发布的笔记。有的时候可能删不了，就需要手动去远程仓库中删除。
- 对于已经发布的笔记，想要复制链接分享给他人，打开文件后执行`Create a link to this note`，粘贴发送给他人即可。

其它命令的用法可参考[官方文档](https://link.zhihu.com/?target=https%3A//enveloppe.github.io/Commands)。

## 上传首页

此时访问会发现还是提示404，这是因为还没有上传首页的原因。
在任意目录下新建如下文档，命名为index.md。输入一下内容

```text

--- 
share: true 
path: content 
en-filename: index 
title: 首页 
created: 2024-09-13T14:36:50.000+08:00 
updated: 2024-09-23T15:56:30.292+08:00 
--- 

这是首页内容。

```

## quartz配置修改

### 修改链接处理

此时点击文章中的双链，会发现跳转到404页面。通过url可以看到这是因为链接多了一个文件夹。可以通过在`quartz.config.ts`修改链接处理来解决这个问题。

此插件解析链接并处理它们以指向正确的位置，详细说明参考[官方文档](https://quartz.jzhao.xyz/plugins/CrawlLinks)。这里应改成相对路径，不然在不同文件夹下点击笔记跳转时会出现问题。此外，可以开启懒加载选项，优化浏览体验。

```ts
      Plugin.CrawlLinks({ markdownLinkResolution: "relative", lazyLoad: true }),
```

### 其余修改

均参照[lazyjoy的笔记](https://lazyjoy.12123123.xyz/%E5%85%B6%E5%AE%83%E8%B5%84%E6%BA%90/Obsidian/Quartz%E4%B8%AA%E4%BA%BA%E9%85%8D%E7%BD%AE%E4%BF%AE%E6%94%B9%E8%AE%B0%E5%BD%95/)

#### 移动端导航目录

在`quartz.layout.ts`中修改，不是在`quartz.config.ts`中，原文写错了。

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241030151132.png)
