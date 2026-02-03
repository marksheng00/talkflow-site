"use client";

import { useTranslations } from "next-intl";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { buttonStyles } from "@/components/ui/Button";
import { FaqItem } from "@/components/ui/FaqItem";

export default function FAQClient() {
    const t = useTranslations("FAQPage");
    const navT = useTranslations("Navigation");

    // Dynamically get sections
    const sections = t.raw("sections") as {
        title: string;
        items: { q: string; a: string }[]
    }[];

    return (
        <AuroraBackground className="min-h-screen pb-24 text-white">
            <BreadcrumbJsonLd
                items={[
                    { name: navT("home"), item: "/" },
                    { name: `${t("titlePrefix")} ${t("titleSuffix")}`, item: "/faq" }
                ]}
            />
            <section className="section-block section-hero">
                <div className="section-shell section-stack">
                    {/* Header */}
                    <div className="section-heading max-w-none text-center">
                        <h1 className="typo-hero text-white mb-4">
                            {t("titlePrefix")}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 animate-text-shimmer bg-[size:200%_auto] inline-block pb-1">
                                {t("titleSuffix")}
                            </span>
                        </h1>
                        <p className="typo-subtitle-lg text-neutral-400 max-w-3xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* FAQ Items Grouped by Section */}
                    <div className="mt-16 space-y-20 max-w-4xl mx-auto w-full">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="space-y-8">
                                <h2 className="typo-h3 text-emerald-400 uppercase">
                                    {section.title}
                                </h2>
                                <div className="space-y-4">
                                    {section.items.map((item, itemIdx) => (
                                        <FaqItem
                                            key={itemIdx}
                                            size="lg"
                                            question={item.q}
                                            answer={item.a}
                                            iconClassName="text-emerald-300 typo-symbol-lg"
                                            bodyClassName="border-t border-white/5 pt-6"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Help CTA */}
                    <div className="mt-32 p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent text-center">
                        <h2 className="typo-h2 text-white mb-4">{t("Support.title")}</h2>
                        <p className="typo-body text-neutral-400 mb-8 max-w-2xl mx-auto">{t("Support.subtitle")}</p>
                        <a
                            href="mailto:support@talkflo.ai"
                            className={buttonStyles({ variant: "primary", size: "lg" })}
                        >
                            {t("Support.button")}
                        </a>
                    </div>
                </div>
            </section>
        </AuroraBackground>
    );
}
