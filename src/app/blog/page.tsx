import { client } from '@/lib/sanity.client'
import { postsQuery } from '@/lib/sanity.queries'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import BlogCard from '@/components/blog/BlogCard'
import { BookOpen } from 'lucide-react'

export const metadata = {
    title: 'Blog | TalkFlow - English Speaking Practice Tips',
    description: 'Learn how to improve your English speaking skills with AI-powered practice tips and insights.',
}

// Revalidate every hour
export const revalidate = 3600

async function getPosts() {
    return client.fetch(postsQuery)
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <section className="section-shell pt-24 md:pt-32">
                <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>TalkFlow Blog</span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
                        Master the art of <span className="text-emerald-400">fluent speaking</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                        Expert tips, learning strategies, and product updates to help you speak English with confidence.
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post: any) => (
                            <BlogCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <p className="text-slate-400 text-lg">No posts yet. Check back soon!</p>
                    </div>
                )}
            </section>
        </AuroraBackground>
    )
}
