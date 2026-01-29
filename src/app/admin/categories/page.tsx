"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AdminContainer, AdminHeader } from "@/components/admin/ui/AdminKit";
import {
    Search, Edit, Trash2, Plus, Tag, Layers, Hash, Loader2, CornerDownRight
} from "lucide-react";
import Link from "next/link";
import { deleteCategory } from "./actions";

interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
    parent?: string; // Title of parent
    postCount: number;
}

// Map same as frontend, assuming styles are available globally
const COLOR_STYLES: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            // Fetch categories, parent title, and post count
            const query = `*[_type == "category"] | order(parent->title.en asc, title.en asc) {
                _id,
                "title": title.en,
                slug,
                color,
                "parent": parent->title.en,
                "postCount": count(*[_type == "post" && references(^._id)])
            }`;

            try {
                const data = await client.fetch<Category[]>(query);

                // Sort hierarchically in frontend
                const parents = data.filter(c => !c.parent).sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                const children = data.filter(c => c.parent);

                const sorted: Category[] = [];

                parents.forEach(parent => {
                    sorted.push(parent);
                    // Find children for this parent
                    const myChildren = children.filter(child => child.parent === parent.title);
                    // Sort children alphabetically
                    myChildren.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                    sorted.push(...myChildren);
                });

                // Handle orphans (children whose parent might be missing or renamed differently)
                // In exact match logic above, if parent title changed but ref didn't update in our logic... 
                // Wait, logic uses parent->title.en. If parent exists, we have its title.
                // The only edge case is if we can't match string to string perfectly or duplicates.
                // But generally safe. Any leftover children?
                const usedIds = new Set(sorted.map(s => s._id));
                const orphans = data.filter(c => !usedIds.has(c._id));
                sorted.push(...orphans);

                setCategories(sorted);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure? Deleting a category usually breaks references in posts.")) return;

        setCategories(current => current.filter(c => c._id !== id));
        const result = await deleteCategory(id);
        if (!result.success) {
            alert("Delete failed: " + result.error);
            window.location.reload();
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug?.current.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading categories...
        </div>
    );

    return (
        <AdminContainer>
            <div className="flex items-center justify-between mb-8">
                <AdminHeader title="Blog Categories" description="Manage taxonomy and view post distribution." className="mb-0" />
                <Link
                    href="/admin/studio/intent/create/type=category;template=category"
                    target="_blank"
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" /> New Category
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="border border-white/[0.05] rounded-xl bg-zinc-900/10 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0c0c0e] border-b border-white/[0.05]">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-1/3">Category Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Color</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Posts</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Slug</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredCategories.map((cat) => (
                                <tr key={cat._id} className="group hover:bg-white/[0.02] transition-colors">
                                    {/* Name Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {cat.parent && (
                                                <div className="flex items-center text-zinc-600 mr-2 ml-1">
                                                    <CornerDownRight className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                            <Link
                                                href={`/admin/studio/intent/edit/id=${cat._id};type=category`}
                                                target="_blank"
                                                className={`text-sm font-bold transition-all hover:underline decoration-emerald-500/30 ${cat.parent ? 'text-zinc-300' : 'text-zinc-100 text-base'}`}
                                            >
                                                {cat.title || "Untitled"}
                                            </Link>
                                        </div>
                                    </td>

                                    {/* Color Column */}
                                    <td className="px-6 py-4">
                                        {cat.color ? (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border ${COLOR_STYLES[cat.color] || 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                                {cat.color}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-zinc-600 italic">Inherited / None</span>
                                        )}
                                    </td>

                                    {/* Posts Count */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-6 rounded flex items-center justify-center text-xs font-bold ${cat.postCount > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-600'}`}>
                                                {cat.postCount}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Slug */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono bg-white/[0.02] px-2 py-1 rounded w-fit">
                                            <Hash className="w-3 h-3 opacity-50" />
                                            {cat.slug?.current}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/studio/intent/edit/id=${cat._id};type=category`}
                                                target="_blank"
                                                className="p-2 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                                            >
                                                <Edit className="w-3.5 h-3.5" /> Edit
                                            </Link>
                                            <div className="w-px h-3 bg-white/10" />
                                            <button
                                                onClick={(e) => handleDelete(cat._id, e)}
                                                className="p-2 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center text-zinc-500">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Tag className="w-8 h-8 stroke-1" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No categories found</p>
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
