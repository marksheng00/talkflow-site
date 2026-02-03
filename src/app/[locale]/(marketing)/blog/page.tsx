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
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { buttonStyles } from "@/components/ui/Button";
import { badgeStyles } from "@/components/ui/Badge";
import { CategoriesSidebar } from "@/components/blog/CategoriesSidebar";

import { Link } from '@/navigation';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { getTranslations } from 'next-intl/server';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

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
    const navT = await getTranslations({ locale, namespace: 'Navigation' });

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: navT('home'), item: '/' },
                    { name: navT('blog'), item: '/blog' }
                ]}
            />
            <AuroraBackground className="min-h-screen pb-24 text-white">
                <section className="section-block section-hero">
                    <div className="section-shell section-stack stack-base">
                        {/* Header */}
                        <div className="section-heading">
                            <h1 className="typo-hero text-foreground whitespace-normal md:whitespace-nowrap">
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
                            <CategoriesSidebar
                                categories={categories}
                                categorySlug={categorySlug}
                                locale={locale}
                                labels={{
                                    categories: t('Sidebar.categories'),
                                    allPosts: t('Sidebar.allPosts'),
                                }}
                            />

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                {/* Mobile Category Filter */}
                                <div className="lg:hidden mb-8 overflow-x-auto pb-2 no-scrollbar flex gap-2">
                                    <Link
                                        href="/blog"
                                        locale={locale}
                                        className={badgeStyles({
                                            tone: !categorySlug ? "teal" : "slate",
                                            variant: !categorySlug ? "solid" : "ghost",
                                            size: "lg",
                                            caps: false,
                                            interactive: true,
                                            className: !categorySlug ? "border-transparent" : undefined,
                                        })}
                                    >
                                        {t('Hero.latest')}
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug.current}
                                            href={`/blog?category=${cat.slug.current}`}
                                            locale={locale}
                                            className={badgeStyles({
                                                tone: categorySlug === cat.slug.current ? "teal" : "slate",
                                                variant: categorySlug === cat.slug.current ? "solid" : "ghost",
                                                size: "lg",
                                                caps: false,
                                                interactive: true,
                                                className: categorySlug === cat.slug.current ? "border-transparent" : undefined,
                                            })}
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
                                                        className={buttonStyles({
                                                            variant: "secondary",
                                                            size: "sm",
                                                            weight: "medium",
                                                            className: "gap-2",
                                                        })}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" /> {t('Pagination.prev')}
                                                    </Link>
                                                )}

                                                <span className="px-3 py-1.5 typo-body-sm text-slate-500 tabular-nums">
                                                    {page} / {totalPages}
                                                </span>

                                                {page < totalPages && (
                                                    <Link
                                                        href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                                                        locale={locale}
                                                        className={buttonStyles({
                                                            variant: "secondary",
                                                            size: "sm",
                                                            weight: "medium",
                                                            className: "gap-2",
                                                        })}
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
                                            className={buttonStyles({
                                                variant: "accent",
                                                size: "sm",
                                            })}
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
        </>
    )
}
