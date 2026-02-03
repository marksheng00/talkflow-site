"use client";
import { X, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { BugReport } from "@/types/roadmap";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface BugDetailModalProps {
    mounted: boolean;
    selectedBug: BugReport | null;
    setSelectedBug: (bug: BugReport | null) => void;
    handleBugVote: (id: string, e: React.MouseEvent) => void;
    votedIdeas: Map<string, "up" | "down">;
    lastVotedId: string | null;
}

export function BugDetailModal({
    mounted,
    selectedBug,
    setSelectedBug,
    handleBugVote,
    votedIdeas,
    lastVotedId,
}: BugDetailModalProps) {
    const t = useTranslations('RoadmapPage');

    if (!mounted || !selectedBug) return null;

    return (
        <Modal
            isOpen={!!selectedBug}
            onClose={() => setSelectedBug(null)}
            size="lg"
            className="max-w-2xl"
            showCloseButton={false}
            allowOverflow
        >
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
                            <Badge tone="rose" size="sm" variant="soft">
                                {t.has(`Filters.Platforms.${selectedBug.platform}`) ? t(`Filters.Platforms.${selectedBug.platform}`) : selectedBug.platform}
                            </Badge>
                            <span className="typo-mono text-slate-500">
                                {t("BugsTab.modal.label")}
                            </span>
                            {(() => {
                                        const statusMap = {
                                            reported: {
                                                label: t.has("BugsTab.status.reported") ? t("BugsTab.status.reported") : "reported",
                                                tone: "rose",
                                            },
                                            investigating: {
                                                label: t.has("BugsTab.status.investigating") ? t("BugsTab.status.investigating") : "investigating",
                                                tone: "amber",
                                            },
                                            fixing: {
                                                label: t.has("BugsTab.status.fixing") ? t("BugsTab.status.fixing") : "fixing",
                                                tone: "blue",
                                            },
                                            resolved: {
                                                label: t.has("BugsTab.status.resolved") ? t("BugsTab.status.resolved") : "resolved",
                                                tone: "emerald",
                                            },
                                            wont_fix: {
                                                label: t.has("BugsTab.status.wont_fix") ? t("BugsTab.status.wont_fix") : "wont_fix",
                                                tone: "slate",
                                            },
                                        };
                                        const status =
                                            statusMap[selectedBug.status as keyof typeof statusMap] ||
                                            statusMap.reported;
                                        return (
                                            <Badge
                                                tone={status.tone as "rose" | "amber" | "blue" | "emerald" | "slate"}
                                                size="xs"
                                                variant="soft"
                                                className="ml-auto"
                                            >
                                                {status.label}
                                            </Badge>
                                        );
                                    })()}
                        </div>
                        <h2 className="typo-h3 text-white">
                            {selectedBug.title}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="typo-label text-neutral-400">
                                {t("BugsTab.modal.description")}
                            </h3>
                            <p className="typo-body text-slate-300 border-l-4 border-white/5 pl-4">
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
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 typo-button-md transition-all ${votedIdeas.get(selectedBug.id) === "up"
                        ? "bg-slate-800 text-emerald-500 cursor-default"
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        }`}
                >
                    <Zap className={`h-5 w-5 ${votedIdeas.get(selectedBug.id) === "up" ? "fill-emerald-500" : ""}`} />
                    <span>
                        {votedIdeas.get(selectedBug.id) === "up" ? t('RoadmapTab.boosted') : t('RoadmapTab.boost')}
                    </span>
                </button>
            </div>

            {/* DESKTOP Side Actions */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                <button
                    onClick={() => setSelectedBug(null)}
                    className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-neutral-400 group"
                >
                    <X className="h-6 w-6" />
                </button>

                <button
                    onClick={(e) => handleBugVote(selectedBug.id, e)}
                    disabled={votedIdeas.has(selectedBug.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${votedIdeas.get(selectedBug.id) === "up"
                        ? "bg-black/80 border border-emerald-500/50 text-emerald-500 cursor-default"
                        : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:scale-105 cursor-pointer text-neutral-400"
                        }`}
                >
                    {votedIdeas.get(selectedBug.id) !== "up" ? (
                        <Zap className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                    ) : (
                        <AnimatedCounter
                            from={selectedBug.upvotes - 1}
                            to={selectedBug.upvotes}
                            skipAnimation={lastVotedId !== selectedBug.id}
                        />
                    )}
                </button>
            </div>
        </Modal>
    );
}
