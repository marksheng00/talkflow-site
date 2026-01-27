import { client } from '@/lib/sanity.client';
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/sanity.queries';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity.image';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN, zhTW } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { estimateReadingTime } from '@/lib/blog-helpers';
import type { PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import type { Metadata } from 'next';
import type { BlogPost, BlogCategory } from '@/types/blog';
import type { SanityImageSource } from '@sanity/image-url';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

// Helper to generate IDs from text
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

// Helper to extract text from PortableText blocks
const extractText = (block: PortableTextBlock): string => {
    if (!block.children) return '';
    return (block.children as Array<{ text: string }>).map((child) => child.text).join('');
};

// Generate static params for all posts across all languages
export async function generateStaticParams() {
    const posts = await client.fetch<Array<{ slug: { current: string }, language: string }>>(allPostSlugsQuery);
    return posts.map((post) => ({
        slug: post.slug.current,
        locale: post.language || 'en'
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params;
    if (!slug) return {};

    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug, language: locale });

    if (!post) return {};

    // Prepare alternates (hreflang)
    const languages: Record<string, string> = {};
    if (post.translations) {
        post.translations.forEach(t => {
            languages[t.language] = `/${t.language}/blog/${t.slug.current}`;
        });
    }

    return {
        title: post.seo?.metaTitle || `${post.title} | talkflo Blog`,
        description: post.seo?.metaDescription || post.excerpt,
        keywords: post.seo?.keywords,
        alternates: {
            canonical: `/${locale}/blog/${slug}`,
            languages
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
        },
    };
}

// Custom components for PortableText
type PortableImageValue = (SanityImageSource & { alt?: string }) | null;

const ptComponents: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            const imageValue = value as PortableImageValue;
            if (!imageValue || !(imageValue as { asset?: { _ref?: string } }).asset?._ref) {
                return null;
            }
            return (
                <div className="relative w-full aspect-video my-8 rounded-xl overflow-hidden bg-slate-800">
                    <Image
                        src={urlFor(imageValue).fit('max').auto('format').url()}
                        alt={imageValue.alt || 'Blog image'}
                        fill
                        className="object-contain"
                    />
                </div>
            );
        },
    },
    marks: {
        link: ({ children, value }) => {
            const linkValue = value as { href: string };
            const rel = !linkValue.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            return (
                <a href={linkValue.href} rel={rel} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30">
                    {children}
                </a>
            );
        },
    },
    block: {
        h2: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => {
            const id = slugify(extractText(value));
            return <h2 id={id} className="text-3xl font-bold text-white mt-12 mb-6 scroll-mt-32">{children}</h2>;
        },
        h3: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => {
            const id = slugify(extractText(value));
            return <h3 id={id} className="text-2xl font-bold text-white mt-10 mb-4 scroll-mt-32">{children}</h3>;
        },
        blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 italic text-slate-300 bg-white/5 rounded-r-lg">
                {children}
            </blockquote>
        ),
        normal: ({ children }: { children?: ReactNode }) => <p className="text-lg text-slate-300 leading-relaxed mb-6">{children}</p>,
    }
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;

    if (!slug) notFound();

    const [post, t] = await Promise.all([
        client.fetch<BlogPost | null>(postBySlugQuery, { slug, language: locale }),
        getTranslations({ locale, namespace: 'BlogPage' })
    ]);

    if (!post) notFound();

    // Extract headings for TOC
    const headings = (post.body || [])
        .filter((block: PortableTextBlock) => block._type === 'block' && (block.style === 'h2' || block.style === 'h3'))
        .map((block: PortableTextBlock) => ({
            id: slugify(extractText(block)),
            text: extractText(block),
            level: (block.style === 'h2' ? 2 : 3) as number
        }));

    const readingTime = estimateReadingTime(post.body || []);

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <section className="section-block section-hero">
                <div className="section-shell">

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Sidebar / TOC */}
                        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-32">
                            <div className="space-y-8 pt-3">
                                <Link
                                    href="/blog"
                                    locale={locale}
                                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group text-sm font-bold"
                                >
                                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    {t('Post.back')}
                                </Link>
                                <TableOfContents headings={headings} translation={t('Post.toc')} />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0">
                            {/* Mobile Back Link */}
                            <div className="lg:hidden mb-8">
                                <Link
                                    href="/blog"
                                    locale={locale}
                                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group text-sm font-bold"
                                >
                                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    {t('Post.back')}
                                </Link>
                            </div>

                            <article>
                                {/* Header */}
                                <header className="text-left">
                                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
                                        {post.title}
                                    </h1>

                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-8 border-y border-white/10 py-6 mb-12 w-full text-left">
                                        {/* Author */}
                                        <div className="flex items-center gap-4">
                                            {post.author?.image && (
                                                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
                                                    <Image
                                                        src={urlFor(post.author.image).width(96).height(96).url()}
                                                        alt={post.author.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">{t('Post.author')}</span>
                                                <span className="font-bold text-white text-lg whitespace-nowrap">{post.author?.name}</span>
                                            </div>
                                        </div>

                                        <div className="hidden md:block w-px h-10 bg-white/10" />

                                        {/* Date */}
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">{t('Post.published')}</span>
                                            <time className="text-white font-medium whitespace-nowrap">
                                                {post.publishedAt
                                                    ? format(
                                                        new Date(post.publishedAt),
                                                        (locale === 'zh' || locale === 'zh-Hant') ? 'yyyy年MM月dd日' : 'MMMM dd, yyyy',
                                                        {
                                                            locale: locale === 'zh' ? zhCN : (locale === 'zh-Hant' ? zhTW : undefined)
                                                        }
                                                    )
                                                    : t('Post.unknown')}
                                            </time>
                                        </div>

                                        <div className="hidden md:block w-px h-10 bg-white/10" />

                                        {/* Read Time */}
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">{t('Post.readTime')}</span>
                                            <div className="flex items-center gap-2 text-white font-medium whitespace-nowrap">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{t('Post.readSuffix', { minutes: readingTime })}</span>
                                            </div>
                                        </div>

                                        {post.categories && post.categories.length > 0 && (
                                            <>
                                                <div className="hidden md:block w-px h-10 bg-white/10" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">{t('Post.category')}</span>
                                                    <div className="flex items-center gap-2">
                                                        {post.categories.map((cat: BlogCategory) => (
                                                            <span
                                                                key={cat.slug.current}
                                                                className="text-white font-medium whitespace-nowrap"
                                                            >
                                                                {cat.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </header>

                                {/* Main Image */}
                                {post.mainImage && (
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-16">
                                        <Image
                                            src={urlFor(post.mainImage).width(1200).height(630).url()}
                                            alt={post.mainImage.alt || post.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}

                                {/* Body */}
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-emerald-400 prose-p:text-slate-300 prose-li:text-slate-300">
                                    <PortableText
                                        value={post.body}
                                        components={ptComponents}
                                    />
                                </div>
                            </article>
                        </main>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
