"use client";

import { FeedbackCardData } from "@/lib/data/home-data";

export function FeedbackCard({ card }: { card: FeedbackCardData }) {
    return (
        <div
            className={`rounded-2xl border p-4 backdrop-blur-sm transition-transform hover:scale-[1.02] ${card.color} border-white/5 bg-white/5`}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {card.type}
                </span>
            </div>
            <p className="text-sm font-medium text-slate-300 opacity-80 line-through decoration-slate-500/50">
                &ldquo;{card.content}&rdquo;
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
                <span className="mr-1 inline-block">✨</span> {card.correction}
            </p>
        </div>
    );
}
