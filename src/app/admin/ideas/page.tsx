"use client";

import { useState, useEffect } from "react";
import { CommunityIdea, IdeaStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminIdeasPage() {
    const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchIdeas = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchIdeas();
    }, []);

    const updateStatus = async (id: string, newStatus: IdeaStatus) => {
        const { error } = await supabaseClient
            .from("community_ideas")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea));
        }
    };

    const acceptIdea = async (idea: CommunityIdea) => {
        // Just update status to 'planned'. No moving to roadmap table.
        await updateStatus(idea.id, "planned");
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

    if (loading) return <div className="text-white">Loading ideas...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading">Ideas Moderation</h1>

            <div className="grid gap-4">
                {ideas.map((idea) => (
                    <div key={idea.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider ${idea.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                                    idea.status === 'planned' ? 'bg-emerald-500/20 text-emerald-400' :
                                        idea.status === 'declined' ? 'bg-rose-500/20 text-rose-400' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {idea.status}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {new Date(idea.created_at || '').toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{idea.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>👍 {idea.upvotes} Upvotes</span>
                                <span>📂 {idea.category || 'Uncategorized'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                            {idea.status === 'open' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(idea.id, 'under_review')}
                                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-sm font-bold rounded-lg border border-amber-500/20 transition-colors text-left"
                                    >
                                        In Review
                                    </button>
                                </>
                            )}

                            {(idea.status === 'open' || idea.status === 'under_review') && (
                                <>
                                    <button
                                        onClick={() => acceptIdea(idea)}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-lg transition-colors text-left"
                                    >
                                        Accept & Plan
                                    </button>
                                    <button
                                        onClick={() => updateStatus(idea.id, 'declined')}
                                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-bold rounded-lg border border-rose-500/20 transition-colors text-left"
                                    >
                                        Decline
                                    </button>
                                </>
                            )}

                            {(idea.status === 'planned' || idea.status === 'declined') && (
                                <button
                                    onClick={() => updateStatus(idea.id, 'open')}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold rounded-lg border border-white/10 transition-colors text-left"
                                >
                                    Reset to Open
                                </button>
                            )}

                            <button
                                onClick={() => deleteIdea(idea.id)}
                                className="px-4 py-2 hover:bg-rose-950/30 text-rose-500/70 hover:text-rose-500 text-xs rounded-lg transition-colors text-left mt-2"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                ))}

                {ideas.length === 0 && (
                    <div className="p-12 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-4">
                        <p>No ideas submitted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
