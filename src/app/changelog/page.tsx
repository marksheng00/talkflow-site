import type { Metadata } from "next";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { changelogData, ChangeType } from "@/lib/data/changelog-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CheckCircle2, Zap, Bug, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Changelog | talkflo",
    description: "See what's new in talkflo. We are shipping improvements and new features every week.",
    alternates: {
        canonical: "/changelog",
    },
    openGraph: {
        title: "Product Changelog | talkflo",
        description: "Track our journey and see the latest updates.",
    }
};

const typeConfig: Record<ChangeType, { label: string; color: string; icon: any }> = {
    feature: { label: "New", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Sparkles },
    fix: { label: "Fix", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: Bug },
    improvement: { label: "Update", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: CheckCircle2 },
    perf: { label: "Perf", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Zap },
};

export default function ChangelogPage() {
    return (
        <AuroraBackground className="min-h-screen pb-32 text-white">
            <section className="relative pt-32 pb-16 section-shell max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Changelog.
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        We're building in public. Here's everything we've shipped recently.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-16">
                    {changelogData.map((release, index) => (
                        <div key={release.version} className="relative pl-8 md:pl-12">
                            {/* Timeline Dot */}
                            <div className={cn(
                                "absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-black",
                                index === 0 ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" : "bg-slate-600"
                            )} />

                            {/* Release Header */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white font-heading">
                                        {release.version}
                                    </h2>
                                    {index === 0 && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950 bg-emerald-400 rounded-full">
                                            Latest
                                        </span>
                                    )}
                                </div>
                                <time className="text-sm font-mono text-slate-500">
                                    {format(new Date(release.date), "MMMM dd, yyyy")}
                                </time>
                            </div>

                            {/* Changes List */}
                            <div className="space-y-4">
                                {release.changes.map((change, idx) => {
                                    const config = typeConfig[change.type];
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="group flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", config.color.replace("text-", "text-").replace("bg-", "bg-").replace("border-", "border-"))}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color.split(" ")[0])}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                                    {change.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </AuroraBackground>
    );
}
