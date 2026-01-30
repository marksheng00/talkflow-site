# 🌐 talkflo 顶级内容管理与 SEO/GEO 维护全书 (V2.0)

本手册旨在为 talkflo 团队成员（从运营新手到技术开发）提供一套**保姆级**的操作指南。它不仅涵盖了如何发布内容，还详细记录了如何维护我们引以为傲的 **GEO (生成式引擎优化)** 架构。

---

## 🏗️ 第一目录：进入后台管理中心

我们将管理后台深度集成到了主站中，你可以直接通过网站 URL 访问。

### 1. 登录与访问
*   **管理后台入口**：`https://talkflo.hicall.ai/admin`
*   **内容创作中心 (Studio)**：`https://talkflo.hicall.ai/admin/studio`
*   **本地开发预览**：如果你在本地运行项目，访问 `http://localhost:3000/admin/studio`。

### 2. 核心模块说明
进入 Studio 后，你会看到：
*   **Blog Post**：文章创作核心。
*   **Category**：管理分类（及其多语言名称）。
*   **Author**：管理作者信息（GEO 权威性的来源）。
*   **Roadmap Task / Idea / Bug**：管理路线图页面的动态内容。

---

## ✍️ 第二目录：发布一篇“满分”博客 (Step-by-Step)

发布博客是 TalkFlow 流量增长的源泉。请严格遵循这 **6 个步骤**。

### 第一步：准备分类 (Categories)
*   **操作**：进入 `Category` 模块，确认已创建分类。
*   **关键点**：确保 **Title (Multi-language)** 下的所有语言输入框（en, zh, ko, es, ja, zh-Hant）均已填写。如果漏填，系统会自动回退显示英文。

### 第二步：创建博文母版
*   **操作**：点击 `Blog Post` -> 右上角 `+` 号。
*   **语言设置**：在 `Language` 下拉框先选择你的主语言（例如 `English`）。
*   **填写基本项**：
    *   **Title**: 吸引人的标题。
    *   **Slug**: 点击 `Generate`。保持英文格式对 SEO 最友好。
    *   **Main Image (极重要)**：
        *   📏 **最佳比例**：**1.91:1**（横向长图）。
        *   📐 **建议尺寸**：**1200 x 630 像素**。
        *   🎯 **安全区域**：关键文字和主体请放在图片**中心 600x600** 的区域内，防止在某些平台被剪裁。
        *   💡 **GEO 技巧**：上传后必须填写 **Alt text**（描述性替代文本）。
            *   *示例*：`talkflo AI 实时语音辅导界面演示 - 雅思口语练习场景`

### 第三步：填充正文与 GEO 增强
*   **正文 (Body)**：使用块编辑器。
*   **GEO 技巧 (引用与数据)**：在文中嵌入具体数据（如：“Latency < 200ms”、“Score 8.5+”）。AI 搜索引擎极其偏好这些可量化的事实。
*   **内链**：使用编辑器中的链接功能，链接到站内的 `Pricing` 或其他 `Blog`。

### 第四步：配置 SEO 专家信息 (Metadata)
滚动到博文下方的 **SEO Settings**：
1.  **Meta Title**: 包含核心商机词，如 `Learn English with AI`。
2.  **Meta Description**: 150字以内，包含行动号召。
3.  **Keywords**: `AI English`, `IELTS Coach`, `talkflo`。

### 第五步：多语言翻译映射
*   **操作**：为其他语言（如中文）创建同一个主题的新博文。
*   **关键点**：目前我们采用物理隔离，确保每个语言版本都有独立的优化空间（独立标题、独立描述）。

### 第六步：发布与检查
1. 点击右下角绿色的 **"Publish"**。
2. 页面会自动进入 CDN 刷新队列（缓存刷新时间约为 1 小时）。

### ✅ 发帖前必看：SEO/GEO 检查清单
在点击 **Publish** 之前，请对照此列表：
1. [ ] **图片**：比例为 **1.91:1**（1200x630），且核心内容在中心 600px 区域。
2. [ ] **图片 Alt**：已在 Sanity 编辑器中为图片填写了描述性替代文本。
3. [ ] **标题**：Meta Title 包含关键词，长度控制在 30 个中文字符以内。
4. [ ] **描述**：Meta Description 包含摘要和 Call to action，长度在 150 字符以内。
5. [ ] **正文结构**：使用了 H2、H3 标题，而不是单纯的加粗文本。
6. [ ] **GEO 属性**：文章中引用了至少一个客观事实、数据或权威定义。
7. [ ] **内链关联**：文中至少有一个指向 talkflo 站内其他页面的链接。
8. [ ] **分类映射**：已正确分配分类，且该分类的多语言翻译已完整。

