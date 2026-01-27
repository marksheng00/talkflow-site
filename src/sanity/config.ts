import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { structure } from './structure'

export default defineConfig({
    name: 'default',
    title: 'talkflo Admin Studio',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

    basePath: '/admin/studio',

    plugins: [structureTool({ structure }), visionTool()],

    schema: {
        types: schemaTypes,
    },
})
