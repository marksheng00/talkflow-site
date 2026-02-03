import { BugReport } from "@/types/roadmap";
import { Bug, Plus, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/roadmap/AnimatedCounter";
import { Badge } from "@/components/ui/Badge";

interface BugsTabProps {
    filteredBugs: BugReport[];
    setSelectedBug: (bug: BugReport) => void;
    setIsBugModalOpen: (open: boolean) => void;
    handleBugVote: (id: string, e: React.MouseEvent) => void;
    votedIdeas: Map<string, "up" | "down">;
    lastVotedId: string | null;
}

export function BugsTab({
    filteredBugs,
    setSelectedBug,
    setIsBugModalOpen,
    handleBugVote,
    votedIdeas,
    lastVotedId
}: BugsTabProps) {
    const t = useTranslations('RoadmapPage');

    return (
        <div className="section-shell section-stack max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-stack-tight stack-base">
            <button
                onClick={() => setIsBugModalOpen(true)}
                className="group relative flex flex-row items-center gap-3 md:gap-6 rounded-2xl border border-dashed border-rose-500/20 bg-rose-500/5 p-4 w-full hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
            >
                <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Bug className="h-5 w-5 text-rose-400" />
                </div>
                <div className="text-left min-w-0 flex-1">
                    <p className="typo-body-sm-strong text-slate-200 group-hover:text-white truncate">{t('BugsTab.submitCard.title')}</p>
                    <p className="typo-body-sm text-slate-500 truncate">{t('BugsTab.submitCard.subtitle')}</p>
                </div>
                <div className="ml-auto pl-2 flex-shrink-0">
                    <Plus className="h-5 w-5 text-slate-600 group-hover:text-rose-400 transition-colors" />
                </div>
            </button>

            <div className="grid gap-cards md:grid-cols-2 lg:grid-cols-3 w-full">
                {filteredBugs.map(bug => {
                    const platformTone = {
                        Web: "blue",
                        iOS: "rose",
                        Android: "emerald",
                    }[bug.platform] || "slate";

                    return (
                        <div
                            key={bug.id}
                            onClick={() => setSelectedBug(bug)}
                            className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] pad-card h-[220px] transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg cursor-pointer w-full min-w-0 overflow-hidden"
                        >
                            <div className="space-y-1.5 min-w-0">
                                <div className="flex items-start justify-between gap-4 min-w-0">
                                    <h3 className="typo-body-strong text-white group-hover:text-rose-400 transition-colors pr-8 truncate min-w-0">
                                        {bug.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge tone={platformTone as "blue" | "rose" | "emerald" | "slate"} size="xs" variant="soft" caps={false}>
                                        {bug.platform}
                                    </Badge>
                                </div>
                            </div>

                            <p className="typo-body-sm text-neutral-400 min-h-[40px] line-clamp-3">
                                {bug.stepsToReproduce}
                            </p>

                            <div
                                className="mt-auto pt-3 flex items-center justify-between border-t border-white/5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={(e) => handleBugVote(bug.id, e)}
                                    disabled={votedIdeas.has(bug.id)}
                                    className={`flex items-center gap-1.5 typo-body-sm-strong transition-all group/up ${votedIdeas.get(bug.id) === "up"
                                        ? "text-emerald-400"
                                        : "text-slate-500 hover:text-emerald-400 hover:scale-105"
                                        }`}
                                >
                                    <Zap className={`h-4 w-4 transition-all ${votedIdeas.get(bug.id) === "up" ? "fill-emerald-400" : "group-hover/up:fill-emerald-400/20"}`} />
                                    {votedIdeas.get(bug.id) === "up" ? (
                                        <AnimatedCounter
                                            from={bug.upvotes - 1}
                                            to={bug.upvotes}
                                            skipAnimation={lastVotedId !== bug.id}
                                            className="typo-body-sm-strong"
                                        />
                                    ) : (
                                        <span>{bug.upvotes}</span>
                                    )}
                                </button>

                                {/* Status Badge */}
                                <div className="flex items-center">
                                    <Badge tone="slate" size="xs" variant="soft">
                                        {t.has(`BugsTab.status.${bug.status}`) ? t(`BugsTab.status.${bug.status}`) : bug.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
