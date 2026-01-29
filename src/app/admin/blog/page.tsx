"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AdminContainer, AdminHeader, AdminButton, AdminSearch, AdminStatusSelector, AdminPagination } from "@/components/admin/ui/AdminKit";
import {
    Edit, Trash2, Globe, ExternalLink,
    Calendar, User as UserIcon, Loader2, Plus, Hash, Tag
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
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 10;

    // Fetch data from Sanity
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const start = (page - 1) * PAGE_SIZE;
            const end = page * PAGE_SIZE;

            let filterString = '';
            if (selectedLanguage !== 'all') {
                filterString = ` && language == "${selectedLanguage}"`;
            }
            if (searchQuery) {
                // escape double quotes in search query
                const escapedSearch = searchQuery.replace(/"/g, '\\"');
                filterString += ` && title match "*${escapedSearch}*"`;
            }

            const query = `{
                "posts": *[_type == "post"${filterString}] | order(_createdAt desc) [${start}...${end}] {
                    _id,
                    title,
                    slug,
                    excerpt,
                    language,
                    author->{name},
                    categories[]->{title},
                    _createdAt,
                    _updatedAt
                },
                "total": count(*[_type == "post"${filterString}])
            }`;

            try {
                const { posts: data, total } = await client.fetch(query);
                setPosts(data || []);
                setTotalCount(total || 0);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, selectedLanguage, searchQuery]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [selectedLanguage, searchQuery]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

        setPosts(current => current.filter(p => p._id !== id));
        const result = await deleteBlogPost(id);
        if (!result.success) {
            alert("Failed to delete post.");
            window.location.reload();
        }
    };

    const filteredPosts = posts;

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing Blog Workspace...
        </div>
    );

    return (
        <AdminContainer>
            <AdminHeader
                title="Blog Editor"
                description="Manage and distribute multilingual blog content."
                className="mb-6"
            >
                <AdminSearch
                    placeholder="Search posts..."
                    onSearch={setSearchQuery}
                    className="w-64"
                />
                <AdminStatusSelector
                    value={selectedLanguage}
                    options={[
                        { value: 'all', label: 'All Languages' },
                        ...LANGUAGES.map(l => ({ value: l.id, label: l.title }))
                    ]}
                    onChange={setSelectedLanguage}
                />
                <div className="h-4 w-px bg-white/10 mx-1" />
                <Link href="/admin/studio/desk/post" target="_blank">
                    <AdminButton icon={<Plus className="w-3.5 h-3.5" />}>
                        New Post
                    </AdminButton>
                </Link>
            </AdminHeader>

            <div className="border border-white/[0.05] rounded-xl bg-zinc-900/10 overflow-hidden flex flex-col mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border-spacing-0">
                        <thead className="sticky top-0 bg-[#09090b] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                            <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Post Details</th>
                                <th className="px-6 py-4 font-bold">Language</th>
                                <th className="px-6 py-4 font-bold">Author</th>
                                <th className="px-6 py-4 font-bold text-right">Created</th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredPosts.map((post) => (
                                <tr key={post._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-6 max-w-xl">
                                        <div className="space-y-1">
                                            <Link
                                                href={`/admin/studio/intent/edit/id=${post._id}`}
                                                target="_blank"
                                                className="text-[14px] font-bold text-zinc-100 hover:text-white hover:underline transition-all block"
                                            >
                                                {post.title || "Untitled"}
                                            </Link>
                                            <p className="text-[12px] text-zinc-500 line-clamp-1">{post.excerpt || 'No description provided.'}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
                                                    {post.slug?.current || "no-slug"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2 py-1 rounded-md uppercase tracking-wider">
                                            {post.language || 'en'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <UserIcon className="w-2.5 h-2.5 text-zinc-500" />
                                            </div>
                                            <span className="text-xs text-zinc-400 font-medium">{post.author?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                                                {new Date(post._createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[9px] text-zinc-700 uppercase font-bold tracking-tighter">
                                                Updated {new Date(post._updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/studio/intent/edit/id=${post._id}`} target="_blank">
                                                <AdminButton variant="ghost" size="sm" icon={<Edit className="w-3.5 h-3.5" />} />
                                            </Link>
                                            <AdminButton
                                                variant="danger"
                                                size="sm"
                                                icon={<Trash2 className="w-3.5 h-3.5" />}
                                                onClick={(e: React.MouseEvent) => handleDelete(post._id, e)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-20 grayscale">
                                            <Tag className="w-8 h-8 mb-2 text-zinc-500" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No matching posts</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    totalItems={totalCount}
                    currentPage={page}
                    totalPages={Math.ceil(totalCount / PAGE_SIZE)}
                    onPageChange={setPage}
                />
            </div>
        </AdminContainer>
    );
}
