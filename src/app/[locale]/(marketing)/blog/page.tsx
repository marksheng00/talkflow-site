import { client } from '@/lib/sanity.client';
import {
    postsQuery,
    postsCountQuery,
    categoriesQuery,
    postsByCategoryQuery,
    postsByCategoryCountQuery
} from '@/lib/sanity.queries';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import BlogCard from '@/components/blog/BlogCard';
import { ChevronLeft, ChevronRight, Filter, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

import { Link } from '@/navigation';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'BlogPage' });

    return {
        title: `${t('Hero.articles')} | talkflo - English Speaking Practice Tips`,
        description: 'Expert tips, learning strategies, and product updates to help you speak English with confidence.',
    };
}

export const revalidate = 3600
const POSTS_PER_PAGE = 9

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; category?: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'BlogPage' });
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj.page) || 1;
    const categorySlug = searchParamsObj.category;
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    const [posts, totalPosts, categories] = await Promise.all([
        categorySlug
            ? client.fetch<BlogPost[]>(postsByCategoryQuery, { categorySlug, start, end, language: locale })
            : client.fetch<BlogPost[]>(postsQuery, { start, end, language: locale }),
        categorySlug
            ? client.fetch<number>(postsByCategoryCountQuery, { categorySlug, language: locale })
            : client.fetch<number>(postsCountQuery, { language: locale }),
        client.fetch<BlogCategory[]>(categoriesQuery, { language: locale })
    ]);

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const currentCategory = categories.find((c) => c.slug.current === categorySlug);

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <section className="section-block section-hero">
                <div className="section-shell section-stack stack-base">
                    {/* Header */}
                    <div className="section-heading">
                        <h1 className="font-heading text-5xl md:text-8xl font-bold tracking-tighter text-foreground leading-[1.1] md:leading-[0.9] whitespace-normal md:whitespace-nowrap">
                            {currentCategory ? (
                                <>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-teal-400 animate-text-shimmer bg-[size:200%_auto] pb-4 inline-block">{currentCategory.title}</span> {t('Hero.articles')}
                                </>
                            ) : (
                                <>
                                    {t('Hero.latest')}{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-cyan-400 animate-text-shimmer bg-[size:200%_auto] pb-4 inline-block">
                                        {t('Hero.insights')}
                                    </span>
                                </>
                            )}
                        </h1>
                    </div>

                    {/* Two-column layout */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Sidebar (Desktop) */}
                        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-32">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Filter className="w-3 h-3" />
                                {t('Sidebar.categories')}
                            </h3>
                            <nav className="flex flex-col space-y-1">
                                <Link
                                    href="/blog"
                                    locale={locale}
                                    className={`px-3 py-2 rounded-xl text-sm transition-all ${!categorySlug
                                        ? 'bg-teal-500/20 text-teal-400 font-bold'
                                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {t('Sidebar.allPosts')}
                                </Link>
                                {categories
                                    .filter(cat => !cat.parent)
                                    .map((parent) => {
                                        const children = categories.filter(c => c.parent === parent.slug.current);
                                        const isChildActive = children.some(c => c.slug.current === categorySlug);
                                        // Only highlight parent if explicitly selected, NOT if a child is selected
                                        const isParentActive = categorySlug === parent.slug.current;

                                        return (
                                            <div key={parent.slug.current} className="group relative">
                                                <Link
                                                    href={`/blog?category=${parent.slug.current}`}
                                                    locale={locale}
                                                    className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between ${isParentActive
                                                        ? 'bg-teal-500/20 text-teal-400 font-bold'
                                                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    {parent.title}
                                                    {children.length > 0 && (
                                                        <ChevronRight
                                                            className={cn(
                                                                "w-3.5 h-3.5 transition-transform opacity-50 text-neutral-400 group-hover:text-white group-hover:opacity-100",
                                                                isChildActive ? "rotate-90 opacity-100 text-white" : "group-hover:rotate-90"
                                                            )}
                                                        />
                                                    )}
                                                </Link>

                                                {children.length > 0 && (
                                                    <div
                                                        className={cn(
                                                            "flex-col ml-4 mt-0.5 border-l border-white/10 pl-2 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200 origin-top",
                                                            isChildActive ? "flex" : "hidden group-hover:flex"
                                                        )}
                                                    >
                                                        {children.map(child => (
                                                            <Link
                                                                key={child.slug.current}
                                                                href={`/blog?category=${child.slug.current}`}
                                                                locale={locale}
                                                                className={`px-3 py-1.5 rounded-lg text-xs transition-all block ${categorySlug === child.slug.current
                                                                    ? 'text-teal-400 font-bold bg-teal-500/10 hover:bg-teal-500/20'
                                                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                                                    }`}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Category Filter */}
                            <div className="lg:hidden mb-8 overflow-x-auto pb-2 no-scrollbar flex gap-2">
                                <Link
                                    href="/blog"
                                    locale={locale}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${!categorySlug
                                        ? 'bg-teal-500 text-black border-teal-500'
                                        : 'bg-white/5 border-white/10 text-neutral-400'
                                        }`}
                                >
                                    {t('Hero.latest')}
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug.current}
                                        href={`/blog?category=${cat.slug.current}`}
                                        locale={locale}
                                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${categorySlug === cat.slug.current
                                            ? 'bg-teal-500 text-black border-teal-500'
                                            : 'bg-white/5 border-white/10 text-neutral-400'
                                            }`}
                                    >
                                        {cat.title}
                                    </Link>
                                ))}
                            </div>

                            {/* Blog Cards */}
                            {posts.length > 0 ? (
                                <>
                                    <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
                                        {posts.map((post) => (
                                            <BlogCard key={post._id} post={post} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center items-center gap-3">
                                            {page > 1 && (
                                                <Link
                                                    href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                                                    locale={locale}
                                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> {t('Pagination.prev')}
                                                </Link>
                                            )}

                                            <span className="px-3 py-1.5 text-slate-500 text-sm tabular-nums">
                                                {page} / {totalPages}
                                            </span>

                                            {page < totalPages && (
                                                <Link
                                                    href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                                                    locale={locale}
                                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                                                >
                                                    {t('Pagination.next')} <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-2xl border border-white/10 border-dashed text-center">
                                    <BookOpen className="w-10 h-10 text-slate-600 mb-3" />
                                    <p className="text-neutral-400 mb-4">{t('Empty.title')}</p>
                                    <Link
                                        href="/blog"
                                        locale={locale}
                                        className="px-5 py-2 rounded-xl bg-teal-500 text-black font-bold text-sm hover:bg-teal-400 transition-colors"
                                    >
                                        {t('Empty.button')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>


        </AuroraBackground>
    )
}
