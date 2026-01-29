"use client";

import { useState, useEffect } from "react";
import { RoadmapItem, RoadmapStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, X, Loader2, Calendar, ArrowLeft, Globe, Layers, Pencil, Zap, Image as ImageIcon, CloudUpload, CalendarDays, Map, Activity, Settings, Trash2 } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { cn } from "@/lib/utils";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const STATUS_COLUMNS: RoadmapStatus[] = ["researching", "building", "shipping", "released"];
const LOCALES = ["en", "zh", "zh-Hant", "es", "ja", "ko"];

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
    const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);

    const getStoragePathFromUrl = (url: string) => {
        if (!url || !url.includes('/public/roadmap-covers/')) return null;
        const parts = url.split('/public/roadmap-covers/');
        return parts[parts.length - 1]; // Handles nested paths too
    };

    const getLocalizedContent = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        return input[activeLocale] || input['en'] || Object.values(input)[0] || "";
    };

    const fetchTasks = async () => {
        const { data, error } = await supabaseClient
            .from("roadmap_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching roadmap:", error);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedTasks = (data || []).map((t: any) => ({
                ...t,
                title: t.title || { en: "" },
                description: t.description || { en: "" },
                detailedContent: t.detailed_content || { en: "" },
                coverImage: t.cover_image,
                startDate: t.start_date,
                targetDate: t.target_date
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
        if (newStatus === 'released') newProgress = 100;
        else if (newProgress === 100) newProgress = 95;

        const updatedTasks = tasks.map(t =>
            t.id === draggableId ? { ...t, status: newStatus, progress: newProgress } : t
        );
        setTasks(updatedTasks);

        await supabaseClient
            .from("roadmap_items")
            .update({ status: newStatus, progress: newProgress })
            .eq("id", draggableId);
    };

    const openEditor = (task?: RoadmapItem) => {
        if (task) {
            setEditingTask(task);
        } else {
            setEditingTask({
                status: 'researching',
                category: 'Feature',
                progress: 0,
                title: { en: "" },
                description: { en: "" },
                detailedContent: { en: "" }
            });
        }
        setActiveLocale('en');
        setTranslateFeedback(null);
        setPendingDeletes([]);
        setViewMode('editor');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingTask) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('roadmap-covers')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('roadmap-covers')
                .getPublicUrl(filePath);

            if (editingTask.coverImage) {
                const oldPath = getStoragePathFromUrl(editingTask.coverImage);
                if (oldPath) setPendingDeletes([...pendingDeletes, oldPath]);
            }
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
        if (finalStatus === 'released') finalProgress = 100;
        else if (finalProgress === 100) finalProgress = 95;

        const taskData = {
            title: task.title,
            description: task.description,
            category: task.category,
            start_date: task.startDate,
            target_date: task.targetDate,
            progress: finalProgress,
            status: finalStatus,
            accelerations: task.accelerations || 0,
            cover_image: task.coverImage,
            detailed_content: task.detailedContent
        };

        if (task.id) {
            const { error } = await supabaseClient
                .from("roadmap_items")
                .update(taskData)
                .eq("id", task.id);

            if (!error) {
                setTasks(tasks.map(t => t.id === task.id ? {
                    ...t,
                    ...taskData,
                    startDate: taskData.start_date,
                    targetDate: taskData.target_date,
                    coverImage: taskData.cover_image,
                    detailedContent: taskData.detailed_content
                } as RoadmapItem : t));
                setEditingTask(null);
                setViewMode('kanban');
            } else {
                alert("Update failed: " + error.message);
            }
        } else {
            const { data, error } = await supabaseClient
                .from("roadmap_items")
                .insert(taskData)
                .select()
                .single();

            if (!error && data) {
                const newTask = {
                    ...data,
                    startDate: data.start_date,
                    targetDate: data.target_date,
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

        // Cleanup storage
        if (pendingDeletes.length > 0) {
            await supabaseClient.storage.from('roadmap-covers').remove(pendingDeletes);
            setPendingDeletes([]);
        }
    };

    const handleAutoTranslate = async () => {
        if (!editingTask) return;
        const fieldsToTranslate = [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Summary' }, { key: 'detailedContent', label: 'Detailed Content' }];
        const sourceTitle = editingTask.title?.[activeLocale];
        if (!sourceTitle) return alert(`Please enter a Title in ${activeLocale} first.`);

        setTranslating(true);
        setTranslateFeedback(null);
        const updatedTask = { ...editingTask };
        let errorCount = 0;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            const targetLocales = LOCALES.filter(l => l !== activeLocale);
            for (const lang of targetLocales) {
                for (const field of fieldsToTranslate) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const sourceText = (editingTask as any)[field.key]?.[activeLocale];
                    if (sourceText && sourceText !== "<p></p>" && sourceText.trim() !== "") {
                        try {
                            const res = await fetch("/api/admin/translate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ text: sourceText, from: activeLocale, to: lang })
                            });
                            const data = await res.json();
                            if (data.translatedText) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if (!(updatedTask as any)[field.key]) (updatedTask as any)[field.key] = {};
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (updatedTask as any)[field.key][lang] = data.translatedText;
                            } else {
                                errorCount++;
                            }
                            await delay(250);
                        } catch (err) {
                            errorCount++;
                        }
                    }
                }
            }
            setEditingTask({ ...updatedTask });
            setTranslateFeedback({ type: errorCount > 0 ? 'error' : 'success', message: "" });
        } catch (err) {
            setTranslateFeedback({ type: 'error', message: "" });
        } finally {
            setTranslating(false);
            setTimeout(() => setTranslateFeedback(null), 3000);
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing Roadmap...
        </div>
    );

    // EDITOR VIEW
    if (viewMode === 'editor' && editingTask) {
        return (
            <div className="h-full flex flex-col bg-[#09090b] text-zinc-300 animate-in fade-in duration-500 overflow-hidden">
                <div className="h-16 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('kanban')} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"><ArrowLeft className="w-4.5 h-4.5" /></button>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                {getLocalizedContent(editingTask.title) || 'Untitled Task'}
                            </h2>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">ID: {editingTask.id?.slice(0, 8) || 'Draft'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                            {LOCALES.map(loc => (
                                <button
                                    key={loc} onClick={() => setActiveLocale(loc)}
                                    className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold transition-all uppercase", activeLocale === loc ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-600 hover:text-zinc-400")}
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

                        <button onClick={() => handleSaveTask(editingTask)} className="px-5 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-lg text-[11px] transition-all flex items-center gap-1.5 shadow-lg">
                            <Activity className="w-3.5 h-3.5" /> Save Changes
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-zinc">
                    <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-3 space-y-12">
                            {/* Title Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Task Title</label>
                                <input
                                    className="w-full bg-transparent border-none p-0 text-3xl font-bold text-zinc-100 outline-none placeholder:text-zinc-800 focus:ring-0"
                                    placeholder="Enter task title..."
                                    value={editingTask.title?.[activeLocale] || ''}
                                    onChange={e => setEditingTask({ ...editingTask, title: { ...editingTask.title, [activeLocale]: e.target.value } })}
                                />
                            </div>

                            {/* Summary Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Summary</label>
                                <textarea
                                    className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 text-[15px] text-zinc-400 outline-none focus:border-white/10 transition-all min-h-[120px] leading-relaxed resize-none"
                                    placeholder="Enter summary..."
                                    value={editingTask.description?.[activeLocale] || ''}
                                    onChange={e => setEditingTask({ ...editingTask, description: { ...editingTask.description, [activeLocale]: e.target.value } })}
                                />
                            </div>

                            {/* Content Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Description</label>
                                <TiptapEditor
                                    content={editingTask.detailedContent?.[activeLocale] || ''}
                                    onChange={(html) => setEditingTask({ ...editingTask, detailedContent: { ...editingTask.detailedContent, [activeLocale]: html } })}
                                />
                            </div>
                        </div>

                        <aside className="space-y-10">
                            <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl space-y-8">
                                <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5" /> Properties
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Status</label>
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-zinc-300 appearance-none outline-none focus:border-indigo-500/30"
                                            value={editingTask.status || 'researching'}
                                            onChange={e => {
                                                const s = e.target.value as RoadmapStatus;
                                                let p = editingTask.progress || 0;
                                                if (s === 'released') p = 100; else if (p === 100) p = 95;
                                                setEditingTask({ ...editingTask, status: s, progress: p });
                                            }}
                                        >
                                            {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Category</label>
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-zinc-300 appearance-none outline-none focus:border-indigo-500/30"
                                            value={editingTask.category || 'Feature'}
                                            onChange={e => setEditingTask({ ...editingTask, category: e.target.value })}
                                        >
                                            {["Feature", "Content", "AI Core", "UIUX"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/[0.05]">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Completion</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range" min="0" max="100"
                                                className="flex-1 accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none"
                                                value={editingTask.progress || 0}
                                                onChange={e => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                                            />
                                            <span className="text-[10px] font-mono text-indigo-400 font-bold">{editingTask.progress}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="space-y-4 pb-2">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] uppercase font-bold text-zinc-600 ml-0.5 tracking-tight">Start Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-2 pl-9 text-[11px] text-zinc-400 font-mono [color-scheme:dark] outline-none focus:border-indigo-500/30 transition-all font-medium"
                                                        value={editingTask.startDate || ''}
                                                        onChange={e => setEditingTask({ ...editingTask, startDate: e.target.value })}
                                                    />
                                                    <CalendarDays className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-700 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] uppercase font-bold text-zinc-600 ml-0.5 tracking-tight">Target Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-2 pl-9 text-[11px] text-zinc-400 font-mono [color-scheme:dark] outline-none focus:border-indigo-500/30 transition-all font-medium"
                                                        value={editingTask.targetDate || ''}
                                                        onChange={e => setEditingTask({ ...editingTask, targetDate: e.target.value })}
                                                    />
                                                    <CalendarDays className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-700 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/[0.05]">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] uppercase font-bold text-zinc-600">Cover Image</label>
                                        <label className="text-[9px] font-bold text-indigo-500 hover:text-indigo-400 cursor-pointer uppercase">
                                            {uploading ? "Uploading..." : "Replace"}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    {editingTask.coverImage ? (
                                        <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-32">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={editingTask.coverImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                                            <button
                                                onClick={() => {
                                                    if (editingTask.coverImage) {
                                                        const path = getStoragePathFromUrl(editingTask.coverImage);
                                                        if (path) setPendingDeletes([...pendingDeletes, path]);
                                                    }
                                                    setEditingTask({ ...editingTask, coverImage: '' });
                                                }}
                                                className="absolute inset-0 flex items-center justify-center bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-all text-white"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-32 rounded-xl border border-dashed border-white/5 flex items-center justify-center opacity-20"><ImageIcon className="w-6 h-6" /></div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        );
    }

    // KANBAN VIEW
    return (
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-full flex flex-col">
            {/* Command Header */}
            <div className="flex items-center justify-between pb-2 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                        Roadmap
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                        {LOCALES.map(loc => (
                            <button
                                key={loc}
                                onClick={() => setActiveLocale(loc)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all",
                                    activeLocale === loc
                                        ? "bg-zinc-800 text-zinc-100 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-[1px] bg-white/10 mx-1" />

                    <button
                        onClick={() => openEditor()}
                        className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-black font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" /> New Task
                    </button>
                </div>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 h-full overflow-x-auto pb-4 custom-scrollbar">
                        {STATUS_COLUMNS.map((status) => (
                            <div key={status} className="flex-shrink-0 w-80 border border-white/[0.05] rounded-xl bg-zinc-900/10 flex flex-col max-h-full">
                                <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between shrink-0">
                                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <Layers className="w-3 h-3 text-indigo-500" /> {status}
                                    </h3>
                                    <div className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded leading-none">
                                        {tasks.filter(t => t.status === status).length}
                                    </div>
                                </div>

                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar transition-colors",
                                                snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''
                                            )}
                                        >
                                            {tasks.filter(t => t.status === status).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => openEditor(task)}
                                                            className={cn(
                                                                "group bg-[#0F0F12] border border-white/[0.03] p-4 rounded-xl hover:border-zinc-700/40 hover:bg-[#141417] transition-all cursor-pointer relative",
                                                                snapshot.isDragging ? "shadow-2xl ring-1 ring-indigo-500/20 z-50 rotate-1" : "shadow-sm"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                                                                    {task.category || 'Feature'}
                                                                </span>
                                                                {task.accelerations > 0 && (
                                                                    <span className="flex items-center gap-0.5 text-emerald-500 text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-lg border border-emerald-500/10">
                                                                        <Zap className="w-2.5 h-2.5" /> {task.accelerations}x
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h4 className="text-[13px] font-bold text-zinc-100 mb-1 leading-snug line-clamp-2">{getLocalizedContent(task.title)}</h4>
                                                            <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mb-3 font-medium">{getLocalizedContent(task.description)}</p>

                                                            {task.coverImage && (
                                                                <div className="mb-3 rounded-lg overflow-hidden border border-white/5 bg-black/20">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={task.coverImage} alt="" className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            )}

                                                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-3">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="flex items-center gap-1 text-zinc-600 font-mono text-[9px]">
                                                                        <Calendar className="w-2.5 h-2.5" />
                                                                        {task.targetDate || 'TBD'}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-zinc-600">
                                                                        <Globe className="w-2.5 h-2.5" />
                                                                        <span className="text-[9px] font-mono">
                                                                            {LOCALES.length - LOCALES.filter(l => !task.title[l]).length}/{LOCALES.length}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-indigo-500" style={{ width: `${task.progress}%` }} />
                                                                </div>
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
        </div>
    );
}
