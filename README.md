## 🧩 B站视频过滤助手

![Preview](https://github.com/Nokic233/bili-filter/blob/master/img/v1.4.0.png)

**让你的B站页面更干净、更专注。**

这是一款专为哔哩哔哩（Bilibili）用户打造的浏览器插件，可根据 **视频标题** 或 **UP主名称** 自动屏蔽不想看到的内容。
支持 **通配符** 匹配，提供多种过滤模式，覆盖B站主要页面。

---

### ✨ 功能特性

*   🔍 **智能过滤**：支持对 **视频标题** 和 **UP主名称** 进行关键词过滤。
*   🧩 **通配符支持**：支持使用通配符（如 `*`）进行模糊匹配，规则更灵活。
*   🎨 **三种过滤模式**：
    *   **模糊**：对匹配内容进行高斯模糊处理。
    *   **隐藏**：直接移除匹配内容，眼不见为净。
    *   **提示**：仅在卡片上标记过滤原因，不做视觉遮挡。
*   🏠 **全局覆盖**：
    *   首页推荐
    *   热门、每周必看、入站必刷
    *   **全站排行榜**（番剧、国创、游戏等全部分区）
    *   **搜索结果页**（综合搜索、视频搜索）
    *   视频播放页侧边推荐
*   ⚡ **即时生效**：更改设置后无需手动刷新，页面自动应用新规则。

---

### 🔧 安装方式

1. **Firefox 浏览器**：
   *   访问 [Firefox 商店](https://addons.mozilla.org/zh-CN/firefox/addon/bilifilter-%E9%80%9A%E8%BF%87%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4b%E7%AB%99%E8%A7%86%E9%A2%91/)。
   *   点击 **添加至 Firefox** 按钮，确认安装。

2. **Edge 浏览器**：
   *   访问 [Edge 商店](https://microsoftedge.microsoft.com/addons/detail/mdhlabejecfnlmfkoajjoficieadcejl)。
   *   点击 **获取** 按钮，确认安装。

3. **Chrome 浏览器**：
   *   由于 Chrome 商店审核限制，建议下载 Release 包手动安装，或自行编译安装。

---

### 💻 本地开发

如果你是开发者，或者想要体验最新功能，可以按以下步骤进行本地构建：

1. **克隆项目**
   ```bash
   git clone https://github.com/Nokic233/bili-filter.git
   cd bili-filter
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   此命令会启动 Chrome 浏览器并加载插件。

4. **构建生产版本**
   ```bash
   npm run build
   ```

---

### 📬 反馈与支持

如果遇到问题或有新功能建议，欢迎联系：

*   🐙 GitHub Issues：[https://github.com/Nokic233/bili-filter/issues](https://github.com/Nokic233/bili-filter/issues)
*   📧 邮箱：**[k1466006376@163.com](mailto:k1466006376@163.com)**
