import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'
import { format } from 'date-fns'

export default function BlogCard({ post }: { post: any }) {
    return (
        <Link
            href={`/blog/${post.slug.current}`}
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
                    {post.categories?.slice(0, 2).map((cat: any) => (
                        <span
                            key={cat.slug.current}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-${cat.color || 'emerald'}-500/30 text-${cat.color || 'emerald'}-400 bg-${cat.color || 'emerald'}-500/10`}
                        >
                            {cat.title}
                        </span>
                    ))}
                </div>

                <h3 className="font-heading text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-white/5">
                    {post.author?.image && (
                        <Image
                            src={urlFor(post.author.image).width(24).height(24).url()}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )}
                    <span className="font-medium text-slate-400">{post.author?.name}</span>
                    <span className="text-slate-600">·</span>
                    <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
                </div>
            </div>
        </Link>
    )
}
