"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
    Plus,
    Trash2,
    Rocket,
    ArrowLeft,
    Calendar,
    Layers,
    ChevronRight,
    Search,
    CheckCircle2,
    Clock,
    Sparkles,
    Loader2,
    Settings,
    Check,
    AlertCircle
} from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { cn } from "@/lib/utils";

// Types
type Release = {
    id: string;
    version: string;
    publish_date: string;
    status: "draft" | "published";
};

type ChangeItem = {
    id: string;
    release_id: string;
    type: "feature" | "fix" | "improvement" | "perf";
    description: Record<string, string>; // { "en": "...", "zh": "..." }
    order: number;
};

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const LOCALES = ["EN", "ZH", "KO", "JA", "ES", "ZH-Hant"];

const TYPE_LABELS: Record<string, string> = {
    feature: "New Feature",
    fix: "Bug Fix",
    improvement: "Improvement",
    perf: "Performance",
};

const TYPE_COLORS: Record<string, string> = {
    feature: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    fix: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    improvement: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    perf: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function AdminChangelogPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [changes, setChanges] = useState<ChangeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [translating, setTranslating] = useState(false);

    // UI state
    const [editingItem, setEditingItem] = useState<ChangeItem | null>(null);
    const [activeLocale, setActiveLocale] = useState<string>("EN");
    const [showSettings, setShowSettings] = useState(false);
    const [translateFeedback, setTranslateFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Fetch releases
    const fetchReleases = async () => {
        setLoading(true);
        const { data } = await supabaseClient
            .from("changelog_releases")
            .select("*")
            .order("publish_date", { ascending: false });
        setReleases(data || []);
        setLoading(false);
    };

    // Fetch changes
    const fetchChanges = useCallback(async (releaseId: string) => {
        const { data } = await supabaseClient
            .from("changelog_items")
            .select("*")
            .eq("release_id", releaseId)
            .order("order", { ascending: true });

        const items = data || [];
        setChanges(items);
        if (items.length > 0 && !editingItem) {
            setEditingItem(items[0]);
        }
    }, [editingItem]);

    useEffect(() => { fetchReleases(); }, []);

    useEffect(() => {
        if (selectedRelease) {
            fetchChanges(selectedRelease.id);
        } else {
            setEditingItem(null);
            setChanges([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRelease?.id]);

    const handleCreateRelease = async () => {
        const { data, error } = await supabaseClient
            .from("changelog_releases")
            .insert({ version: "v1.0.0 (Draft)", status: "draft", publish_date: new Date().toISOString() })
            .select()
            .single();

        if (!error) {
            setReleases([data, ...releases]);
            setSelectedRelease(data);
        }
    };

    const handleUpdateRelease = async (updates: Partial<Release>) => {
        if (!selectedRelease) return;
        const updated = { ...selectedRelease, ...updates };
        setSelectedRelease(updated);
        setReleases(releases.map((r) => (r.id === selectedRelease.id ? updated : r)));
        await supabaseClient.from("changelog_releases").update(updates).eq("id", selectedRelease.id);
    };

    const handleDeleteRelease = async (id: string) => {
        if (!confirm(`Delete this release?`)) return;
        await supabaseClient.from("changelog_releases").delete().eq("id", id);
        setReleases(releases.filter((r) => r.id !== id));
        setSelectedRelease(null);
    };

    const handleAddChange = async () => {
        if (!selectedRelease) return;
        const { data, error } = await supabaseClient
            .from("changelog_items")
            .insert({
                release_id: selectedRelease.id,
                type: "feature",
                description: { en: "" },
                order: changes.length,
            })
            .select()
            .single();

        if (!error) {
            setChanges([...changes, data]);
            setEditingItem(data);
        }
    };

    const handleUpdateChangeItem = async (item: ChangeItem) => {
        setChanges(changes.map((c) => (c.id === item.id ? item : c)));
        if (editingItem?.id === item.id) setEditingItem(item);
        await supabaseClient
            .from("changelog_items")
            .update({ type: item.type, description: item.description })
            .eq("id", item.id);
    };

    const handleDeleteChangeItem = async (itemId: string) => {
        if (!confirm("Delete this item?")) return;
        const remaining = changes.filter((c) => c.id !== itemId);
        setChanges(remaining);
        if (editingItem?.id === itemId) setEditingItem(remaining[0] || null);
        await supabaseClient.from("changelog_items").delete().eq("id", itemId);
    };

    const handleAutoTranslate = async () => {
        if (!editingItem) return;
        const sourceText = editingItem.description[activeLocale.toLowerCase()];
        if (!sourceText || sourceText === "<p></p>" || sourceText.trim() === "") return;

        setTranslating(true);
        setTranslateFeedback(null);
        const updatedDesc = { ...editingItem.description };

        try {
            const targetLocales = LOCALES.map(l => l.toLowerCase()).filter(l => l !== activeLocale.toLowerCase());
            for (const lang of targetLocales) {
                const res = await fetch("/api/admin/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: sourceText, from: activeLocale.toLowerCase(), to: lang })
                });
                const data = await res.json();
                if (data.translatedText) updatedDesc[lang] = data.translatedText;
            }
            const updatedItem = { ...editingItem, description: updatedDesc };
            setEditingItem(updatedItem);
            handleUpdateChangeItem(updatedItem);
            setTranslateFeedback({ type: 'success', message: '' });
        } catch (err) {
            console.error("Auto-translate error:", err);
            setTranslateFeedback({ type: 'error', message: '' });
        } finally {
            setTranslating(false);
            setTimeout(() => setTranslateFeedback(null), 3000);
        }
    };

    const filteredReleases = releases.filter(r => r.version.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return (
        <div className="h-full flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing Workspace...
        </div>
    );

    // ==========================================
    // 1. DASHBOARD VIEW
    if (!selectedRelease) {
        return (
            <div className="h-full flex flex-col bg-[#09090b]">
                <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Changelog</h1>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                                type="text" placeholder="Search releases..."
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-400 w-48 focus:border-indigo-500/30 outline-none"
                            />
                        </div>
                    </div>
                    <button onClick={handleCreateRelease} className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-md text-xs transition-all flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> New Release
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-zinc">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredReleases.map(r => (
                            <div key={r.id} onClick={() => setSelectedRelease(r)} className="group bg-zinc-900/40 border border-white/[0.04] p-5 rounded-xl hover:bg-zinc-900 hover:border-zinc-700/50 transition-all cursor-pointer">
                                <div className="flex justify-between mb-4">
                                    <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 transition-colors"><Layers className="w-4 h-4" /></div>
                                    <StatusBadge status={r.status} />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white mb-1">{r.version}</h3>
                                <p className="text-[10px] text-zinc-500 font-mono uppercase">{new Date(r.publish_date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. WORKSPACE BATTLESTATION
    return (
        <div className="h-full flex flex-col bg-[#09090b] text-zinc-300">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 bg-[#09090b]/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedRelease(null)} className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">
                            {selectedRelease.version}
                            <span className={cn("text-[8px] px-1.5 py-0.5 rounded border uppercase", selectedRelease.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20')}>
                                {selectedRelease.status}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Locale Switcher (Flat) */}
                    <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-white/5 mr-2">
                        {LOCALES.map(loc => (
                            <button
                                key={loc} onClick={() => setActiveLocale(loc)}
                                className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold transition-all", activeLocale === loc ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-600 hover:text-zinc-400")}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button onClick={() => setShowSettings(!showSettings)} className={cn("p-1.5 rounded-md transition-colors", showSettings ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200")}>
                        <Settings className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => handleUpdateRelease({ status: selectedRelease.status === 'published' ? 'draft' : 'published' })}
                        className={cn("px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-lg",
                            selectedRelease.status === 'draft' ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/10" : "bg-zinc-800 text-zinc-300 border border-white/10")}
                    >
                        {selectedRelease.status === 'draft' ? <Rocket className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                        {selectedRelease.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* INNER SIDEBAR: Item List */}
                <aside className="w-[300px] border-r border-white/5 bg-[#0b0b0d] flex flex-col shrink-0">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/10">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Update Items</span>
                        <button onClick={handleAddChange} className="p-1 hover:bg-white/5 rounded text-emerald-400 transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-zinc">
                        {changes.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setEditingItem(item)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 group relative",
                                    editingItem?.id === item.id
                                        ? "bg-zinc-900 border-zinc-700/50 shadow-sm"
                                        : "bg-transparent border-transparent hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <div className={cn("mt-1 w-1.5 h-1.5 rounded-full shrink-0", TYPE_COLORS[item.type].split(' ')[1].replace('text-', 'bg-'))} />
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-[12px] font-bold truncate mb-0.5">{item.type.toUpperCase()}</p>
                                    <div
                                        className="text-[11px] opacity-60 line-clamp-1 pointer-events-none"
                                        dangerouslySetInnerHTML={{ __html: item.description?.en || "No content..." }}
                                    />
                                </div>
                                {editingItem?.id === item.id && <ChevronRight className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-700" />}
                            </button>
                        ))}
                        {changes.length === 0 && (
                            <div className="py-12 px-4 text-center">
                                <p className="text-[11px] text-zinc-700 italic">No items yet. Add one to begin.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/5">
                        <button onClick={() => handleDeleteRelease(selectedRelease.id)} className="w-full py-2 rounded-md text-[10px] font-bold text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5 transition-all uppercase tracking-widest">Delete Release</button>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col bg-black/20 min-w-0 relative">
                    {editingItem ? (
                        <>
                            {/* Editor Header / Item Actions */}
                            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/5 shrink-0">
                                <div className="flex items-center gap-1">
                                    {Object.entries(TYPE_LABELS).map(([val, label]) => (
                                        <button
                                            key={val} onClick={() => {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                handleUpdateChangeItem({ ...editingItem, type: val as any });
                                            }}
                                            className={cn("px-2.5 py-1 rounded text-[10px] font-bold transition-all border",
                                                editingItem.type === val ? TYPE_COLORS[val] : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/5")}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleAutoTranslate}
                                        disabled={translating}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all border",
                                            translating
                                                ? "bg-amber-500/5 text-amber-500 border-amber-500/10 animate-pulse cursor-not-allowed"
                                                : translateFeedback?.type === 'success'
                                                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                                                    : translateFeedback?.type === 'error'
                                                        ? "bg-rose-500/5 text-rose-400 border-rose-500/10"
                                                        : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-zinc-200"
                                        )}
                                    >
                                        {translating ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : translateFeedback?.type === 'success' ? (
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        ) : translateFeedback?.type === 'error' ? (
                                            <AlertCircle className="w-3 h-3 text-rose-400" />
                                        ) : (
                                            <Sparkles className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200" />
                                        )}
                                        <span>
                                            {translating ? "Translating..." : translateFeedback?.type === 'success' ? "Done" : "Translate"}
                                        </span>
                                    </button>
                                    <button onClick={() => handleDeleteChangeItem(editingItem.id)} className="p-1.5 text-zinc-700 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            {/* Tiptap Container */}
                            <div className="flex-1 overflow-y-auto scrollbar-zinc bg-[#09090b]">
                                <TiptapEditor
                                    content={editingItem.description[activeLocale.toLowerCase()] || ""}
                                    onChange={(val) => {
                                        const updatedItem = { ...editingItem, description: { ...editingItem.description, [activeLocale.toLowerCase()]: val } };
                                        setEditingItem(updatedItem);
                                        handleUpdateChangeItem(updatedItem);
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                            <Layers className="w-12 h-12 opacity-10" />
                            <p className="text-xs">Select an item from the list or add a new one.</p>
                        </div>
                    )}

                    {/* SETTINGS OVERLAY / DRAWER */}
                    {showSettings && (
                        <div className="absolute inset-y-0 right-0 w-80 bg-[#0d0d0f] border-l border-white/10 shadow-2xl z-20 animate-in slide-in-from-right duration-300 flex flex-col">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Release Settings</span>
                                <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white transition-colors truncate">×</button>
                            </div>
                            <div className="p-6 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase">Version</label>
                                    <input
                                        className="w-full bg-zinc-900 border border-white/5 rounded-md px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500/30"
                                        value={selectedRelease.version} onChange={(e) => handleUpdateRelease({ version: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-900 border border-white/5 rounded-md px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500/30 font-mono [color-scheme:dark]"
                                            value={new Date(selectedRelease.publish_date).toISOString().split("T")[0]}
                                            onChange={(e) => handleUpdateRelease({ publish_date: new Date(e.target.value).toISOString() })}
                                        />
                                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-zinc-700 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                            <p className="text-[9px] text-zinc-700 uppercase font-bold">Total Items</p>
                                            <p className="text-lg font-bold text-zinc-400">{changes.length}</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                            <p className="text-[9px] text-zinc-700 uppercase font-bold">ID Hash</p>
                                            <p className="text-[9px] font-mono break-all opacity-30">{selectedRelease.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
    if (status === 'published') return (
        <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" /> Published
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" /> Draft
        </span>
    );
}
