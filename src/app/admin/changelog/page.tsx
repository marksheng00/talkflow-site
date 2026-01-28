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
    Loader2,
    Settings,
    Activity,
    FileText,
    ArrowRight,
    Clock,
    RotateCw
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
    description: Record<string, string>;
    order: number;
};

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const LOCALES = ["en", "zh", "zh-Hant", "es", "ja", "ko"];

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

    // Editor State
    const [editingItem, setEditingItem] = useState<ChangeItem | null>(null);
    const [activeLocale, setActiveLocale] = useState<string>("en");
    const [translateFeedback, setTranslateFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [localVersion, setLocalVersion] = useState<string>("");

    useEffect(() => {
        if (selectedRelease) {
            setLocalVersion(selectedRelease.version);
        }
    }, [selectedRelease?.id]);

    const getLocalizedContent = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        return input[activeLocale] || input['en'] || Object.values(input)[0] || "";
    };

    // Fetch releases
    const fetchReleases = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from("changelog_releases")
                .select("*")
                .order("publish_date", { ascending: false });
            
            if (error) {
                console.error("Error fetching releases:", error);
            } else {
                setReleases(data || []);
            }
        } catch (err) {
            console.error("Unexpected error fetching releases:", err);
        } finally {
            setLoading(false);
        }
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
        if (items.length > 0) {
            setEditingItem(items[0]);
        }
    }, []);

    useEffect(() => { fetchReleases(); }, []);

    useEffect(() => {
        if (selectedRelease) {
            fetchChanges(selectedRelease.id);
        } else {
            setEditingItem(null);
            setChanges([]);
        }
    }, [selectedRelease?.id, fetchChanges]);

    const VERSION_REGEX = /^v\d+\.\d+\.\d+$/;

    const handleCreateRelease = async () => {
        // 1. Get the latest version from existing releases
        let nextVersion = "v1.0.0";
        
        if (releases.length > 0) {
            // Find the highest version that matches our format
            const validVersions = releases
                .filter(r => VERSION_REGEX.test(r.version))
                .sort((a, b) => {
                    const partsA = a.version.substring(1).split('.').map(Number);
                    const partsB = b.version.substring(1).split('.').map(Number);
                    for (let i = 0; i < 3; i++) {
                        if (partsA[i] !== partsB[i]) return partsB[i] - partsA[i];
                    }
                    return 0;
                });

            if (validVersions.length > 0) {
                const latest = validVersions[0].version;
                const parts = latest.substring(1).split('.').map(Number);
                // Increment the patch version (the last digit)
                parts[2] = parts[2] + 1;
                nextVersion = `v${parts.join('.')}`;
            }
        }
        
        const { data, error } = await supabaseClient
            .from("changelog_releases")
            .insert({ 
                version: nextVersion, 
                status: "draft", 
                publish_date: new Date().toISOString() 
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating release:", error);
            if (error.code === '23505') {
                alert(`Failed to create: Version "${nextVersion}" already exists.`);
            } else {
                alert(`Failed to create release: ${error.message}`);
            }
            return;
        }

        if (data) {
            setReleases([data, ...releases]);
            setSelectedRelease(data);
        }
    };

    const handleUpdateRelease = async (updates: Partial<Release>) => {
        if (!selectedRelease) return;
        
        const previousRelease = { ...selectedRelease };
        const updated = { ...selectedRelease, ...updates };

        // 1. Update local editing state
        setSelectedRelease(updated);

        // 2. If version is being updated, validate format before syncing to DB
        if (updates.version !== undefined && !VERSION_REGEX.test(updates.version)) {
            return; 
        }

        // 3. Sync to Database
        const { error } = await supabaseClient.from("changelog_releases").update(updates).eq("id", selectedRelease.id);
        
        if (error) {
            console.error("Error updating release:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            
            if (error.code === '23505') {
                alert(`Version "${updates.version}" already exists. Reverting change.`);
            }
            
            // Revert local states
            setSelectedRelease(previousRelease);
            if (updates.version !== undefined) {
                setLocalVersion(previousRelease.version);
            }
            return;
        }

        // 4. Update the main releases list only on successful DB sync
        setReleases(releases.map((r) => (r.id === selectedRelease.id ? updated : r)));
    };

    const handleDeleteRelease = async (id: string) => {
        const ok = window.confirm("Delete this release permanently?");
        if (!ok) return;
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

        if (error) {
            console.error("Error adding change item:", error);
            alert(`Failed to add change item: ${error.message}`);
            return;
        }

        if (data) {
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
        const ok = window.confirm("Delete this item?");
        if (!ok) return;
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
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing Workspace...
        </div>
    );

    // ==========================================
    // 1. DASHBOARD LIST VIEW
    if (!selectedRelease) {
        return (
            <div className="p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-full flex flex-col">
                {/* Command Header */}
                <div className="flex items-center justify-between pb-2 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                            Changelog
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                                type="text" placeholder="Search releases..."
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-zinc-400 w-48 focus:border-white/10 outline-none transition-all font-bold uppercase"
                            />
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 mx-1" />
                        <button onClick={handleCreateRelease} className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-lg text-xs transition-all flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" /> New Release
                        </button>
                    </div>
                </div>

                {/* Table View (Scalable) */}
                <div className="flex-1 overflow-hidden border border-white/[0.05] rounded-xl bg-zinc-900/10 flex flex-col mb-4">
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <table className="w-full text-left border-collapse border-spacing-0">
                            <thead className="sticky top-0 bg-[#09090b] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                                <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <th className="px-6 py-4 font-bold">Version</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Publish Date</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredReleases.map(r => (
                                    <tr
                                        key={r.id}
                                        onClick={() => setSelectedRelease(r)}
                                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{r.version}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={r.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                                                {new Date(r.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredReleases.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center opacity-20 grayscale">
                                <Activity className="w-8 h-8 mb-2 text-zinc-500" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No releases found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. EDITOR VIEW
    return (
        <div className="h-full flex flex-col bg-[#0b0b0d] text-zinc-300 animate-in fade-in duration-500 overflow-hidden">
            {/* 1. Header Bar */}
            <div className="h-16 flex items-center justify-between px-6 bg-[#0c0c0e] shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedRelease(null)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"><ArrowLeft className="w-4.5 h-4.5" /></button>
                    <div className="flex flex-col">
                        <input
                            className="bg-transparent border-none p-0 text-sm font-bold text-zinc-100 outline-none placeholder:text-zinc-800 focus:ring-0 w-64"
                            placeholder="Enter version..."
                            value={localVersion}
                            onChange={(e) => setLocalVersion(e.target.value)}
                            onBlur={() => {
                                if (localVersion !== selectedRelease.version) {
                                    handleUpdateRelease({ version: localVersion });
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                        />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter leading-none">ID: {selectedRelease.id.slice(0, 8)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Picker */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <input
                            type="date"
                            className="bg-transparent text-[10px] font-bold text-zinc-400 outline-none [color-scheme:dark] cursor-pointer hover:text-zinc-200 transition-colors uppercase tracking-widest"
                            value={new Date(selectedRelease.publish_date).toISOString().split("T")[0]}
                            onChange={(e) => handleUpdateRelease({ publish_date: new Date(e.target.value).toISOString() })}
                        />
                    </div>

                    <div className="h-4 w-px bg-white/10 mx-1" />

                    {/* Locale Switcher */}
                    <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                        {LOCALES.map(loc => (
                            <button
                                key={loc} onClick={() => setActiveLocale(loc)}
                                className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold transition-all uppercase", activeLocale.toLowerCase() === loc.toLowerCase() ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-600 hover:text-zinc-400")}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleAutoTranslate}
                        disabled={translating}
                        className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center bg-white/5 border border-white/5",
                            translating ? "text-amber-500" : translateFeedback?.type === 'success' ? "text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {translating ? "Translating..." : translateFeedback?.type === 'success' ? "Done" : "Auto-Translate"}
                    </button>

                    <button
                        onClick={() => {
                            const newStatus = selectedRelease.status === 'published' ? 'draft' : 'published';
                            const updates: Partial<Release> = { status: newStatus };
                            if (newStatus === 'published' && selectedRelease.version.includes('(Draft)')) {
                                updates.version = selectedRelease.version.replace('(Draft)', '').trim();
                            }
                            handleUpdateRelease(updates);
                        }}
                        className="px-5 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-lg text-[11px] transition-all flex items-center gap-1.5 shadow-lg"
                    >
                        {selectedRelease.status === 'draft' ? <Rocket className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                        {selectedRelease.status === 'draft' ? 'Publish Release' : 'Unpublish'}
                    </button>
                </div>
            </div>

            {/* 3. Main Workspace */}
            <div className="flex-1 overflow-y-auto scrollbar-zinc pb-20">
                <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
                    {/* Items List */}
                    <div className="space-y-8">
                        {changes.map((item, idx) => (
                            <div key={item.id} className="group relative space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Item Header */}
                                <div className="flex items-center justify-between group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-1.5">
                                        <div className="text-[10px] font-mono text-zinc-700 w-4 font-bold">{(idx + 1).toString().padStart(2, '0')}</div>
                                        <div className="flex items-center bg-white/5 rounded-md p-1 border border-white/5 gap-1">
                                            {Object.entries(TYPE_LABELS).map(([val, label]) => (
                                                <button
                                                    key={val}
                                                    onClick={() => handleUpdateChangeItem({ ...item, type: val as any })}
                                                    className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all",
                                                        item.type === val
                                                            ? "bg-zinc-800 text-zinc-100"
                                                            : "text-zinc-600 hover:text-zinc-400"
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteChangeItem(item.id)}
                                        className="p-1.5 text-zinc-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Rich Text Editor */}
                                <div className="border border-white/[0.06] rounded-xl bg-zinc-900/10 focus-within:border-white/10 transition-all overflow-hidden">
                                    <TiptapEditor
                                        content={item.description[activeLocale.toLowerCase()] || ""}
                                        onChange={(val) => {
                                            const updatedItem = { ...item, description: { ...item.description, [activeLocale.toLowerCase()]: val } };
                                            handleUpdateChangeItem(updatedItem);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Empty State / Add First Item */}
                        {changes.length === 0 && (
                            <div className="h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-600 opacity-40">
                                <FileText className="w-8 h-8 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-widest">No changes documented</p>
                            </div>
                        )}

                        {/* Add Item Trigger */}
                        <div className="pt-4 flex justify-center">
                            <button
                                onClick={handleAddChange}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs font-bold text-zinc-400 hover:text-zinc-100 transition-all flex items-center gap-2 group"
                            >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Add New Change Block
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-white/[0.04] w-full" />

                    {/* Bottom Danger Zone */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => handleDeleteRelease(selectedRelease.id)}
                            className="text-[10px] font-bold text-rose-500/30 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]"
                        >
                            Delete Entire Release
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
    return (
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {status}
        </span>
    );
}
