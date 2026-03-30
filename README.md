<p align="center">
  <img src="docs/logo.svg" width="300px"></img>
</p>
<p align="center">
  <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/dullage/flatnotes?style=for-the-badge">
</p>

**中文** |  [English](README_en.md)

一款自托管、零数据库的 Markdown 笔记系统。直接利用文件夹存储，简单、高效、透明，回归记录本质，为您打造私有零干扰的极致写作空间。

预览 [Demo 网页](https://demo.flatnotes.io) . *注意: 该演示网站每15分钟重置一次。*

## 📑 目录

* [设计理念](#⭐️ 设计理念)
* [功能特性](#🎉  功能特性)
* [快速开始](#🚀 快速开始)
* [发展规划](#🔭 发展规划)
* [参与贡献](#🤝 参与贡献)
* [赞助](#👍 赞助)
* [致谢](#🙏 致谢)

## ⭐️ 设计理念

《扁平笔记》旨在打造一款**零干扰**的云笔记应用，让记录回归内容本身。这意味着：

- **界面简洁纯净**：摒弃繁琐，只保留最核心的写作与阅读体验。
- **结构扁平化**：告别复杂的文件夹、笔记本分级。所有笔记一览无余，通过强大的**搜索**与**标签**功能，让查找变得轻而易举。
- **极速全局检索**：在应用任何位置，只需按下键盘快捷键 `/` 即可立即启动全文搜索。

​        另一个核心原则是：**不“绑架”您的数据**。您的笔记就是纯粹的 Markdown 文件，没有笨重的数据库，没有私有的加密格式，也没有复杂的文件夹结构。这意味着您拥有绝对的数据自主权，可以随时将文件迁移到其他应用中。

​        同时，《扁平笔记》仅缓存搜索索引，并在程序启动或每次执行搜索时进行增量同步。因此，即使在应用运行期间，您也可以自由地在外部使用其他编辑器（如 Typora 或 VS Code）添加、修改或删除这些 Markdown 文件，系统会自动感应变化。



## 🎉  功能特性

- **响应式移动界面**：完美适配手机、平板及桌面端，随时随地开启记录。
- **双模式编辑器**：支持原生 Markdown 源码及“所见即所得”（WYSIWYG）编辑模式。
- **高级搜索引擎**：基于全文检索的高级搜索功能，瞬间定位所需内容。
- **灵活标签系统**：通过“标签”功能轻松分类、关联和管理您的笔记。
- **高度可定制首页**：支持根据个人偏好自由配置首页展示逻辑。
- **双链引用 (Wikilink)**：支持 `[[双链]]`语法，轻松实现笔记间的跳转与关联。
- **自适应主题**：内置精美的亮色与暗黑主题，随心切换。
- **多重安全验证**：提供无验证、只读、用户名密码及 2FA 双重认证等多种访问控制方案。
- **标准 RESTful API**：开放接口，方便集成到您的自动化工作流或第三方应用中。

更多详情请参阅原作者 [维基页面](https://github.com/dullage/flatnotes/wiki)。



## 🚀 快速开始

本仓库已预设好 Docker 部署环境，您只需简单几步即可完成部署：

1. **克隆仓库到您的服务器：**

   ```bash
   sudo git clone https://github.com/litxiaxiang/flatnotes.git
   cd flatnotesSee
   ```

2. **配置环境变量：** 使用编辑器打开目录下的 `docker-compose.yml`，根据注释修改您的 **用户名**、**密码** 及 **端口号**。

   ```bash
   nano docker-compose.yml
   ```

3. **一键启动：**

   ```bash
   docker compose up -d --build
   ```

4. **版本更新：** 后续如果您想更新版本，只需执行以下自动化脚本（：

   ```bash
   cd flatnotesSee
   sudo ./update.sh
   ```

​        访问地址：`http://您的服务器IP:端口号`。更多详细配置请参考 [官方 Wiki](https://github.com/dullage/flatnotes/wiki)。



## 🔭 发展规划

​        我希望《扁平笔记》始终保持极致的简洁与专注，这意味着在功能开发上我会保持**克制**，以避免应用变得臃肿。尽管如此，我依然非常重视每一位用户的声音。如果您有任何改进建议或想法，欢迎随时提供反馈。



## 🤝 参与贡献

如果您有兴趣为《扁平笔记》贡献代码、修复 Bug 或提供改进建议，我们非常欢迎！请在开始之前阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 文件以了解相关规范。



## 👍 赞助

如果你觉得这个项目有用，请考虑请我喝杯啤酒。这真的会让我开心一整天。

[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/Dullage)



## 🙏 致谢

​        特别感谢两个出色的开源项目，它们让flatnotes成为可能。

* [Whoosh](https://whoosh.readthedocs.io/en/latest/intro.html) - 一个快速、纯Python的搜索引擎库。
* [TOAST UI Editor](https://ui.toast.com/tui-editor) - 一款适用于浏览器的GFM Markdown和所见即所得编辑器。