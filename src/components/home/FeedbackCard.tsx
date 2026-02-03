"use client";

import { FeedbackCardData } from "@/lib/data/home-data";
import { cardStyles } from "@/components/ui/Card";

export function FeedbackCard({ card }: { card: FeedbackCardData }) {
    return (
        <div
            className={cardStyles({
                variant: "soft",
                radius: "2xl",
                className: `p-4 backdrop-blur-sm transition-transform hover:scale-[1.02] ${card.color} border-white/5`,
            })}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2 py-0.5 typo-caption">
                    {card.type}
                </span>
            </div>
            <p className="typo-body-sm-strong text-slate-300 opacity-80 line-through decoration-slate-500/50">
                &ldquo;{card.content}&rdquo;
            </p>
            <p className="mt-2 typo-body-sm-strong text-white">
                <span className="mr-1 inline-block">✨</span> {card.correction}
            </p>
        </div>
    );
}
