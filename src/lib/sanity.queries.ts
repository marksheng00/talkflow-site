import { groq } from 'next-sanity'

// 基础文章字段
const postFields = groq`
  _id,
  title,
  slug,
  language,
  publishedAt,
  excerpt,
  mainImage,
  body,
  "author": author->{name, image},
  "categories": categories[]->{
    "title": coalesce(
      title[$language], 
      select($language == "zh-Hant" => title.zh_Hant),
      title.en,
      title
    ),
    slug,
    color
  }
`

// 获取所有文章 (支持分页 + 语言过滤)
// 逻辑：寻找当前语言的文章，如果没有 language 字段，则默认视为英语 (en)
export const postsQuery = groq`
  *[_type == "post" && (language == $language || (!defined(language) && $language == "en"))] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`

// 获取特定分类的文章 (支持分页 + 语言过滤)
export const postsByCategoryQuery = groq`
  *[_type == "post" && (language == $language || (!defined(language) && $language == "en")) && $categorySlug in categories[]->slug.current] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`

// 获取文章总数 (用于分页计算)
export const postsCountQuery = groq`count(*[_type == "post" && (language == $language || (!defined(language) && $language == "en"))])`
export const postsByCategoryCountQuery = groq`count(*[_type == "post" && (language == $language || (!defined(language) && $language == "en")) && $categorySlug in categories[]->slug.current])`

// 获取所有分类
export const categoriesQuery = groq`
  *[_type == "category"] | order(coalesce(title.en, title) asc) {
    "title": coalesce(
      title[$language], 
      select($language == "zh-Hant" => title.zh_Hant),
      title.en,
      title
    ),
    slug,
    color,
    description,
    "parent": parent->slug.current
  }
`

// 获取所有文章的 slugs（用于 generateStaticParams）
export const allPostSlugsQuery = groq`
  *[_type == "post"] {
    slug,
    language
  }
`

// 获取单个文章并包含关联的翻译（用于 SEO hreflang）
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && (language == $language || language == "en" || !defined(language))] | order(select(language == $language => 0, 1) asc)[0] {
    ${postFields},
    seo,
    "translations": *[_type == "post" && translationId == ^.translationId && _id != ^._id && defined(translationId)] {
      language,
      slug
    }
  }
`
