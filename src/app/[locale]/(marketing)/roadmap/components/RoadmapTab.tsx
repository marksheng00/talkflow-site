import { RoadmapItem } from "@/types/roadmap";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

interface RoadmapTabProps {
    filteredTasks: RoadmapItem[];
    setSelectedTask: (task: RoadmapItem) => void;
    timelineRef: React.RefObject<HTMLDivElement | null>;
    mounted: boolean;
    todayPercent: number | null;
    locale: string;
}

export function RoadmapTab({
    filteredTasks,
    setSelectedTask,
    timelineRef,
    mounted,
    todayPercent,
    locale
}: RoadmapTabProps) {
    const t = useTranslations('RoadmapPage');

    const getLocalizedString = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        return input[locale] || input["en"] || Object.values(input)[0] || "";
    };

    return (
        <div className="section-shell max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight">
            <div className="flex flex-col gap-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.05] p-1 overflow-hidden">
                {/* Timeline Header (Syncs with scroll) */}
                <div className="sticky top-0 z-30 bg-zinc-950/90 border-b border-white/[0.05] backdrop-blur-xl">
                    <div className="h-10 relative overflow-hidden" ref={timelineRef}>
                        <div className="absolute inset-y-0 left-0 min-w-[3000px] flex">
                            {Array.from({ length: 25 }, (_, i) => {
                                // Dynamic timeline: Start from 1 year ago
                                const today = new Date();
                                const date = new Date(today.getFullYear() - 1, today.getMonth() + i, 1);
                                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                                const year = date.getFullYear();
                                const isCurrentMonth = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

                                return (
                                    <div key={i} className={`flex-1 min-w-[120px] border-r border-white/[0.02] flex items-center justify-center flex-col ${isCurrentMonth ? 'bg-emerald-500/5' : ''}`}>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrentMonth ? 'text-emerald-400' : 'text-zinc-500'}`}>{monthName}</span>
                                        <span className="text-[9px] text-zinc-700 font-mono">{year}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Groups */}
                <div className="flex-1 overflow-y-auto custom-scrollbar-hidden max-h-[800px]">
                    {Object.entries(
                        filteredTasks.reduce((acc, task) => {
                            const cat = task.category || 'Other';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(task);
                            return acc;
                        }, {} as Record<string, RoadmapItem[]>)
                    ).map(([category, tasks]) => (
                        <div key={category} className="mb-2">
                            {/* Group Header */}
                            <div className="sticky top-0 z-20 h-8 bg-zinc-900/80 border-y border-white/[0.05] flex items-center px-4 backdrop-blur-md">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.has(`Filters.Categories.${category}`) ? t(`Filters.Categories.${category}`) : category}</span>
                                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-zinc-500">{tasks.length}</span>
                            </div>

                            {/* Task Bars container */}
                            <div className="relative py-2 min-h-[50px] overflow-hidden" ref={el => {
                                // Sync horizontal scroll with header
                                if (el && timelineRef.current) {
                                    el.scrollLeft = timelineRef.current.scrollLeft;
                                    el.onscroll = () => {
                                        if (timelineRef.current) timelineRef.current.scrollLeft = el.scrollLeft;
                                        // Sync other group containers
                                        document.querySelectorAll('.gantt-group-container').forEach((c: any) => {
                                            if (c !== el) c.scrollLeft = el.scrollLeft;
                                        });
                                    };
                                }
                            }} className="gantt-group-container overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                <div className="min-w-[3000px] relative h-full">
                                    {/* Grid Lines Background */}
                                    <div className="absolute inset-0 flex pointer-events-none">
                                        {Array.from({ length: 25 }, (_, i) => (
                                            <div key={i} className="flex-1 min-w-[120px] border-r border-white/[0.02] h-full" />
                                        ))}
                                    </div>

                                    {/* Today Line */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-emerald-500/50 z-10">
                                        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-2 py-2">
                                        {tasks.map(task => {
                                            if (!task.startDate || !task.targetDate) return null;

                                            const today = new Date();
                                            const timelineStart = new Date(today.getFullYear() - 1, today.getMonth(), 1);
                                            const timelineEnd = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0); // Approx 25 months range

                                            // Calculate simple percentage position
                                            const totalMs = timelineEnd.getTime() - timelineStart.getTime();
                                            const startMs = new Date(task.startDate).getTime() - timelineStart.getTime();
                                            const durationMs = new Date(task.targetDate).getTime() - new Date(task.startDate).getTime();

                                            const left = (startMs / totalMs) * 100;
                                            const width = (durationMs / totalMs) * 100;

                                            // Skip if out of range
                                            if (left + width < 0 || left > 100) return null;

                                            return (
                                                <button
                                                    key={task.id}
                                                    onClick={() => setSelectedTask(task)}
                                                    className="relative block h-10 rounded-sm border hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all group"
                                                    style={{
                                                        left: `${Math.max(0, left)}%`,
                                                        width: `${Math.max(0.5, width)}%`, // min width for visibility
                                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                                        borderColor: 'rgba(255,255,255,0.08)'
                                                    }}
                                                >
                                                    <div className="absolute inset-0 flex items-center px-3 overflow-hidden">
                                                        <span className="text-[11px] font-bold text-zinc-300 whitespace-nowrap truncate sticky left-2">
                                                            {getLocalizedString(task.title)}
                                                        </span>
                                                    </div>
                                                    {/* Progress Fill */}
                                                    <div
                                                        className="absolute bottom-0 left-0 h-[2px] bg-emerald-500/50 transition-all group-hover:h-full group-hover:opacity-10 -z-10"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
