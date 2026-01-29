"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { pricingTiers as staticPricingTiers, BillingCycle } from "@/lib/data/pricing-data";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Link from "next/link";

export default function PricingClient() {
    const t = useTranslations('PricingPage');
    const navT = useTranslations('Navigation');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

    // Reconstruct pricing tiers with translations
    const translatedTiers = [
        { id: 'free', staticData: staticPricingTiers.find(p => p.name === 'Free')! },
        { id: 'pro', staticData: staticPricingTiers.find(p => p.name === 'Pro')! },
        { id: 'ultra', staticData: staticPricingTiers.find(p => p.name === 'Ultra')! },
    ].map(({ id, staticData }) => ({
        ...staticData,
        name: t(`Tiers.${id}.name`),
        description: t(`Tiers.${id}.description`),
        features: [0, 1, 2, 3, 4, 5, 6].map(idx => {
            // Check if feature translation exists (naive check or just try/catch, 
            // but next-intl usually returns key if missing. Actually, JSON arrays are fixed length.)
            // Safer way: Use the length of features in JSON. 
            // Since we know the length:
            // Free: 5, Pro: 6, Ultra: 7.
            // Let's manually limit or just try.
            return t.raw(`Tiers.${id}.features`)[idx];
        }).filter(Boolean), // Filter out undefined if mapping exceeds length
        cta: t(`Tiers.${id}.cta`)
    }));

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <FaqJsonLd
                questions={[0, 1, 2, 3].map(idx => ({
                    q: t(`FAQ.items.${idx}.q`),
                    a: t(`FAQ.items.${idx}.a`)
                }))}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: navT('home'), item: '/' },
                    { name: navT('pricing'), item: '/pricing' }
                ]}
            />
            {/* Hero Section */}
            <section className="section-block section-hero">
                <div className="section-shell section-stack stack-loose text-center items-center">
                    <div className="section-heading">
                        <h1 className="mx-auto max-w-none font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.1] md:leading-[0.9] text-balance break-words hyphens-auto">
                            {t('Hero.title')}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 animate-text-shimmer bg-[size:200%_auto] inline-block pb-4">
                                {t('Hero.titleSuffix')}
                            </span>
                        </h1>
                        <p className="mx-auto max-w-5xl text-xl md:text-2xl text-muted/60 font-light tracking-tight leading-relaxed">
                            {t('Hero.subtitle')}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="mt-0">
                        <PricingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
                    </div>
                    <div className="grid grid-cols-1 gap-grid md:grid-cols-3 max-w-7xl mx-auto w-full">
                        {translatedTiers.map((tier) => {
                            let orderClass = "";
                            // Check original name for ordering logic or us id
                            if (tier.name.includes("Ultra") || tier.cta.includes("Ultra")) orderClass = "order-1 md:order-3"; // Fallback to content check is risky. 
                            // Better: use the index or id from mapping.
                            // But staticData.name is 'Ultra'.
                            // Let's rely on the order in the array: Free, Pro, Ultra.
                            // But layout requirement was: Free(1), Pro(2), Ultra(3) -> Pro usually center?
                            // Wait, original code: Ultra=order-3, Pro=order-2, Free=order-1.
                            // Wait, `order-1 md:order-3` means on mobile it's 1st?
                            // Original code:
                            // Ultra: order-1 md:order-3 (Top on mobile, Right on desktop)
                            // Pro: order-2 md:order-2 (Middle)
                            // Free: order-3 md:order-1 (Bottom on mobile, Left on desktop)

                            // Let's use the static data name for this logic logic.
                            const originalName = staticPricingTiers.find(p => p.price.monthly === tier.price.monthly)?.name || '';

                            if (originalName === "Ultra") orderClass = "order-1 md:order-3";
                            else if (originalName === "Pro") orderClass = "order-2 md:order-2";
                            else if (originalName === "Free") orderClass = "order-3 md:order-1";

                            return (
                                <div key={tier.name} className={`${orderClass} w-full`}>
                                    <PricingCard tier={tier} billingCycle={billingCycle} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Comparison / FAQ Section */}
            <section className="section-block">
                <div className="section-shell section-stack">
                    <div className="section-heading">
                        <h2 className="font-heading text-4xl font-bold text-white">
                            {t('FAQ.title')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-cards md:grid-cols-2 max-w-5xl mx-auto">
                        {[0, 1, 2, 3].map((idx) => (
                            <details
                                key={idx}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-base md:text-lg transition-all hover:bg-white/10"
                            >
                                <summary className="flex cursor-pointer items-start justify-between font-medium text-white gap-4">
                                    {t(`FAQ.items.${idx}.q`)}
                                    <span className="text-emerald-200 transition-transform group-open:rotate-45 text-2xl leading-none">
                                        +
                                    </span>
                                </summary>
                                <p className="mt-4 text-base text-neutral-400 leading-relaxed pr-8">
                                    {t(`FAQ.items.${idx}.a`)}
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
                                {t('CTA.title')}
                            </h3>
                            <p className="text-base text-slate-200 max-w-xl">
                                {t('CTA.subtitle')}
                            </p>
                            <Link
                                href="/signup"
                                className="group flex h-14 items-center gap-3 rounded-2xl bg-white px-8 !text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
                            >
                                <span className="text-xl transition-transform group-hover:rotate-12">👋</span>
                                <span className="text-base font-bold">{t('CTA.button')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
