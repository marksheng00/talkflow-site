"use client";

import { useState, useEffect } from "react";
import { BugReport, BugStatus, BugSeverity } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminBugsPage() {
    const [bugs, setBugs] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBugs = async () => {
        setLoading(true);
        const { data, error } = await supabaseClient
            .from("bug_reports")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching bugs:", error);
        else setBugs(data || []);

        setLoading(false);
    };

    useEffect(() => {
        fetchBugs();
    }, []);

    const updateStatus = async (id: string, newStatus: BugStatus) => {
        const { error } = await supabaseClient
            .from("bug_reports")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setBugs(bugs.map(b => b.id === id ? { ...b, status: newStatus } : b));
        }
    };

    if (loading) return <div className="text-white">Loading bug reports...</div>;

    const getSeverityColor = (s: BugSeverity) => {
        switch (s) {
            case 'blocker': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'major': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading">Bug Reports</h1>

            <div className="grid gap-4">
                {bugs.map((bug) => (
                    <div key={bug.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider ${getSeverityColor(bug.severity)}`}>
                                    {bug.severity}
                                </span>
                                <span className="px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                    {bug.platform}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {new Date(bug.created_at || '').toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{bug.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{bug.description || 'No description provided.'}</p>

                            {(bug.stepsToReproduce || bug.expectedResult || bug.actualResult) && (
                                <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-slate-400 space-y-2 mb-3">
                                    {bug.stepsToReproduce && <p><span className="text-slate-500">Steps:</span> {bug.stepsToReproduce}</p>}
                                    {bug.expectedResult && <p><span className="text-slate-500">Expected:</span> {bug.expectedResult}</p>}
                                    {bug.actualResult && <p><span className="text-slate-500 text-rose-400">Actual:</span> {bug.actualResult}</p>}
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Status: <strong className="text-white uppercase">{bug.status.replace('_', ' ')}</strong></span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                            <select
                                value={bug.status}
                                onChange={(e) => updateStatus(bug.id, e.target.value as BugStatus)}
                                className="px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="reported">Reported</option>
                                <option value="investigating">Investigating</option>
                                <option value="fixing">Fixing</option>
                                <option value="resolved">Resolved</option>
                                <option value="wont_fix">Won't Fix</option>
                            </select>
                        </div>
                    </div>
                ))}

                {bugs.length === 0 && (
                    <div className="p-12 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-4">
                        <p>No active bugs reported. Great job!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
