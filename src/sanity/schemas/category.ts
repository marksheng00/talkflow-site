import { defineType, defineField } from 'sanity'
import { ColorPicker } from '../components/ColorPicker'

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title (Multi-language)',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'zh', title: 'Simplified Chinese', type: 'string' },
                { name: 'zh_Hant', title: 'Traditional Chinese', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'ko', title: 'Korean', type: 'string' },
                { name: 'ja', title: 'Japanese', type: 'string' },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.en',
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
            name: 'parent',
            title: 'Parent Category',
            type: 'reference',
            to: [{ type: 'category' }],
            description: 'Optional: Select a parent category to create a hierarchy (e.g. AI -> LLM).'
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'string',
            components: {
                input: ColorPicker
            },
            initialValue: 'blue',
            hidden: ({ document }) => !!document?.parent,
        }),
    ],
    preview: {
        select: {
            title: 'title.en',
            subtitle: 'slug.current',
            color: 'color'
        },
        prepare({ title, subtitle, color }) {
            return {
                title: title || 'Untitled Category',
                subtitle: subtitle,
            }
        }
    }
})
