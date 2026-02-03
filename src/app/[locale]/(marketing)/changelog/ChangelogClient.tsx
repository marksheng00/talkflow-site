"use client";

import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Zap, Bug, Sparkles, Check, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getPublicSupabaseClient } from "@/lib/supabase";

// Initialize Supabase Client
const supabaseClient = getPublicSupabaseClient();

type ChangeType = "feature" | "fix" | "improvement" | "perf";

interface DBRelease {
    id: string;
    version: string;
    publish_date: string;
    status: string;
}

interface DBChangeItem {
    id: string;
    release_id: string;
    type: ChangeType;
    description: Record<string, string>;
    order: number;
}

interface RenderRelease {
    version: string;
    date: string;
    changes: {
        type: ChangeType;
        content: string; // localized content
    }[];
}

function ChangeItem({
    change,
}: {
    change: { type: ChangeType; content: string };
}) {
    const t = useTranslations('ChangelogPage');
    const [squashed, setSquashed] = useState(false);

    const typeConfig: Record<ChangeType, { label: string; color: string; icon: LucideIcon }> = {
        feature: { label: t('Types.feature'), color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Sparkles },
        fix: { label: t('Types.fix'), color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: Bug },
        improvement: { label: t('Types.improvement'), color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: CheckCircle2 },
        perf: { label: t('Types.perf'), color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Zap },
    };

    const config = typeConfig[change.type];
    const Icon = config.icon;
    const isBug = change.type === 'fix';

    const handleBugClick = () => {
        if (isBug && !squashed) {
            setSquashed(true);
            if (navigator.vibrate) navigator.vibrate(50);
        }
    };

    return (
        <SpotlightCard className="rounded-2xl border-white/5 bg-white/[0.02]">
            <div className="flex gap-4 p-4 items-start relative z-10">
                <div className="flex-shrink-0 mt-0.5">
                    <button
                        onClick={handleBugClick}
                        disabled={!isBug || squashed}
                        className={cn(
                            "h-8 w-8 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                            squashed ? "bg-emerald-500/20 text-emerald-400 scale-110" : config.color,
                            isBug && !squashed && "cursor-pointer hover:scale-110 hover:bg-rose-500/20 active:scale-95 animate-pulse"
                        )}
                        title={isBug ? (squashed ? t('Squash.success') : t('Squash.title')) : ""}
                    >
                        <AnimatePresence mode="wait">
                            {squashed ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Check className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="icon"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                >
                                    <Icon className={cn("h-4 w-4", isBug && "group-hover:animate-wiggle")} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "typo-caption transition-colors duration-500",
                            squashed ? "text-emerald-400" : config.color.split(" ")[0]
                        )}>
                            {squashed ? t('Squash.fixed') : config.label}
                        </span>
                    </div>
                    <div
                        className={cn(
                            "typo-body transition-all duration-500 prose prose-invert prose-p:my-0 prose-strong:text-white max-w-none",
                            squashed ? "text-emerald-100/70 line-through decoration-emerald-500/50 decoration-2 opacity-50" : "text-slate-300"
                        )}
                        dangerouslySetInnerHTML={{ __html: change.content }}
                    />
                </div>
            </div>
        </SpotlightCard>
    );
}

export default function ChangelogClient() {
    const t = useTranslations('ChangelogPage');
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const [changelogData, setChangelogData] = useState<RenderRelease[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChangelog() {
            setLoading(true);

            // Check if Supabase client is available
            if (!supabaseClient) {
                console.warn('Supabase client not available');
                setLoading(false);
                return;
            }

            // 1. Fetch published releases
            const { data: releases, error: releasesError } = await supabaseClient
                .from("changelog_releases")
                .select("*")
                .eq("status", "published")
                .order("publish_date", { ascending: false });

            if (releasesError || !releases) {
                console.error("Error fetching releases:", releasesError);
                setLoading(false);
                return;
            }

            // 2. Fetch all items for these releases
            // Optimally we'd use a join, but RLS/Policies might complicate types. Two queries is fine for changelog page.
            const releaseIds = releases.map(r => r.id);
            if (releaseIds.length === 0) {
                setChangelogData([]);
                setLoading(false);
                return;
            }

            const { data: items, error: itemsError } = await supabaseClient
                .from("changelog_items")
                .select("*")
                .in("release_id", releaseIds)
                .order("order", { ascending: true });

            if (itemsError) {
                console.error("Error fetching items:", itemsError);
            }

            // 3. Assemble and Localize
            const itemsByRelease: Record<string, DBChangeItem[]> = {};
            items?.forEach((item: DBChangeItem) => {
                if (!itemsByRelease[item.release_id]) itemsByRelease[item.release_id] = [];
                itemsByRelease[item.release_id].push(item);
            });

            const formattedData: RenderRelease[] = releases.map((r: DBRelease) => {
                const releaseItems = itemsByRelease[r.id] || [];
                return {
                    version: r.version,
                    date: r.publish_date,
                    changes: releaseItems.map(item => {
                        // Priority: Exact Locale -> English -> First available key -> Empty
                        let content = item.description[locale];
                        if (!content) content = item.description['en'];
                        if (!content) content = Object.values(item.description)[0] || '';

                        return {
                            type: item.type,
                            content
                        };
                    })
                };
            });

            setChangelogData(formattedData);
            setLoading(false);
        }

        fetchChangelog();
    }, [locale]);

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <section className="section-block section-hero">
                <div className="section-shell max-w-4xl mx-auto section-stack">
                    {/* Header */}
                    <div className="section-heading">
                        <h1 className="typo-hero text-foreground whitespace-normal md:whitespace-nowrap">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-amber-400 animate-text-shimmer bg-[size:200%_auto] block md:inline-block pb-4">
                                {t('Hero.title')}
                            </span>
                        </h1>
                        <p className="typo-subtitle-lg text-muted/60 max-w-4xl mx-auto">
                            {t('Hero.subtitle')}
                        </p>
                        <p className="typo-mono text-slate-600">
                            {t('Hero.tip')}
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l border-white/10 ml-4 md:ml-12 stack-loose">
                        {loading && (
                            <div className="pl-12 py-12 text-slate-500 animate-pulse">
                                Loading updates...
                            </div>
                        )}

                        {!loading && changelogData.length === 0 && (
                            <div className="pl-12 py-12 text-slate-500">
                                No updates published yet.
                            </div>
                        )}

                        {changelogData.map((release, index) => {
                            return (
                                <div key={release.version} className="relative pl-8 md:pl-12">
                                    {/* Timeline Dot */}
                                    <div className={cn(
                                        "absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-black z-20",
                                        index === 0 ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" : "bg-slate-600"
                                    )} />

                                    {/* Release Header */}
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6 relative group/header">
                                        <div className="flex items-center gap-3">
                                            <h2 className="typo-h3 text-white group-hover/header:text-emerald-400 transition-colors cursor-default">
                                                {release.version}
                                            </h2>
                                            {index === 0 && (
                                                <Badge tone="emerald" variant="solid" size="sm" className="animate-pulse">
                                                    {t('Latest')}
                                                </Badge>
                                            )}
                                        </div>
                                        <time className="typo-mono text-slate-500">
                                            {format(new Date(release.date), locale === 'zh' ? "yyyy年MM月dd日" : "MMMM dd, yyyy", {
                                                locale: locale === 'zh' ? zhCN : undefined
                                            })}
                                        </time>
                                    </div>

                                    {/* Changes List */}
                                    <div className="space-y-4">
                                        {release.changes.map((change, idx) => (
                                            <ChangeItem
                                                key={`${release.version}-${idx}`}
                                                change={change}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
