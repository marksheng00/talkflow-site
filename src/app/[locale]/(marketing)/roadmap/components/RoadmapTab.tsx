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
            {/* Unified Gantt Chart View */}
            <div className="flex gap-4 md:gap-6">
                {/* LEFT: Fixed Task Column */}
                <div className="w-[120px] md:w-[280px] flex-shrink-0 transition-all">
                    <div className="mb-6 pb-4 border-b border-white/10 px-2">
                        <div className="text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{t('RoadmapTab.taskOverview')}</span>
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
                                                {getLocalizedString(task.title)}
                                            </h4>
                                            <div className="hidden md:flex items-center gap-2">
                                                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500 pr-1.5 py-0.5">
                                                    {task.category ? (t.has(`Filters.Categories.${task.category}`) ? t(`Filters.Categories.${task.category}`) : task.category) : ""}
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
                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{monthName}</span>
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
                                            UIUX: { border: 'border-amber-600/40', bg: 'bg-amber-700/10', progress: 'bg-amber-600/30', text: 'text-amber-200' },
                                            Bug: { border: 'border-rose-600/40', bg: 'bg-rose-700/10', progress: 'bg-rose-600/30', text: 'text-rose-200' }
                                        };

                                        const colors = categoryColors[task.category as keyof typeof categoryColors] || { border: 'border-slate-600/40', bg: 'bg-slate-700/10', progress: 'bg-slate-600/20', text: 'text-slate-300' };

                                        return (
                                            <div key={task.id} className="relative h-12 flex items-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTask(task);
                                                    }}
                                                    onMouseDown={(e) => e.stopPropagation()}
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
    );
}
