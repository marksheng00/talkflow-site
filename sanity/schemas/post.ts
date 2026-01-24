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
            validation: (Rule) => Rule.required().min(5).max(100),
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: [
                    { title: 'English', value: 'en' },
                    { title: 'Simplified Chinese', value: 'zh' },
                    { title: 'Traditional Chinese', value: 'zh-Hant' },
                    { title: 'Spanish', value: 'es' },
                    { title: 'Korean', value: 'ko' },
                    { title: 'Japanese', value: 'ja' },
                ],
            },
            initialValue: 'en',
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
            description: 'Short summary for list view and SEO',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            fields: [
                {
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    description: 'Overrides the main title for SEO',
                },
                {
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    description: 'Overrides the excerpt for SEO',
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
            language: 'language',
        },
        prepare(selection) {
            const { author, language } = selection
            const langLabel = language ? `[${language.toUpperCase()}] ` : ''
            return {
                ...selection,
                title: `${langLabel}${selection.title}`,
                subtitle: author && `by ${author}`
            }
        },
    },
})
