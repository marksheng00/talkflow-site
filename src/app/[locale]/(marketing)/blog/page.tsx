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
import Link from 'next/link';
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
            ? client.fetch<BlogPost[]>(postsByCategoryQuery, { categorySlug, start, end })
            : client.fetch<BlogPost[]>(postsQuery, { start, end }),
        categorySlug
            ? client.fetch<number>(postsByCategoryCountQuery, { categorySlug })
            : client.fetch<number>(postsCountQuery),
        client.fetch<BlogCategory[]>(categoriesQuery)
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
                                    className={`px-3 py-2 rounded-xl text-sm transition-all ${!categorySlug
                                        ? 'bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {t('Sidebar.allPosts')}
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug.current}
                                        href={`/blog?category=${cat.slug.current}`}
                                        className={`px-3 py-2 rounded-xl text-sm transition-all ${categorySlug === cat.slug.current
                                            ? 'bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {cat.title}
                                    </Link>
                                ))}
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Category Filter */}
                            <div className="lg:hidden mb-8 overflow-x-auto pb-2 no-scrollbar flex gap-2">
                                <Link
                                    href="/blog"
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${!categorySlug
                                        ? 'bg-teal-500 text-black border-teal-500'
                                        : 'bg-white/5 border-white/10 text-slate-400'
                                        }`}
                                >
                                    {t('Hero.latest')}
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug.current}
                                        href={`/blog?category=${cat.slug.current}`}
                                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${categorySlug === cat.slug.current
                                            ? 'bg-teal-500 text-black border-teal-500'
                                            : 'bg-white/5 border-white/10 text-slate-400'
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
                                    <p className="text-slate-400 mb-4">{t('Empty.title')}</p>
                                    <Link
                                        href="/blog"
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
