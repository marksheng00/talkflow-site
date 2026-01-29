"use client";

import { Link } from '@/navigation';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { estimateReadingTime } from '@/lib/blog-helpers';
import { Clock } from 'lucide-react';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { useTranslations, useLocale } from 'next-intl';

const COLOR_MAP: Record<string, string> = {
    blue: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    rose: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    indigo: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    orange: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    teal: "border-teal-500/30 text-teal-400 bg-teal-500/10",
    pink: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    sky: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    slate: "border-slate-500/30 text-slate-400 bg-slate-500/10",
};

export default function BlogCard({ post }: { post: BlogPost }) {
    const t = useTranslations('BlogPage');
    const localeSelection = useLocale();
    const readingTime = estimateReadingTime(post.body || []);

    return (
        <Link
            href={`/blog/${post.slug.current}`}
            locale={localeSelection}
            className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg h-full"
        >
            {post.mainImage && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800">
                    <Image
                        src={urlFor(post.mainImage).width(600).height(400).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2">
                    {post.categories?.slice(0, 2).map((cat: BlogCategory) => (
                        <span
                            key={cat.slug.current}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${COLOR_MAP[cat.color || 'emerald'] || COLOR_MAP['emerald']}`}
                        >
                            {cat.title}
                        </span>
                    ))}
                </div>

                <h2 className="font-heading text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                </h2>

                <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        {post.author?.image && (
                            <Image
                                src={urlFor(post.author.image).width(24).height(24).url()}
                                alt={post.author.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                            />
                        )}
                        <span className="font-medium text-neutral-400">{post.author?.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <time>
                            {post.publishedAt
                                ? format(new Date(post.publishedAt), localeSelection === 'zh' ? 'MM月dd日' : 'MMM dd', {
                                    locale: localeSelection === 'zh' ? zhCN : undefined
                                })
                                : ''}
                        </time>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t('Card.readingTime', { minutes: readingTime })}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
