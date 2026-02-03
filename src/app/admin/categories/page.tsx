"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AdminContainer, AdminHeader, AdminButton, AdminSearch, AdminPagination } from "@/components/admin/ui/AdminKit";
import {
    Edit, Trash2, Plus, Tag, Hash, Loader2, CornerDownRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteCategory } from "./actions";

interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
    parent?: string; // Title of parent
    postCount: number;
}



export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
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
                const parents = data.filter(c => !c.parent).sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                const children = data.filter(c => c.parent);
                const sorted: Category[] = [];

                parents.forEach(parent => {
                    sorted.push(parent);
                    const myChildren = children.filter(child => child.parent === parent.title);
                    myChildren.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                    sorted.push(...myChildren);
                });

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
        (cat.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.slug?.current || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Mapping Taxonomies...
        </div>
    );

    return (
        <AdminContainer>
            <AdminHeader
                title="Blog Categories"
                description="Manage global taxonomy and content distribution."
                className="mb-6"
            >
                <AdminSearch
                    placeholder="Search categories..."
                    onSearch={setSearchQuery}
                    className="w-64"
                />
                <div className="h-4 w-px bg-white/10 mx-1" />
                <Link href="/admin/studio/intent/create/type=category;template=category" target="_blank">
                    <AdminButton icon={<Plus className="w-3.5 h-3.5" />}>
                        New Category
                    </AdminButton>
                </Link>
            </AdminHeader>

            <div className="border border-white/[0.05] rounded-2xl bg-zinc-900/10 overflow-hidden flex flex-col mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0c0c0e] border-b border-white/[0.05]">
                            <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                                <th className="px-6 py-4 w-1/3">Category Hierarchy</th>
                                <th className="px-6 py-4">Color Profile</th>
                                <th className="px-6 py-4 text-center">Referenced Posts</th>
                                <th className="px-6 py-4">Slug Index</th>
                                <th className="px-6 py-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredCategories.map((cat) => (
                                <tr key={cat._id} className="group hover:bg-white/[0.02] transition-colors">
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
                                                className={cn(
                                                    "font-bold transition-all hover:underline leading-none",
                                                    cat.parent ? "text-zinc-400 text-xs" : "text-zinc-100 text-[14px]"
                                                )}
                                            >
                                                {cat.title || "Untitled"}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {cat.color ? (
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", cat.color.startsWith('bg-') ? cat.color : `bg-${cat.color}-500/40`)} />
                                                <span className={cn("text-[10px] font-bold uppercase tracking-tight", cat.color.startsWith('text-') ? cat.color : `text-${cat.color}-400`)}>
                                                    {cat.color}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-zinc-700 font-bold uppercase italic">No Profile</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <div className={cn(
                                                "min-w-[32px] h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold",
                                                cat.postCount > 0 ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-white/5 text-zinc-600"
                                            )}>
                                                {cat.postCount}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-white/5 py-1 px-2 rounded-lg w-fit">
                                            <Hash className="w-3 h-3 opacity-30" />
                                            {cat.slug?.current}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/studio/intent/edit/id=${cat._id};type=category`} target="_blank">
                                                <AdminButton variant="ghost" size="sm" icon={<Edit className="w-3.5 h-3.5" />} />
                                            </Link>
                                            <AdminButton
                                                variant="danger"
                                                size="sm"
                                                icon={<Trash2 className="w-3.5 h-3.5" />}
                                                onClick={(e: React.MouseEvent) => handleDelete(cat._id, e)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Tag className="w-8 h-8 text-zinc-500" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No Taxonomies Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    totalItems={categories.length}
                    currentPage={1}
                    totalPages={1}
                    onPageChange={() => { }}
                />
            </div>
        </AdminContainer>
    );
}
