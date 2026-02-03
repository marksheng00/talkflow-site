"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { RoadmapItem } from "@/types/roadmap";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    differenceInDays,
    format
} from "date-fns";
import { cn } from "@/lib/utils";

interface RoadmapTabProps {
    filteredTasks: RoadmapItem[];
    setSelectedTask: (task: RoadmapItem) => void;
    mounted: boolean;
    locale: string;
}

// Category Configuration
const CATEGORY_CONFIG: Record<string, { color: string; label: string; order: number }> = {
    "AI Core": { color: "emerald", label: "AI Core", order: 1 },
    "Feature": { color: "blue", label: "Feature", order: 2 },
    "Content": { color: "purple", label: "Content", order: 3 },
    "UIUX": { color: "amber", label: "UIUX", order: 4 },
    "Infrastructure": { color: "slate", label: "Infrastructure", order: 5 },
    "Other": { color: "zinc", label: "Other", order: 99 }
};

const COLOR_MAP: Record<string, {
    active: string;
    activeComplete: string;
    released: string;
    releasedComplete: string;
    progress: string;
}> = {
    emerald: {
        active: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-all",
        activeComplete: "bg-emerald-600 border-none text-white",
        released: "bg-emerald-500/5 border-emerald-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-emerald-600 border-none text-white",
        progress: "bg-emerald-600"
    },
    blue: {
        active: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 transition-all",
        activeComplete: "bg-blue-600 border-none text-white",
        released: "bg-blue-500/5 border-blue-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-blue-600 border-none text-white",
        progress: "bg-blue-600"
    },
    purple: {
        active: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 transition-all",
        activeComplete: "bg-purple-600 border-none text-white",
        released: "bg-purple-500/5 border-purple-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-purple-600 border-none text-white",
        progress: "bg-purple-600"
    },
    amber: {
        active: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 transition-all",
        activeComplete: "bg-amber-600 border-none text-white",
        released: "bg-amber-500/5 border-amber-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-amber-600 border-none text-white",
        progress: "bg-amber-600"
    },
    slate: {
        active: "bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20 transition-all",
        activeComplete: "bg-slate-600 border-none text-white",
        released: "bg-slate-500/5 border-slate-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-slate-600 border-none text-white",
        progress: "bg-slate-600"
    },
    zinc: {
        active: "bg-zinc-500/10 border-zinc-500/20 hover:bg-zinc-500/20 transition-all",
        activeComplete: "bg-zinc-600 border-none text-white",
        released: "bg-zinc-500/5 border-zinc-500/10 opacity-50 grayscale-[0.2]",
        releasedComplete: "bg-zinc-600 border-none text-white",
        progress: "bg-zinc-600"
    }
};

