# SEO Landing Pages 批量创建和管理指南

## 系统概述

本系统基于 Sanity CMS + Next.js 构建，支持批量创建和管理 SEO landing pages，具有以下特点：

- **多语言支持**：支持 6 种语言（en, zh, zh-Hant, ko, es, ja）
- **SEO 优化**：内置 meta tags、JSON-LD、sitemap
- **灵活的内容结构**：支持多个内容区块、FAQ、相关页面
- **翻译管理**：集成翻译 Hub，便于多语言管理
- **状态管理**：Draft → Review → Published 工作流

## 文件结构

```
src/
├── sanity/
│   └── schemas/
│       └── seoLandingPage.ts          # Sanity schema 定义
├── app/
│   └── [locale]/
│       └── seo/
│           └── [slug]/
│               └── page.tsx            # 动态路由页面
├── lib/
│   └── sanity.queries.ts              # GROQ 查询
└── app/
    └── sitemap.ts                     # 自动生成 sitemap
```

## 批量创建策略

### 1. 关键词研究

在创建页面之前，先进行关键词研究：

**工具推荐：**
- Google Keyword Planner
- Ahrefs
- SEMrush
- Ubersuggest

**关键词分类：**
```
高商业意图（优先级 1-3）:
- "AI English speaking practice"
- "best language learning app"
- "IELTS speaking practice online"

中等商业意图（优先级 4-6）:
- "how to improve English speaking"
- "English pronunciation practice"
- "business English training"

信息类关键词（优先级 7-10）:
- "common English mistakes"
- "English speaking tips"
- "how to learn English fast"
```

### 2. 批量创建流程

#### 步骤 1：创建模板页面

在 Sanity 中创建一个模板页面，包含：
- 标准化的 Hero section
- 常用的内容区块
- FAQ 模板
- CTA 配置

#### 步骤 2：使用 Translation Hub 批量翻译

1. 创建英文版本（主版本）
2. 使用 Translation Hub 生成其他语言版本
3. 逐个翻译内容
4. 设置相同的 translationId

#### 步骤 3：批量导入（可选）

如果需要批量导入，可以使用 Sanity 的 CLI：

```bash
# 安装 Sanity CLI
npm install -g @sanity/cli

# 导入数据
sanity dataset import ./seo-pages.json production
```

**JSON 数据格式示例：**
```json
[
  {
    "_type": "seoLandingPage",
    "title": "AI English Speaking Practice",
    "subtitle": "Master English fluency with AI-powered conversations",
    "heroDescription": "Practice speaking English with our AI tutor...",
    "primaryKeyword": "AI English speaking practice",
    "targetKeywords": [
      "English speaking practice",
      "AI language learning",
      "online English tutor"
    ],
    "metaTitle": "AI English Speaking Practice - Free Online Tutor | TalkFlow",
    "metaDescription": "Practice English speaking with AI. Get instant feedback on pronunciation, grammar, and fluency. Free trial available.",
    "language": "en",
    "slug": {
      "current": "ai-english-speaking-practice",
      "_type": "slug"
    },
    "status": "published",
    "priority": 1,
    "ctaText": "Start Free Trial",
    "ctaLink": "/pricing",
    "publishedAt": "2024-01-15T10:00:00Z"
  }
]
```

### 3. 内容模板

#### 模板 A：功能导向页面

```
适用于：特定功能介绍
URL 示例：/seo/ai-english-speaking-practice

结构：
1. Hero
   - 标题：功能名称 + 核心价值
   - 副标题：简短描述
   - CTA：立即试用

2. 问题引入
   - 用户痛点场景
   - 当前解决方案的不足

3. 解决方案
   - 功能详细介绍
   - 技术原理
   - 使用示例

4. 优势对比
   - 与竞品对比
   - 数据支持

5. FAQ
   - 常见问题 5-8 个

6. CTA
   - 最终转化按钮
```

#### 模板 B：目标用户导向页面

```
适用于：特定用户群体
URL 示例：/seo/english-for-ielts

结构：
1. Hero
   - 标题：针对目标用户的解决方案
   - 副标题：用户痛点
   - CTA：开始备考

2. 用户画像
   - 目标用户描述
   - 挑战和目标

3. 解决方案
   - 如何帮助用户
   - 功能特性
   - 成功案例

4. 学习路径
   - 分步指南
   - 时间规划

5. FAQ
   - 考试相关 FAQ

6. CTA
   - 立即开始
```

