# TalkFlow Blog - Sanity CMS 实施方案

## 阶段 1: Sanity 项目初始化 (30分钟)

### 1.1 安装 Sanity CLI 并初始化项目
```bash
cd /Users/marksheng/Cursor/TalkFlow/TalkFlow_OWS/talkflow-site
npm install -g @sanity/cli
npx sanity init --project-plan free --dataset production
```

**回答交互式问题**:
- Project name: `talkflow-blog`
- Dataset: `production`
- Output path: `./sanity`
- Schema template: `Clean project with no predefined schemas`

### 1.2 安装前端依赖
```bash
npm install next-sanity @sanity/image-url @portabletext/react
npm install -D @sanity/types
```

---

## 阶段 2: Sanity Schema 设计 (1小时)

### 2.1 创建 Schema 文件

#### `sanity/schemas/author.ts`
```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    }),
  ],
})
```

#### `sanity/schemas/category.ts`
```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Emerald', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
          { title: 'Rose', value: 'rose' },
        ],
      },
    }),
  ],
})
```

#### `sanity/schemas/blockContent.ts`
```typescript
import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineArrayMember({
      type: 'code',
      options: {
        language: 'typescript',
        languageAlternatives: [
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
        ],
      },
    }),
  ],
})
```

#### `sanity/schemas/post.ts`
```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50).max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
```

#### `sanity/schemas/index.ts`
```typescript
import author from './author'
import category from './category'
import post from './post'
import blockContent from './blockContent'

export const schemaTypes = [post, author, category, blockContent]
```

### 2.2 配置 Sanity Studio

#### `sanity/sanity.config.ts`
```typescript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'TalkFlow Blog',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
```

---

## 阶段 3: Next.js 集成 (2小时)

### 3.1 创建 Sanity 客户端

#### `src/lib/sanity.client.ts`
```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
```

#### `src/lib/sanity.image.ts`
```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

#### `src/lib/sanity.queries.ts`
```typescript
import { groq } from 'next-sanity'

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug, color}
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "author": author->{name, image, bio},
    "categories": categories[]->{title, slug, color},
    seo
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && $category in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug, color}
  }
`
```

### 3.2 创建博客页面

#### `src/app/blog/page.tsx`
```typescript
import { client } from '@/lib/sanity.client'
import { postsQuery } from '@/lib/sanity.queries'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import BlogCard from '@/components/blog/BlogCard'

export const metadata = {
  title: 'Blog | TalkFlow - English Speaking Practice Tips',
  description: 'Learn how to improve your English speaking skills with AI-powered practice tips and insights.',
}

export const revalidate = 3600 // ISR: 每小时重新生成

async function getPosts() {
  return client.fetch(postsQuery)
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <AuroraBackground className="min-h-screen pb-24 text-white">
      <section className="section-shell pt-24">
        <div className="mb-12">
          <h1 className="font-heading text-5xl font-bold text-white mb-4">
            TalkFlow Blog
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Tips, insights, and stories to help you master English speaking with AI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </AuroraBackground>
  )
}
```

#### `src/app/blog/[slug]/page.tsx`
```typescript
import { client } from '@/lib/sanity.client'
import { postBySlugQuery, postsQuery } from '@/lib/sanity.queries'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity.image'
import Image from 'next/image'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await client.fetch(postsQuery)
  return posts.map((post: any) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug })
  
  if (!post) return {}

  return {
    title: post.seo?.metaTitle || `${post.title} | TalkFlow Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [urlFor(post.mainImage).width(1200).height(630).url()],
    },
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug })

  if (!post) notFound()

  return (
    <AuroraBackground className="min-h-screen pb-24 text-white">
      <article className="section-shell pt-24 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          {post.mainImage && (
            <div className="relative aspect-video w-full mb-8 rounded-2xl overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(1200).height(630).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {post.categories?.map((cat: any) => (
              <span
                key={cat.slug.current}
                className={`px-3 py-1 rounded-full text-xs font-bold bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/30`}
              >
                {cat.title}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-400">
            {post.author?.image && (
              <Image
                src={urlFor(post.author.image).width(48).height(48).url()}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-white font-medium">{post.author?.name}</p>
              <time className="text-sm">
                {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
              </time>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>
      </article>
    </AuroraBackground>
  )
}
```

### 3.3 创建组件

#### `src/components/blog/BlogCard.tsx`
```typescript
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'
import { format } from 'date-fns'

export default function BlogCard({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg"
    >
      {post.mainImage && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden">
          <Image
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {post.categories?.slice(0, 2).map((cat: any) => (
            <span
              key={cat.slug.current}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-500"
            >
              {cat.title}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-slate-500">
          {post.author?.image && (
            <Image
              src={urlFor(post.author.image).width(24).height(24).url()}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>{post.author?.name}</span>
          <span>·</span>
          <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
        </div>
      </div>
    </Link>
  )
}
```

---

## 阶段 4: 部署 Sanity Studio (30分钟)

### 4.1 本地启动 Studio
```bash
cd sanity
npm run dev
```
访问 `http://localhost:3333`

### 4.2 部署到 Sanity Cloud
```bash
cd sanity
npx sanity deploy
```
选择一个子域名，比如 `talkflow-blog`
Studio 会部署到 `https://talkflow-blog.sanity.studio`

### 4.3 配置 CORS
在 Sanity 管理后台添加允许的域名：
- `http://localhost:3000` (开发)
- `https://talkflow.hicall.ai` (生产)

---

## 阶段 5: 环境变量配置

### `.env.local`
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## 阶段 6: 测试和上线 (1小时)

### 6.1 创建测试数据
1. 访问 Sanity Studio
2. 创建 1-2 个作者
3. 创建 3-4 个分类
4. 写 2-3 篇测试文章

### 6.2 本地测试
```bash
npm run dev
```
访问 `http://localhost:3000/blog`

### 6.3 部署到 Vercel
```bash
git add .
git commit -m "feat: Add Sanity CMS blog"
git push
```

---

## 📊 时间估算

| 阶段 | 时间 |
|------|------|
| Sanity 初始化 | 30分钟 |
| Schema 设计 | 1小时 |
| Next.js 集成 | 2小时 |
| Studio 部署 | 30分钟 |
| 测试和上线 | 1小时 |
| **总计** | **5小时** |

---

## 🎯 后续优化

1. **添加搜索功能**
2. **添加评论系统** (Giscus)
3. **添加阅读时间估算**
4. **添加相关文章推荐**
5. **添加 RSS Feed**
6. **添加 Newsletter 订阅**
