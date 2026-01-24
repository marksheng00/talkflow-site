"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
    Loader2,
    Plus,
    X,
    Sparkles,
    Zap,
    ArrowUp,
    ArrowDown,
    Bug,
    Lightbulb,
} from "lucide-react";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import {
    Category,
    categories,
    RoadmapItem,
    CommunityIdea,
    BugReport,
    BugPlatform,
    IdeaSubmission,
    BugSubmission
} from "@/types/roadmap";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import {
    accelerateRoadmapItem,
    voteIdea,
    voteBugReport,
    createIdea,
    createBugReport
} from "@/lib/roadmap";

// Form State
type FormState = {
    title: string;
    description: string;
    category: string;
};

// Types for local state
type Tab = "roadmap" | "ideas" | "bugs";

// Request deduplication map
const pendingBoosts = new Map<string, Promise<RoadmapItem>>();

interface RoadmapClientProps {
    initialTasks: RoadmapItem[];
    initialIdeas: CommunityIdea[];
    initialBugs: BugReport[];
}

export default function RoadmapClient({ initialTasks, initialIdeas, initialBugs }: RoadmapClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("roadmap");
    const [tasks, setTasks] = useState<RoadmapItem[]>(initialTasks);
    const [ideals, setIdeals] = useState<CommunityIdea[]>(initialIdeas);
    const [bugs, setBugs] = useState<BugReport[]>(initialBugs);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filtering
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [selectedPlatform, setSelectedPlatform] = useState<BugPlatform | "All">("All");

    // Modals
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<RoadmapItem | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<CommunityIdea | null>(null);
    const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);

    // Boost tracking
    const [boostedTasks, setBoostedTasks] = useState<Set<string>>(new Set());
    const [justBoosted, setJustBoosted] = useState(false);
    // Vote tracking
    const [votedIdeas, setVotedIdeas] = useState<Map<string, "up" | "down">>(new Map());
    const [lastVotedId, setLastVotedId] = useState<string | null>(null);
    const [todayPercent, setTodayPercent] = useState<number | null>(null);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        category: "",
    });

    const [bugForm, setBugForm] = useState({
        title: "",
        steps: "",
        expected: "",
        actual: "",
        platform: "Web" as "Web" | "iOS" | "Android"
    });

    const [bugSubmitting, setBugSubmitting] = useState(false);

    // Gantt Chart Drag-to-Scroll Logic
    const timelineRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftOnDown = useRef(0);

    // Timeline Drag Interaction
    useLayoutEffect(() => {
        const el = timelineRef.current;
        if (!el) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';
            startX.current = e.pageX - el.offsetLeft;
            scrollLeftOnDown.current = el.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDragging.current = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX.current) * 2; // scroll speed multiplier
            el.scrollLeft = scrollLeftOnDown.current - walk;
        };

        // Prevent clicks when dragging
        const handleClick = (e: MouseEvent) => {
            if (Math.abs(scrollLeftOnDown.current - el.scrollLeft) > 5) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        el.addEventListener("mousedown", handleMouseDown);
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseup", handleMouseUp);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("click", handleClick, { capture: true });

        // Initial cursor
        el.style.cursor = 'grab';

        return () => {
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseup", handleMouseUp);
            el.removeEventListener("mouseleave", handleMouseLeave);
            el.removeEventListener("click", handleClick, { capture: true });
        };
    }, [activeTab]);

    // Fetch Data - Removed in favor of Server Action pre-fetching
    // useEffect(() => { ... }, []);

    // Reset tracking states when modal opens/changes
    useEffect(() => {
        setJustBoosted(false);
    }, [selectedTask?.id]);

    useEffect(() => {
        setLastVotedId(null);
    }, [selectedIdea?.id]);

    useEffect(() => {
        const dayMs = 1000 * 60 * 60 * 24;
        const timelineStart = Date.UTC(2024, 0, 1);
        const timelineEnd = Date.UTC(2032, 0, 31);
        const totalDays = (timelineEnd - timelineStart) / dayMs;
        const todayOffset = (Date.now() - timelineStart) / dayMs;
        setTodayPercent((todayOffset / totalDays) * 100);
    }, []);

    // Filter Logic
    const filteredTasks = useMemo(() => {
        if (selectedCategory === "All") return tasks;
        return tasks.filter(t => t.category === selectedCategory);
    }, [tasks, selectedCategory]);

    const filteredIdeals = useMemo(() => {
        if (selectedCategory === "All") return ideals;
        return ideals.filter(i => i.category === selectedCategory);
    }, [ideals, selectedCategory]);

    const filteredBugs = useMemo(() => {
        if (selectedPlatform === "All") return bugs;
        return bugs.filter(b => b.platform === selectedPlatform);
    }, [bugs, selectedPlatform]);

    // Handlers
    // Handlers
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submission: IdeaSubmission = {
                title: form.title,
                description: form.description,
                category: form.category || undefined,
            };

            const newItem = await createIdea(submission);

            setIdeals(prev => [newItem, ...prev]);
            setIsSubmitModalOpen(false);
            setForm({ title: "", description: "", category: "" });
            setActiveTab("ideas");
        } catch (error: unknown) {
            console.error("Failed to submit idea", error);
            const message = error instanceof Error ? error.message : "Ensure title > 6 chars";
            alert(`Failed to create idea: ${message}`);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleBugSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBugSubmitting(true);
        try {
            const submission: BugSubmission = {
                title: bugForm.title,
                stepsToReproduce: bugForm.steps,
                expectedResult: bugForm.expected,
                actualResult: bugForm.actual,
                platform: bugForm.platform,
            };

            const newItem = await createBugReport(submission);

            setBugs(prev => [newItem, ...prev]);
            setIsBugModalOpen(false);
            setBugForm({ title: "", steps: "", expected: "", actual: "", platform: "Web" });
            setActiveTab("bugs");
        } catch (error: unknown) {
            console.error("Failed to submit bug", error);
            const message = error instanceof Error ? error.message : "Ensure title > 6 chars";
            alert(`Failed to report bug: ${message}`);
        } finally {
            setBugSubmitting(false);
        }
    }

    async function handleVote(id: string, direction: "up" | "down", e: React.MouseEvent) {
        e.stopPropagation();

        // 1. Optimistic Update
        const previousIdeals = ideals;
        const prevSelectedIdea = selectedIdea;

        const optimisticallyUpdate = (i: CommunityIdea) => {
            if (direction === "up") {
                return { ...i, upvotes: i.upvotes + 1 };
            } else {
                return { ...i, downvotes: (i.downvotes || 0) + 1 };
            }
        };

        setIdeals(prev => prev.map(i => i.id === id ? optimisticallyUpdate(i) : i));

        if (selectedIdea?.id === id) {
            setSelectedIdea(optimisticallyUpdate(selectedIdea));
        }
        setVotedIdeas(prev => new Map(prev).set(id, direction));
        setLastVotedId(id);

        try {
            // 2. Server Request
            const updatedItem = await voteIdea(id, direction);

            // 3. Reconcile (Optional, but good for data consistency)
            setIdeals(prev => prev.map(i => i.id === id ? updatedItem : i));
            if (selectedIdea?.id === id) setSelectedIdea(updatedItem);
        } catch (error) {
            console.error("Vote failed", error);
            // 4. Rollback on error
            setIdeals(previousIdeals);
            if (prevSelectedIdea && prevSelectedIdea.id === id) setSelectedIdea(prevSelectedIdea);
            setVotedIdeas(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        }
    }

    async function handleBoost(task: RoadmapItem) {
        const taskId = task.id;

        // UI Optimistic Update Check
        if (boostedTasks.has(taskId)) return;
        if (pendingBoosts.has(taskId)) return;

        // 1. Optimistic Update
        const previousTasks = tasks;
        const prevSelectedTask = selectedTask;

        const optimisticUpdate = (t: RoadmapItem) => ({ ...t, accelerations: t.accelerations + 1 });

        setTasks(prev => prev.map(t => t.id === taskId ? optimisticUpdate(t) : t));

        if (selectedTask?.id === taskId) {
            setSelectedTask(optimisticUpdate(selectedTask));
        }
        setBoostedTasks(prev => new Set(prev).add(taskId));
        setJustBoosted(true);

        const boostPromise = (async () => {
            try {
                const updatedItem = await accelerateRoadmapItem(taskId);
                // Reconcile with server data
                setTasks(prev => prev.map(t => t.id === taskId ? updatedItem : t));
                if (selectedTask?.id === taskId) setSelectedTask(updatedItem);
                return updatedItem;
            } catch (error) {
                console.error("Boost failed", error);
                // Rollback
                setTasks(previousTasks);
                if (prevSelectedTask && prevSelectedTask.id === taskId) setSelectedTask(prevSelectedTask);
                setBoostedTasks(prev => {
                    const next = new Set(prev);
                    next.delete(taskId);
                    return next;
                });
                throw error;
            } finally {
                pendingBoosts.delete(taskId);
            }
        })();

        pendingBoosts.set(taskId, boostPromise);
    }

    async function handleBugVote(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (votedIdeas.has(id)) return;

        // 1. Optimistic Update
        const previousBugs = bugs;
        const prevSelectedBug = selectedBug;

        const optimisticUpdate = (b: BugReport) => ({ ...b, upvotes: b.upvotes + 1 });

        setBugs(prev => prev.map(b => b.id === id ? optimisticUpdate(b) : b));

        if (selectedBug?.id === id) {
            setSelectedBug(optimisticUpdate(selectedBug));
        }
        setVotedIdeas(prev => new Map(prev).set(id, "up"));

        try {
            const updatedBug = await voteBugReport(id);
            // Reconcile
            setBugs(prev => prev.map(b => b.id === id ? updatedBug : b));
        } catch (error) {
            console.error("Bug vote failed", error);
            // Rollback
            setBugs(previousBugs);
            if (prevSelectedBug && prevSelectedBug.id === id) setSelectedBug(prevSelectedBug);
            setVotedIdeas(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        }
    }

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white overflow-x-hidden">
            {/* Hero + Content Section */}
            <section className="section-block section-hero">
                <div className="section-shell section-stack stack-tight items-center text-center">
                    <div className="section-heading">
                        <h1 className="font-heading text-5xl font-bold tracking-tighter text-foreground md:text-8xl whitespace-normal md:whitespace-nowrap leading-[1.1] md:leading-[0.9]">
                            Building in{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 animate-text-shimmer bg-[size:200%_auto] block md:inline-block pb-4">
                                public.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted/60 font-light tracking-tight leading-relaxed max-w-4xl mx-auto">
                            Track our progress, vote on upcoming features, and help us shape the future of agentic communication.
                        </p>
                    </div>

                    <div className="flex w-full flex-col stack-tight md:flex-row md:items-center md:justify-between">
                        <div className="flex p-1 stack-tight md:gap-1 rounded-xl bg-white/5 border border-white/5 w-full md:w-fit">
                            <button
                                onClick={() => setActiveTab("roadmap")}
                                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "roadmap" ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                            >
                                Roadmap
                            </button>
                            <button
                                onClick={() => setActiveTab("ideas")}
                                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "ideas" ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                            >
                                Ideas
                            </button>
                            <button
                                onClick={() => setActiveTab("bugs")}
                                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "bugs" ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                            >
                                Bugs
                            </button>
                        </div>

                        <div className="flex gap-1.5 md:gap-2 w-full md:w-auto justify-center md:justify-end">
                            {activeTab === "bugs" ? (
                                // Platform Filters for Bugs
                                (["All", "iOS", "Android", "Web"] as const).map(p => {
                                    const isActive = selectedPlatform === p;
                                    const platformColors = {
                                        All: { active: 'bg-slate-500/20 border-slate-500/50 text-slate-300', hover: 'hover:border-slate-500/30' },
                                        Web: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                        iOS: "bg-rose-500/20 text-rose-400 border-rose-500/30",
                                        Android: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                    };
                                    const colors = platformColors[p] || platformColors.All;

                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setSelectedPlatform(p)}
                                            className={`flex-1 md:flex-initial px-3 md:px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-semibold border transition-all text-center whitespace-nowrap ${isActive
                                                ? (typeof colors === 'string' ? colors : colors.active)
                                                : `bg-transparent border-white/10 text-slate-500 ${typeof colors === 'string' ? '' : colors.hover} hover:text-slate-300`
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })
                            ) : (
                                // Category Filters for Roadmap/Ideas
                                categories.map(cat => {
                                    const categoryButtonColors = {
                                        All: { active: 'bg-slate-500/20 border-slate-500/50 text-slate-300', hover: 'hover:border-slate-500/30' },
                                        "Feature": "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                        "Content": "bg-purple-500/20 text-purple-400 border-purple-500/30",
                                        "AI Core": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                        "UIUX": "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                        "Bug": "bg-rose-500/20 text-rose-400 border-rose-500/30",
                                    };

                                    const mobileLabels: Record<string, string> = {
                                        "AI Core": "AI",
                                        "Feature": "Feat",
                                    };
                                    const displayLabel = mobileLabels[cat] || cat;
                                    const buttonColor = categoryButtonColors[cat as keyof typeof categoryButtonColors] || categoryButtonColors.All;

                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`flex-1 md:flex-initial px-2 md:px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-semibold border transition-all text-center whitespace-nowrap ${selectedCategory === cat
                                                ? (typeof buttonColor === 'string' ? buttonColor : buttonColor.active)
                                                : `bg-transparent border-white/10 text-slate-500 ${typeof buttonColor === 'string' ? '' : buttonColor.hover} hover:text-slate-300`
                                                }`}
                                        >
                                            <span className="md:hidden">{displayLabel}</span>
                                            <span className="hidden md:inline">{cat}</span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CONTENT TABS --- */}

                {/* TAB 1: OFFICIAL ROADMAP - GANTT CHART */}
                {activeTab === "roadmap" && (
                    <div className="section-shell max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight">

                        {/* Unified Gantt Chart View */}
                        <div className="flex gap-4 md:gap-6">
                            {/* LEFT: Fixed Task Column */}
                            <div className="w-[120px] md:w-[280px] flex-shrink-0 transition-all">
                                <div className="mb-6 pb-4 border-b border-white/10">
                                    <div className="text-center">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Overview</span>
                                        <div className="text-[9px] text-slate-600 mt-0.5 opacity-0">2024</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {filteredTasks
                                        .filter(task => task.startDate && task.targetDate)
                                        .map((task) => (
                                            <div key={task.id} className="h-12 flex items-center">
                                                <button
                                                    onClick={() => setSelectedTask(task)}
                                                    className="w-full h-full flex items-center text-left hover:bg-white/5 rounded-lg px-2 transition-colors group"
                                                >
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold text-sm text-white leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                                            {task.title}
                                                        </h4>
                                                        <div className="hidden md:flex items-center gap-2">
                                                            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500 px-1.5 py-0.5">
                                                                {task.category}
                                                            </span>
                                                            <div className="flex items-center gap-1 text-slate-600">
                                                                <Zap className="h-2.5 w-2.5" />
                                                                <span className="text-[9px] font-medium">{task.accelerations}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* RIGHT: Scrollable Timeline */}
                            <div className="flex-1 overflow-hidden">
                                <div
                                    ref={timelineRef}
                                    className="overflow-x-auto md:overflow-x-hidden overflow-y-hidden cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] select-none"
                                >
                                    <div className="min-w-[8000px]">
                                        {/* Timeline Header */}
                                        <div className="mb-6 pb-4 border-b border-white/10 flex">
                                            {Array.from({ length: 97 }, (_, i) => {
                                                const date = new Date(2024, i, 1);
                                                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                                                const year = date.getFullYear();
                                                return (
                                                    <div key={i} className="flex-1 text-center min-w-[80px]">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{monthName}</span>
                                                        {i % 12 === 0 && <div className="text-[9px] text-slate-600 mt-0.5">{year}</div>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Task Bars */}
                                        <div className="relative space-y-3">
                                            {mounted && todayPercent !== null && todayPercent >= 0 && todayPercent <= 100 && (
                                                <div
                                                    className="absolute -top-6 -bottom-6 border-l-2 border-dashed border-emerald-500/30 pointer-events-none z-10"
                                                    style={{ left: `${todayPercent.toFixed(4)}%` }}
                                                />
                                            )}

                                            {/* Grid Lines */}
                                            {Array.from({ length: 97 }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute -top-6 -bottom-6 border-l border-white/[0.03] pointer-events-none"
                                                    style={{ left: `${(i / 97) * 100}%` }}
                                                />
                                            ))}

                                            {filteredTasks
                                                .filter(task => task.startDate && task.targetDate)
                                                .map((task) => {
                                                    const startDate = new Date(task.startDate!);
                                                    const endDate = new Date(task.targetDate!);
                                                    const timelineStart = new Date('2024-01-01');
                                                    const timelineEnd = new Date('2032-01-31');

                                                    const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
                                                    const taskStartOffset = (startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
                                                    const taskDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

                                                    const leftPercent = (taskStartOffset / totalDays) * 100;
                                                    const widthPercent = (taskDuration / totalDays) * 100;

                                                    const categoryColors = {
                                                        Feature: { border: 'border-blue-600/40', bg: 'bg-blue-700/10', progress: 'bg-blue-600/30', text: 'text-blue-200' },
                                                        Content: { border: 'border-purple-600/40', bg: 'bg-purple-700/10', progress: 'bg-purple-600/30', text: 'text-purple-200' },
                                                        "AI Core": { border: 'border-emerald-600/40', bg: 'bg-emerald-700/10', progress: 'bg-emerald-600/30', text: 'text-emerald-200' },
                                                        UIUX: { border: 'border-amber-600/40', bg: 'bg-amber-700/10', progress: 'bg-amber-600/30', text: 'text-amber-200' }
                                                    };

                                                    const colors = categoryColors[task.category as keyof typeof categoryColors] || { border: 'border-slate-600/40', bg: 'bg-slate-700/10', progress: 'bg-slate-600/20', text: 'text-slate-300' };

                                                    return (
                                                        <div key={task.id} className="relative h-12 flex items-center">
                                                            <button
                                                                onClick={() => setSelectedTask(task)}
                                                                className={`absolute h-12 rounded-lg border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg`}
                                                                style={{
                                                                    left: `${leftPercent}%`,
                                                                    width: `${widthPercent}%`,
                                                                    minWidth: '100px'
                                                                }}
                                                            >
                                                                <div className="absolute inset-0 overflow-hidden rounded-lg">
                                                                    <div
                                                                        className={`absolute bottom-0 left-0 h-[2px] ${colors.progress.replace('/30', '/60')} transition-all`}
                                                                        style={{ width: `${task.progress || 0}%` }}
                                                                    />
                                                                </div>
                                                                <div className="relative h-full flex items-center justify-between px-3 z-10">
                                                                    <span className={`text-[11px] font-semibold ${colors.text} truncate`}>
                                                                        {task.progress}%
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: COMMUNITY IDEAS */}
                {activeTab === "ideas" && (
                    <div className="section-shell section-stack max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight stack-base">
                        <button
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="group relative flex flex-row items-center gap-3 md:gap-6 rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/5 p-4 w-full hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
                        >
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                <Lightbulb className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate">Submit New Idea</p>
                                <p className="text-xs text-slate-500 truncate">Have a feature request? Add it to the pool.</p>
                            </div>
                            <div className="ml-auto pl-2 flex-shrink-0">
                                <Plus className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            </div>
                        </button>

                        <div className="grid gap-cards md:grid-cols-2 lg:grid-cols-3 w-full">
                            {filteredIdeals.map(idea => (
                                <div
                                    key={idea.id}
                                    onClick={() => setSelectedIdea(idea)}
                                    className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] pad-card h-[220px] transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg cursor-pointer w-full min-w-0 overflow-hidden"
                                >
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-start justify-between gap-4 min-w-0">
                                            <h4 className="font-semibold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors pr-8 truncate min-w-0">
                                                {idea.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
                                                {idea.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 leading-relaxed min-h-[40px] line-clamp-3">
                                        {idea.description}
                                    </p>

                                    <div
                                        className="mt-auto pt-3 flex items-center gap-3 border-t border-white/5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => handleVote(idea.id, "up", e)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors group/up"
                                        >
                                            <ArrowUp className="h-4 w-4 transition-transform group-hover/up:-translate-y-0.5" />
                                            <span>{idea.upvotes}</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleVote(idea.id, "down", e)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-400 transition-colors group/down"
                                        >
                                            <ArrowDown className="h-4 w-4 transition-transform group-hover/down:translate-y-0.5" />
                                            <span>{idea.downvotes || 0}</span>
                                        </button>

                                        <div className="ml-auto">
                                            {(() => {
                                                const isPlanned = idea.status === 'planned';
                                                return (
                                                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${isPlanned
                                                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                                                        : 'text-slate-500 bg-white/5 border-white/5'
                                                        }`}>
                                                        {isPlanned ? 'Planned' : 'Open'}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 3: BUG TRACKER */}
                {activeTab === "bugs" && (
                    <div className="section-shell section-stack max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight stack-base">
                        <button
                            onClick={() => setIsBugModalOpen(true)}
                            className="group relative flex flex-row items-center gap-3 md:gap-6 rounded-2xl border border-dashed border-rose-500/20 bg-rose-500/5 p-4 w-full hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                        >
                            <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                <Bug className="h-5 w-5 text-rose-400" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate">Report a Bug</p>
                                <p className="text-xs text-slate-500 truncate">Found something broken? Help us squash it.</p>
                            </div>
                            <div className="ml-auto pl-2 flex-shrink-0">
                                <Plus className="h-5 w-5 text-slate-600 group-hover:text-rose-400 transition-colors" />
                            </div>
                        </button>

                        <div className="grid gap-cards md:grid-cols-2 lg:grid-cols-3">
                            {filteredBugs.map(bug => (
                                <div
                                    key={bug.id}
                                    onClick={() => setSelectedBug(bug)}
                                    className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] pad-card h-[220px] transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg cursor-pointer w-full min-w-0 overflow-hidden"
                                >
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-start justify-between gap-4 min-w-0">
                                            <h4 className="font-semibold text-white text-base leading-tight group-hover:text-rose-400 transition-colors pr-8 truncate min-w-0">
                                                {bug.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
                                                {bug.platform}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 leading-relaxed min-h-[40px] line-clamp-3">
                                        {bug.description}
                                    </p>

                                    <div
                                        className="mt-auto pt-3 flex items-center gap-3 border-t border-white/5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => handleBugVote(bug.id, e)}
                                            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors group/up ${votedIdeas.has(bug.id) ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"}`}
                                        >
                                            <ArrowUp className="h-4 w-4 transition-transform group-hover/up:-translate-y-0.5" />
                                            <span>{bug.upvotes}</span>
                                        </button>

                                        <div className="ml-auto">
                                            {(() => {
                                                const statusMap = {
                                                    reported: { label: 'Reported', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                                                    investigating: { label: 'Investigating', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                                                    fixing: { label: 'Fixing', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                                                    resolved: { label: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                                                    wont_fix: { label: "Won't Fix", color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
                                                };
                                                const status = statusMap[bug.status] || statusMap.reported;
                                                return (
                                                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* TASK DETAIL MODAL */}
            {mounted && selectedTask && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedTask(null)} />
                    <div className="relative w-full max-w-3xl animate-in zoom-in-95">
                        <div className="relative w-full bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh]">

                            {/* Mobile Close Button (Top Right) */}
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="md:hidden absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                {selectedTask.coverImage && (
                                    <div className="relative h-[200px] md:h-[300px] overflow-hidden shrink-0">
                                        <Image
                                            src={selectedTask.coverImage}
                                            alt={selectedTask.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
                                    </div>
                                )}

                                <div className="p-6 md:p-8 pb-8">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-medium text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                {selectedTask.category}
                                            </span>
                                            {selectedTask.startDate && selectedTask.targetDate && (
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {selectedTask.startDate} — {selectedTask.targetDate}
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                                            {selectedTask.title}
                                        </h1>
                                        <div className="h-1.5 w-12 bg-emerald-500 mb-8 rounded-full" />
                                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium mb-8 italic border-l-4 border-white/5 pl-6">
                                            {selectedTask.description}
                                        </p>
                                    </div>

                                    {selectedTask.detailedContent && (
                                        <div className="prose prose-invert prose-emerald max-w-none">
                                            <div className="text-base text-slate-300 leading-relaxed space-y-6 whitespace-pre-line font-medium">
                                                {selectedTask.detailedContent}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Bottom Action Bar */}
                            <div className="md:hidden p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shrink-0">
                                <button
                                    onClick={() => handleBoost(selectedTask)}
                                    disabled={boostedTasks.has(selectedTask.id) || selectedTask.progress === 100}
                                    className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${boostedTasks.has(selectedTask.id) || selectedTask.progress === 100
                                        ? "bg-slate-800 text-emerald-500 cursor-default"
                                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                        }`}
                                >
                                    <Zap className={`h-5 w-5 ${boostedTasks.has(selectedTask.id) ? "fill-emerald-500" : ""}`} />
                                    <span>
                                        {boostedTasks.has(selectedTask.id) ? "Boosted!" : "Boost this Feature"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP Side Actions */}
                        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-slate-400 group"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <button
                                onClick={() => handleBoost(selectedTask)}
                                disabled={boostedTasks.has(selectedTask.id) || selectedTask.progress === 100}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${boostedTasks.has(selectedTask.id) || selectedTask.progress === 100
                                    ? "bg-black/80 border border-emerald-500/50 cursor-default text-emerald-500"
                                    : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:scale-105 cursor-pointer text-slate-400"
                                    }`}
                            >
                                {!boostedTasks.has(selectedTask.id) && selectedTask.progress !== 100 ? (
                                    <Zap className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                                ) : (
                                    <AnimatedCounter
                                        from={selectedTask.accelerations - 1}
                                        to={selectedTask.accelerations}
                                        skipAnimation={!justBoosted}
                                    />
                                )}
                            </button>
                        </div>

                    </div>
                </div>,
                document.body
            )}

            {/* IDEA DETAIL MODAL */}
            {mounted && selectedIdea && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedIdea(null)} />
                    <div className="relative w-full max-w-2xl animate-in zoom-in-95">
                        <div className="relative w-full bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]">

                            {/* Mobile Close Button (Top Right) */}
                            <button
                                onClick={() => setSelectedIdea(null)}
                                className="md:hidden absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                <div className="relative h-[200px] md:h-[240px] w-full bg-slate-900/50 overflow-hidden shrink-0">
                                    {selectedIdea.coverImage ? (
                                        <Image
                                            src={selectedIdea.coverImage}
                                            alt={selectedIdea.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-[#0A0A0A] to-black flex items-center justify-center">
                                            <Sparkles className="h-12 w-12 text-white/5" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                                </div>

                                <div className="p-6 md:p-8 pt-2 space-y-6 relative">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-medium text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                {selectedIdea.category}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">
                                                IDEA
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                                            {selectedIdea.title}
                                        </h2>
                                    </div>
                                    <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium border-l-4 border-white/5 pl-6 italic pb-4">
                                        {selectedIdea.description}
                                    </p>
                                </div>
                            </div>

                            {/* Mobile Bottom Action Bar */}
                            <div className="md:hidden p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shrink-0 flex gap-3">
                                <button
                                    onClick={(e) => handleVote(selectedIdea.id, "up", e)}
                                    disabled={votedIdeas.has(selectedIdea.id)}
                                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${votedIdeas.has(selectedIdea.id)
                                        ? "bg-slate-800 text-emerald-400 cursor-default"
                                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 active:bg-emerald-500/20"
                                        }`}
                                >
                                    <ArrowUp className="h-5 w-5" />
                                    <span>{selectedIdea.upvotes} Upvote</span>
                                </button>
                                <button
                                    onClick={(e) => handleVote(selectedIdea.id, "down", e)}
                                    disabled={votedIdeas.has(selectedIdea.id)}
                                    className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold transition-all ${votedIdeas.has(selectedIdea.id)
                                        ? "bg-slate-800 text-rose-400 cursor-default"
                                        : "bg-white/5 border border-white/10 text-slate-400 active:bg-white/10"
                                        }`}
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP Side Actions */}
                        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                            <button
                                onClick={() => setSelectedIdea(null)}
                                className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-slate-400 group"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <button
                                onClick={(e) => handleVote(selectedIdea.id, "up", e)}
                                disabled={votedIdeas.has(selectedIdea.id)}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${votedIdeas.has(selectedIdea.id)
                                    ? "bg-black/80 border border-emerald-500/50 text-emerald-500 cursor-default"
                                    : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 hover:scale-105 cursor-pointer text-slate-500"
                                    }`}
                            >
                                {!votedIdeas.has(selectedIdea.id) ? (
                                    <ArrowUp className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
                                ) : (
                                    <AnimatedCounter
                                        from={votedIdeas.get(selectedIdea.id) === "up" ? selectedIdea.upvotes - 1 : selectedIdea.upvotes}
                                        to={selectedIdea.upvotes}
                                        skipAnimation={lastVotedId !== selectedIdea.id}
                                    />
                                )}
                            </button>
                            <button
                                onClick={(e) => handleVote(selectedIdea.id, "down", e)}
                                disabled={votedIdeas.has(selectedIdea.id)}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${votedIdeas.has(selectedIdea.id)
                                    ? "bg-black/80 border border-rose-500/50 text-rose-500 cursor-default"
                                    : "bg-black/80 border border-white/10 hover:border-rose-500/50 hover:text-rose-400 hover:scale-105 cursor-pointer text-slate-400"
                                    }`}
                            >
                                {!votedIdeas.has(selectedIdea.id) ? (
                                    <ArrowDown className="h-6 w-6 transition-transform group-hover:translate-y-0.5" />
                                ) : (
                                    <AnimatedCounter
                                        from={votedIdeas.get(selectedIdea.id) === "down" ? (selectedIdea.downvotes || 0) - 1 : (selectedIdea.downvotes || 0)}
                                        to={selectedIdea.downvotes || 0}
                                        skipAnimation={lastVotedId !== selectedIdea.id}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* BUG DETAIL MODAL */}
            {mounted && selectedBug && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedBug(null)} />
                    <div className="relative w-full max-w-2xl animate-in zoom-in-95">
                        <div className="relative w-full bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]">

                            {/* Mobile Close Button (Top Right) */}
                            <button
                                onClick={() => setSelectedBug(null)}
                                className="md:hidden absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                <div className="p-6 md:p-8 pt-8 space-y-6 relative">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-medium text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                                                {selectedBug.platform}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">
                                                BUG REPORT
                                            </span>
                                            {(() => {
                                                const statusMap = {
                                                    reported: { label: 'Reported', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                                                    investigating: { label: 'Investigating', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                                                    fixing: { label: 'Fixing', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                                                    resolved: { label: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                                                    wont_fix: { label: "Won't Fix", color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
                                                };
                                                const status = statusMap[selectedBug.status] || statusMap.reported;
                                                return (
                                                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                                            {selectedBug.title}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                                            <p className="text-base text-slate-300 leading-relaxed font-medium border-l-4 border-white/5 pl-4">
                                                {selectedBug.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Bottom Action Bar */}
                            <div className="md:hidden p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shrink-0 flex gap-3">
                                <button
                                    onClick={(e) => handleBugVote(selectedBug.id, e)}
                                    disabled={votedIdeas.has(selectedBug.id)}
                                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${votedIdeas.has(selectedBug.id)
                                        ? "bg-slate-800 text-emerald-400 cursor-default"
                                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 active:bg-emerald-500/20"
                                        }`}
                                >
                                    <ArrowUp className="h-5 w-5" />
                                    <span>{selectedBug.upvotes} Upvote</span>
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP Side Actions */}
                        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                            <button
                                onClick={() => setSelectedBug(null)}
                                className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-slate-400 group"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <button
                                onClick={(e) => handleBugVote(selectedBug.id, e)}
                                disabled={votedIdeas.has(selectedBug.id)}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${votedIdeas.has(selectedBug.id)
                                    ? "bg-black/80 border border-emerald-500/50 text-emerald-500 cursor-default"
                                    : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 hover:scale-105 cursor-pointer text-slate-500"
                                    }`}
                            >
                                {!votedIdeas.has(selectedBug.id) ? (
                                    <ArrowUp className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
                                ) : (
                                    <AnimatedCounter
                                        from={selectedBug.upvotes - 1}
                                        to={selectedBug.upvotes}
                                        skipAnimation={lastVotedId !== selectedBug.id}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* SUBMIT IDEA MODAL */}
            {mounted && isSubmitModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsSubmitModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
                        <button
                            onClick={() => setIsSubmitModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10 transition-colors z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-heading font-bold text-white leading-tight flex items-center gap-2">
                                <Lightbulb className="h-6 w-6 text-emerald-500" />
                                Submit New Idea
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Share your feature requests with the team.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                                <input
                                    placeholder="What's your idea?"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${form.category === cat
                                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                                : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                <textarea
                                    placeholder="Describe how this would work..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none leading-relaxed"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                    minLength={12}
                                />
                            </div>

                            <button
                                disabled={submitting}
                                className="w-full h-14 bg-emerald-500 text-black rounded-xl font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {submitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Submit Idea"}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* BUG SUBMIT MODAL */}
            {mounted && isBugModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsBugModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95">
                        <button
                            onClick={() => setIsBugModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10 transition-colors z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Bug className="h-6 w-6 text-rose-500" />
                                Report a Bug
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Something not working? Let us know.</p>
                        </div>

                        <form onSubmit={handleBugSubmit} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">What went wrong?</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. App crashes when I click..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors"
                                    value={bugForm.title}
                                    onChange={e => setBugForm({ ...bugForm, title: e.target.value })}
                                />
                            </div>

                            {/* Platform Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Platform</label>
                                <div className="flex gap-2">
                                    {(["Web", "iOS", "Android"] as const).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setBugForm({ ...bugForm, platform: p })}
                                            className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${bugForm.platform === p
                                                ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                                                : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Steps to Reproduce</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Describe how to reproduce..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
                                    value={bugForm.steps}
                                    onChange={e => setBugForm({ ...bugForm, steps: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={bugSubmitting}
                                type="submit"
                                className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
                            >
                                {bugSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Report Bug"
                                )}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AuroraBackground>
    );
}
