"use client";

import { useTranslations } from "next-intl";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export default function RefundClient() {
    const t = useTranslations("RefundPage");
    const navT = useTranslations("Navigation");

    // Dynamically get sections
    const sections = t.raw("sections") as { title: string; content: string }[];

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <BreadcrumbJsonLd
                items={[
                    { name: navT("home"), item: "/" },
                    { name: t("title"), item: "/refund" }
                ]}
            />
            <section className="section-block section-hero">
                <div className="section-shell section-stack">
                    {/* Header */}
                    <div className="section-heading max-w-none text-left">
                        <h1 className="typo-h1 text-white mb-4">
                            {t("title")}
                        </h1>
                        <p className="typo-subtitle-lg text-neutral-400 max-w-3xl">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="mt-16 space-y-16 max-w-4xl">
                        {sections.map((section, idx) => (
                            <section key={idx} className="space-y-4">
                                <h2 className="typo-h3 text-white">
                                    {section.title}
                                </h2>
                                <div className="typo-body-lg text-slate-300">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Refund Disclaimer */}
                    <div className="mt-24 p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm shadow-2xl">
                        <h3 className="typo-title-sm text-emerald-400 mb-2">{t("Promise.title")}</h3>
                        <p className="typo-body text-slate-300">{t("Promise.content")}</p>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