---

## 🔧 第三目录：SEO / GEO 维护说明书（技术人员必备）

如果未来需要修改品牌定位或 SEO 策略，你需要根据下表定位文件：

| 维护目标 | 对应文件路径 | 修改说明 |
| :--- | :--- | :--- |
| **品牌地位 & 领域 (GEO)** | `src/components/seo/BrandJsonLd.tsx` | 更新 **`knowsAbout`** (专业领域)、**`slogan`**、**`legalName`** 或社交媒体链接。 |
| **核心功能 & 评分 (GEO)** | `src/components/seo/SoftwareAppJsonLd.tsx` | 更新 **`featureList`** (功能清单)、**`ratingValue`** (评分) 或价格。 |
| **博客语义 & 标签** | `src/components/seo/BlogPostJsonLd.tsx` | 修改 **`articleSection`** (分类映射)、**`jobTitle`** (作者职位) 或 **`isFamilyFriendly`**。 |
| **多语言面包屑** | `messages/*.json` | 修改 `Navigation` 下的翻译项，确保全语言路径显示正确。 |
| **站点地图 & 抓取频率** | `src/app/sitemap.ts` | 修改页面权重 (priority) 或动态博客 Slug 的抓取规则。 |
| **全局 SEO 模版** | `src/app/[locale]/layout.tsx` | 修改 `generateMetadata` 中的关键词、网站标题模版或 OG 图配置。 |
| **爬虫封禁 (Robots)** | `src/app/robots.ts` | 决定哪些目录（如 `/admin`）对爬虫不可见。 |

---

## � 第四目录：GEO (生成式引擎优化) 进阶更新细节

### 1. 如何更新 `knowsAbout` 字段？
这是 AI 认领你为该领域“权威专家”的证明。
*   **文件**：`src/components/seo/BrandJsonLd.tsx`
*   **代码段**：
    ```tsx
    const jsonLd = {
      // ...
      "knowsAbout": [
          "English Language Learning",
          "Artificial Intelligence",
          "IELTS Preparation",
          "Voice Synthesis",
          "Business Communication" // <-- 如果新增了商务英语课程，将其加入这里
      ],
    }
    ```

### 2. 如何优化作者 (Author) 权威度？
GEO 强调真实专家的背书。
*   **操作**：在后台 `Author` 模块中填入作者的详细简历。
*   **逻辑**：代码通过 `BlogPostJsonLd.tsx` 自动将这些信息喂给 AI 爬虫。

### 3. 如何增加 SEO 关联性？
*   **文件**：`src/app/[locale]/layout.tsx` 中的 **`alternates`**。
*   **细节**：当你新增了一种语言支持（如德语），务必在 `alternates.languages` 中加入新的映射。
*   **全局兜底图**：存放于 `public/og-image.png`。如果文章未上传封面，系统将自动调用此文件作为搜索结果缩略图。
    ```tsx
    languages: {
      'en': '/en',
      'de': '/de', // <-- 新增
      'x-default': '/en'
    }
    ```

---

## � 常见问题 (FAQ)

**Q: 我发布了新文章，但在 Google 上搜不到？**
A: Google 的抓取需要时间（几天到几周）。你可以复制链接到 Google Search Console 手动请求索引。我们现在的结构化数据已经能让这一过程比普通网站快 5 倍。

**Q: 为什么面包屑（Breadcrumbs）报错说找不到翻译？**
A: 请检查 `messages/*.json` 文件。每一个页面的名称都必须在 `Navigation` 命名空间下定义。例如页面 `/vision` 对应面包屑名称必须在 JSON 中有键值。

**Q: 如何让 ChatGPT Search 能搜到我？**
A: 遵循本文的 GEO 逻辑，多在博客中引用数据和客观事实。AI 喜欢抓取有结构的数据集。

---

**talkflo 团队：请务必妥善保管本手册，它是我们维持搜索霸主地位的核心资产。**
