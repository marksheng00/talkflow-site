'use server'

import { client } from "@/sanity/lib/client"

const writeToken = process.env.SANITY_API_TOKEN

export async function deleteCategory(id: string) {
    if (!writeToken) {
        console.error("Missing SANITY_API_TOKEN")
        return { success: false, error: "Configuration error" }
    }

    try {
        // Use a write client
        const writeClient = client.withConfig({
            token: writeToken,
            useCdn: false // Always ensure freshness for writes
        })

        await writeClient.delete(id)
        return { success: true }
    } catch (error) {
        console.error("Failed to delete category:", error)
        return { success: false, error: String(error) }
    }
}
