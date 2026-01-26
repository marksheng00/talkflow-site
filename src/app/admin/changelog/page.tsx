"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
    Plus,
    Trash2,
    Rocket,
    ArrowLeft,
    Calendar,
    Layers,
    Edit2,
    ChevronRight,
    Hash,
    Search,
    MoreVertical,
    ExternalLink,
    Filter,
    CheckCircle2,
    Clock,
    Sparkles,
    Loader2
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

const LOCALES = ["en", "zh", "ko", "ja", "es", "zh-Hant"];

const TYPE_LABELS: Record<string, string> = {
    feature: "New Feature",
    fix: "Bug Fix",
    improvement: "Improvement",
    perf: "Performance",
};

const TYPE_COLORS: Record<string, string> = {
    feature: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    fix: "bg-rose-500/20 text-rose-400 border-rose-500/20",
    improvement: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    perf: "bg-amber-500/20 text-amber-400 border-amber-500/20",
};

export default function AdminChangelogPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [changes, setChanges] = useState<ChangeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [translating, setTranslating] = useState(false);

    // View State: 'grid' -> 'release' -> 'item'
    const [viewMode, setViewMode] = useState<"grid" | "release" | "item">("grid");

    // Item Editing State
    const [editingItem, setEditingItem] = useState<ChangeItem | null>(null);
    const [activeLocale, setActiveLocale] = useState<string>("en");

    // Fetch releases list
    const fetchReleases = async () => {
        setLoading(true);
        const { data } = await supabaseClient
            .from("changelog_releases")
            .select("*")
            .order("publish_date", { ascending: false });

        setReleases(data || []);
        setLoading(false);
    };

    // Fetch changes for selected release
    const fetchChanges = async (releaseId: string) => {
        const { data } = await supabaseClient
            .from("changelog_items")
            .select("*")
            .eq("release_id", releaseId)
            .order("order", { ascending: true });
        setChanges(data || []);
    };

    useEffect(() => {
        fetchReleases();
    }, []);

    useEffect(() => {
        if (selectedRelease) {
            fetchChanges(selectedRelease.id);
            if (!editingItem) {
                setViewMode("release");
            }
        } else {
            setViewMode("grid");
        }
    }, [selectedRelease]);

    const handleCreateRelease = async () => {
        const { data, error } = await supabaseClient
            .from("changelog_releases")
            .insert({ version: "v1.0.0 (Draft)", status: "draft", publish_date: new Date().toISOString() })
            .select()
            .single();

        if (error) alert(error.message);
        else {
            setReleases([data, ...releases]);
            setSelectedRelease(data);
        }
    };

    const handleUpdateRelease = async (updates: Partial<Release>) => {
        if (!selectedRelease) return;
        const updated = { ...selectedRelease, ...updates };
        setSelectedRelease(updated);
        setReleases(releases.map((r) => (r.id === selectedRelease.id ? updated : r)));

        await supabaseClient
            .from("changelog_releases")
            .update(updates)
            .eq("id", selectedRelease.id);
    };

    const handleDeleteRelease = async (e: React.MouseEvent, id: string, version: string) => {
        e.stopPropagation();
        if (!confirm(`Delete ${version}?`)) return;

        await supabaseClient.from("changelog_releases").delete().eq("id", id);
        setReleases(releases.filter((r) => r.id !== id));
        if (selectedRelease?.id === id) {
            setSelectedRelease(null);
            setViewMode("grid");
        }
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

        if (error) alert(error.message);
        else {
            setChanges([...changes, data]);
            setEditingItem(data);
            setViewMode("item");
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
        setChanges(changes.filter((c) => c.id !== itemId));
        if (editingItem?.id === itemId) {
            setEditingItem(null);
            setViewMode("release");
        }
        await supabaseClient.from("changelog_items").delete().eq("id", itemId);
    };

    const handleAutoTranslate = async () => {
        if (!editingItem) return;
        // Strip HTML for better translation with some engines, though Tiptap usually handles it
        const sourceText = editingItem.description[activeLocale];
        if (!sourceText || sourceText === "<p></p>" || sourceText.trim() === "") {
            alert("Please enter some content in the current language first.");
            return;
        }

        setTranslating(true);
        const updatedDesc = { ...editingItem.description };

        try {
            // Translate to all other locales
            const targetLocales = LOCALES.filter(l => l !== activeLocale);

            // Sequential translation to avoid rate limits on free engines
            for (const lang of targetLocales) {
                const res = await fetch("/api/admin/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: sourceText, from: activeLocale, to: lang })
                });
                const data = await res.json();
                if (data.translatedText) {
                    updatedDesc[lang] = data.translatedText;
                }
                // Optional: add a small delay if needed
            }

            const updatedItem = { ...editingItem, description: updatedDesc };
            setEditingItem(updatedItem);
            handleUpdateChangeItem(updatedItem);
        } catch (err) {
            console.error("Auto-translate error:", err);
            alert("Some translations failed. Please check the network.");
        } finally {
            setTranslating(false);
        }
    };

    const filteredReleases = releases.filter(r =>
        r.version.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ==========================================
    // 3. ITEM EDITOR VIEW
    // ==========================================
    if (viewMode === "item" && editingItem && selectedRelease) {
        return (
            <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setEditingItem(null); setViewMode("release"); }}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <span className="font-heading font-bold text-slate-500">{selectedRelease.version}</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white font-bold flex items-center gap-2">
                                <Edit2 className="w-4 h-4 text-emerald-500" /> Edit Item
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDeleteChangeItem(editingItem.id)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-lg text-sm border border-rose-500/20 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Item
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full overflow-hidden pb-4">
                    <div className="lg:col-span-3 flex flex-col h-full bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
                            {LOCALES.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLocale(lang)}
                                    disabled={translating}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all",
                                        activeLocale === lang ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
                                        translating && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                            <div className="flex-1" />
                            <button
                                onClick={handleAutoTranslate}
                                disabled={translating}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all mr-2",
                                    translating
                                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                                )}
                            >
                                {translating ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Translating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3 h-3" />
                                        Magic Translate
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <TiptapEditor
                                content={editingItem.description[activeLocale] || ""}
                                onChange={(val) => {
                                    const updatedDesc = { ...editingItem.description, [activeLocale]: val };
                                    const updatedItem = { ...editingItem, description: updatedDesc };
                                    setEditingItem(updatedItem);
                                    handleUpdateChangeItem(updatedItem);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-6">
                            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Properties</h3>
                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Change Type</label>
                                <div className="space-y-2">
                                    {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                        <button
                                            key={value}
                                            onClick={() => {
                                                const newItem = { ...editingItem, type: value as any };
                                                setEditingItem(newItem);
                                                handleUpdateChangeItem(newItem);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between",
                                                editingItem.type === value ? TYPE_COLORS[value] + " border-opacity-50" : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                                            )}
                                        >
                                            <span className="font-bold text-sm">{label}</span>
                                            {editingItem.type === value && <div className="w-2 h-2 rounded-full bg-current" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Item ID</label>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 p-2 rounded font-mono break-all leading-tight">
                                    <Hash className="w-3 h-3 shrink-0" /> {editingItem.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. RELEASE EDITOR VIEW
    // ==========================================
    if (viewMode === "release" && selectedRelease) {
        return (
            <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedRelease(null)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold font-heading text-slate-200">Edit Release</h1>
                    </div>
                    <div className="flex gap-3">
                        {selectedRelease.status === "draft" ? (
                            <button
                                onClick={() => handleUpdateRelease({ status: "published" })}
                                className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <Rocket className="w-4 h-4" /> Publish
                            </button>
                        ) : (
                            <button
                                onClick={() => handleUpdateRelease({ status: "draft" })}
                                className="px-4 py-2 bg-white/5 text-slate-300 font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Layers className="w-4 h-4" /> Unpublish
                            </button>
                        )}
                        <button
                            onClick={(e) => handleDeleteRelease(e, selectedRelease.id, selectedRelease.version)}
                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-lg text-sm border border-rose-500/20 transition-colors"
                        >
                            Delete Release
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pb-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Change Items</label>
                                <button
                                    onClick={handleAddChange}
                                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {changes.map((item) => {
                                    const descText = item.description?.en || Object.values(item.description)[0] || "No description";
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => { setEditingItem(item); setViewMode("item"); }}
                                            className="w-full text-left bg-black/20 border border-white/10 p-4 rounded-xl hover:bg-white/[0.07] hover:border-white/20 transition-all flex items-start gap-4 group"
                                        >
                                            <div className="mt-1 shrink-0">
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border border-transparent", TYPE_COLORS[item.type])}>
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-transparent", TYPE_COLORS[item.type])}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-sm text-slate-300 line-clamp-1 prose prose-invert prose-sm max-w-none prose-p:my-0 opacity-80"
                                                    dangerouslySetInnerHTML={{ __html: descText }}
                                                />
                                            </div>
                                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="w-5 h-5 text-slate-500" />
                                            </div>
                                        </button>
                                    );
                                })}
                                {changes.length === 0 && (
                                    <button onClick={handleAddChange} className="w-full p-8 border border-dashed border-white/20 rounded-xl text-center text-slate-500 text-sm hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors">
                                        <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                        <p>No changes yet. Click here to add your first item.</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-6 sticky top-0">
                            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Release Info</h3>
                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Version Name</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-lg font-bold outline-none focus:border-emerald-500 transition-colors"
                                    value={selectedRelease.version}
                                    onChange={(e) => handleUpdateRelease({ version: e.target.value })}
                                    placeholder="e.g. v1.2.0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Publish Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
                                        value={new Date(selectedRelease.publish_date).toISOString().split("T")[0]}
                                        onChange={(e) => handleUpdateRelease({ publish_date: new Date(e.target.value).toISOString() })}
                                    />
                                    <Calendar className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 1. PRO TABLE DASHBOARD VIEW
    // ==========================================
    return (
        <div className="space-y-6 h-full flex flex-col relative animate-in fade-in">
            {/* Search & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-10 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold font-heading mb-1">Changelog Control</h1>
                    <p className="text-sm text-slate-500">Manage all product versions and updates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search version..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white w-64 focus:border-emerald-500/50 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreateRelease}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
                    >
                        <Plus className="w-4 h-4" /> New Release
                    </button>
                </div>
            </div>

            {!loading ? (
                <div className="flex-1 overflow-hidden">
                    <div className="border border-white/10 rounded-xl bg-black/20 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Version</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Publish Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReleases.map((release) => (
                                    <tr
                                        key={release.id}
                                        onClick={() => setSelectedRelease(release)}
                                        className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-200 group-hover:text-white">{release.version}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {release.status === 'published' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wide border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3 h-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wide border border-amber-500/20">
                                                    <Clock className="w-3 h-3" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 group-hover:text-slate-400 font-mono">
                                            {new Date(release.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedRelease(release); }}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteRelease(e, release.id, release.version)}
                                                    className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredReleases.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="text-slate-500 flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8 opacity-20" />
                                                <p>No releases found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-xs text-slate-600 flex justify-between items-center px-2">
                        <span>Showing {filteredReleases.length} of {releases.length} releases</span>
                        <span className="font-mono">TalkFlow Changelog Engine v2.1</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-emerald-500 animate-spin" />
                        <p className="animate-pulse">Loading engine data...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
