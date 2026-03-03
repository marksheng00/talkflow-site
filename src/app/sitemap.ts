import { MetadataRoute } from "next";
import { client } from "@/lib/sanity.client";
import { allPostSlugsQuery, allSeoLandingPageSlugsQuery } from "@/lib/sanity.queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://talkflo.hicall.ai";
    const locales = ['en', 'zh', 'zh-Hant', 'ko', 'es', 'ja'];
    const paths = ['', '/pricing', '/roadmap', '/blog', '/vision'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 1. Add static entries for each path across all locales
    paths.forEach(path => {
        locales.forEach(locale => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: path === '' ? "daily" : path === '/pricing' ? "monthly" : "weekly",
                priority: path === '' ? 1 : path === '/pricing' ? 0.8 : 0.6,
            });
        });
    });

    // 2. Fetch all blog posts and add them to the sitemap
    try {
        const posts = await client.fetch<{ slug: { current: string }, language?: string }[]>(allPostSlugsQuery);

        posts.forEach(post => {
            if (post.slug?.current) {
                const postLocale = post.language || 'en';
                sitemapEntries.push({
                    url: `${baseUrl}/${postLocale}/blog/${post.slug.current}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.5,
                });
            }
        });
    } catch (error) {
        console.error("Failed to fetch posts for sitemap:", error);
    }

    // 3. Fetch all SEO landing pages and add them to the sitemap
    try {
        const seoPages = await client.fetch<{ slug: { current: string }, language?: string }[]>(allSeoLandingPageSlugsQuery);

        seoPages.forEach(page => {
            if (page.slug?.current) {
                const pageLocale = page.language || 'en';
                sitemapEntries.push({
                    url: `${baseUrl}/${pageLocale}/seo/${page.slug.current}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.7,
                });
            }
        });
    } catch (error) {
        console.error("Failed to fetch SEO landing pages for sitemap:", error);
    }

    return sitemapEntries;
}
