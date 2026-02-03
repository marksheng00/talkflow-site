import { CommunityIdea } from "@/types/roadmap";
import { Lightbulb, Plus, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { Badge } from "@/components/ui/Badge";

interface IdeasTabProps {
    filteredIdeals: CommunityIdea[];
    setSelectedIdea: (idea: CommunityIdea) => void;
    setIsSubmitModalOpen: (open: boolean) => void;
    handleVote: (id: string, e: React.MouseEvent) => void;
    votedIdeas: Map<string, "up" | "down">;
    lastVotedId: string | null;
}

export function IdeasTab({
    filteredIdeals,
    setSelectedIdea,
    setIsSubmitModalOpen,
    handleVote,
    votedIdeas,
    lastVotedId
}: IdeasTabProps) {
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

    return (
        <div className="section-shell section-stack max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight stack-base">
            <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="group relative flex flex-row items-center gap-3 md:gap-6 rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/5 p-4 w-full hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
            >
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-left min-w-0 flex-1">
                    <p className="typo-body-sm-strong text-slate-200 group-hover:text-white truncate">{t('IdeasTab.submitCard.title')}</p>
                    <p className="typo-body-sm text-slate-500 truncate">{t('IdeasTab.submitCard.subtitle')}</p>
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
                                <h3 className="typo-body-strong text-white group-hover:text-emerald-400 transition-colors pr-8 truncate min-w-0">
                                    {idea.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge tone={getCategoryTone(idea.category)} size="xs" variant="soft" caps={false}>
                                    {idea.category ? (t.has(`Filters.Categories.${idea.category}`) ? t(`Filters.Categories.${idea.category}`) : idea.category) : ""}
                                </Badge>
                            </div>
                        </div>

                        <p className="typo-body-sm text-neutral-400 min-h-[40px] line-clamp-3">
                            {idea.description}
                        </p>

                        <div
                            className="mt-auto pt-3 flex items-center justify-between border-t border-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => handleVote(idea.id, e)}
                                disabled={votedIdeas.has(idea.id)}
                                className={`flex items-center gap-1.5 typo-body-sm-strong transition-all group/up ${votedIdeas.get(idea.id) === "up"
                                    ? "text-emerald-400"
                                    : "text-slate-500 hover:text-emerald-400 hover:scale-105"
                                    }`}
                            >
                                <Zap className={`h-4 w-4 transition-all ${votedIdeas.get(idea.id) === "up" ? "fill-emerald-400" : "group-hover/up:fill-emerald-400/20"}`} />
                                {votedIdeas.get(idea.id) === "up" ? (
                                    <AnimatedCounter
                                        from={idea.upvotes - 1}
                                        to={idea.upvotes}
                                        skipAnimation={lastVotedId !== idea.id}
                                        className="typo-body-sm-strong"
                                    />
                                ) : (
                                    <span>{idea.upvotes}</span>
                                )}
                            </button>

                            {/* Status Badge */}
                            <div className="flex items-center">
                                {(() => {
                                    return (
                                        <Badge tone="slate" size="xs" variant="soft">
                                            {t.has(`IdeasTab.status.${idea.status}`) ? t(`IdeasTab.status.${idea.status}`) : idea.status}
                                        </Badge>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
