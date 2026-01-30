import { RoadmapItem } from "@/types/roadmap";
import { X, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { createPortal } from "react-dom";

interface TaskDetailModalProps {
    mounted: boolean;
    selectedTask: RoadmapItem | null;
    setSelectedTask: (task: RoadmapItem | null) => void;
    handleBoost: (task: RoadmapItem) => void;
    boostedTasks: Set<string>;
    justBoosted: boolean;
    locale: string;
}

export function TaskDetailModal({
    mounted,
    selectedTask,
    setSelectedTask,
    handleBoost,
    boostedTasks,
    justBoosted,
    locale
}: TaskDetailModalProps) {
    const t = useTranslations('RoadmapPage');

    const getLocalizedString = (input: Record<string, string> | null | undefined) => {
        if (!input) return "";
        return input[locale] || input["en"] || Object.values(input)[0] || "";
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case "Feature":
                return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "Content":
                return "text-purple-400 bg-purple-500/10 border-purple-500/20";
            case "AI Core":
                return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "UIUX":
                return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "Bug":
                return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            default:
                return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    };

    if (!mounted || !selectedTask) return null;

    return createPortal(
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
                                    alt={getLocalizedString(selectedTask.title)}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
                            </div>
                        )}

                        <div className="p-6 md:p-8 pb-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${getCategoryColor(selectedTask.category)}`}>
                                        {selectedTask.category ? (t.has(`Filters.Categories.${selectedTask.category}`) ? t(`Filters.Categories.${selectedTask.category}`) : selectedTask.category) : ""}
                                    </span>
                                    {selectedTask.startDate && selectedTask.targetDate && (
                                        <span className="text-xs text-slate-500 font-mono">
                                            {selectedTask.startDate} — {selectedTask.targetDate}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                                    {getLocalizedString(selectedTask.title)}
                                </h1>
                                <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-medium mb-8 italic border-l-4 border-white/5 pl-6">
                                    {getLocalizedString(selectedTask.description)}
                                </p>
                            </div>

                            {selectedTask.detailedContent && (
                                <div className="prose prose-invert prose-emerald max-w-none">
                                    <div className="text-base text-slate-300 leading-relaxed space-y-6 whitespace-pre-line font-medium">
                                        <div dangerouslySetInnerHTML={{ __html: getLocalizedString(selectedTask.detailedContent) }} />
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
                                {boostedTasks.has(selectedTask.id) ? t('RoadmapTab.boosted') : t('RoadmapTab.boost')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* DESKTOP Side Actions */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                    <button
                        onClick={() => setSelectedTask(null)}
                        className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-neutral-400 group"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <button
                        onClick={() => handleBoost(selectedTask)}
                        disabled={boostedTasks.has(selectedTask.id) || selectedTask.progress === 100}
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${boostedTasks.has(selectedTask.id) || selectedTask.progress === 100
                            ? "bg-black/80 border border-emerald-500/50 cursor-default text-emerald-500"
                            : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:scale-105 cursor-pointer text-neutral-400"
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
    );
}
