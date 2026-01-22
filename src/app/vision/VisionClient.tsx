"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Globe2, Sparkles, Zap } from "lucide-react";

// --- Components ---

function FadeInText({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function GridBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        </div>
    );
}

function GlowingOrb({ className }: { className?: string }) {
    return (
        <div className={cn("absolute rounded-full blur-[100px] opacity-40 mix-blend-screen animate-pulse-slow", className)} />
    );
}

export default function VisionClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

    return (
        <div ref={containerRef} className="relative bg-[#020617] text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden">
            <AuroraBackground className="fixed inset-0 z-0 opacity-30" />
            <GridBackground />

            {/* Glowing Orbs for ambiance */}
            <GlowingOrb className="top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20" />
            <GlowingOrb className="bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/20 animation-delay-2000" />

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12">

                {/* --- Section 1: The Definition --- */}
                <section className="min-h-screen flex flex-col justify-center items-center text-center relative pt-32 pb-20">
                    <FadeInText delay={0.2}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">The Master Plan</span>
                        </div>
                    </FadeInText>

                    <FadeInText delay={0.4} className="max-w-5xl mx-auto">
                        <h1 className="font-heading text-5xl md:text-8xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8">
                            Communication <br className="hidden md:block" /> Operating System.
                        </h1>
                    </FadeInText>

                    <FadeInText delay={0.6} className="max-w-2xl mx-auto">
                        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light">
                            We are not just building an English tutor. We are engineering the <span className="text-white font-medium">fundamental layer</span> for human understanding.
                        </p>
                    </FadeInText>
                </section>

                {/* --- Section 2: The Why (The Problem) --- */}
                <section className="py-32 md:py-48 relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <FadeInText className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-heading font-bold">The Friction of <span className="text-rose-400">Silence</span>.</h2>
                            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                                <p>
                                    Humanity's greatest asset is collaboration. Yet, we are segmented by <span className="text-white">invisible walls</span>.
                                </p>
                                <ul className="space-y-4 border-l-2 border-white/10 pl-6">
                                    <li className="flex gap-4">
                                        <div className="h-6 w-6 mt-1 flex-shrink-0 text-slate-500">01</div>
                                        <div>
                                            <strong className="text-white block mb-1">Language Barrier</strong>
                                            Non-native speakers lose opportunities not because of ability, but expression.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-6 w-6 mt-1 flex-shrink-0 text-slate-500">02</div>
                                        <div>
                                            <strong className="text-white block mb-1">Context Mismatch</strong>
                                            Diverse backgrounds and information asymmetry lead to misunderstanding.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </FadeInText>

                        {/* Visual Metaphor for Friction */}
                        <FadeInText delay={0.3} className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Abstract Noise Animation */}
                                <div className="w-full h-full opacity-30 mix-blend-overlay" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                                }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                                <div className="relative z-10 text-center space-y-2">
                                    <div className="text-6xl md:text-8xl font-bold text-white/5 tracking-tighter">ERROR</div>
                                    <div className="text-6xl md:text-8xl font-bold text-white/5 tracking-tighter">LOST</div>
                                    <div className="text-6xl md:text-8xl font-bold text-white/5 tracking-tighter">NOISE</div>
                                </div>
                            </div>
                        </FadeInText>
                    </div>
                </section>

                {/* --- Section 3: The What (The Product Vision) --- */}
                <section className="py-32 md:py-48 relative border-t border-white/5">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <FadeInText>
                            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">TalkFlow is Step One.</h2>
                            <p className="text-xl text-slate-400">
                                We start by mastering the tool of language. Then, we simulate the world.
                            </p>
                        </FadeInText>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Non-Linear Metaverse",
                                desc: "Generative storylines where every choice matters. Learn by living through scenarios, not just reading them.",
                                icon: Globe2,
                                color: "text-blue-400"
                            },
                            {
                                title: "Simulation Engine",
                                desc: "Job interviews, sales pitches, medical consultations. Infinite, hyper-realistic role-play environments.",
                                icon: BrainCircuit,
                                color: "text-purple-400"
                            },
                            {
                                title: "Digital Twin",
                                desc: "The system learns about YOU. It records your knowledge, builds your context, and helps you articulate your specific expertise.",
                                icon: Sparkles,
                                color: "text-emerald-400"
                            }
                        ].map((item, i) => (
                            <FadeInText key={i} delay={i * 0.15} className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all hover:scale-[1.02] duration-500">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <item.icon className={cn("h-10 w-10 mb-6", item.color)} />
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </FadeInText>
                        ))}
                    </div>
                </section>

                {/* --- Section 4: The Final Goal --- */}
                <section className="py-32 md:py-64 relative text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />

                    <FadeInText>
                        <h2 className="text-[12vw] font-bold font-heading leading-none tracking-tighter text-white/10 select-none">
                            SYMBIOSIS
                        </h2>
                    </FadeInText>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <FadeInText delay={0.3} className="max-w-2xl px-6 pointer-events-auto">
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-8">
                                AI-Empowered Human Connection.
                            </h3>
                            <p className="text-lg text-slate-300 mb-10">
                                Imagine a world where you can express your complex thoughts perfectly, in any language, to anyone. Where the machine handles the syntax, so you can focus on the <span className="text-emerald-400 font-bold">soul</span> of the message.
                            </p>
                            <Link href="/signup" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
                                Join the Revolution
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </FadeInText>
                    </div>
                </section>

            </div>
        </div>
    );
}
