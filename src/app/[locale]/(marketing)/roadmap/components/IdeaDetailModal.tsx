import { CommunityIdea } from "@/types/roadmap";
import { X, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

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

    if (!mounted || !selectedIdea) return null;

    return (
        <Modal
            isOpen={!!selectedIdea}
            onClose={() => setSelectedIdea(null)}
            size="lg"
            className="max-w-2xl"
            showCloseButton={false}
            allowOverflow
        >
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
                            <Badge tone={getCategoryTone(selectedIdea.category)} size="sm" variant="soft">
                                {selectedIdea.category ? (t.has(`Filters.Categories.${selectedIdea.category}`) ? t(`Filters.Categories.${selectedIdea.category}`) : selectedIdea.category) : ""}
                            </Badge>
                            <span className="typo-mono text-slate-500">
                                {t('IdeasTab.modal.label')}
                            </span>
                        </div>
                        <h2 className="typo-h3 text-white">
                            {selectedIdea.title}
                        </h2>
                    </div>
                    <p className="typo-body-lg text-neutral-400 border-l-4 border-white/5 pl-6 italic pb-4">
                        {selectedIdea.description}
                    </p>
                </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className="md:hidden p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shrink-0 flex gap-3">
                <button
                    onClick={(e) => handleVote(selectedIdea.id, e)}
                    disabled={votedIdeas.has(selectedIdea.id)}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 typo-button-md transition-all ${votedIdeas.get(selectedIdea.id) === "up"
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
        </Modal>
    );
}
