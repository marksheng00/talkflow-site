"use client";

import { useState, useEffect } from "react";
import { BugReport, BugStatus, BugSeverity } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import {
    Bug,
    AlertTriangle,
    AlertOctagon,
    CheckCircle2,
    MoreHorizontal,
    Smartphone,
    Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminBugsPage() {
    const [bugs, setBugs] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all'); // Simplified filter

    useEffect(() => {
        const fetchBugs = async () => {
            const { data, error } = await supabaseClient
                .from("bug_reports")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) console.error("Error fetching bugs:", error);
            else setBugs(data || []);

            setLoading(false);
        };
        fetchBugs();
    }, []);

    const updateStatus = async (id: string, newStatus: BugStatus) => {
        // Optimistic
        setBugs(bugs.map(b => b.id === id ? { ...b, status: newStatus } : b));

        const { error } = await supabaseClient
            .from("bug_reports")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) alert("Failed to update bug status");
    };

    const getSeverityIcon = (s: BugSeverity) => {
        switch (s) {
            case 'blocker': return <AlertOctagon className="w-4 h-4 text-rose-500" />;
            case 'major': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default: return <Bug className="w-4 h-4 text-blue-400" />;
        }
    };

    const getPlatformIcon = (p: string) => {
        if (p?.toLowerCase().includes('ios') || p?.toLowerCase().includes('android')) return <Smartphone className="w-3.5 h-3.5" />;
        return <Monitor className="w-3.5 h-3.5" />;
    };

    const filteredBugs = bugs.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'open') return !['resolved', 'wont_fix'].includes(b.status);
        if (filter === 'resolved') return ['resolved', 'wont_fix'].includes(b.status);
        return true;
    });

    if (loading) return (
        <div className="h-full flex items-center justify-center text-zinc-500">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Loading reports...
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-[#09090b]">
            {/* Header */}
            <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-xl sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Bug Triage</h1>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex gap-1">
                        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
                        <FilterButton active={filter === 'open'} onClick={() => setFilter('open')} label="Open" />
                        <FilterButton active={filter === 'resolved'} onClick={() => setFilter('resolved')} label="Resolved" />
                    </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                    {filteredBugs.length} REPORTS
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 md:max-w-5xl md:mx-auto w-full">
                <div className="space-y-2">
                    {filteredBugs.map((bug) => (
                        <div
                            key={bug.id}
                            className="group flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-zinc-900/40 border border-white/[0.04] hover:bg-zinc-900 hover:border-zinc-700/50 transition-all items-start"
                        >
                            <div className="shrink-0 pt-1" title={bug.severity.toUpperCase()}>
                                {getSeverityIcon(bug.severity)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-medium text-zinc-200 truncate">{bug.title}</h3>
                                    <div className="flex items-center text-[10px] text-zinc-500 uppercase tracking-wider gap-2">
                                        <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">
                                            {getPlatformIcon(bug.platform)} {bug.platform}
                                        </span>
                                        <span className="text-zinc-600">•</span>
                                        <span>{new Date(bug.created_at || '').toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <p className="text-[13px] text-zinc-500 leading-relaxed mb-3">
                                    {bug.description || 'No description provided.'}
                                </p>

                                {(bug.stepsToReproduce || bug.expectedResult) && (
                                    <div className="text-xs font-mono text-zinc-500 bg-black/30 p-2 rounded border border-white/5 space-y-1 mb-2">
                                        {bug.stepsToReproduce && <div><span className="text-zinc-600">steps:</span> {bug.stepsToReproduce}</div>}
                                        {bug.expectedResult && <div><span className="text-zinc-600">expected:</span> {bug.expectedResult}</div>}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-[140px] shrink-0">
                                <StatusSelector current={bug.status} onChange={(s) => updateStatus(bug.id, s)} />
                            </div>
                        </div>
                    ))}

                    {filteredBugs.length === 0 && (
                        <div className="py-20 text-center text-zinc-500 text-sm">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-emerald-500/20" />
                            <p>No bugs found. Nice work!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                active
                    ? "bg-zinc-800 text-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
        >
            {label}
        </button>
    );
}

function StatusSelector({ current, onChange }: { current: BugStatus, onChange: (s: BugStatus) => void }) {
    const STATUSES: { value: BugStatus, label: string, color: string }[] = [
        { value: 'reported', label: 'Reported', color: 'text-zinc-400' },
        { value: 'investigating', label: 'Investigating', color: 'text-amber-400' },
        { value: 'fixing', label: 'Fixing', color: 'text-indigo-400' },
        { value: 'resolved', label: 'Resolved', color: 'text-emerald-400' },
        { value: 'wont_fix', label: "Won't Fix", color: 'text-rose-400' },
    ];

    return (
        <div className="relative">
            <select
                value={current}
                onChange={(e) => onChange(e.target.value as BugStatus)}
                className={cn(
                    "w-full appearance-none bg-zinc-950 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-xs font-bold uppercase tracking-wider outline-none focus:border-zinc-700 cursor-pointer transition-colors",
                    STATUSES.find(s => s.value === current)?.color
                )}
            >
                {STATUSES.map(s => (
                    <option key={s.value} value={s.value} className="text-zinc-300 bg-zinc-900">
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
