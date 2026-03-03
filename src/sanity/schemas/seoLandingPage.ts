import { defineType, defineField } from 'sanity'
import { TranslationManager } from '../components/TranslationManager'
import { LANGUAGES } from '../lib/languages'

export default defineType({
    name: 'seoLandingPage',
    title: 'SEO Landing Page',
    type: 'document',
    groups: [
        {
            name: 'editorial',
            title: 'Content',
            default: true,
        },
        {
            name: 'translate',
            title: 'Translate',
        },
        {
            name: 'seo',
            title: 'SEO',
        },
        {
            name: 'settings',
            title: 'Settings',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            group: 'editorial',
            validation: (Rule) => Rule.required().min(5).max(100),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
            group: 'editorial',
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: 'heroDescription',
            title: 'Hero Description',
            type: 'text',
            group: 'editorial',
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'introduction',
            title: 'Introduction',
            type: 'blockContent',
            group: 'editorial',
        }),
        defineField({
            name: 'sections',
            title: 'Content Sections',
            type: 'array',
            group: 'editorial',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'heading',
                            type: 'string',
                            title: 'Section Heading',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'content',
                            type: 'blockContent',
                            title: 'Section Content',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'highlight',
                            type: 'boolean',
                            title: 'Highlight Section',
                            initialValue: false,
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
            group: 'editorial',
            initialValue: 'Start Learning Now',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'string',
            group: 'editorial',
            initialValue: '/',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'translationId',
            title: 'Translation Hub',
            type: 'string',
            hidden: false,
            group: 'translate',
            components: {
                input: TranslationManager
            },
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            group: 'settings',
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
                        _type == "seoLandingPage" && 
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
            name: 'language',
            title: 'Language',
            type: 'string',
            group: 'settings',
            options: {
                list: LANGUAGES.map(l => ({ title: l.title, value: l.id })),
            },
            initialValue: 'en',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'targetKeywords',
            title: 'Target Keywords',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.min(1).max(10),
        }),
        defineField({
            name: 'primaryKeyword',
            title: 'Primary Keyword',
            type: 'string',
            group: 'seo',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'metaTitle',
            title: 'SEO Meta Title',
            type: 'string',
            group: 'seo',
            validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'SEO Meta Description',
            type: 'text',
            group: 'seo',
            rows: 3,
            validation: (Rule) => Rule.required().max(160),
        }),
        defineField({
            name: 'ogImage',
            title: 'OG Image',
            type: 'image',
            group: 'settings',
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
            name: 'faqItems',
            title: 'FAQ Items',
            type: 'array',
            group: 'editorial',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'question',
                            type: 'string',
                            title: 'Question',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'answer',
                            type: 'text',
                            title: 'Answer',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'relatedPages',
            title: 'Related Pages',
            type: 'array',
            group: 'settings',
            of: [
                {
                    type: 'reference',
                    to: { type: 'seoLandingPage' },
                },
            ],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            group: 'settings',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: 'Draft', value: 'draft' },
                    { title: 'Review', value: 'review' },
                    { title: 'Published', value: 'published' },
                ],
            },
            initialValue: 'draft',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'priority',
            title: 'SEO Priority',
            type: 'number',
            group: 'seo',
            description: '1 = highest, 10 = lowest',
            validation: (Rule) => Rule.required().min(1).max(10),
            initialValue: 5,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            slug: 'slug.current',
            language: 'language',
            status: 'status',
        },
        prepare(selection) {
            const { slug, language, status } = selection
            const langLabel = language ? `[${language.toUpperCase()}] ` : ''
            const statusLabel = status ? `(${status})` : ''
            return {
                ...selection,
                title: `${langLabel}${selection.title} ${statusLabel}`,
                subtitle: slug ? `/seo/${slug}` : 'No slug',
            }
        },
    },
})
