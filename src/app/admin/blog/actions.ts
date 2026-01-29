'use server'

import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN, // This will be read from server env
    useCdn: false,
})

export async function deleteBlogPost(id: string) {
    if (!process.env.SANITY_API_TOKEN) {
        throw new Error("Missing SANITY_API_TOKEN")
    }

    try {
        await client.delete(id)
        revalidatePath('/admin/blog')
        return { success: true }
    } catch (error) {
        console.error("Delete failed:", error)
        return { success: false, error: "Failed to delete post" }
    }
}
