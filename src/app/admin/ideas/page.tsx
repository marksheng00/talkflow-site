"use client";

import { useState, useEffect } from "react";
import { CommunityIdea, IdeaStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import {
    ThumbsUp,
    Trash2,
    Clock,
    Loader2,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminIdeasPage() {
    const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | IdeaStatus>('all');

    useEffect(() => {
        const fetchIdeas = async () => {
            const { data, error } = await supabaseClient
                .from("community_ideas")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching ideas:", error);
            } else {
                setIdeas(data || []);
            }
            setLoading(false);
        };
        fetchIdeas();
    }, []);

    const updateStatus = async (id: string, newStatus: IdeaStatus) => {
        // Optimistic update
        setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea));

        const { error } = await supabaseClient
            .from("community_ideas")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            // Revert on error (could implement proper rollback, but alert for now)
            alert("Failed to update status");
        }
    };


    const deleteIdea = async (id: string) => {
        if (!confirm("Are you sure you want to delete this idea?")) return;

        const { error } = await supabaseClient
            .from("community_ideas")
            .delete()
            .eq("id", id);

        if (!error) {
            setIdeas(ideas.filter(idea => idea.id !== id));
        }
    };

    const filteredIdeas = filter === 'all' ? ideas : ideas.filter(i => i.status === filter);

    if (loading) return (
        <div className="h-full flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading inbox...
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-[#09090b]">
            {/* Header Toolbar */}
            <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-xl sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Idea Inbox</h1>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex gap-1">
                        {(['all', 'open', 'planned', 'under_review', 'declined'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider transition-all",
                                    filter === s
                                        ? "bg-zinc-800 text-zinc-200"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                    {filteredIdeas.length} ITEMS
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 md:max-w-5xl md:mx-auto w-full">
                <div className="space-y-3">
                    {filteredIdeas.map((idea) => (
                        <div
                            key={idea.id}
                            className="group flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/[0.04] hover:bg-zinc-900 hover:border-zinc-700/50 transition-all"
                        >
                            {/* Status Icon */}
                            <div className="shrink-0 pt-1">
                                <StatusBadge status={idea.status} />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-zinc-200 truncate">{idea.title}</h3>
                                    <span className="text-[10px] text-zinc-500 px-1.5 py-0.5 bg-zinc-800/50 rounded border border-white/5 capitalize">
                                        {idea.category || 'General'}
                                    </span>
                                </div>
                                <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2">
                                    {idea.description}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-600">
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        {idea.upvotes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(idea.created_at || '').toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Status Selector (Full Control) */}
                            <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0">
                                <IdeaStatusSelector current={idea.status} onChange={(s) => updateStatus(idea.id, s)} />
                                <button
                                    onClick={() => deleteIdea(idea.id)}
                                    className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors md:opacity-0 md:group-hover:opacity-100"
                                    title="Delete Permanently"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredIdeas.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-3">
                                <Filter className="w-5 h-5 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-sm">No ideas found in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: IdeaStatus }) {
    switch (status) {
        case 'open':
            return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" title="Open" />;
        case 'under_review':
            return <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Under Review" />;
        case 'planned':
            return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Planned" />;
        case 'declined':
            return <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" title="Declined" />;
    }
}

function IdeaStatusSelector({ current, onChange }: { current: IdeaStatus, onChange: (s: IdeaStatus) => void }) {
    const STATUSES: { value: IdeaStatus, label: string, color: string }[] = [
        { value: 'open', label: 'Open', color: 'text-zinc-400' },
        { value: 'under_review', label: 'Under Review', color: 'text-amber-400' },
        { value: 'planned', label: 'Planned', color: 'text-emerald-400' },
        { value: 'declined', label: 'Declined', color: 'text-rose-400' },
    ];

    return (
        <div className="relative">
            <select
                value={current}
                onChange={(e) => onChange(e.target.value as IdeaStatus)}
                className={cn(
                    "w-full appearance-none bg-zinc-950 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider outline-none focus:border-zinc-700 cursor-pointer transition-colors min-w-[120px]",
                    STATUSES.find(s => s.value === current)?.color
                )}
            >
                {STATUSES.map(s => (
                    <option key={s.value} value={s.value} className="text-zinc-300 bg-zinc-900 border-none">
                        {s.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <MoreHorizontal className="w-3.5 h-3.5" />
            </div>
        </div>
    );
}
