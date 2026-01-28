import { CommunityIdea } from "@/types/roadmap";
import { Lightbulb, Plus, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";

interface IdeasTabProps {
    filteredIdeals: CommunityIdea[];
    setSelectedIdea: (idea: CommunityIdea) => void;
    setIsSubmitModalOpen: (open: boolean) => void;
    handleVote: (id: string, direction: "up" | "down", e: React.MouseEvent) => void;
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
                    <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate">{t('IdeasTab.submitCard.title')}</p>
                    <p className="text-xs text-slate-500 truncate">{t('IdeasTab.submitCard.subtitle')}</p>
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
                                <h4 className="font-semibold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors pr-8 truncate min-w-0">
                                    {idea.title}
                                </h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
                                    {t(`Filters.Categories.${idea.category}`)}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-neutral-400 leading-relaxed min-h-[40px] line-clamp-3">
                            {idea.description}
                        </p>

                        <div
                            className="mt-auto pt-3 flex items-center justify-between border-t border-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => handleVote(idea.id, "up", e)}
                                disabled={votedIdeas.has(idea.id)}
                                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors group/up ${votedIdeas.get(idea.id) === "up" ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
                                    }`}
                            >
                                <ArrowUp className={`h-4 w-4 transition-transform ${votedIdeas.has(idea.id) ? "" : "group-hover/up:-translate-y-0.5"}`} />
                                {votedIdeas.get(idea.id) === "up" ? (
                                    <AnimatedCounter
                                        from={idea.upvotes - 1}
                                        to={idea.upvotes}
                                        skipAnimation={lastVotedId !== idea.id}
                                        className="text-xs font-semibold"
                                    />
                                ) : (
                                    <span>{idea.upvotes}</span>
                                )}
                            </button>

                            {/* Status Badge */}
                            <div className="flex items-center">
                                {(() => {
                                    const statusColors: Record<string, string> = {
                                        planned: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                        under_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                        open: "bg-slate-500/10 text-slate-400 border-slate-500/20",
                                        declined: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                                    };
                                    const colors = statusColors[idea.status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
                                     return (
                                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors}`}>
                                             {t(`IdeasTab.status.${idea.status}`)}
                                         </span>
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
