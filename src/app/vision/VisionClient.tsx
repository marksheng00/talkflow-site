"use client";

import { motion } from "framer-motion";
import {
    Fingerprint, Target, Zap,
    Sparkles, GraduationCap, Globe2,
    Database, Glasses, Cpu, LucideIcon,
    ArrowRight
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarButton } from "@/components/ui/SiteNavbar";


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
        <div className="md:sticky md:top-40 h-fit mb-12 md:mb-0">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="font-mono text-xs tracking-[0.4em] text-accent/80 uppercase block mb-6">
                    {label}
                </span>
                <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-8 leading-[1.1] font-bold tracking-tight">
                    {title}
                </h2>
                <p className="text-muted/80 text-lg md:text-xl leading-relaxed max-w-sm font-light">
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px", once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative md:py-8 rounded-[2rem] transition-all duration-700 hover:bg-white/[0.02]"
        >
            {/* Background Glow - Only visible on hover, creating an 'organic' bound */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="inline-flex p-4 rounded-2xl bg-white/[0.03] text-muted/50 group-hover:text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                        <stage.icon className="w-6 h-6" />
                    </div>
                    <div className="text-muted/20 font-mono text-4xl group-hover:text-accent/20 transition-colors duration-500 select-none">
                        {stage.id}
                    </div>
                </div>

                <div className="mb-3 text-[10px] font-mono tracking-[0.3em] text-accent/40 uppercase">
                    {stage.subtitle}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-heading tracking-tight">
                    {stage.title}
                </h3>

                <p className="text-muted/70 text-lg leading-relaxed font-light group-hover:text-muted transition-colors duration-500">
                    {stage.text}
                </p>
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---

export default function VisionClient() {
    return (
        <AuroraBackground className="pb-0">
            <div className="relative z-10">
                {/* Hero Section */}
                <header className="relative max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-32 md:pb-32 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl tracking-tighter text-foreground mb-12 font-bold leading-[1.1] md:leading-[0.9] whitespace-normal md:whitespace-nowrap">
                            Evolution of{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-foreground to-accent animate-text-shimmer bg-[size:200%_auto] pb-4 md:inline-block">
                                Connection
                            </span>
                        </h1>
                        <p className="text-xl md:text-3xl text-muted/60 leading-relaxed font-light max-w-5xl mx-auto tracking-tight">
                            We are building the world&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-accent/80 to-foreground animate-text-shimmer bg-[size:200%_auto] font-semibold">
                                <b className="font-bold">first</b> Agentic Communication OS
                            </span>.
                            A path to quantify, augment, and eventually transcend human language barriers.
                        </p>
                    </motion.div>
                </header>

                {/* Chapters Content */}
                <main className="section-shell space-y-20 md:space-y-32">
                    {CHAPTERS.map((chapter) => (
                        <section key={chapter.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                            {/* Sticky Left: Chapter Intro */}
                            <div className="lg:col-span-4 mb-12 lg:mb-0">
                                <ChapterHeader
                                    label={chapter.label}
                                    title={chapter.title}
                                    description={chapter.description}
                                />
                            </div>

                            {/* Right: Stage Cards */}
                            <div className="lg:col-span-8 flex flex-col">
                                {chapter.stages.map((stage) => (
                                    <StageCard key={stage.id} stage={stage} />
                                ))}
                            </div>
                        </section>
                    ))}
                </main>

                {/* Final Statement & CTA */}
                <footer className="section-shell pt-24 pb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl mx-auto"
                    >
                        <h2 className="font-heading text-5xl md:text-8xl text-foreground mb-12 font-bold tracking-tighter leading-[1.1] md:leading-[0.9] whitespace-normal md:whitespace-nowrap">
                            Everyone deserves{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-foreground to-accent animate-text-shimmer bg-[size:200%_auto] pb-2 md:inline-block">
                                a voice.
                            </span>
                        </h2>
                        <p className="text-muted/60 text-xl md:text-2xl leading-relaxed mb-16 max-w-5xl mx-auto font-light tracking-tight">
                            <span className="text-foreground/80 font-medium">talkflo</span> is the invisible infrastructure that ensures that voice is heard, understood, and amplified across all boundaries.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <NavbarButton href="/roadmap" variant="primary" className="px-10 py-5 text-lg rounded-full">
                                Explore the Roadmap <ArrowRight className="ml-2 w-5 h-5" />
                            </NavbarButton>
                            <NavbarButton href="/login" variant="secondary" className="px-10 py-5 text-lg rounded-full bg-white/5 border-white/10 hover:bg-white/10">
                                Get Started Right Now
                            </NavbarButton>
                        </div>
                    </motion.div>
                </footer>
            </div>
        </AuroraBackground >
    );
}
