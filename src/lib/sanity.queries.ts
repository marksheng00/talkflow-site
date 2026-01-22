import { groq } from 'next-sanity'

// 基础文章字段
const postFields = groq`
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  body,
  "author": author->{name, image},
  "categories": categories[]->{title, slug, color}
`

// 获取所有文章 (支持分页)
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`

// 获取特定分类的文章 (支持分页)
export const postsByCategoryQuery = groq`
  *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`

// 获取文章总数 (用于分页计算)
export const postsCountQuery = groq`count(*[_type == "post"])`
export const postsByCategoryCountQuery = groq`count(*[_type == "post" && $categorySlug in categories[]->slug.current])`

// 获取所有分类
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    title,
    slug,
    color,
    description
  }
`

// 获取所有文章的 slugs（用于 generateStaticParams）
export const allPostSlugsQuery = groq`
  *[_type == "post"] {
    slug
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    seo
  }
`
