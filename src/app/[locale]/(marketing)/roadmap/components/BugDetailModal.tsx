"use client";

import { createPortal } from "react-dom";
import { X, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { BugReport } from "@/types/roadmap";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";

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

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
                onClick={() => setSelectedBug(null)}
            />
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
                                        {t.has(`Filters.Platforms.${selectedBug.platform}`) ? t(`Filters.Platforms.${selectedBug.platform}`) : selectedBug.platform}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {t("BugsTab.modal.label")}
                                    </span>
                                    {(() => {
                                        const statusMap = {
                                            reported: {
                                                label: t.has("BugsTab.status.reported") ? t("BugsTab.status.reported") : "reported",
                                                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                                            },
                                            investigating: {
                                                label: t.has("BugsTab.status.investigating") ? t("BugsTab.status.investigating") : "investigating",
                                                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                                            },
                                            fixing: {
                                                label: t.has("BugsTab.status.fixing") ? t("BugsTab.status.fixing") : "fixing",
                                                color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                            },
                                            resolved: {
                                                label: t.has("BugsTab.status.resolved") ? t("BugsTab.status.resolved") : "resolved",
                                                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                            },
                                            wont_fix: {
                                                label: t.has("BugsTab.status.wont_fix") ? t("BugsTab.status.wont_fix") : "wont_fix",
                                                color: "text-neutral-400 bg-slate-500/10 border-slate-500/20",
                                            },
                                        };
                                        const status =
                                            statusMap[selectedBug.status as keyof typeof statusMap] ||
                                            statusMap.reported;
                                        return (
                                            <span
                                                className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded border ${status.color}`}
                                            >
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
                                    <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                                        {t("BugsTab.modal.description")}
                                    </h4>
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
                            className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${votedIdeas.get(selectedBug.id) === "up"
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
            </div>
        </div>,
        document.body
    );
}
