import { client } from '@/lib/sanity.client';
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/sanity.queries';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity.image';
import Image from 'next/image';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { PortableTextComponents } from '@portabletext/react';
import type { Metadata } from 'next';
import type { BlogPost, BlogCategory } from '@/types/blog';
import type { SanityImageSource } from '@sanity/image-url';
import type { ReactNode } from 'react';

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = await client.fetch<Array<{ slug: { current: string } }>>(allPostSlugsQuery);
    return posts.map((post) => ({
        slug: post.slug.current,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    if (!slug) return {};

    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });

    if (!post) return {};

    return {
        title: post.seo?.metaTitle || `${post.title} | talkflo Blog`,
        description: post.seo?.metaDescription || post.excerpt,
        keywords: post.seo?.keywords,
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
        h2: ({ children }: { children?: ReactNode }) => <h2 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h2>,
        h3: ({ children }: { children?: ReactNode }) => <h3 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h3>,
        blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 italic text-slate-300 bg-white/5 rounded-r-lg">
                {children}
            </blockquote>
        ),
        normal: ({ children }: { children?: ReactNode }) => <p className="text-lg text-slate-300 leading-relaxed mb-6">{children}</p>,
    }
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) notFound();

    console.log('Fetching post for slug:', slug);
    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });
    console.log('Sanity fetch result:', post);

    if (!post) notFound();

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <section className="section-block">
                <div className="section-shell section-stack stack-base max-w-4xl mx-auto">

                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </Link>

                    <article>
                        {/* Header */}
                        <header className="section-stack text-center">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {post.categories?.map((cat: BlogCategory) => (
                                    <span
                                        key={cat.slug.current}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${cat.color || 'emerald'}-500/10 text-${cat.color || 'emerald'}-400 border border-${cat.color || 'emerald'}-500/20`}
                                    >
                                        {cat.title}
                                    </span>
                                ))}
                            </div>

                            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400 border-y border-white/5 py-6">
                                <div className="flex items-center gap-3">
                                    {post.author?.image && (
                                        <Image
                                            src={urlFor(post.author.image).width(48).height(48).url()}
                                            alt={post.author.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full ring-2 ring-white/10"
                                        />
                                    )}
                                    <div className="text-left">
                                        <p className="text-white font-bold">{post.author?.name}</p>
                                        <p className="text-xs">{post.author?.bio || 'Author'}</p>
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-10 bg-white/10" />

                                <div className="flex items-center gap-6 text-sm font-medium">
                                    <time>{post.publishedAt ? format(new Date(post.publishedAt), 'MMMM dd, yyyy') : 'Unknown Date'}</time>
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </header>

                        {/* Main Image */}
                        {post.mainImage && (
                            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
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
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-emerald-400">
                            <PortableText
                                value={post.body}
                                components={ptComponents}
                            />
                        </div>
                    </article>
                </div>
            </section>
        </AuroraBackground>
    )
}
