import { CommunityIdea } from "@/types/roadmap";
import { X, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";

interface IdeaDetailModalProps {
    mounted: boolean;
    selectedIdea: CommunityIdea | null;
    setSelectedIdea: (idea: CommunityIdea | null) => void;
    handleVote: (id: string, e: React.MouseEvent) => void;
    votedIdeas: Map<string, "up" | "down">;
    lastVotedId: string | null;
}

export function IdeaDetailModal({
    mounted,
    selectedIdea,
    setSelectedIdea,
    handleVote,
    votedIdeas,
    lastVotedId,
}: IdeaDetailModalProps) {
    const t = useTranslations('RoadmapPage');

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

    if (!mounted || !selectedIdea) return null;

    return createPortal(
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
                                    <span className={`text-xs font-medium px-2 py-1 rounded border ${getCategoryColor(selectedIdea.category)}`}>
                                        {selectedIdea.category ? (t.has(`Filters.Categories.${selectedIdea.category}`) ? t(`Filters.Categories.${selectedIdea.category}`) : selectedIdea.category) : ""}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {t('IdeasTab.modal.label')}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                                    {selectedIdea.title}
                                </h2>
                            </div>
                            <p className="text-base md:text-lg text-neutral-400 leading-relaxed font-medium border-l-4 border-white/5 pl-6 italic pb-4">
                                {selectedIdea.description}
                            </p>
                        </div>
                    </div>

                    {/* Mobile Bottom Action Bar */}
                    <div className="md:hidden p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shrink-0 flex gap-3">
                        <button
                            onClick={(e) => handleVote(selectedIdea.id, e)}
                            disabled={votedIdeas.has(selectedIdea.id)}
                            className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${votedIdeas.get(selectedIdea.id) === "up"
                                ? "bg-slate-800 text-emerald-500 cursor-default"
                                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                }`}
                        >
                            <Zap className={`h-5 w-5 ${votedIdeas.get(selectedIdea.id) === "up" ? "fill-emerald-500" : ""}`} />
                            <span>
                                {votedIdeas.get(selectedIdea.id) === "up" ? t('RoadmapTab.boosted') : t('RoadmapTab.boost')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* DESKTOP Side Actions */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-full ml-6 z-20 flex-col gap-4">
                    <button
                        onClick={() => setSelectedIdea(null)}
                        className="flex flex-col items-center justify-center w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-xl hover:border-white/30 hover:text-white transition-all text-neutral-400 group"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <button
                        onClick={(e) => handleVote(selectedIdea.id, e)}
                        disabled={votedIdeas.has(selectedIdea.id)}
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-xl backdrop-blur-xl transition-all overflow-hidden ${votedIdeas.get(selectedIdea.id) === "up"
                            ? "bg-black/80 border border-emerald-500/50 text-emerald-500 cursor-default"
                            : "bg-black/80 border border-white/10 hover:border-emerald-500/50 hover:scale-105 cursor-pointer text-neutral-400"
                            }`}
                    >
                        {votedIdeas.get(selectedIdea.id) !== "up" ? (
                            <Zap className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                        ) : (
                            <AnimatedCounter
                                from={selectedIdea.upvotes - 1}
                                to={selectedIdea.upvotes}
                                skipAnimation={lastVotedId !== selectedIdea.id}
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
