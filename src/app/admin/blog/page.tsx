"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AdminContainer, AdminHeader } from "@/components/admin/ui/AdminKit";
import {
    Search, Filter, Edit, Trash2, Globe, ExternalLink,
    Calendar, User as UserIcon, Loader2, Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/sanity/lib/languages";
import { deleteBlogPost } from "./actions";

// Type definition based on your schema
interface BlogPost {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    language?: string;
    author?: { name: string };
    categories?: Array<{ title: string }>;
    _createdAt: string;
    _updatedAt: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

    // Fetch data from Sanity
    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[_type == "post"] | order(_createdAt desc) {
                _id,
                title,
                slug,
                excerpt,
                language,
                author->{name},
                categories[]->{title},
                _createdAt,
                _updatedAt
            }`;

            try {
                const data = await client.fetch(query);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Helper: Handle Delete



    // Helper: Handle Delete
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Stop navigation
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

        // Optimistic update
        setPosts(current => current.filter(p => p._id !== id));

        const result = await deleteBlogPost(id);
        if (!result.success) {
            alert("Failed to delete post. Please check console or token permissions.");
            // Revert changes if needed, or just reload
            window.location.reload();
        }
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug?.current.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLang = selectedLanguage === "all" || post.language === selectedLanguage;

        return matchesSearch && matchesLang;
    });

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading content...
        </div>
    );

    return (
        <AdminContainer>
            <div className="flex items-center justify-between mb-8">
                <AdminHeader title="Blog Editor" description="Manage and edit blog posts (Shortcut: Ctrl+N New Post)" className="mb-0" />
                <Link
                    href="/admin/studio/desk/post"
                    target="_blank"
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" /> New Post
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search title or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all font-medium"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="relative min-w-[140px]">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full appearance-none bg-zinc-900/50 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-zinc-300 outline-none focus:border-emerald-500/50 transition-all cursor-pointer font-medium"
                        >
                            <option value="all">All Languages</option>
                            {LANGUAGES.map(l => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="border border-white/[0.05] rounded-xl bg-zinc-900/10 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0c0c0e] border-b border-white/[0.05]">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Title</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap w-[300px]">Summary</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Language</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Author</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Created</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredPosts.map((post) => (
                                <tr key={post._id} className="group hover:bg-white/[0.02] transition-colors">
                                    {/* Title Column */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                href={`/admin/studio/structure/post;${post._id}`}
                                                target="_blank"
                                                className="text-sm font-bold text-zinc-200 hover:text-emerald-400 decoration-emerald-500/30 hover:underline transition-all line-clamp-2"
                                            >
                                                {post.title || "Untitled"}
                                            </Link>
                                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
                                                <span className="truncate max-w-[150px]">{post.slug?.current || "no-slug"}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Summary Column */}
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed max-w-[280px]">
                                            {post.excerpt || <span className="italic opacity-50">No summary</span>}
                                        </p>
                                    </td>

                                    {/* Language Column */}
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight gap-1.5",
                                            post.language === 'en' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-zinc-800 text-zinc-400 border border-white/5"
                                        )}>
                                            <Globe className="w-3 h-3" />
                                            {post.language ? post.language.toUpperCase() : 'EN'}
                                        </span>
                                    </td>

                                    {/* Author Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <UserIcon className="w-3 h-3 text-zinc-500" />
                                            </div>
                                            <span className="text-xs text-zinc-400 font-medium">
                                                {post.author?.name || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Dates Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium font-mono">
                                                <Calendar className="w-3 h-3 text-zinc-600" />
                                                {new Date(post._createdAt).toLocaleDateString()}
                                            </div>
                                            <span className="text-[9px] text-zinc-600 pl-4.5">
                                                Updated {new Date(post._updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/studio/structure/post;${post._id}`}
                                                target="_blank"
                                                className="p-2 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                                            >
                                                <Edit className="w-3.5 h-3.5" /> Edit
                                            </Link>
                                            <div className="w-px h-3 bg-white/10" />
                                            <button
                                                onClick={(e) => handleDelete(post._id, e)}
                                                className="p-2 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center text-zinc-500">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Search className="w-8 h-8 stroke-1" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No matching posts found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminContainer>
    );
}
