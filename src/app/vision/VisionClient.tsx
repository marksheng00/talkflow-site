"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Globe, Fingerprint, Activity, Zap } from "lucide-react";

// --- Micro Components ---

const PhaseBadge = ({ phase, label, active }: { phase: string; label: string; active?: boolean }) => (
    <div className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500",
        active
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            : "border-white/10 bg-white/5 text-slate-500"
    )}>
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{phase}</span>
        <span className="w-px h-3 bg-current opacity-20" />
        <span className="text-xs font-bold tracking-wide">{label}</span>
    </div>
);

const GlowingOrb = ({ className }: { className?: string }) => (
    <div className={cn("absolute rounded-full blur-[80px] opacity-30 mix-blend-screen pointer-events-none", className)} />
);

// --- Phase Visualizations ---

const Phase1Visual = () => (
    <div className="relative w-full h-[300px] md:h-[400px] border border-white/10 bg-white/[0.02] rounded-3xl overflow-hidden flex items-center justify-center group">
        {/* Chat Interface Sim */}
        <div className="w-[280px] space-y-4 opacity-80 transition-opacity duration-700 group-hover:opacity-100">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 p-4 rounded-2xl rounded-tl-sm backdrop-blur-md border border-white/5"
            >
                <div className="h-2 w-3/4 bg-white/20 rounded-full animate-pulse" />
                <div className="h-2 w-1/2 bg-white/20 rounded-full mt-2" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-emerald-500/20 border border-emerald-500/20 p-4 rounded-2xl rounded-br-sm backdrop-blur-md ml-auto"
            >
                <div className="h-2 w-2/3 bg-emerald-400/30 rounded-full ml-auto" />
            </motion.div>
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)] opacity-40" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
    </div>
);

const Phase2Visual = () => (
    <div className="relative w-full h-[300px] md:h-[400px] border border-white/10 bg-white/[0.02] rounded-3xl overflow-hidden flex items-center justify-center">
        {/* Network / Simulation Graph */}
        <div className="relative w-64 h-64">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border border-purple-500/20 rounded-full"
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="h-16 w-16 text-purple-400/50" />
            </div>
            {/* Orbiting nodes */}
            <motion.div
                className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)] z-10"
                animate={{ rotate: 360 }}
                style={{ originX: 0.5, originY: 8 }} // Orbit radius hack
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10"
                animate={{ rotate: -360 }}
                style={{ originX: 0.5, originY: 6 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
        </div>

        {/* Digital Noise Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
);

const Phase3Visual = () => (
    <div className="relative w-full h-[300px] md:h-[400px] border border-white/10 bg-white/[0.02] rounded-3xl overflow-hidden flex items-center justify-center">
        {/* The Singularity / OS Orb */}
        <motion.div
            className="w-48 h-48 rounded-full bg-emerald-500/20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
            className="absolute w-32 h-32 rounded-full border border-emerald-400/50 bg-emerald-400/10 backdrop-blur-md flex items-center justify-center z-10"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <Activity className="h-12 w-12 text-emerald-300" />
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
            className="absolute w-32 h-32 rounded-full border border-emerald-400/30"
            animate={{ scale: [1, 2], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Data streams */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)] z-20" />
    </div>
);

const VisionSection = ({
    phase,
    title,
    description,
    visual,
    align = "left",
    isFinal = false
}: {
    phase: string,
    title: string,
    description: string,
    visual: React.ReactNode,
    align?: "left" | "right",
    isFinal?: boolean
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: true });

    return (
        <section ref={ref} className={cn("min-h-[80vh] flex flex-col justify-center py-20 relative", isFinal ? "min-h-screen" : "")}>
            {/* Connecting Line */}
            {!isFinal && (
                <div className="absolute left-1/2 md:left-1/2 bottom-0 top-full w-px h-24 bg-gradient-to-b from-white/10 to-transparent -translate-x-1/2" />
            )}

            <div className={cn("grid md:grid-cols-2 gap-12 md:gap-24 items-center", align === "right" ? "md:grid-flow-dense" : "")}>
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(align === "right" ? "md:col-start-2" : "")}
                >
                    <PhaseBadge phase={phase.split(":")[0]} label={phase.split(":")[1]} active={isInView} />

                    <h2 className="mt-8 text-4xl md:text-6xl font-heading font-bold text-white leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        {title}
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg">
                        {description}
                    </p>

                    {isFinal && (
                        <div className="mt-12 group">
                            <Link href="/signup" className="relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)]">
                                <span className="relative z-10 flex items-center gap-2">
                                    Join the Revolution
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={cn(align === "right" ? "md:col-start-1" : "")}
                >
                    {visual}
                </motion.div>
            </div>
        </section>
    );
};

export default function VisionClient() {
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <div className="relative bg-[#020617] text-white overflow-hidden selection:bg-emerald-500/30 min-h-screen">
            <AuroraBackground className="fixed inset-0 z-0 opacity-20" style={{ y: backgroundY }} />

            {/* Ambient Lighting */}
            <GlowingOrb className="top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 animate-blob" />
            <GlowingOrb className="top-[40%] right-[-20%] w-[50vw] h-[50vw] bg-purple-600/10 animate-blob animation-delay-2000" />
            <GlowingOrb className="bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-emerald-600/10 animate-blob animation-delay-4000" />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pb-32">

                {/* Hero */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-8 max-w-5xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
                            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">Vision 2030</span>
                        </div>

                        <h1 className="font-heading text-6xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[0.9]">
                            Communication<br />
                            <span className="text-white/20">OS.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
                            From <span className="text-white font-medium">language tutor</span> to the <span className="text-white font-medium">fundamental layer of human understanding</span>.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    >
                        <span className="text-xs font-mono tracking-[0.2em] text-slate-600 uppercase">Scroll to Initialize</span>
                        <motion.div
                            className="w-[1px] h-16 bg-gradient-to-b from-slate-600 to-transparent"
                            animate={{ scaleY: [0, 1, 0], originY: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </section>

                {/* Scrollytelling Content */}
                <div className="relative">
                    {/* Vertical Guide Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 md:block hidden" />

                    {/* Phase 1: NOW */}
                    <VisionSection
                        phase="Phase 1: Interface"
                        title="TalkFlow Now."
                        description="We start by solving the immediate pain: Language Fluency. Our AI engine builds the bridge, correcting syntax, refining accent, and building confidence in a 1-on-1 environment."
                        visual={<Phase1Visual />}
                        align="left"
                    />

                    {/* Phase 2: NEXT */}
                    <VisionSection
                        phase="Phase 2: Simulation"
                        title="Context Engine."
                        description="Language without context is noise. We are building the Metaverse of Scenarios—infinite, generative role-plays (Interview, Negotiation, Dating) that prepare you for the unpredictability of the real world."
                        visual={<Phase2Visual />}
                        align="right"
                    />

                    {/* Phase 3: FUTURE */}
                    <VisionSection
                        phase="Phase 3: Symbiosis"
                        title="Communication OS."
                        description="The ultimate goal: A digital extension of your mind. An OS that understands your intent and handles the transmission, erasing language barriers and cultural friction forever."
                        visual={<Phase3Visual />}
                        align="left"
                        isFinal={true}
                    />
                </div>

            </div>
        </div>
    );
}
