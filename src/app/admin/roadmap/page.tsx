"use client";

import { useState, useEffect } from "react";
import { RoadmapItem, RoadmapStatus } from "@/types/roadmap";
import { createClient } from "@supabase/supabase-js";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, X, Loader2, RefreshCw, Calendar, Save, Trash2, ArrowLeft, ArrowRight, Upload, Sparkles, Check, AlertCircle, Globe } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { cn } from "@/lib/utils";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabaseClient
            .from("roadmap_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching roadmap:", error);
        } else {
            // Map snake_case DB fields to camelCase
            // DB columns are now JSONB, so we get Objects directly.
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

        let newStatus = destination.droppableId as RoadmapStatus;
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

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this roadmap task?")) return;

        const { error } = await supabaseClient
            .from("roadmap_items")
            .delete()
            .eq("id", taskId);

        if (!error) {
            setTasks(tasks.filter(t => t.id !== taskId));
            if (viewMode === 'editor') {
                setViewMode('kanban');
                setEditingTask(null);
            }
        } else {
            alert("Failed to delete task: " + error.message);
        }
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

    const handleSaveTask = async (task: Partial<RoadmapItem>) => {
        const titleEn = task.title?.en || task.title?.[Object.keys(task.title || {})[0] || 'en'];
        if (!titleEn) return alert("Title (English) is required");

        let finalStatus = task.status || 'researching';
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
                                if (!(updatedTask as any)[field.key]) (updatedTask as any)[field.key] = {};
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

    const getLocalizedContent = (input: any) => {
        if (!input) return "";
        // Priority: Active Locale -> En -> First Key -> Empty
        return input[activeLocale] || input['en'] || Object.values(input)[0] || "";
    };

    if (loading) return <div className="text-white">Loading roadmap...</div>;

    // EDITOR VIEW
    if (viewMode === 'editor' && editingTask) {
        return (
            <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setViewMode('kanban'); setEditingTask(null); }}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold font-heading text-slate-200">
                            {editingTask.id ? 'Edit Task' : 'Create New Task'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        {/* Language Tabs Row */}
                        <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-lg mr-4 border border-white/5">
                            {LOCALES.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLocale(lang)}
                                    disabled={translating}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                                        activeLocale === lang ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
                                        translating && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                            <div className="w-px h-4 bg-white/10 mx-1" />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAutoTranslate}
                                    disabled={translating}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all duration-300",
                                        translating
                                            ? "bg-amber-500/10 text-amber-500 animate-pulse cursor-not-allowed"
                                            : translateFeedback?.type === 'success'
                                                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                                                : translateFeedback?.type === 'error'
                                                    ? "bg-rose-500 text-white hover:bg-rose-600"
                                                    : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                                    )}
                                    title="Auto Translate All Fields"
                                >
                                    {translating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : translateFeedback?.type === 'success' ? (
                                        <Check className="w-3 h-3" />
                                    ) : translateFeedback?.type === 'error' ? (
                                        <AlertCircle className="w-3 h-3" />
                                    ) : (
                                        <Sparkles className="w-3 h-3" />
                                    )}

                                    {translating
                                        ? 'Translating...'
                                        : translateFeedback?.type === 'success'
                                            ? 'Success'
                                            : translateFeedback?.type === 'error'
                                                ? 'Failed'
                                                : 'Magic Translate'
                                    }
                                </button>
                            </div>
                        </div>

                        {editingTask.id && (
                            <button
                                onClick={() => handleDeleteTask(editingTask.id!)}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-lg text-sm border border-rose-500/20 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            onClick={() => handleSaveTask(editingTask)}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Editor Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pb-10">
                    {/* Left: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title ({activeLocale})</label>
                            </div>
                            <input
                                className="w-full bg-transparent border-b border-white/10 py-2 text-3xl font-bold text-white outline-none focus:border-emerald-500 placeholder:text-slate-700"
                                placeholder={`Task Title (${activeLocale})`}
                                value={editingTask.title?.[activeLocale] || ''}
                                onChange={e => setEditingTask({
                                    ...editingTask,
                                    title: { ...editingTask.title, [activeLocale]: e.target.value }
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Summary ({activeLocale})</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-300 outline-none focus:border-emerald-500 h-24 resize-none leading-relaxed"
                                placeholder={`A brief description (${activeLocale})...`}
                                value={editingTask.description?.[activeLocale] || ''}
                                onChange={e => setEditingTask({
                                    ...editingTask,
                                    description: { ...editingTask.description, [activeLocale]: e.target.value }
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Content ({activeLocale})</label>
                            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 min-h-[300px]">
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

                    {/* Right: Sidebar Properties */}
                    <div className="space-y-6">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-6">
                            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Properties</h3>

                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
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
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Category</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
                                    value={editingTask.category || 'Feature'}
                                    onChange={e => setEditingTask({ ...editingTask, category: e.target.value })}
                                >
                                    {["Feature", "Content", "AI Core", "UIUX"].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-slate-500 font-bold mb-2">ETA</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="e.g. Q1 2026"
                                    value={editingTask.eta || ''}
                                    onChange={e => setEditingTask({ ...editingTask, eta: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-xs uppercase text-slate-500 font-bold">Progress</label>
                                    <span className="text-xs font-bold text-emerald-400">{editingTask.progress || 0}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    value={editingTask.progress || 0}
                                    onChange={e => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-4">
                            <label className="block text-xs uppercase text-slate-500 font-bold">Cover Image</label>
                            {editingTask.coverImage && (
                                <img src={editingTask.coverImage} className="w-full h-32 object-cover rounded-lg border border-white/10 opacity-80" />
                            )}
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-xs font-mono outline-none focus:border-emerald-500 transition-colors"
                                placeholder="Image URL..."
                                value={editingTask.coverImage || ''}
                                onChange={e => setEditingTask({ ...editingTask, coverImage: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col relative animate-in fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Roadmap Kanban</h1>
                <button
                    onClick={() => openEditor()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/20"
                >
                    + New Task
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px]">
                    {STATUS_COLUMNS.map((status) => (
                        <div key={status} className="flex-shrink-0 w-80 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-sm">{status}</h3>
                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-400">
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
                                                        className={`bg-slate-900/80 p-4 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors group relative shadow-sm cursor-pointer ${snapshot.isDragging ? 'shadow-xl ring-2 ring-emerald-500 z-50' : ''
                                                            }`}
                                                    >
                                                        {/* Delete Button (Visible on Hover) */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent opening modal
                                                                handleDeleteTask(task.id);
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 bg-rose-500/10 text-rose-500 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all z-10"
                                                            title="Delete Task"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>


                                                        <div className="flex items-start justify-between mb-2 pr-6">
                                                            <span className="text-[10px] uppercase font-bold text-slate-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                                                                {task.category || 'General'}
                                                            </span>
                                                            {task.accelerations > 0 && (
                                                                <span className="text-xs text-amber-400">⚡️ {task.accelerations}</span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-white text-sm mb-1 line-clamp-2">{getLocalizedContent(task.title)}</h4>
                                                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{getLocalizedContent(task.description)}</p>

                                                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <span>ETA: {task.eta || 'TBD'}</span>

                                                                {/* Translation Status Indicator */}
                                                                {(() => {
                                                                    const missingLocales = LOCALES.filter(l => !task.title[l]);
                                                                    const currentCount = LOCALES.length - missingLocales.length;
                                                                    const isFullyTranslated = missingLocales.length === 0;

                                                                    return (
                                                                        <div
                                                                            title={isFullyTranslated ? "Fully Translated" : `Missing: ${missingLocales.join(', ')}`}
                                                                            className={cn(
                                                                                "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                                                                                isFullyTranslated
                                                                                    ? "text-emerald-500/80 bg-emerald-500/10"
                                                                                    : "text-amber-500/70 bg-amber-500/10"
                                                                            )}
                                                                        >
                                                                            <Globe className="w-3 h-3" />
                                                                            <span className="font-mono text-[9px]">{currentCount}/{LOCALES.length}</span>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>

                                                            {task.progress !== undefined && (
                                                                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500" style={{ width: `${task.progress}%` }} />
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
    );
}
