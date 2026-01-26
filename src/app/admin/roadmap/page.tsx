"use client";

import { useState, useEffect } from "react";
import { RoadmapItem, RoadmapStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, X, Loader2, Calendar, ArrowLeft, Sparkles, Check, AlertCircle, Globe, Layers, Pencil, Zap, Image as ImageIcon, CloudUpload } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { cn } from "@/lib/utils";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const STATUS_COLUMNS: RoadmapStatus[] = ["researching", "building", "shipping", "released"];
const LOCALES = ["en", "zh", "ko", "ja", "es", "zh-Hant"];

export default function AdminRoadmapPage() {
    const [tasks, setTasks] = useState<RoadmapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Partial<RoadmapItem> | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'editor'>('kanban');

    // Editor Language State
    const [activeLocale, setActiveLocale] = useState<string>('en');
    const [translating, setTranslating] = useState(false);
    const [translateFeedback, setTranslateFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    const getLocalizedContent = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        // Priority: Active Locale -> En -> First Key -> Empty
        return input[activeLocale] || input['en'] || Object.values(input)[0] || "";
    };

    const fetchTasks = async () => {
        // setLoading(true);
        const { data, error } = await supabaseClient
            .from("roadmap_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching roadmap:", error);
        } else {
            // Map snake_case DB fields to camelCase
            // DB columns are now JSONB, so we get Objects directly.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedTasks = (data || []).map((t: any) => ({
                ...t,
                title: t.title || { en: "" },
                description: t.description || { en: "" },
                detailedContent: t.detailed_content || { en: "" },
                coverImage: t.cover_image
            }));
            setTasks(mappedTasks);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as RoadmapStatus;
        const task = tasks.find(t => t.id === draggableId);
        if (!task) return;

        let newProgress = task.progress || 0;

        // Logic 1: Drag TO Released -> Progress 100%
        if (newStatus === 'released') {
            newProgress = 100;
        }
        // Logic 2: Drag FROM Released (or was 100%) -> Progress 95%
        else if (newProgress === 100) {
            newProgress = 95;
        }

        // Optimistic update
        const updatedTasks = tasks.map(t =>
            t.id === draggableId ? { ...t, status: newStatus, progress: newProgress } : t
        );
        setTasks(updatedTasks);

        // API update
        await supabaseClient
            .from("roadmap_items")
            .update({ status: newStatus, progress: newProgress })
            .eq("id", draggableId);
    };



    const openEditor = (task?: RoadmapItem) => {
        if (task) {
            setEditingTask(task);
        } else {
            // New Task
            setEditingTask({
                status: 'researching',
                category: 'Feature',
                progress: 0,
                title: { en: "" },
                description: { en: "" },
                detailedContent: { en: "" }
            });
        }
        setActiveLocale('en'); // Reset to default locale
        setTranslateFeedback(null);
        setViewMode('editor');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingTask) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `roadmap-covers/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabaseClient.storage
                .from('roadmap-covers')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('roadmap-covers')
                .getPublicUrl(filePath);

            setEditingTask({ ...editingTask, coverImage: publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Upload failed: ' + (error as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveTask = async (task: Partial<RoadmapItem>) => {
        const titleEn = task.title?.en || task.title?.[Object.keys(task.title || {})[0] || 'en'];
        if (!titleEn) return alert("Title (English) is required");

        const finalStatus = task.status || 'researching';
        let finalProgress = task.progress || 0;

        // Sync Logic: Prioritize Status
        if (finalStatus === 'released') {
            finalProgress = 100;
        } else if (finalProgress === 100) {
            finalProgress = 95;
        }

        const taskData = {
            title: task.title,
            description: task.description,
            category: task.category,
            eta: task.eta,
            progress: finalProgress,
            status: finalStatus,
            accelerations: task.accelerations || 0,
            cover_image: task.coverImage,
            detailed_content: task.detailedContent
        };

        if (task.id) {
            // Update
            const { error } = await supabaseClient
                .from("roadmap_items")
                .update(taskData)
                .eq("id", task.id);

            if (!error) {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, ...taskData, coverImage: taskData.cover_image, detailedContent: taskData.detailed_content } as RoadmapItem : t));
                setEditingTask(null);
                setViewMode('kanban');
            } else {
                alert("Update failed: " + error.message);
            }
        } else {
            // Create New
            const { data, error } = await supabaseClient
                .from("roadmap_items")
                .insert(taskData)
                .select()
                .single();

            if (!error && data) {
                // Ensure data matches new structure even if DB returns old format initially (unlikely with this insert)
                const newTask = {
                    ...data,
                    coverImage: data.cover_image,
                    detailedContent: data.detailed_content || { en: "" },
                    title: data.title || { en: "" },
                    description: data.description || { en: "" }
                };
                setTasks([newTask, ...tasks]);
                setEditingTask(null);
                setViewMode('kanban');
            } else {
                alert("Create failed: " + (error?.message || 'Unknown error'));
            }
        }
    };

    const handleAutoTranslate = async () => {
        if (!editingTask) return;

        // Translate Title, Description, and Detailed Content
        const fieldsToTranslate = [
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Summary' },
            { key: 'detailedContent', label: 'Detailed Content' }
        ];

        // Check if current locale has content
        const sourceTitle = editingTask.title?.[activeLocale];
        if (!sourceTitle) {
            alert(`Please enter at least a Title in ${activeLocale} first.`);
            return;
        }

        setTranslating(true);
        setTranslateFeedback(null);
        console.log("Starting controlled-concurrency translation from:", activeLocale);
        const updatedTask = { ...editingTask };

        let errorCount = 0;

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // SEQUENTIAL EXECUTION
            // This is the only way to strictly guarantee we don't hit QPS limits due to network caching/batching
            const targetLocales = LOCALES.filter(l => l !== activeLocale);

            for (const lang of targetLocales) {
                for (const field of fieldsToTranslate) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const sourceText = (editingTask as any)[field.key]?.[activeLocale];

                    if (sourceText && sourceText !== "<p></p>" && sourceText.trim() !== "") {
                        try {
                            // console.log(`Translating ${field.key} to ${lang}...`);
                            const res = await fetch("/api/admin/translate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ text: sourceText, from: activeLocale, to: lang })
                            });
                            const data = await res.json();

                            if (data.translatedText) {
                                // Deep merge
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if (!(updatedTask as any)[field.key]) (updatedTask as any)[field.key] = {};
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (updatedTask as any)[field.key][lang] = data.translatedText;
                            } else {
                                errorCount++;
                                console.error(`Failed ${field.key} -> ${lang}:`, data.error);
                            }

                            // Mild throttle between requests (5 QPS limit -> 200ms min gap)
                            // Using 250ms to be safe
                            await delay(250);

                        } catch (err) {
                            errorCount++;
                            console.error(`Request Error ${field.key} -> ${lang}:`, err);
                        }
                    }
                }
            }

            setEditingTask({ ...updatedTask });

            if (errorCount > 0) {
                setTranslateFeedback({ type: 'error', message: "" });
            } else {
                setTranslateFeedback({ type: 'success', message: "" });
            }

        } catch (err) {
            console.error("Auto-translate critical error:", err);
            setTranslateFeedback({ type: 'error', message: "" });
        } finally {
            setTranslating(false);
            setTimeout(() => setTranslateFeedback(null), 3000);
        }
    };



    if (loading) return <div className="text-white p-8">Loading roadmap...</div>;

    // EDITOR VIEW
    if (viewMode === 'editor' && editingTask) {
        return (
            <div className="h-full flex flex-col bg-[#09090b] animate-in slide-in-from-right-4 duration-300">
                {/* Editor Header */}
                <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-5 bg-[#09090b]/50 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setViewMode('kanban');
                                setEditingTask(null);
                            }}
                            className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-zinc-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-zinc-200">Edit Issue</h2>
                            <p className="text-[10px] text-zinc-600 font-mono tracking-wide">{editingTask.id}</p>
                        </div>

                        <div className="h-4 w-px bg-white/[0.04] mx-2" />

                        {/* Language Switcher in Editor */}
                        <div className="flex items-center gap-1 ml-1">
                            {LOCALES.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setActiveLocale(loc)}
                                    className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all",
                                        activeLocale === loc
                                            ? "bg-zinc-800 text-zinc-100"
                                            : "text-zinc-600 hover:text-zinc-400 hover:bg-white/5"
                                    )}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Translate Button in Editor */}
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
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : translateFeedback?.type === 'success' ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : translateFeedback?.type === 'error' ? (
                                <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                            )}
                            <span>{translating ? "Translating..." : translateFeedback?.type === 'success' ? "Done" : "Translate"}</span>
                        </button>


                        <button
                            onClick={() => handleSaveTask(editingTask)}
                            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-black rounded-md text-[12px] font-bold transition-colors shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Editor Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Title Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider pl-1">Title ({activeLocale})</label>
                                <input
                                    className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-bold text-zinc-100 outline-none focus:border-indigo-500/50 placeholder:text-zinc-800 transition-colors"
                                    placeholder={`Issue Title (${activeLocale})`}
                                    value={editingTask.title?.[activeLocale] || ''}
                                    onChange={e => setEditingTask({
                                        ...editingTask,
                                        title: { ...editingTask.title, [activeLocale]: e.target.value }
                                    })}
                                />
                            </div>

                            {/* Summary Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider pl-1">Short Summary ({activeLocale})</label>
                                <textarea
                                    className="w-full bg-zinc-900/50 border border-white/[0.04] rounded-lg p-4 text-sm text-zinc-300 outline-none focus:border-indigo-500/30 focus:bg-zinc-900 min-h-[100px] resize-none leading-relaxed transition-all"
                                    placeholder={`A brief description (${activeLocale})...`}
                                    value={editingTask.description?.[activeLocale] || ''}
                                    onChange={e => setEditingTask({
                                        ...editingTask,
                                        description: { ...editingTask.description, [activeLocale]: e.target.value }
                                    })}
                                />
                            </div>

                            {/* Tiptap Editor */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider pl-1">Detailed Content ({activeLocale})</label>
                                <div className="border border-white/[0.04] rounded-xl overflow-hidden bg-zinc-900/30 min-h-[400px]">
                                    <TiptapEditor
                                        content={editingTask.detailedContent?.[activeLocale] || ''}
                                        onChange={(html) => setEditingTask({
                                            ...editingTask,
                                            detailedContent: { ...editingTask.detailedContent, [activeLocale]: html }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Properties Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-zinc-900/50 border border-white/[0.04] rounded-xl p-5 space-y-6 sticky top-6">
                                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/[0.04] pb-3">Properties</h3>

                                {/* Status */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-zinc-600 pl-1">Status</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-[13px] text-zinc-300 outline-none focus:border-indigo-500/30 appearance-none cursor-pointer hover:bg-black/40 transition-colors"
                                            value={editingTask.status || 'researching'}
                                            onChange={e => {
                                                const newStatus = e.target.value as RoadmapStatus;
                                                let newProgress = editingTask.progress;
                                                if (newStatus === 'released') newProgress = 100;
                                                else if (editingTask.progress === 100) newProgress = 95;
                                                setEditingTask({ ...editingTask, status: newStatus, progress: newProgress });
                                            }}
                                        >
                                            {STATUS_COLUMNS.map(s => (
                                                <option key={s} value={s} className="bg-zinc-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-zinc-600 pl-1">Category</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-[13px] text-zinc-300 outline-none focus:border-indigo-500/30 appearance-none cursor-pointer hover:bg-black/40 transition-colors"
                                        value={editingTask.category || 'Feature'}
                                        onChange={e => setEditingTask({ ...editingTask, category: e.target.value })}
                                    >
                                        {["Feature", "Content", "AI Core", "UIUX"].map(c => (
                                            <option key={c} value={c} className="bg-zinc-900">{c}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ETA */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-zinc-600 pl-1">ETA</label>
                                    <input
                                        className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-[13px] text-zinc-300 outline-none focus:border-indigo-500/30 font-mono placeholder:text-zinc-700"
                                        placeholder="e.g. Q1 2026"
                                        value={editingTask.eta || ''}
                                        onChange={e => setEditingTask({ ...editingTask, eta: e.target.value })}
                                    />
                                </div>

                                {/* Progress */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Progress</label>
                                        <span className="text-[10px] font-mono text-emerald-500">{editingTask.progress || 0}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        value={editingTask.progress || 0}
                                        onChange={e => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                                    />
                                </div>

                                {/* Cover Image */}
                                <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Cover Image</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="cover-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="cover-upload"
                                                className={cn(
                                                    "flex items-center gap-1.5 px-2 py-1 rounded border border-white/5 text-[10px] font-bold uppercase cursor-pointer transition-all",
                                                    uploading ? "opacity-50" : "hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
                                                )}
                                            >
                                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CloudUpload className="w-3 h-3" />}
                                                {uploading ? "Uploading..." : "Upload"}
                                            </label>
                                        </div>
                                    </div>

                                    {editingTask.coverImage ? (
                                        <div className="rounded-lg overflow-hidden border border-white/10 relative group bg-black/40">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={editingTask.coverImage} alt="Cover Preview" className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => setEditingTask({ ...editingTask, coverImage: '' })}
                                                    className="p-2 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                                    title="Remove Image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-32 rounded-lg border border-dashed border-white/5 flex flex-col items-center justify-center bg-white/[0.02] text-zinc-700">
                                            <ImageIcon className="w-6 h-6 mb-2 opacity-20" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Image Set</span>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <input
                                            className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 pl-8 text-[10px] text-zinc-500 font-mono outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-800"
                                            placeholder="https://..."
                                            value={editingTask.coverImage || ''}
                                            onChange={e => setEditingTask({ ...editingTask, coverImage: e.target.value })}
                                        />
                                        <Globe className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-800" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // KANBAN VIEW
    return (
        <div className="h-full flex flex-col bg-[#09090b]">
            {/* Toolbar Header - Denser, cleaner */}
            <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-5 bg-[#09090b]/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    {/* Segmented Control for View */}
                    <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-white/[0.04]">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
                                viewMode === 'kanban'
                                    ? "bg-zinc-800 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Board</span>
                        </button>
                        <button
                            onClick={() => openEditor()}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
                                viewMode === 'editor'
                                    ? "bg-zinc-800 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editor</span>
                        </button>
                    </div>

                    <div className="h-4 w-px bg-white/[0.04]" />

                    {/* Flat Language Tags */}
                    <div className="flex items-center gap-1.5 ml-1">
                        {LOCALES.map(loc => (
                            <button
                                key={loc}
                                onClick={() => setActiveLocale(loc)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all tracking-tight",
                                    activeLocale === loc
                                        ? "bg-zinc-800 text-zinc-100 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openEditor()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-md text-[12px] font-bold hover:bg-zinc-200 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Issue</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden p-0"> {/* P-0 to allow board to control padding */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 p-5 h-full"> {/* Added padding here */}
                        {STATUS_COLUMNS.map((status) => (
                            <div key={status} className="flex-shrink-0 w-80 bg-zinc-900 border border-white/[0.04] rounded-xl flex flex-col">
                                <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                                    <h3 className="font-bold text-zinc-300 uppercase tracking-wider text-sm">{status}</h3>
                                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-zinc-400">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>

                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''
                                                }`}
                                        >
                                            {tasks.filter(t => t.status === status).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => openEditor(task)}
                                                            className={`
                                                                bg-zinc-900/50 backdrop-blur-sm p-3 rounded-md border border-white/[0.04] 
                                                                hover:border-zinc-600 hover:bg-zinc-900 transition-all group relative cursor-pointer
                                                                ${snapshot.isDragging ? 'shadow-2xl ring-1 ring-white/10 z-50 rotate-2' : 'shadow-sm'}
                                                            `}
                                                        >


                                                            {/* Header Matches: Category + Priority? */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                                                                        {task.category || 'General'}
                                                                    </span>
                                                                    {task.accelerations > 0 && (
                                                                        <span className="flex items-center gap-0.5 text-emerald-500/80 text-[10px] font-mono bg-emerald-500/5 px-1 rounded">
                                                                            <Zap className="w-2.5 h-2.5" />
                                                                            {task.accelerations}x
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <h4 className="font-medium text-[13px] text-zinc-200 mb-1 leading-snug line-clamp-2">
                                                                {getLocalizedContent(task.title) || <span className="italic text-zinc-600">Untitled</span>}
                                                            </h4>
                                                            <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                                                                {getLocalizedContent(task.description)}
                                                            </p>

                                                            {task.coverImage && (
                                                                <div className="mb-3 rounded-sm overflow-hidden border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={task.coverImage} alt="Cover" className="w-full h-20 object-cover" />
                                                                </div>
                                                            )}

                                                            {/* Footer Meta */}
                                                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-auto">
                                                                <div className="flex items-center gap-3">
                                                                    {/* Translation Status */}
                                                                    {(() => {
                                                                        const missingLocales = LOCALES.filter(l => !task.title[l]);
                                                                        const currentCount = LOCALES.length - missingLocales.length;
                                                                        const isFullyTranslated = missingLocales.length === 0;

                                                                        return (
                                                                            <div
                                                                                title={isFullyTranslated ? "Fully Translated" : `Missing: ${missingLocales.join(', ')}`}
                                                                                className={cn(
                                                                                    "flex items-center gap-1 px-1 py-0.5 rounded transition-colors",
                                                                                    isFullyTranslated
                                                                                        ? "text-emerald-500/60 bg-emerald-500/5"
                                                                                        : "text-amber-500/60 bg-amber-500/5"
                                                                                )}
                                                                            >
                                                                                <Globe className="w-2.5 h-2.5" />
                                                                                <span className="font-mono text-[9px]">{currentCount}/{LOCALES.length}</span>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {task.eta && (
                                                                        <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
                                                                            <Calendar className="w-2.5 h-2.5" />
                                                                            {task.eta}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Mini Progress */}
                                                                {task.progress !== undefined && (
                                                                    <div className="flex items-center gap-1.5" title={`${task.progress}% Complete`}>
                                                                        <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-zinc-500" style={{ width: `${task.progress}%` }} />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div >
    );
}


