"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarButton } from "@/components/ui/SiteNavbar";
import { ArrowRight, Cpu, ShieldCheck, Sparkles, Target } from "lucide-react";

const stages = [
    {
        id: "Stage 0",
        title: "Foundation",
        mission: "Set up your profile, choose communicating roles, and complete the first guided loop.",
        outcome: "Feel the friction disappear as you gain a steady rhythm in safe practice.",
    },
    {
        id: "Stage 1",
        title: "Targeted Dialog",
        mission: "Practice prompts, get instant verbal feedback, and repeat until you own the response.",
        outcome: "Build confidence for exams, interviews, and important presentations.",
    },
    {
        id: "Stage 2",
        title: "Growth Loop",
        mission: "Daily mini-lessons paired with live reviews and nudges keep you progressing.",
        outcome: "Your streak stays alive, and every missed beat turns into the next win.",
    },
    {
        id: "Stage 2.5",
        title: "Humanized Voice",
        mission: "Control pauses, tone, and persona so rehearsals mirror real conversations.",
        outcome: "Speech feels alive—more natural, more human, more you.",
    },
    {
        id: "Stage 3.1",
        title: "Adaptive Paths",
        mission: "Dynamic study paths rewrite themselves based on your performance.",
        outcome: "You never waste time—every session is tuned to what you need now.",
    },
    {
        id: "Stage 3.2",
        title: "Multi-role Worlds",
        mission: "Jump into multi-agent simulations with shared context and live event cues.",
        outcome: "Practice leading, collaborating, and thinking across roles like a pro.",
    },
    {
        id: "Stage 4",
        title: "Scenario UGC",
        mission: "Upload company knowledge or SOPs and turn them into role-plays instantly.",
        outcome: "Train with the exact language your team or customers care about.",
    },
    {
        id: "Stage 5",
        title: "Out-of-app Execution",
        mission: "Move the coaching loop into meetings, calls, and devices in real time.",
        outcome: "Every interaction has a coach whispering, “Say it this way.”",
    },
    {
        id: "Final",
        title: "Intelligence Communication OS",
        mission: "A unified model, open APIs, and privacy guardrails that learn you.",
        outcome: "Always listening, constantly advising, forever helping you act with clarity.",
    },
];

export default function VisionClient() {
    return (
        <AuroraBackground className="pb-24">
            <div className="relative z-10">
                {/* Hero */}
                <section className="section-block">
                    <div className="section-shell section-stack stack-hero text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="section-heading !max-w-6xl"
                        >
                            <h1 className="font-heading text-5xl md:text-8xl font-bold tracking-tighter text-foreground text-balance w-full md:whitespace-nowrap leading-[1.1] md:leading-[0.9]">
                                Evolution of{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 animate-text-shimmer bg-[size:200%_auto] block md:inline-block pb-4">
                                    Connection
                                </span>
                            </h1>
                            <p className="max-w-4xl mx-auto text-xl md:text-2xl text-muted/60 leading-relaxed font-light text-balance w-full">
                                We are building the world&rsquo;s first Agentic Communication OS. A path to quantify, augment, and eventually transcend human language barriers.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stage-by-stage mission */}
                <section className="section-block">
                    <div className="section-shell section-stack stack-loose">
                        <div className="section-heading">
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
                                Stage-by-stage mission
                            </h2>
                            <p className="text-lg text-slate-400 text-balance">
                                Every stage is a mission: from safe practice to mission-critical execution.
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
                                Security & Trust
                            </h3>
                            <p className="text-lg text-slate-400 text-balance">
                                Privacy, explainable feedback, and composable controls keep every mission safe.
                            </p>
                        </div>
                        <div className="grid gap-grid md:grid-cols-3">
                            {[
                                {
                                    title: "Privacy-first",
                                    desc: "You control the data with encryption and fine-grained access wherever you go.",
                                    icon: ShieldCheck,
                                },
                                {
                                    title: "Explainable feedback",
                                    desc: "Understand every score, export your journey, and share it with stakeholders.",
                                    icon: Sparkles,
                                },
                                {
                                    title: "Composable platform",
                                    desc: "Plug talkflo into your calendars, meetings, and stacks via APIs and plugins.",
                                    icon: Cpu,
                                },
                            ].map((item) => (
                                <div key={item.title} className="pad-card rounded-3xl border border-white/10 bg-white/[0.02] flex gap-3 items-start">
                                    <div className="mt-1 rounded-full bg-white/10 p-2">
                                        <item.icon className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-white">{item.title}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
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
                                Everyone deserves a voice.
                            </h4>
                            <p className="text-lg text-slate-400 text-balance">
                                talkflo is the invisible infrastructure that ensures that voice is heard, understood, and amplified across all boundaries.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-grid">
                            <NavbarButton href="/roadmap" variant="primary" className="px-10 py-4 text-lg rounded-full">
                                Explore the roadmap <ArrowRight className="ml-2 h-5 w-5" />
                            </NavbarButton>
                            <NavbarButton href="/login" variant="secondary" className="px-10 py-4 text-lg rounded-full bg-white/5 border-white/10 hover:bg-white/10">
                                Try it now
                            </NavbarButton>
                        </div>
                    </div>
                </section>
            </div>
        </AuroraBackground>
    );
}
