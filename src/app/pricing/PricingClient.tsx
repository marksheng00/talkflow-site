"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { pricingTiers, pricingFaqs, BillingCycle } from "@/lib/data/pricing-data";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import Link from "next/link";

export default function PricingClient() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            {/* Hero Section */}
            <section className="section-block">
                <div className="section-shell section-stack stack-loose text-center items-center">
                    <div className="section-heading">
                        <h1 className="mx-auto max-w-7xl font-heading text-5xl font-bold tracking-tighter text-foreground md:text-8xl whitespace-normal md:whitespace-nowrap leading-[1.1] md:leading-[0.9]">
                            Simple pricing for{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 animate-text-shimmer bg-[size:200%_auto] block md:inline-block pb-4">
                                U.
                            </span>
                        </h1>
                        <p className="mx-auto max-w-4xl text-xl md:text-2xl text-muted/60 font-light tracking-tight leading-relaxed">
                            Start for free, upgrade when you&apos;re serious. No hidden fees.
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="mt-0">
                        <PricingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
                    </div>
                    <div className="grid grid-cols-1 gap-grid md:grid-cols-3 max-w-6xl mx-auto w-full">
                        {pricingTiers.map((tier) => (
                            <PricingCard key={tier.name} tier={tier} billingCycle={billingCycle} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison / FAQ Section */}
            <section className="section-block">
                <div className="section-shell section-stack">
                    <div className="section-heading">
                        <h2 className="font-heading text-4xl font-bold text-white">
                            Common Questions.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-cards md:grid-cols-2 max-w-5xl mx-auto">
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
                </div>
            </section>

            {/* CTA Footer */}
            <section className="section-block">
                <div className="section-shell">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-indigo-400/10 p-6 md:p-10 text-center stack-base">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,245,197,0.12),transparent_30%)]" />
                        <div className="relative z-10 flex flex-col items-center stack-base">
                            <h3 className="font-heading text-3xl font-semibold text-white md:text-4xl">
                                Still not sure?
                            </h3>
                            <p className="text-base text-slate-200 max-w-xl">
                                You can start using talkflo for free without a credit card. Upgrade
                                only when you see the results.
                            </p>
                            <Link
                                href="/signup"
                                className="group flex h-14 items-center gap-3 rounded-2xl bg-white px-8 !text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
                            >
                                <span className="text-xl transition-transform group-hover:rotate-12">👋</span>
                                <span className="text-base font-bold">Start Free Trial</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
