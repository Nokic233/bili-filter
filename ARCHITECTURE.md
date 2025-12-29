# bili-filter 项目架构文档

`bili-filter` 是一款基于 **WXT (Web Extension Toolbox)** 框架开发的 B 站（Bilibili）视频过滤浏览器插件。它允许用户通过自定义关键词（视频标题或作者名称）来过滤 B 站各个页面的视频内容。

## 1. 技术栈 (Technology Stack)

*   **核心框架**: [WXT](https://wxt.dev/) (现代 Web Extension 开发框架)
*   **前端框架**: [Vue 3](https://vuejs.org/) (用于 Popup 界面开发)
*   **UI 组件库**: [Element Plus](https://element-plus.org/)
*   **编程语言**: TypeScript
*   **样式处理**: Sass (CSS 预处理器)
*   **匹配引擎**: [matcher](https://github.com/sindresorhus/matcher) (支持通配符的字符串匹配)

---

## 2. 核心模块设计 (Core Modules)

项目主要分为三个核心部分：**内容脚本 (Content Script)**、**弹出层 (Popup UI)** 和 **存储管理 (Storage)**。

### 2.1 内容脚本 (Content Script) —— `entrypoints/content.ts`
内容脚本是插件的核心，负责在 B 站页面上执行真实的过滤逻辑。
*   **页面适配器 (`pageConfigs`)**: 定义了 B 站不同页面（如首页、热门、搜索、排行榜、视频播放页等）的 URL 模式及其对应的 DOM 选择器（容器选择器、标题选择器、作者选择器）。
*   **动态监听**: 
    *   使用 `wxt:locationchange` 监听单页应用（SPA）的路由变化。
    *   使用 `MutationObserver` 监听 DOM 树的变化，确保异步加载、滚动加载的视频卡片也能被及时捕捉并过滤。
*   **过滤处理 (`handleCard`)**: 提取视频卡片中的标题和作者信息，与用户定义的过滤规则进行对比。

### 2.2 弹出层 (Popup UI) —— `entrypoints/popup/`
用户交互界面，基于 Vue 3 开发。
*   **功能**: 提供关键词输入、模式切换（模糊、隐藏、提示）、黑名单列表展示与管理。
*   **响应式**: 当用户在 Popup 中修改配置时，内容脚本会实时感知并更新当前页面的过滤效果。

### 2.3 存储管理 (Storage) —— `utils/storage.ts`
基于 WXT 提供的 `storage` API 封装，实现多端数据同步。
*   **配置项**: 
    *   `videoTitle`: 标题过滤关键词列表（支持通配符）。
    *   `authorName`: UP 主姓名过滤列表（支持通配符）。
    *   `filterMode`: 过滤模式（`blur` 模糊、`hide` 隐藏、`tip` 仅显示原因提示）。

---

## 3. 过滤机制 (Filtering Mechanism)

1.  **加载阶段**: 内容脚本根据当前 URL 匹配 `pageConfigs` 中的配置。
2.  **观察阶段**: 初始化 `MutationObserver` 监听目标容器（如视频列表 ul/div）。
3.  **匹配阶段**:
    *   从 DOM 中提取“标题”和“作者”。
    *   使用 `matcher` 库对标题进行规则匹配。
    *   对作者进行通配符匹配。
4.  **执行阶段**:
    *   根据匹配结果，为视频卡片所属的 DOM 节点添加对应的 CSS 类名（如 `.bili-filter-mode-blur`）。
    *   CSS 根据类名控制元素的滤镜、可见性或显示伪元素提示。

---

## 4. 目录结构说明 (Directory Structure)

```text
bili-filter/
├── assets/             # 静态资源及全局样式 (如过滤模式的 CSS 效果)
├── components/         # 可复用的 Vue 组件
├── entrypoints/        # 扩展入口
│   ├── background.ts   # 后台脚本
│   ├── content.ts      # 核心逻辑：内容脚本（控制 B 站页面 DOM）
│   └── popup/          # 插件点击弹窗的 Vue 应用
├── utils/              # 工具函数
│   ├── base.ts         # 基础工具
│   ├── dom.ts          # DOM 操作相关
│   ├── matcher.ts      # 匹配规则逻辑
│   └── storage.ts      # 插件存储配置封装
├── wxt.config.ts       # WXT 配置文件
├── package.json        # 依赖与脚本定义
└── tsconfig.json       # TypeScript 配置
```

---

## 5. 项目亮点

*   **低入侵性**: 通过 CSS 变量和类名实现过滤效果，不直接删除 DOM，性能损耗极低且支持实时切换。
*   **扩展性强**: 增加新页面的过滤支持只需在 `pageConfigs` 中添加几行配置，无需修改核心逻辑。
*   **开发体验**: 借力 WXT，支持开发时的热重载 (HMR) 和多浏览器自动构建。
