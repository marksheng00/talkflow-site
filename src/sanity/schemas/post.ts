import { defineType, defineField } from 'sanity'
import { TranslationManager } from '../components/TranslationManager'
import { LANGUAGES } from '../lib/languages'

export default defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'translationId',
            title: 'Translation ID',
            type: 'string',
            hidden: false, // We want to show the component
            components: {
                input: TranslationManager
            },
        }),
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
                list: LANGUAGES.map(l => ({ title: l.title, value: l.id })),
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
                isUnique: async (slug, context) => {
                    const { document, getClient } = context
                    const client = getClient({ apiVersion: '2021-10-21' })
                    const id = document?._id.replace(/^drafts\./, '')
                    const params = {
                        draft: `drafts.${id}`,
                        published: id,
                        slug,
                        language: document?.language || 'en'
                    }

                    const query = `!defined(*[
                        _type == "post" && 
                        !(_id in [$draft, $published]) && 
                        slug.current == $slug && 
                        (language == $language || (!defined(language) && $language == 'en'))
                    ][0]._id)`

                    return await client.fetch(query, params)
                }
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
