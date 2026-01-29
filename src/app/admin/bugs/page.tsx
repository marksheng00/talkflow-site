"use client";

import { useState, useEffect } from "react";
import { BugReport, BugStatus, BugSeverity } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import {
    Bug,
    Clock,
    Loader2,
    Smartphone,
    Monitor,
    Trash2,
    ShieldAlert,
    Activity,
    ArrowLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminContainer, AdminHeader, AdminBadge, AdminStatusSelector, AdminSegmentedControl, AdminButton, AdminDetailHeader, AdminPagination } from "@/components/admin/ui/AdminKit";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminBugsPage() {
    const [bugs, setBugs] = useState<BugReport[]>([]);
    const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<BugStatus | 'all'>('all');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 15;

    useEffect(() => {
        const fetchBugs = async () => {
            setLoading(true);
            let query = supabaseClient
                .from("bug_reports")
                .select("*", { count: 'exact' });

            if (filter !== 'all') {
                query = query.eq("status", filter);
            }

            const { data, count, error } = await query
                .order("created_at", { ascending: false })
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

            if (error) {
                console.error("Error fetching bugs:", error);
            } else {
                setBugs(data || []);
                setTotalCount(count || 0);
            }
            setLoading(false);
        };
        fetchBugs();
    }, [filter, page]);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    const updateStatus = async (id: string, newStatus: BugStatus) => {
        setBugs(bugs.map(b => b.id === id ? { ...b, status: newStatus as any } : b));

        const { error } = await supabaseClient
            .from("bug_reports")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            alert("Failed to update bug status");
        }
    };

    const deleteBug = async (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this bug report?");
        if (!ok) return false;

        const { error } = await supabaseClient
            .from("bug_reports")
            .delete()
            .eq("id", id);

        if (!error) {
            setBugs(bugs.filter(b => b.id !== id));
            return true;
        } else {
            console.error("Delete failed:", error);
            alert(`Failed to delete: ${error.message}`);
            return false;
        }
    };

    const getSeverityVariant = (s: BugSeverity) => {
        switch (s) {
            case 'blocker': return "rose";
            case 'major': return "amber";
            default: return "blue";
        }
    };

    const getPlatformIcon = (p: string) => {
        if (p?.toLowerCase().includes('ios') || p?.toLowerCase().includes('android')) return <Smartphone className="w-3 h-3" />;
        return <Monitor className="w-3 h-3" />;
    };

    const filteredBugs = bugs;

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading reports...
        </div>
    );

    // DETAIL VIEW
    if (selectedBug) {
        return (
            <div className="h-full flex flex-col bg-[#0b0b0d] text-zinc-300 animate-in fade-in duration-500 overflow-hidden">
                <AdminDetailHeader
                    title={selectedBug.title}
                    subtitle={`ID: ${selectedBug.id.slice(0, 8)}`}
                    onBack={() => setSelectedBug(null)}
                >
                    <AdminStatusSelector
                        size="sm"
                        value={selectedBug.status}
                        options={[
                            { value: 'reported', label: 'Reported' },
                            { value: 'investigating', label: 'Investigating' },
                            { value: 'fixing', label: 'Fixing' },
                            { value: 'resolved', label: 'Resolved' },
                            { value: 'wont_fix', label: "Won't Fix" },
                        ]}
                        onChange={(s) => {
                            updateStatus(selectedBug.id, s);
                            setSelectedBug({ ...selectedBug, status: s });
                        }}
                    />
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                            const success = await deleteBug(selectedBug.id);
                            if (success) setSelectedBug(null);
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
                                {selectedBug.description || <span className="text-zinc-600 italic">No description provided.</span>}
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Steps to Reproduce</label>
                            <div className="text-sm text-zinc-300 font-mono bg-zinc-900/50 p-4 rounded border border-white/[0.04] whitespace-pre-wrap">
                                {selectedBug.stepsToReproduce || 'No steps provided.'}
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expected Result</label>
                                <div className="text-sm text-zinc-400 whitespace-pre-wrap">
                                    {selectedBug.expectedResult || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Actual Result</label>
                                <div className="text-sm text-zinc-400 whitespace-pre-wrap">
                                    {selectedBug.actualResult || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.05] w-full" />

                        {/* Metadata Rows */}
                        <div className="grid grid-cols-3 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Severity</label>
                                <div className="text-sm text-zinc-300 capitalize font-medium">{selectedBug.severity}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform</label>
                                <div className="text-sm text-zinc-300 capitalize font-medium">{selectedBug.platform}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reported</label>
                                <div className="text-sm text-zinc-300 font-mono">{new Date(selectedBug.created_at || '').toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminContainer>
            <AdminHeader title="Bugs">
                <AdminSegmentedControl
                    value={filter}
                    onChange={(val: any) => setFilter(val)}
                    options={[
                        { value: 'all', label: 'All' },
                        { value: 'reported', label: 'Reported' },
                        { value: 'investigating', label: 'Investigating' },
                        { value: 'fixing', label: 'Fixing' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'wont_fix', label: "Won't Fix" },
                    ]}
                />
            </AdminHeader>

            {/* Table View (Scalable) */}
            <div className="flex-1 overflow-hidden border border-white/[0.05] rounded-xl bg-zinc-900/10 flex flex-col mb-4">
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse border-spacing-0">
                        <thead className="sticky top-0 bg-[#09090b] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                            <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Details</th>
                                <th className="px-6 py-4 font-bold">Severity</th>
                                <th className="px-6 py-4 font-bold">Platform</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Reported</th>
                                <th className="px-6 py-4 w-12 text-right pr-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredBugs.map((bug) => (
                                <tr
                                    key={bug.id}
                                    onClick={() => setSelectedBug(bug)}
                                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-6 max-w-xl">
                                        <div className="space-y-1">
                                            <h4 className="text-[14px] font-bold text-zinc-100">{bug.title}</h4>
                                            <p className="text-[12px] text-zinc-500 line-clamp-1">{bug.description || 'No description provided.'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                        {bug.severity}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase">
                                            {getPlatformIcon(bug.platform)}
                                            {bug.platform}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <AdminStatusSelector
                                            value={bug.status}
                                            options={[
                                                { value: 'reported', label: 'Reported' },
                                                { value: 'investigating', label: 'Investigating' },
                                                { value: 'fixing', label: 'Fixing' },
                                                { value: 'resolved', label: 'Resolved' },
                                                { value: 'wont_fix', label: "Won't Fix" },
                                            ]}
                                            onChange={(s) => updateStatus(bug.id, s)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                                            {new Date(bug.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBugs.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20 grayscale">
                            <Activity className="w-8 h-8 mb-2 text-zinc-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No bugs reported</p>
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
