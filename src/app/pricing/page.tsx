"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { pricingTiers, pricingFaqs } from "@/lib/data/pricing-data";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import Link from "next/link";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 w-full text-center px-4">
                <h1 className="mx-auto max-w-4xl font-heading text-5xl font-bold tracking-tight text-white md:text-6xl">
                    Simple pricing for
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        fluent speaking.
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-400">
                    Start for free, upgrade when you&apos;re serious. No hidden fees.
                </p>

                {/* Toggle */}
                <div className="mt-10">
                    <PricingToggle isYearly={isYearly} onChange={setIsYearly} />
                </div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="section-shell mb-32">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                    {pricingTiers.map((tier) => (
                        <PricingCard key={tier.name} tier={tier} isYearly={isYearly} />
                    ))}
                </div>
            </section>

            {/* Comparison / FAQ Section */}
            <section className="section-shell space-y-16 mb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-heading text-4xl font-bold text-white">
                        Common Questions.
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-5xl mx-auto">
                    {pricingFaqs.map((item) => (
                        <details
                            key={item.q}
                            className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-base md:text-lg transition-all hover:bg-white/10"
                        >
                            <summary className="flex cursor-pointer items-start justify-between font-medium text-white gap-4">
                                {item.q}
                                <span className="text-emerald-200 transition-transform group-open:rotate-45 text-2xl leading-none">
                                    +
                                </span>
                            </summary>
                            <p className="mt-4 text-base text-slate-400 leading-relaxed pr-8">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* CTA Footer */}
            <section className="section-shell">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-indigo-400/10 p-10 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,245,197,0.12),transparent_30%)]" />
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <h3 className="font-heading text-3xl font-semibold text-white md:text-4xl">
                            Still not sure?
                        </h3>
                        <p className="text-base text-slate-200 max-w-xl">
                            You can start using TalkFlow for free without a credit card. Upgrade
                            only when you see the results.
                        </p>
                        <Link
                            href="/signup"
                            className="group flex h-[50px] items-center gap-3 rounded-xl bg-white px-8 !text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
                        >
                            <span className="text-xl transition-transform group-hover:rotate-12">👋</span>
                            <span className="text-sm font-bold">Start Free Trial</span>
                        </Link>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