export function RoadmapTab({
    filteredTasks,
    setSelectedTask,
    locale
}: RoadmapTabProps) {
    const t = useTranslations('RoadmapPage');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // 1. Dynamic Time Window Calculation
    const { timelineStart, timelineEnd, totalDays, months } = useMemo(() => {
        const today = new Date();
        const start = startOfMonth(subMonths(today, 13)); // 13 months back
        const end = endOfMonth(addMonths(today, 13));     // 13 months forward

        const monthList = [];
        let current = start;
        while (current <= end) {
            monthList.push(current);
            current = addMonths(current, 1);
        }

        return {
            timelineStart: start,
            timelineEnd: end,
            totalDays: differenceInDays(end, start),
            months: monthList
        };
    }, []);

    // 2. Data Processing & Grouping
    const groupedTasks = useMemo(() => {
        // Filter tasks within window
        const visible = filteredTasks.filter(task => {
            if (!task.startDate || !task.targetDate) return false;
            const start = new Date(task.startDate);
            const end = new Date(task.targetDate);
            // Check intersection with timeline window
            return (start <= timelineEnd && end >= timelineStart);
        });

        // Group by Category
        const groups: Record<string, RoadmapItem[]> = {};
        visible.forEach(task => {
            const cat = task.category || "Other";
            // Normalize category key if needed, or use as is
            const key = Object.keys(CATEGORY_CONFIG).find(k => k.toLowerCase() === cat.toLowerCase()) || "Other";
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });

        // Sort groups and tasks
        return Object.entries(groups)
            .sort(([keyA], [keyB]) => {
                const orderA = CATEGORY_CONFIG[keyA]?.order ?? 99;
                const orderB = CATEGORY_CONFIG[keyB]?.order ?? 99;
                return orderA - orderB;
            })
            .map(([key, tasks]) => ({
                key,
                config: CATEGORY_CONFIG[key] || { color: "zinc", label: key, order: 99 },
                tasks: tasks.sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime())
            }));
    }, [filteredTasks, timelineStart, timelineEnd]);

    // 3. Scroll to Today on Mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const today = new Date();
            const percent = differenceInDays(today, timelineStart) / totalDays;
            // Center today: scroll to percent * fullWidth - halfScreen
            const scrollPos = (percent * container.scrollWidth) - (container.clientWidth / 2);
            container.scrollLeft = scrollPos;
        }
    }, [timelineStart, totalDays]);

    // 4. Interaction Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 1.5; // Drag Multiplier for feel
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const getLocalizedString = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        return input[locale] || input["en"] || Object.values(input)[0] || "";
    };

    // Calculate Today Line Position
    const todayPercent = useMemo(() => {
        const today = new Date();
        return (differenceInDays(today, timelineStart) / totalDays) * 100;
    }, [timelineStart, totalDays]);

    return (
        <div className="section-shell max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
            {/* Unified Gantt Chart Container - Ultra Clear Glass */}
            <div className="flex gap-0 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] overflow-hidden relative shadow-2xl">

                {/* LEFT: Fixed Sidebar (Category & Tasks) */}
                <div className="w-[140px] md:w-[320px] flex-shrink-0 border-r border-white/[0.08] bg-white/[0.01] z-20 relative backdrop-blur-md">
                    {/* Header */}
                    <div className="h-14 border-b border-white/[0.08] flex items-center px-6 bg-white/[0.02] backdrop-blur-xl">
                        <span className="typo-caption text-slate-300">Task Overview</span>
                    </div>

                    {/* Content Groups */}
                    <div className="py-2">
                        {groupedTasks.map((group) => (
                            <div key={group.key} className="mb-4">
                                {/* Group Header - LEFT - Frosted Glass */}
                                <div className="h-9 px-4 flex items-center gap-3 mb-1 sticky top-0 bg-white/[0.03] backdrop-blur-xl z-30 border-y border-white/[0.05]">
                                    <span className="typo-body-sm-strong text-slate-200">{group.config.label}</span>
                                    <span className="typo-mono text-slate-500 ml-auto">{group.tasks.length}</span>
                                </div>
                                {/* Tasks List */}
                                <div className="space-y-[2px]">
                                    {group.tasks.map(task => (
                                        <div key={task.id} className="h-10 px-4 flex items-center group cursor-pointer hover:bg-white/[0.05] transition-all duration-300" onClick={() => setSelectedTask(task)}>
                                            <div className="min-w-0 flex-1">
                                                <div className="typo-body-sm text-slate-400 group-hover:text-white transition-colors truncate">
                                                    {getLocalizedString(task.title)}
                                                </div>
                                            </div>
                                            {task.accelerations > 0 && (
                                                <div className="flex items-center gap-1.5 text-emerald-400/90 ml-auto pl-2 w-[54px] flex-shrink-0 justify-start">
                                                    <Zap className="h-3.5 w-3.5 fill-current flex-shrink-0" />
                                                    <span className="typo-mono text-left">{task.accelerations}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Infinite Timeline */}
                <div className="flex-1 min-w-0 relative bg-transparent">
                    <div
                        ref={scrollContainerRef}
                        className={cn(
                            "overflow-x-auto overflow-y-hidden h-full select-none custom-scrollbar",
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        )}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                    >
                        {/* The Canvas */}
                        <div className="min-w-[4000px] relative h-full">

                            {/* 1. Month Headers (Sticky Top) - Frosted Glass */}
                            <div className="h-14 border-b border-white/[0.08] flex sticky top-0 bg-white/[0.02] backdrop-blur-xl z-20">
                                {months.map((date, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 border-r border-white/[0.05] flex flex-col justify-center px-3 min-w-[120px]"
                                    >
                                        <span className="typo-caption text-slate-300">
                                            {format(date, 'MMM')}
                                        </span>
                                        <span className="typo-caption-xs text-slate-500 mt-0.5">
                                            {format(date, 'yyyy')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* 2. Today Line - Extreme Minimalism */}
                            {todayPercent >= 0 && todayPercent <= 100 && (
                                <div
                                    className="absolute top-14 bottom-0 z-30 pointer-events-none flex flex-col items-center w-4 -ml-2"
                                    style={{ left: `${todayPercent}%` }}
                                >
                                    {/* Laser Line - Ghost Tech Dashed Style */}
                                    <div className="w-px h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.5)_4px,transparent_4px)] bg-[size:1px_10px] shadow-[0_0_4px_rgba(255,255,255,0.2)]" />
                                </div>
                            )}

                            {/* 3. Task Bars Container */}
                            <div className="py-2 relative">
                                {/* Vertical Grid Lines - Subtle */}
                                {months.map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-0 bottom-0 border-r border-white/[0.02] pointer-events-none"
                                        style={{ left: `${(i / months.length) * 100}%` }}
                                    />
                                ))}

                                {/* Group Rows */}
                                {groupedTasks.map((group) => (
                                    <div key={group.key} className="mb-4 relative">
                                        {/* Spacer for Group Header - RIGHT */}
                                        <div className="h-9 mb-1 bg-white/[0.02] border-y border-white/[0.02]" />

                                        {/* Task Bars */}
                                        <div className="space-y-[2px]">
                                            {group.tasks.map(task => {
                                                if (!task.startDate || !task.targetDate) return <div key={task.id} className="h-10" />;

                                                const start = new Date(task.startDate);
                                                const end = new Date(task.targetDate);

                                                const offsetDays = differenceInDays(start, timelineStart);
                                                const durationDays = differenceInDays(end, start) || 1; // min 1 day

                                                const left = (offsetDays / totalDays) * 100;
                                                const width = (durationDays / totalDays) * 100;

                                                const isReleased = task.status === 'released';


                                                // Style Presets based on status
                                                let styleClass = "";
                                                const isComplete = (task.progress || 0) >= 100;
                                                const styles = COLOR_MAP[group.config.color] || COLOR_MAP['zinc'];

                                                if (isComplete) {
                                                    styleClass = styles.activeComplete;
                                                } else if (isReleased) {
                                                    styleClass = styles.released;
                                                } else {
                                                    // All other active phases (Shipping, Building, Researching)
                                                    styleClass = styles.active;
                                                }

                                                const getPhaseName = (progress: number = 0) => {
                                                    if (progress >= 100) return t('RoadmapTab.Phases.released');
                                                    if (progress >= 75) return t('RoadmapTab.Phases.shipping');
                                                    if (progress >= 25) return t('RoadmapTab.Phases.building');
                                                    return t('RoadmapTab.Phases.researching');
                                                };

                                                return (
                                                    <div key={task.id} className="h-10 relative group/bar">
                                                        <div
                                                            className={cn(
                                                                "absolute top-2 bottom-2 rounded-lg overflow-hidden backdrop-blur-sm transition-all hover:scale-y-110 hover:brightness-125 cursor-pointer min-w-[24px]",
                                                                styleClass
                                                            )}
                                                            style={{
                                                                left: `${Math.max(0, left)}%`,
                                                                width: `${width}%`
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTask(task);
                                                            }}
                                                        >
                                                            {/* Progress Fill - Only needed for partial completion */}
                                                            {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
                                                                <div
                                                                    className={cn(
                                                                        "absolute inset-y-0 left-0 transition-all",
                                                                        `bg-${group.config.color}-600`
                                                                    )}
                                                                    style={{ width: `${task.progress}%` }}
                                                                />
                                                            )}

                                                            {/* Label on the bar (if wide enough) */}
                                                            <div className="absolute inset-0 flex items-center px-2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                                                                <span className="typo-badge-sm text-white drop-shadow-md truncate">
                                                                    {getPhaseName(task.progress)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
