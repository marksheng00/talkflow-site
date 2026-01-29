import { defineType, defineField } from 'sanity'

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
            options: {
                list: [
                    { title: 'Blue', value: 'blue' },
                    { title: 'Emerald', value: 'emerald' },
                    { title: 'Purple', value: 'purple' },
                    { title: 'Rose', value: 'rose' },
                    { title: 'Amber', value: 'amber' },
                    { title: 'Cyan', value: 'cyan' },
                ],
            },
            initialValue: 'blue'
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
                // We can even use the color to show a colored circle if we want, 
                // but standard preview just expects title/subtitle/media.
                // Sanity Studio doesn't natively render the 'color' string as a color unless we use custom media.
            }
        }
    }
})
