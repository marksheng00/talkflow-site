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
                { name: 'zh-Hant', title: 'Traditional Chinese', type: 'string' },
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
})
