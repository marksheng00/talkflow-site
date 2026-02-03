import { RoadmapItem } from "@/types/roadmap";
import { X, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

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

    const getCategoryTone = (category?: string) => {
        switch (category) {
            case "Feature":
                return "blue";
            case "Content":
                return "purple";
            case "AI Core":
                return "emerald";
            case "UIUX":
                return "amber";
            case "Bug":
                return "rose";
            default:
                return "slate";
        }
    };

    if (!mounted || !selectedTask) return null;

    return (
        <Modal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            size="xl"
            className="max-w-3xl"
            showCloseButton={false}
            allowOverflow
        >
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
                            <Badge tone={getCategoryTone(selectedTask.category)} size="sm" variant="soft">
                                {selectedTask.category ? (t.has(`Filters.Categories.${selectedTask.category}`) ? t(`Filters.Categories.${selectedTask.category}`) : selectedTask.category) : ""}
                            </Badge>
                            {selectedTask.startDate && selectedTask.targetDate && (
                                <span className="typo-mono text-slate-500">
                                    {selectedTask.startDate} — {selectedTask.targetDate}
                                </span>
                            )}
                        </div>
                        <h2 className="typo-h2 text-white mb-4">
                            {getLocalizedString(selectedTask.title)}
                        </h2>
                        <p className="typo-body-lg text-neutral-400 mb-8 italic border-l-4 border-white/5 pl-6">
                            {getLocalizedString(selectedTask.description)}
                        </p>
                    </div>

                    {selectedTask.detailedContent && (
                        <div className="prose prose-invert prose-emerald max-w-none">
                            <div className="typo-body text-slate-300 space-y-6 whitespace-pre-line">
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
                    className={`w-full h-12 rounded-2xl flex items-center justify-center gap-2 typo-button-md transition-all ${boostedTasks.has(selectedTask.id) || selectedTask.progress === 100
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
        </Modal>
    );
}
