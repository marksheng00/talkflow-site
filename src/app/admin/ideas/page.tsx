"use client";

import { useState, useEffect } from "react";
import { CommunityIdea, IdeaStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import {
    ThumbsUp,
    Trash2,
    Clock,
    Loader2,
    MessageSquare,
    Activity,
    ArrowLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminContainer, AdminHeader, AdminBadge, AdminStatusSelector, AdminSegmentedControl, AdminButton, AdminDetailHeader, AdminPagination } from "@/components/admin/ui/AdminKit";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminIdeasPage() {
    const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
    const [selectedIdea, setSelectedIdea] = useState<CommunityIdea | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | IdeaStatus>('all');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 15;

    useEffect(() => {
        const fetchIdeas = async () => {
            setLoading(true);
            let query = supabaseClient
                .from("community_ideas")
                .select("*", { count: 'exact' });

            if (filter !== 'all') {
                query = query.eq("status", filter);
            }

            const { data, count, error } = await query
                .order("created_at", { ascending: false })
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

            if (error) {
                console.error("Error fetching ideas:", error);
            } else {
                setIdeas(data || []);
                setTotalCount(count || 0);
            }
            setLoading(false);
        };
        fetchIdeas();
    }, [filter, page]);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    const updateStatus = async (id: string, newStatus: IdeaStatus) => {
        setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status: newStatus as any } : idea));

        const { error } = await supabaseClient
            .from("community_ideas")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            alert("Failed to update status");
        }
    };

    const deleteIdea = async (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this idea?");
        if (!ok) return false;

        const { error } = await supabaseClient
            .from("community_ideas")
            .delete()
            .eq("id", id);

        if (!error) {
            setIdeas(ideas.filter(idea => idea.id !== id));
            return true;
        } else {
            console.error("Delete failed:", error);
            alert(`Failed to delete: ${error.message}`);
            return false;
        }
    };

    const filteredIdeas = ideas;

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading ideas...
        </div>
    );

    // DETAIL VIEW
    if (selectedIdea) {
        return (
            <div className="h-full flex flex-col bg-[#0b0b0d] text-zinc-300 animate-in fade-in duration-500 overflow-hidden">
                <AdminDetailHeader
                    title={selectedIdea.title}
                    subtitle={`ID: ${selectedIdea.id.slice(0, 8)}`}
                    onBack={() => setSelectedIdea(null)}
                >
                    <AdminStatusSelector
                        size="sm"
                        value={selectedIdea.status}
                        options={[
                            { value: 'open', label: 'Open' },
                            { value: 'under_review', label: 'Review' },
                            { value: 'planned', label: 'Planned' },
                            { value: 'declined', label: 'Declined' },
                        ]}
                        onChange={(s) => {
                            updateStatus(selectedIdea.id, s);
                            setSelectedIdea({ ...selectedIdea, status: s });
                        }}
                    />
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                            const success = await deleteIdea(selectedIdea.id);
                            if (success) setSelectedIdea(null);
                        }}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                    />
                </AdminDetailHeader>

                {/* Content - MINIMALISTIC REFACTOR */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Main Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {selectedIdea.description || <span className="text-zinc-600 italic">No description provided.</span>}
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.05] w-full" />

                        {/* Metadata Rows */}
                        <div className="grid grid-cols-3 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                                <div className="text-sm text-zinc-300 font-medium">{selectedIdea.category || 'General'}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Submitted</label>
                                <div className="text-sm text-zinc-300 font-mono">{new Date(selectedIdea.created_at || '').toLocaleString()}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upvotes</label>
                                <div className="text-sm text-zinc-300 font-mono">{selectedIdea.upvotes}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminContainer>
            <AdminHeader title="Ideas">
                <AdminSegmentedControl
                    options={[
                        { value: 'all', label: 'All' },
                        { value: 'open', label: 'Open' },
                        { value: 'under_review', label: 'Review' },
                        { value: 'planned', label: 'Planned' },
                        { value: 'declined', label: 'Declined' },
                    ]}
                    value={filter}
                    onChange={setFilter}
                />
            </AdminHeader>

            {/* Table View (Scalable) */}
            <div className="flex-1 overflow-hidden border border-white/[0.05] rounded-xl bg-zinc-900/10 flex flex-col mb-4">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse border-spacing-0">
                        <thead className="sticky top-0 bg-[#09090b] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                            <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Details</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold">Upvotes</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Submitted</th>
                                <th className="px-6 py-4 w-12 text-right pr-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredIdeas.map((idea) => (
                                <tr
                                    key={idea.id}
                                    onClick={() => setSelectedIdea(idea)}
                                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-6 max-w-xl">
                                        <div className="space-y-1">
                                            <h4 className="text-[14px] font-bold text-zinc-100">{idea.title}</h4>
                                            <p className="text-[12px] text-zinc-500 line-clamp-1">{idea.description || 'No description provided.'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                        {idea.category || 'General'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>{idea.upvotes}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <AdminStatusSelector
                                            value={idea.status}
                                            options={[
                                                { value: 'open', label: 'Open' },
                                                { value: 'under_review', label: 'Review' },
                                                { value: 'planned', label: 'Planned' },
                                                { value: 'declined', label: 'Declined' },
                                            ]}
                                            onChange={(s) => updateStatus(idea.id, s)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                                            {new Date(idea.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredIdeas.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20 grayscale">
                            <Activity className="w-8 h-8 mb-2 text-zinc-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No data found</p>
                        </div>
                    )}
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
