"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { NavbarButton } from "@/components/ui/SiteNavbar";
import { ArrowRight, Cpu, ShieldCheck, Sparkles, Target } from "lucide-react";

export default function VisionClient() {
    const t = useTranslations('VisionPage');
    const navT = useTranslations('Navigation');

    // Reconstruct stages from translations dynamically
    const stages = [];
    for (let i = 0; i <= 20; i++) {
        const idKey = `Stages.list.${i}.id`;
        if (t.has(idKey)) {
            stages.push({
                id: t(idKey),
                title: t(`Stages.list.${i}.title`),
                mission: t(`Stages.list.${i}.mission`),
                outcome: t(`Stages.list.${i}.outcome`),
            });
        } else {
            break;
        }
    }

    // Reconstruct security features
    const securityFeatures = [
        { icon: ShieldCheck },
        { icon: Sparkles },
        { icon: Cpu },
    ].map((item, idx) => ({
        ...item,
        title: t(`Security.features.${idx}.title`),
        desc: t(`Security.features.${idx}.desc`),
    }));

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: navT('home'), item: '/' },
                    { name: navT('vision'), item: '/vision' }
                ]}
            />
            <AuroraBackground className="pb-24">
                <div className="relative z-10">
                    {/* Hero */}
                    <section className="section-block section-hero">
                        <div className="section-shell section-stack stack-hero text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="section-heading !max-w-none"
                            >
                                <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.1] md:leading-[0.9] text-balance break-words hyphens-auto">
                                    {t('Hero.titlePrefix')}{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 animate-text-shimmer bg-[size:200%_auto] inline-block pb-4">
                                        {t('Hero.titleSuffix')}
                                    </span>
                                </h1>
                                <p className="max-w-5xl mx-auto text-xl md:text-2xl text-muted/60 leading-relaxed font-light text-balance w-full">
                                    {t('Hero.subtitle')}
                                </p>
                            </motion.div>
                        </div>
                    </section>

                    {/* Stage-by-stage mission */}
                    <section className="section-block">
                        <div className="section-shell section-stack stack-loose">
                            <div className="section-heading">
                                <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
                                    {t('Stages.title')}
                                </h2>
                                <p className="text-lg text-neutral-400 text-balance">
                                    {t('Stages.subtitle')}
                                </p>
                            </div>

                            <div className="grid gap-grid lg:grid-cols-3">
                                {stages.map((stage) => (
                                    <motion.div
                                        key={stage.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.6 }}
                                        className="pad-card rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col gap-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400/80">
                                                {stage.id}
                                            </span>
                                            <Target className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold text-white leading-tight">
                                            {stage.title}
                                        </h3>
                                        <p className="text-base text-slate-200 leading-relaxed">{stage.mission}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Security & Trust */}
                    <section className="section-block">
                        <div className="section-shell section-stack stack-base">
                            <div className="section-heading">
                                <h3 className="font-heading text-3xl md:text-4xl font-bold text-white">
                                    {t('Security.title')}
                                </h3>
                                <p className="text-lg text-neutral-400 text-balance">
                                    {t('Security.subtitle')}
                                </p>
                            </div>
                            <div className="grid gap-grid md:grid-cols-3">
                                {securityFeatures.map((item) => (
                                    <div key={item.title} className="pad-card rounded-3xl border border-white/10 bg-white/[0.02] flex gap-3 items-start">
                                        <div className="mt-1 rounded-full bg-white/10 p-2">
                                            <item.icon className="h-5 w-5 text-emerald-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold text-white">{item.title}</p>
                                            <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="section-block">
                        <div className="section-shell text-center section-stack stack-base">
                            <div className="section-stack items-center text-center">
                                <h4 className="font-heading text-4xl md:text-5xl font-bold text-white">
                                    {t('CTA.title')}
                                </h4>
                                <p className="text-lg text-neutral-400 text-balance">
                                    {t('CTA.subtitle')}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-grid">
                                <NavbarButton href="/roadmap" variant="primary" className="px-10 py-4 text-lg rounded-full">
                                    {t('CTA.explore')} <ArrowRight className="ml-2 h-5 w-5" />
                                </NavbarButton>
                                <NavbarButton href="/login" variant="secondary" className="px-10 py-4 text-lg rounded-full bg-white/5 border-white/10 hover:bg-white/10">
                                    {t('CTA.try')}
                                </NavbarButton>
                            </div>
                        </div>
                    </section>
                </div>
            </AuroraBackground>
        </>
    );
}
