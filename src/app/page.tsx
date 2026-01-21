"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Play,
  MonitorPlay,
  BookOpen,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ChatConversation } from "@/components/home/ChatConversation";
import { FeedbackCard } from "@/components/home/FeedbackCard";
import {
  primaryCta,
  playStore,
  appStore,
  featureCards,
  benefits,
  proofPoints,
  feedbackCards,
  faqs,
} from "@/lib/data/home-data";

export default function Home() {
  return (
    <AuroraBackground className="pb-24 text-white">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-20 pb-32 md:pb-40 overflow-hidden w-full">
        <div className="section-shell relative z-10 flex flex-col items-center text-center">

          {/* Main Title */}
          <h1 className="max-w-4xl font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Simple, Fast, Fluent.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 md:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-400 px-4">
            TalkFlow combines AI voice analysis with real-time coaching so you can practice, improve, and speak freely without friction.
          </p>

          {/* Buttons */}
          <div className="mt-8 md:mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center w-full max-w-lg px-4">
            <Link
              href={appStore}
              className="group flex h-[56px] md:h-[64px] items-center gap-3 md:gap-4 rounded-xl bg-white px-6 md:px-8 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
            >
              <svg viewBox="0 0 384 512" className="h-6 w-6 md:h-7 md:w-7 fill-black flex-shrink-0">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.6-79.1 23.9-100.1 60.5-42.2 73.1-10.8 181.8 30.5 241.6 20.2 29.2 44.1 61.9 75.8 60.7 30.3-1.2 41.8-19.3 78.4-19.3s47.1 19.3 78.9 18.7c32.3-.6 53.3-29.8 73-58.4 22.9-33.1 32.7-65.1 33-66.8-.7-.3-63.5-24.3-63.8-96.1zM288 80.1c15.6-18.8 26.2-44.8 23.3-70.9-22.3 1-49.3 15-65.3 33.8-14.4 16.8-26.9 43.1-23.5 68.3 24.8 1.9 49.3-12.4 65.5-31.2z" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-slate-950">TalkFlow App</span>
                <span className="text-xs text-slate-500 mt-1">Download on App Store</span>
              </div>
            </Link>

            <Link
              href={playStore}
              className="group flex h-[56px] md:h-[64px] items-center gap-3 md:gap-4 rounded-xl bg-white px-6 md:px-8 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
            >
              <svg viewBox="0 0 512 512" className="h-5 w-5 md:h-6 md:w-6 fill-black flex-shrink-0">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-slate-950">TalkFlow App</span>
                <span className="text-xs text-slate-500 mt-1">Get it on Google Play</span>
              </div>
            </Link>

            <Link
              href={primaryCta}
              className="group flex h-[56px] md:h-[64px] items-center gap-3 md:gap-4 rounded-xl bg-white px-6 md:px-8 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
            >
              <MonitorPlay className="h-5 w-5 md:h-6 md:w-6 fill-black stroke-black flex-shrink-0" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-slate-950">Try on web</span>
                <span className="text-xs text-slate-500 mt-1">Coming soon</span>
              </div>
            </Link>
          </div>

          {/* Video Placeholder */}
          <div className="mt-12 md:mt-20 w-full max-w-5xl relative px-4">
            <div className="absolute inset-0 blur-[120px] bg-emerald-400/20 -z-10" />
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 md:gap-4 text-slate-500">
                <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-transform hover:scale-110 cursor-pointer">
                  <Play className="h-6 w-6 md:h-8 md:w-8 text-white fill-current" />
                </div>
                <p className="text-xs md:text-sm font-medium tracking-wide uppercase text-slate-400">Watch Intro</p>
              </div>
            </div>

            {/* Trust Proof Points Row */}
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 w-full pt-8">
              {proofPoints.slice(0, 4).map((point) => (
                <div key={point.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{point.value}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{point.label}</div>
                </div>
              ))}
              {/* Add a 4th dummy point for balance if needed, or stick to 3 */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9/5</div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">App Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="section-shell space-y-16 mb-32 scroll-mt-32">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Everything you need to improve.
          </h2>
          <p className="text-lg text-slate-400">
            Comprehensive tools designed to make you sound like a native speaker.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition hover:bg-white/[0.04]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                <feature.icon className="h-6 w-6 text-emerald-200" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-slate-400 leading-relaxed">{feature.copy}</p>
            </div>
          ))}
        </div>

        {/* Feedback Subsection - Part of "Everything you need" */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 lg:p-16 overflow-hidden relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 z-10 relative">
              <h3 className="font-heading text-3xl font-bold text-white md:text-4xl text-balance">
                Feedback you can actually use.
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed">
                Get clear, actionable advice on your pacing, tone, and grammar. No vague suggestions—just direct ways to improve every single day.
              </p>
              <div className="space-y-4">
                {benefits.map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-base text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Marquee Container */}
            <div className="relative h-[500px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Column 1 - Upward */}
                <div className="flex flex-col gap-4 animate-marquee-up">
                  {[...feedbackCards, ...feedbackCards].map((card, idx) => (
                    <FeedbackCard key={`col1-${idx}`} card={card} />
                  ))}
                </div>
                {/* Column 2 - Downward (slower or reverse) */}
                <div className="flex flex-col gap-4 animate-marquee-down">
                  {[...feedbackCards.slice().reverse(), ...feedbackCards.slice().reverse()].map((card, idx) => (
                    <FeedbackCard key={`col2-${idx}`} card={card} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology / Under the Hood Section */}
      <section className="section-shell space-y-16 mb-32 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Magic, engineered.
          </h3>
          <p className="text-lg text-slate-400">
            Next-gen models and SOTA speech synthesis for an experience that feels truly alive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2 md:h-[560px]">

          {/* 1. Agentic Conversation (Large - 3 cols, 2 rows) */}
          <div className="group relative col-span-1 md:col-span-3 md:row-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col transition-all hover:bg-white/[0.04]">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-indigo-500/15 blur-[60px] transition-all group-hover:bg-indigo-500/25" />

            <div className="relative z-10 space-y-2">
              <h4 className="text-lg font-bold text-white md:text-xl">An active partner, not a script.</h4>
              <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
                Interrupts, asks clarifying questions, guides with empathy.
              </p>
            </div>

            {/* Visual: Simulated Chat Bubbles */}
            <ChatConversation
              messages={[
                {
                  text: "I want to practice for my job interview...",
                  delay: 0,
                  typingSpeed: 60,
                  className: "self-end max-w-[75%] rounded-2xl rounded-br-sm bg-indigo-500/30 px-5 py-3.5 text-base text-white/90 leading-relaxed",
                },
                {
                  text: "Wait— what role? That changes everything.",
                  delay: 2500,
                  typingSpeed: 55,
                  className: "self-start max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-5 py-3.5 text-base text-white/80 leading-relaxed",
                  highlightWords: [
                    { word: "Wait", className: "gradient-word-cool" },
                    { word: "role", className: "gradient-word-emerald" },
                    { word: "changes", className: "gradient-word-warm" },
                  ],
                },
                {
                  text: "Product Manager at a startup.",
                  delay: 5000,
                  typingSpeed: 65,
                  className: "self-end max-w-[65%] rounded-2xl rounded-br-sm bg-indigo-500/30 px-5 py-3.5 text-base text-white/90 leading-relaxed",
                },
                {
                  text: "Perfect. Let's start hard: Tell me about a time you failed.",
                  delay: 7500,
                  typingSpeed: 50,
                  className: "self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-5 py-3.5 text-base text-white/80 leading-relaxed",
                  highlightWords: [
                    { word: "Perfect", className: "gradient-word-cool" },
                    { word: "failed", className: "gradient-word-warm" },
                  ],
                },
              ]}
              cycleDuration={15000}
            />
          </div>

          {/* 2. Speed / Latency (3 cols, 1 row) */}
          <div className="group relative col-span-1 md:col-span-3 md:row-span-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 transition-all hover:bg-white/[0.04] flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-500/25 blur-2xl rounded-full scale-125" />
              <div className="relative text-4xl md:text-5xl font-bold text-emerald-400 tabular-nums">
                &lt;500<span className="text-xl md:text-2xl text-emerald-500/70">ms</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base md:text-lg font-bold text-white">Latency so low, it feels instant.</h4>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5 truncate">
                No awkward pauses. Natural conversation.
              </p>
            </div>
            {/* Speed line animation */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-speed-line" />
            </div>
          </div>

          {/* 3. Models - Smooth sequential fade */}
          <div className="group relative col-span-1 md:col-span-1 md:row-span-1 min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/80 transition-all hover:border-white/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-10 w-full flex items-center justify-center">
                <span className="absolute text-2xl md:text-3xl font-bold text-blue-400 animate-text-cycle will-change-[opacity,transform]" style={{ animationDelay: '0s' }}>Gemini</span>
                <span className="absolute text-2xl md:text-3xl font-bold text-purple-400 animate-text-cycle will-change-[opacity,transform]" style={{ animationDelay: '2s' }}>Claude</span>
                <span className="absolute text-2xl md:text-3xl font-bold text-emerald-400 animate-text-cycle will-change-[opacity,transform]" style={{ animationDelay: '4s' }}>GPT-5</span>
                <span className="absolute text-2xl md:text-3xl font-bold text-orange-400 animate-text-cycle will-change-[opacity,transform]" style={{ animationDelay: '6s' }}>Llama-3</span>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-8">
              <h4 className="text-xs font-bold text-white/90 text-center">Top-tier Models</h4>
            </div>
          </div>

          {/* 4. Voice - High-Fidelity Living Mesh (方案 A 改良) */}
          <div className="group relative col-span-1 md:col-span-1 md:row-span-1 min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/80 transition-all hover:border-white/20">
            {/* The Fluid Mesh Container */}
            <div className="absolute inset-0 flex items-center justify-center scale-110">
              <div className="relative h-full w-full filter blur-[45px] animate-blob-rotate">
                {/* Vibrant Blob 1 - Indigo/Cyan */}
                <div className="absolute top-1/4 left-1/4 h-2/3 w-2/3 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500 opacity-60 animate-blob-one mix-blend-screen" />

                {/* Vibrant Blob 2 - Rose/Amber */}
                <div className="absolute top-1/2 right-0 h-3/5 w-3/5 rounded-full bg-gradient-to-br from-rose-500 via-fuchsia-500 to-orange-400 opacity-60 animate-blob-two mix-blend-color-dodge" />

                {/* Vibrant Blob 3 - Emerald/Teal */}
                <div className="absolute bottom-0 left-1/2 h-1/2 w-3/4 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-600 opacity-50 animate-blob-three mix-blend-overlay" />
              </div>
            </div>

            {/* Sharp Grain/Noise Overlay for high-end texture */}
            <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />

            {/* Overlaid Label - Consistent with others */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-8">
              <h4 className="text-xs font-bold text-white/90 text-center">SOTA Voice</h4>
            </div>
          </div>

          {/* 5. ASR - Sequential single phoneme with pixelated feel */}
          <div className="group relative col-span-1 md:col-span-1 md:row-span-1 min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/80 transition-all hover:border-white/20">
            {/* Pixel Grid Overlay */}
            <div className="absolute inset-0 pixel-grid" />
            <div className="scanline" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-10 w-full flex items-center justify-center font-pixel text-4xl md:text-5xl">
                <span className="absolute text-emerald-400/90 animate-pixel-cycle will-change-[opacity,transform]" style={{ animationDelay: '0s' }}>/θ/</span>
                <span className="absolute text-emerald-400/90 animate-pixel-cycle will-change-[opacity,transform]" style={{ animationDelay: '2s' }}>/ɪ/</span>
                <span className="absolute text-emerald-400/90 animate-pixel-cycle will-change-[opacity,transform]" style={{ animationDelay: '4s' }}>/ŋ/</span>
                <span className="absolute text-emerald-400/90 animate-pixel-cycle will-change-[opacity,transform]" style={{ animationDelay: '6s' }}>/k/</span>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-8">
              <h4 className="text-xs font-bold text-white/90 text-center">Phoneme ASR</h4>
            </div>
          </div>

        </div>
      </section>

      {/* Built by experts - Premium Storytelling Cards */}
      <section id="about" className="section-shell space-y-16 mb-32 scroll-mt-32">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Built by experts.
          </h3>
          <p className="text-lg text-slate-400">
            Where Oxford linguistics meets Silicon Valley engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Card 1: Pedagogy - Green Gradient */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-green-500/10 p-12 transition-all hover:scale-[1.01]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              {/* Left: Embedded Examiner Card */}
              <div className="group/card">
                <div className="relative rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 group-hover:shadow-emerald-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">IELTS Official</p>
                      <p className="text-sm text-slate-500 mt-0.5">Examiner Credentials</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Fluency & Coherence</span>
                      <span className="text-sm font-bold text-slate-900">8.5</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Lexical Resource</span>
                      <span className="text-sm font-bold text-slate-900">9.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Pronunciation</span>
                      <span className="text-sm font-bold text-slate-900">8.0</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-400 italic">Signed by former Cambridge examiners</p>
                  </div>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white">Pedagogy First</h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  Our curriculum isn&apos;t designed by software engineers guessing at education. It&apos;s crafted by <strong>former IELTS examiners</strong> and linguistic PhDs who understand exactly what separates a Band 6 from a Band 8.
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Trusted by 50,000+ learners</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Tech - Indigo Gradient */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-blue-500/10 p-12 transition-all hover:scale-[1.01]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.15),transparent_50%)]" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              {/* Left: Text Content */}
              <div className="space-y-4 md:order-1">
                <h4 className="text-2xl font-bold text-white">SOTA Engineering</h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  Powered by <strong>low-latency LLMs</strong> and proprietary voice processing models. Our system can naturally interrupt you mid-sentence, just like a real conversation partner.
                </p>
                <div className="flex items-center gap-2 text-sm text-indigo-300">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>&lt;200ms response time</span>
                </div>
              </div>

              {/* Right: Embedded Terminal Window */}
              <div className="md:order-2">
                <div className="relative rounded-2xl border border-white/20 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                  {/* Terminal Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-slate-400 ml-2 font-mono">talkflow-engine</span>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-4 font-mono text-xs space-y-1">
                    <p className="text-emerald-400">$ npm run dev</p>
                    <p className="text-slate-500">&gt; Starting TalkFlow engine...</p>
                    <p className="text-indigo-300">✓ Voice model loaded (Gemini Flash 2.0)</p>
                    <p className="text-indigo-300">✓ ASR initialized (Deepgram Nova-2)</p>
                    <p className="text-slate-400">⚡ Avg latency: <span className="text-emerald-400 font-bold">187ms</span></p>
                    <p className="text-slate-400">🎯 Interruption detection: <span className="text-purple-400 font-bold">Active</span></p>
                    <p className="text-slate-500 animate-pulse">▊</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Human-Centric - Rose Gradient */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400/20 via-pink-400/15 to-orange-500/10 p-12 transition-all hover:scale-[1.01]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,114,182,0.15),transparent_50%)]" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              {/* Left: Embedded Chat Bubbles */}
              <div className="space-y-4">
                <div className="relative rounded-2xl rounded-tl-sm border border-white/20 bg-white/95 backdrop-blur-xl p-4 shadow-xl max-w-sm transition-all group-hover:translate-y-[-4px]">
                  <p className="text-sm text-slate-700">I&apos;m worried I keep using the word &quot;very&quot; too much...</p>
                </div>
                <div className="relative rounded-2xl rounded-br-sm border border-rose-200/30 bg-gradient-to-br from-rose-400/20 to-orange-400/20 backdrop-blur-xl p-4 shadow-xl ml-8 transition-all group-hover:translate-y-[-2px]">
                  <p className="text-sm text-white/90">I noticed that too. Try &quot;extremely,&quot; &quot;remarkably,&quot; or just drop it entirely—your point is strong enough without it. 💪</p>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white">Human-Centric</h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  We believe AI should <strong>coach, not replace</strong>. Our system mimics the empathy of a real tutor—noticing patterns, celebrating progress, and adapting to your unique voice.
                </p>
                <div className="flex items-center gap-2 text-sm text-rose-300">
                  <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>Personalized feedback, always</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Voice Note Cards */}
      <section className="section-shell space-y-16 mb-32">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Real people, real results.
          </h3>
          <p className="mt-4 text-lg text-slate-400">
            Join thousands of learners sounding more confident every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-grid">
          {[
            {
              name: "Sarah Chen",
              role: "Software Engineer",
              score: "Job Offer Secured",
              icon: "Briefcase",
              quote: "The mock interviews felt incredibly real. I stopped freezing up when I didn't know the answer.",
              color: "emerald"
            },
            {
              name: "Marcus Rodriguez",
              role: "Medical Student",
              score: "IELTS 6.5 → 7.5",
              icon: "TrendingUp",
              quote: "I used to mumble. TalkFlow forced me to speak up and clearly. It's like a gym for your voice.",
              color: "indigo"
            },
            {
              name: "Yuki Tanaka",
              role: "Product Designer",
              score: "Visa Approved",
              icon: "CheckCircle2",
              quote: "The nuance feedback is crazy. It caught my tone issues that simple grammar checkers always missed.",
              color: "rose"
            }
          ].map((item) => (
            <div
              key={item.name}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/20"
            >
              <div className="space-y-6">
                {/* Unified Premium Glass Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    {item.icon === 'Briefcase' && <Briefcase className="h-3 w-3 text-emerald-400" />}
                    {item.icon === 'TrendingUp' && <TrendingUp className="h-3 w-3 text-indigo-400" />}
                    {item.icon === 'CheckCircle2' && <CheckCircle2 className="h-3 w-3 text-rose-400" />}
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-white/90">{item.score}</span>
                </div>

                <p className="text-lg text-slate-200 leading-relaxed font-medium">“{item.quote}”</p>

                {/* Fake Audio Player UI */}
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2 pr-4 border border-white/5">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Play className="h-3 w-3 text-white ml-0.5" />
                  </div>
                  <div className="flex gap-0.5 h-4 items-center flex-1">
                    {[...Array(20)].map((_, j) => (
                      <div
                        key={j}
                        className="w-0.5 bg-slate-500/50 rounded-full transition-all group-hover:bg-emerald-400/80"
                        style={{
                          height: `${20 + ((j * 13 + item.name.length * 7) % 80)}%`
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">0:14</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 ring-2 ring-white/10" />
                <div>
                  <p className="font-bold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell space-y-16 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="font-heading text-4xl font-bold text-white md:text-5xl">
            FAQ.
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          {faqs.map((item) => (
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
              <p className="mt-4 text-base text-slate-400 leading-relaxed pr-8">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="section-shell">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-indigo-400/10 p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,245,197,0.12),transparent_30%)]" />
          <div className="relative grid gap-6 md:grid-cols-[1.2fr,0.8fr] md:items-center">
            <div className="space-y-4">
              <h3 className="font-heading text-3xl font-semibold text-white md:text-4xl">
                Start practicing in seconds.
              </h3>
              <p className="text-base text-slate-200">
                Download the app or jump into the web experience—everything stays in sync.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={appStore}
                  className="group flex h-[60px] items-center gap-4 rounded-xl bg-white px-6 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95"
                >
                  <svg viewBox="0 0 384 512" className="h-6 w-6 fill-black">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.6-79.1 23.9-100.1 60.5-42.2 73.1-10.8 181.8 30.5 241.6 20.2 29.2 44.1 61.9 75.8 60.7 30.3-1.2 41.8-19.3 78.4-19.3s47.1 19.3 78.9 18.7c32.3-.6 53.3-29.8 73-58.4 22.9-33.1 32.7-65.1 33-66.8-.7-.3-63.5-24.3-63.8-96.1zM288 80.1c15.6-18.8 26.2-44.8 23.3-70.9-22.3 1-49.3 15-65.3 33.8-14.4 16.8-26.9 43.1-23.5 68.3 24.8 1.9 49.3-12.4 65.5-31.2z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold text-slate-950">TalkFlow App</span>
                    <span className="text-xs text-slate-500 mt-0.5">Download on App Store</span>
                  </div>
                </Link>
                <Link
                  href={playStore}
                  className="group flex h-[60px] items-center gap-4 rounded-xl bg-white px-6 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95"
                >
                  <svg viewBox="0 0 512 512" className="h-6 w-6 fill-black">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold text-slate-950">TalkFlow App</span>
                    <span className="text-xs text-slate-500 mt-0.5">Get it on Google Play</span>
                  </div>
                </Link>
                <Link
                  href={primaryCta}
                  className="group flex h-[60px] items-center gap-4 rounded-xl bg-white px-6 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95"
                >
                  <MonitorPlay className="h-6 w-6 fill-black stroke-black" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold text-slate-950">Try on web</span>
                    <span className="text-xs text-slate-500 mt-0.5">Coming soon</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
}
