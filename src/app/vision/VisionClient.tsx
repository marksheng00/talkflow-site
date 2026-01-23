"use client";

import { motion } from "framer-motion";
import {
    Fingerprint, Target, Zap,
    Sparkles, GraduationCap, Globe2,
    Database, Glasses, Cpu, LucideIcon
} from "lucide-react";

// --- Curated Data with 3-Chapter Structure ---

const CHAPTERS = [
    {
        id: "chapter-1",
        label: "Phase I",
        title: "Constitution of Capability",
        description: "Before communication can be augmented, it must be quantified and optimized. In this phase, we build the digital infrastructure for language mastery.",
        stages: [
            {
                id: "0",
                icon: Fingerprint,
                title: "Digital Identity",
                subtitle: "The Foundation",
                text: "We don't just teach language; we map your linguistic DNA. A comprehensive profiling system establishes your unique baseline, ensuring every interaction is tailored to your specific voice and goals."
            },
            {
                id: "1",
                icon: Target,
                title: "Goal-Oriented Mastery",
                subtitle: "Targeted Training",
                text: "Purpose-driven simulation. Whether for IELTS, a boardroom pitch, or a visa interview, we pressure-test your skills in closed-loop scenarios designed to deliver measurable outcomes."
            },
            {
                id: "2",
                icon: Zap,
                title: "The Growth Flywheel",
                subtitle: "Just-in-Time Learning",
                text: "Retention requires relevance. We replace static textbooks with dynamic, micro-learning injections—filling your knowledge gaps the moment they appear, turning daily friction into fluency."
            }
        ]
    },
    {
        id: "chapter-2",
        label: "Phase II",
        title: "The Immersive Shift",
        description: "Moving from 'learning' to 'living'. We bridge the gap between human and machine, creating a simulation so real that the line between practice and reality blurs.",
        stages: [
            {
                id: "2.5",
                icon: Sparkles,
                title: "Hyper-Real Synthesis",
                subtitle: "Beyond the Uncanny Valley",
                text: "We teach AI to breathe, pause, and empathize. Paradoxically, by mastering para-linguistic imperfections, we create a connection that feels deeply, authentically human."
            },
            {
                id: "3.1",
                icon: GraduationCap,
                title: "Adaptive Curriculum",
                subtitle: "A Syllabus for One",
                text: "The addictive progression of a game meets the depth of a university degree. Driven by interactive AI podcasts and adaptive tasks, your curriculum rewrites itself in real-time."
            },
            {
                id: "3.2",
                icon: Globe2,
                title: "The Simulation",
                subtitle: "Multi-Agent World",
                text: "Step into a living ecosystem. Negotiate with a hostile board, navigate a crowded party, or lead a team meeting. Complex social dynamics with multiple AI agents, reacting to you in real-time."
            }
        ]
    },
    {
        id: "chapter-3",
        label: "Phase III",
        title: "Symbiosis & Integration",
        description: "The final evolution. talkflo ceases to be an app and becomes a pervasive layer of intelligence—augmenting your ability to connect, understand, and influence.",
        stages: [
            {
                id: "4",
                icon: Database,
                title: "Context Injection",
                subtitle: "Your World, Uploaded",
                text: "Upload your company's SOPs, your product specs, or your thesis. We ingest your reality to generate scenarios that aren't just realistic—they are your actual work."
            },
            {
                id: "5",
                icon: Glasses,
                title: "Real-World Integration",
                subtitle: "From Practice to Execution",
                text: "talkflo breaks the fourth wall. It joins your meetings, drafts your follow-ups, and whispers real-time cues. It transitions from a tutor to a co-pilot."
            },
            {
                id: "Final",
                icon: Cpu,
                title: "The Communication OS",
                subtitle: "Intelligence Layer",
                text: "A ubiquitous second brain for connection. Always listening (privately), always analyzing, always ready to ensure you are understood—across any language, culture, or context."
            }
        ]
    }
];

// --- Micro-Components ---

const ChapterHeader = ({ label, title, description }: { label: string, title: string, description: string }) => {
    return (
        <div className="md:sticky md:top-32 h-fit mb-12 md:mb-0">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase block mb-4">
                    {label}
                </span>
                <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                    {title}
                </h2>
                <div className="w-12 h-1 bg-border mb-8" />
                <p className="text-muted text-lg leading-relaxed max-w-sm">
                    {description}
                </p>
            </motion.div>
        </div>
    );
};

// Define Stage Type
type Stage = {
    id: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    text: string;
};

const StageCard = ({ stage }: { stage: Stage }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px", once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group relative bg-surface/50 border border-border/50 hover:border-accent/30 p-8 rounded-2xl transition-all duration-500 hover:bg-surface hover:shadow-lg hover:shadow-accent/5"
        >
            <div className="absolute top-8 right-8 text-muted/30 font-mono text-sm group-hover:text-accent/50 transition-colors">
                {stage.id}
            </div>

            <div className="mb-6 inline-flex p-3 rounded-xl bg-background border border-border text-muted group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                <stage.icon className="w-6 h-6" />
            </div>

            <div className="mb-2 text-xs font-mono tracking-widest text-muted/60 uppercase">
                {stage.subtitle}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">
                {stage.title}
            </h3>

            <p className="text-muted leading-relaxed">
                {stage.text}
            </p>
        </motion.div>
    );
};

// --- Main Page Component ---

export default function VisionClient() {
    return (
        <div className="relative min-h-screen text-foreground font-sans selection:bg-accent/30 pb-32">

            {/* Ambient Noise Texture */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

            {/* Hero Section */}
            <header className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="font-heading text-5xl md:text-8xl lg:text-9xl tracking-tight text-foreground mb-8 border-b border-border pb-8 md:pb-12">
                        Evolution of<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-foreground to-accent animate-text-shimmer bg-[size:200%_auto]">
                            Connection
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted leading-relaxed font-light max-w-2xl mx-auto">
                        We are building the world's first <span className="text-accent font-medium">Agentic Communication OS</span>.
                        A comprehensive roadmap to quantify, augment, and eventually transcend human language barriers.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-16 md:mt-24 flex flex-col items-center gap-4 hidden md:flex"
                >
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted">
                        Scroll to Explore
                    </span>
                    <div className="h-16 w-px bg-gradient-to-b from-muted/50 to-transparent" />
                </motion.div>
            </header>

            {/* Chapters Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 space-y-24 md:space-y-48">
                {CHAPTERS.map((chapter) => (
                    <section key={chapter.id} className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
                        {/* Sticky Left: Chapter Intro */}
                        <div className="md:col-span-4 lg:col-span-5">
                            <ChapterHeader
                                label={chapter.label}
                                title={chapter.title}
                                description={chapter.description}
                            />
                        </div>

                        {/* Right: Stage Cards */}
                        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-6 md:gap-8">
                            {chapter.stages.map((stage) => (
                                <StageCard key={stage.id} stage={stage} />
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Final Statement */}
            <footer className="relative z-10 max-w-4xl mx-auto px-6 pt-48 pb-32 text-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

                <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-8">
                    Everyone deserves a voice.
                </h2>
                <p className="text-muted text-lg md:text-xl leading-relaxed mb-12">
                    talkflo is the system that ensures that voice is heard, understood, and amplified.
                </p>
            </footer>
        </div>
    );
}