#### 模板 C：问题解决导向页面

```
适用于：解决特定问题
URL 示例：/seo/how-to-improve-english-pronunciation

结构：
1. Hero
   - 标题：问题 + 解决方案
   - 副标题：为什么这个问题重要
   - CTA：立即改善

2. 问题分析
   - 问题原因
   - 常见错误

3. 解决方案
   - 方法 1：基础技巧
   - 方法 2：进阶技巧
   - 方法 3：工具推荐

4. 实践建议
   - 每日练习计划
   - 注意事项

5. FAQ
   - 相关问题

6. CTA
   - 开始练习
```

## 管理最佳实践

### 1. 内容管理

#### 定期更新
- **每月**：检查排名下降的页面
- **每季度**：更新数据和案例
- **每年**：全面审查所有页面

#### 内容优化
- 使用 A/B 测试优化 CTA
- 根据用户反馈调整内容
- 监控跳出率和停留时间

### 2. SEO 监控

#### 关键指标
```
排名监控：
- 目标关键词排名
- 长尾关键词排名
- 竞争对手排名

流量分析：
- 自然搜索流量
- 转化率
- 用户行为

技术指标：
- 页面加载速度
- 移动端友好性
- Core Web Vitals
```

#### 工具推荐
- Google Search Console
- Google Analytics
- Ahrefs / SEMrush
- PageSpeed Insights

### 3. 翻译管理

#### 工作流
```
1. 创建英文版本
   ↓
2. 使用 Translation Hub 生成框架
   ↓
3. 专业翻译（或使用翻译工具）
   ↓
4. 本地化审核
   ↓
5. 发布
```

#### 注意事项
- 不要直译，要本地化
- 考虑文化差异
- 检查关键词在不同语言中的搜索量
- 确保所有链接正确

### 4. 性能优化

#### 页面加载速度
- 压缩图片
- 使用 Next.js Image 组件
- 启用 CDN
- 减少第三方脚本

#### Core Web Vitals
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## 批量操作示例

### 使用 Sanity CLI 批量更新

```bash
# 导出所有 SEO landing pages
sanity dataset export production seo-pages-backup.tar.gz

# 批量更新状态（需要先导出，修改后重新导入）
# 修改 JSON 文件中的 status 字段
sanity dataset import seo-pages-updated.json production
```

### 使用脚本批量创建

创建 `scripts/create-seo-pages.js`:

```javascript
const pages = [
  {
    title: "AI English Speaking Practice",
    slug: "ai-english-speaking-practice",
    language: "en",
    // ... 其他字段
  },
  // 更多页面
];

pages.forEach(page => {
  // 使用 Sanity API 创建页面
});
```

## 常见问题

### Q: 如何确定页面的优先级？

A: 基于以下因素：
1. 关键词搜索量
2. 商业价值（转化潜力）
3. 竞争程度
4. 当前排名

优先级 1-3：高价值 + 高搜索量
优先级 4-6：中等价值
优先级 7-10：长尾关键词

### Q: 需要创建多少个 SEO landing pages？

A: 取决于：
- 目标市场大小
- 关键词数量
- 资源（内容创作能力）

建议：
- 初期：10-20 个核心页面
- 成长期：50-100 个页面
- 成熟期：100+ 页面

### Q: 如何避免内容重复？

A:
1. 每个页面针对不同的关键词
2. 提供独特的内容角度
3. 使用 canonical 标签
4. 定期审计内容

### Q: 如何衡量 SEO landing pages 的成功？

A:
- 主要指标：自然搜索流量增长
- 次要指标：转化率、排名提升
- 辅助指标：用户参与度、页面停留时间

## 下一步

1. **立即开始**：创建第一个 SEO landing page
2. **持续优化**：根据数据调整内容
3. **扩展规模**：批量创建更多页面
4. **监控效果**：定期分析 SEO 表现

## 相关资源

- [Sanity 文档](https://www.sanity.io/docs)
- [Next.js SEO 文档](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google SEO 指南](https://developers.google.com/search/docs)
- [Schema.org](https://schema.org/)
