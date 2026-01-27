# 🚀 talkflo 博客发布全攻略：从创作到生产环境

本手册涵盖了在 talkflo 网站发布多语言博客的所有步骤。我们已经完成了底层的全自动化工程，你只需专注内容创作。

---

## 第一阶段：进入管理后台 (Sanity Studio)

1.  **访问方式**：
    Sanity Studio 现在已深度集成在 talkflo 站点的管理后台中。你无需再运行独立的命令。
2.  **访问地址**：
    *   **本地开发**：打开浏览器访问 `http://localhost:3000/admin/studio`。
    *   **生产环境**：访问 `https://(你的域名)/admin/studio`。
3.  **导航**：
    在登录 `talkflo Admin` 后台后，点击左侧侧边栏的 **"Blog Studio"** 图标即可直接进入。

---

## 第二阶段：配置分类 (Categories) —— 基础准备

*如果你已经创建好了分类，可以跳过此步。但请确保现有分类已补全多语言信息。*

1.  在左侧菜单点击 **Category**。
2.  **新建或编辑**：点击现有的分类（如 "Product Updates"）。
3.  **填入翻译**：
    *   在 **Title (Multi-language)** 下，你会看到针对 6 种语言的独立输入框。
    *   分别填入各语言名称（例如：English: `Product Updates`, Simplified Chinese: `产品更新`, Korean: `제품 업데이트`）。
4.  **点击 Publish**：确保分类信息已保存。
    *   *魔法说明：代码会自动根据当前页面语言切换标题，未填写的语言由系统自动回退至英文。*

---

## 第三阶段：创作博客文章 (Blog Post)

为了支持多语言 SEO，我们采取 **“一语言、一文档”** 的策略。

### 1. 创建第一篇（母版，如英文/中文）
1.  点击左侧 **Blog Post** -> 右上角 **Create new**。
2.  **设置语言 (重要)**：在 **Language** 下拉菜单选择对应的语言（如 `English`）。
3.  **填写基本信息**：
    *   **Title**: 文章标题。
    *   **Slug**: 点击 `Generate`。建议路径保持英文单词（对全球 SEO 最佳）。
    *   **Author**: 选择作者。
    *   **Main Image**: 上传封面图，务必填入 **Alt text**（有利于图片搜索曝光）。
4.  **撰写正文 (Body)**：使用块编辑器排版。

### 2. 进行 SEO 设置
1.  滚动到下方的 **SEO Settings**。
2.  **Meta Title**: 搜索结果显示的标题，可根据关键词优化。
3.  **Meta Description**: 极其重要！这是用户在 Google 搜索结果中看到的简介，写一句吸引人点击的话。
4.  **Keywords**: 添加核心关键词（如 `AI`, `English practice`, `talkflo updates`）。

### 3. 发布文章
点击右下角的 **Publish**。

---

## 第四阶段：发布对应的翻译版本

当你需要让同一篇内容出现在其他语言页面（如韩语）时：

1.  **新建文档**：再次点击 **Create new Blog Post**。
2.  **设置语言**：在 **Language** 选择 `Korean`。
3.  **对应 Slug**：建议将 Slug 设置为相关的名称（例如英文是 `launch-update`，韩文可以设置成同样的 `launch-update` 或 `launch-update-ko`）。
4.  **填入内容**：填入翻译后的韩语标题、正文和 SEO 信息。
5.  **点击 Publish**。

---

## 第五阶段：预览与推送上线

1.  **本地预览**：
    确保 Next.js 主程序正在运行 (`npm run dev`)。
    *   访问 `http://localhost:3000/en/blog` -> 确认内容。
    *   访问 `http://localhost:3000/ko/blog` -> 确认韩语版。
2.  **推送上线**：
    由于文章内容存储在 Sanity 云端，你无需推送代码即可完成发布。但如果你修改了 Schema 配置，请执行：
    ```bash
    git add .
    git commit -m "Update blog schema configuration"
    git push origin main
    ```
3.  **生产环境缓存**：
    我们的代码设置了 `revalidate = 3600` (1小时自动刷新缓存)。
    *   发布新文章后，如果正式环境没立刻出现，请等待一段时间，或者通过后台 Webhook（如果已配置）触发重新构建。

---

## 💡 技术背书：SEO 自动化说明

当你发布文章后，系统会自动处理以下底层 SEO：
*   **hreflang 关联**：自动生成的代码会告诉 Google 哪些文章是互为翻译版本。
*   **Canonical 规范项**：自动处理页面链接权重，防止重复内容降权。
*   **智能降级逻辑**：如果你还没来得及写某个语言的文章，系统会自动引导该语言下的用户看到英文母版，确保不出现 404 错误。
