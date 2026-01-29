import React from 'react';
import { BlogPost } from '@/types/blog';
import { urlFor } from '@/lib/sanity.image';

interface BlogPostJsonLdProps {
    post: BlogPost;
    locale: string;
}

export default function BlogPostJsonLd({ post, locale }: BlogPostJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.mainImage
            ? [urlFor(post.mainImage).width(1200).height(630).url()]
            : ["https://talkflo.hicall.ai/og-image.png"], // Fallback image
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "inLanguage": locale,
        "isAccessibleForFree": "True",
        "keywords": post.categories?.map(c => c.title).join(', ') || "AI English, Speaking Practice",
        "author": [{
            "@type": "Person",
            "name": post.author?.name || 'talkflo Team',
            "url": "https://talkflo.hicall.ai",
            "jobTitle": "AI Learning Expert"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "talkflo",
            "url": "https://talkflo.hicall.ai",
            "logo": {
                "@type": "ImageObject",
                "url": "https://talkflo.hicall.ai/talkflo_logo.png"
            }
        },
        "description": post.excerpt || post.seo?.metaDescription,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://talkflo.hicall.ai/${locale}/blog/${post.slug.current}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
