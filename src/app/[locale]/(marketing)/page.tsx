"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Play,
  BookOpen,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ChatConversation } from "@/components/home/ChatConversation";
import { FeedbackCard } from "@/components/home/FeedbackCard";
import { AppDownloadButtons } from "@/components/home/AppDownloadButtons";
import {
  primaryCta,
  playStore,
  appStore,
  featureCards,
  feedbackCards,
} from "@/lib/data/home-data";
import FaqJsonLd from "@/components/seo/FaqJsonLd";

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <AuroraBackground className="pb-24 text-white">
      <FaqJsonLd
        questions={[0, 1, 2, 3].map(idx => ({
          q: t(`FAQ.items.${idx}.q`),
          a: t(`FAQ.items.${idx}.a`)
        }))}
      />
      {/* Hero Section */}
      <section className="section-block section-hero relative overflow-hidden w-full">
        <div className="section-shell section-stack stack-hero relative z-10 items-center text-center">

          {/* Main Title */}
          <div className="section-heading max-w-none">
            <h1 className="max-w-none font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.1] md:leading-[0.9] text-balance break-words hyphens-auto">
              {t('titlePrefix')}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 animate-text-shimmer bg-[size:200%_auto] inline-block pb-4">
                {t('titleSuffix')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-5xl text-xl md:text-2xl leading-relaxed text-muted/60 px-2 md:px-0 font-light tracking-tight text-balance">
              {t('subtitle')}
            </p>
          </div>

          <AppDownloadButtons
            appStoreLink={appStore}
            playStoreLink={playStore}
            webLink={primaryCta}
            className="mt-1 md:mt-2"
          />

          {/* Video Placeholder */}
          <div className="w-full max-w-7xl relative flex flex-col stack-loose">
            <div className="absolute inset-0 blur-[120px] bg-emerald-400/20 -z-10" />
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 md:gap-4 text-slate-500">
                <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-transform hover:scale-110 cursor-pointer">
                  <Play className="h-6 w-6 md:h-8 md:w-8 text-white fill-current" />
                </div>
                <p className="text-xs md:text-sm font-medium tracking-wide uppercase text-neutral-400">{t('Hero.watchIntro')}</p>
              </div>
            </div>

            {/* Trust Proof Points Row */}
            <div className="grid grid-cols-2 gap-grid md:grid-cols-4 md:gap-grid-lg w-full pt-2 md:pt-3">
              {[
                { label: t('Hero.proofPoints.learners'), value: "180K+" },
                { label: t('Hero.proofPoints.sessions'), value: "4.7" },
                { label: t('Hero.proofPoints.confidence'), value: "2.1x" },
                { label: t('Hero.proofPoints.rating'), value: "4.9/5" }
              ].map((point) => (
                <div key={point.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{point.value}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{point.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="section-block scroll-mt-32">
        <div className="section-shell section-stack">
          <div className="section-heading">
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('Features.title')}
            </h2>
            <p className="text-lg text-neutral-400 text-balance">
              {t('Features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-grid md:grid-cols-3 md:gap-grid-lg">
            {featureCards.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition hover:bg-white/[0.04]"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-emerald-200" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  {t(`Features.cards.${idx}.title`)}
                </h3>
                <p className="mt-3 text-base text-neutral-400 leading-relaxed">
                  {t(`Features.cards.${idx}.copy`)}
                </p>
              </div>
            ))}
          </div>

          {/* Feedback Subsection - Part of "Everything you need" */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 lg:p-16 overflow-hidden relative section-stack stack-loose">
            <div className="grid gap-grid-lg lg:grid-cols-2 lg:items-center">
              <div className="space-y-8 z-10 relative">
                <h3 className="font-heading text-3xl font-bold text-white md:text-4xl text-balance">
                  {t('Features.Feedback.title')}
                </h3>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  {t('Features.Feedback.desc')}
                </p>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="text-base text-slate-300">{t(`Features.Feedback.list.${idx}`)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: Horizontal Scroll */}
              <div className="lg:hidden relative w-full overflow-hidden">
                <div className="flex gap-grid overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {feedbackCards.map((card, idx) => (
                    <div key={`mobile-${idx}`} className="flex-shrink-0 w-[280px] snap-center">
                      <FeedbackCard card={card} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">{t('Features.Feedback.mobileSwipe')}</p>
              </div>

              {/* Desktop: Vertical Marquee Container */}
              <div className="hidden lg:block relative h-[500px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
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
        </div>
      </section>

      {/* Technology / Under the Hood Section */}
      <section className="section-block relative">
        <div className="section-shell section-stack">
          <div className="section-heading">
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('Tech.title')}
            </h2>
            <p className="text-lg text-neutral-400 text-balance">
              {t('Tech.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:gap-6 md:grid-cols-6 md:grid-rows-2 md:h-[560px]">

            {/* 1. Agentic Conversation (Large - 3 cols, 2 rows) */}
            <div className="group relative col-span-1 md:col-span-3 md:row-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col transition-all hover:bg-white/[0.04] h-[540px] md:h-auto md:min-h-0">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-indigo-500/15 blur-[60px] transition-all group-hover:bg-indigo-500/25" />

              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-white md:text-xl">{t('Tech.cards.partner.title')}</h3>
                <p className="text-neutral-400 leading-relaxed text-xs md:text-sm">
                  {t('Tech.cards.partner.desc')}
                </p>
              </div>

              {/* Visual: Simulated Chat Bubbles */}
              <ChatConversation
                messages={[
                  {
                    text: t('Tech.cards.chat.0'),
                    delay: 0,
                    typingSpeed: 60,
                    className: "self-end max-w-[75%] rounded-2xl rounded-br-sm bg-indigo-500/30 px-5 py-3.5 text-base text-white/90 leading-relaxed",
                  },
                  {
                    text: t('Tech.cards.chat.1'),
                    delay: 2500,
                    typingSpeed: 55,
                    className: "self-start max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-5 py-3.5 text-base text-white/80 leading-relaxed",
                    highlightWords: [
                      { word: t('Tech.cards.chat.1').includes('Wait') ? "Wait" : "请稍等", className: "gradient-word-cool" },
                      { word: t('Tech.cards.chat.1').includes('role') ? "role" : "职位", className: "gradient-word-emerald" },
                      { word: t('Tech.cards.chat.1').includes('changes') ? "changes" : "改变", className: "gradient-word-warm" },
                    ],
                  },
                  {
                    text: t('Tech.cards.chat.2'),
                    delay: 5000,
                    typingSpeed: 65,
                    className: "self-end max-w-[65%] rounded-2xl rounded-br-sm bg-indigo-500/30 px-5 py-3.5 text-base text-white/90 leading-relaxed",
                  },
                  {
                    text: t('Tech.cards.chat.3'),
                    delay: 7500,
                    typingSpeed: 50,
                    className: "self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-5 py-3.5 text-base text-white/80 leading-relaxed",
                    highlightWords: [
                      { word: t('Tech.cards.chat.3').includes('Perfect') ? "Perfect" : "太棒了", className: "gradient-word-cool" },
                      { word: t('Tech.cards.chat.3').includes('failed') ? "failed" : "失败", className: "gradient-word-warm" },
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
                <h3 className="text-base md:text-lg font-bold text-white">{t('Tech.cards.latency.title')}</h3>
                <p className="text-neutral-400 text-xs md:text-sm mt-0.5 truncate">
                  {t('Tech.cards.latency.desc')}
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
                <h3 className="text-xs font-bold text-white/90 text-center">{t('Tech.cards.models')}</h3>
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
                <h3 className="text-xs font-bold text-white/90 text-center">{t('Tech.cards.voice')}</h3>
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
                <h3 className="text-xs font-bold text-white/90 text-center">{t('Tech.cards.asr')}</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Built by experts - Premium Storytelling Cards */}
      <section id="about" className="section-block scroll-mt-32">
        <div className="section-shell section-stack">
          <div className="section-heading">
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('About.title')}
            </h2>
            <p className="text-lg text-neutral-400 text-balance">
              {t('About.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Card 1: Pedagogy - Green Gradient */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-green-500/10 p-6 md:p-12 transition-all hover:scale-[1.01]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                {/* Left: Embedded Examiner Card */}
                <div className="group/card">
                  <div className="relative rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 group-hover:shadow-emerald-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{t('About.cards.pedagogy.badge')}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{t('About.cards.pedagogy.credential')}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">{t('About.cards.pedagogy.stats.fluency')}</span>
                        <span className="text-sm font-bold text-slate-900">8.5</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">{t('About.cards.pedagogy.stats.lexical')}</span>
                        <span className="text-sm font-bold text-slate-900">9.0</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600">{t('About.cards.pedagogy.stats.pronunciation')}</span>
                        <span className="text-sm font-bold text-slate-900">8.0</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-neutral-400 italic">{t('About.cards.pedagogy.footer')}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Text Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">{t('About.cards.pedagogy.title')}</h3>
                  <p className="text-base text-slate-200 leading-relaxed">
                    {t('About.cards.pedagogy.desc')}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('About.cards.pedagogy.trust')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: AI Tech - Indigo Gradient */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-blue-500/10 p-6 md:p-12 transition-all hover:scale-[1.01]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.15),transparent_50%)]" />

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                {/* Left: Text Content */}
                <div className="space-y-4 md:order-1">
                  <h3 className="text-2xl font-bold text-white">{t('About.cards.engineering.title')}</h3>
                  <p className="text-base text-slate-200 leading-relaxed">
                    {t('About.cards.engineering.desc')}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-300">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span>{t('About.cards.engineering.stat')}</span>
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
                      <span className="text-xs text-neutral-400 ml-2 font-mono">talkflo-engine</span>
                    </div>

                    {/* Terminal Content */}
                    <div className="p-4 font-mono text-xs space-y-1">
                      <p className="text-emerald-400">$ npm run dev</p>
                      <p className="text-slate-500">&gt; {t('About.cards.engineering.terminal.starting')}</p>
                      <p className="text-indigo-300">✓ {t('About.cards.engineering.terminal.voice')}</p>
                      <p className="text-indigo-300">✓ {t('About.cards.engineering.terminal.asr')}</p>
                      <p className="text-neutral-400">⚡ {t('About.cards.engineering.terminal.latency')} <span className="text-emerald-400 font-bold">187ms</span></p>
                      <p className="text-neutral-400">🎯 {t('About.cards.engineering.terminal.interruption')} <span className="text-purple-400 font-bold">{t('About.cards.engineering.terminal.active')}</span></p>
                      <p className="text-slate-500 animate-pulse">▊</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Human-Centric - Rose Gradient */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-400/20 via-pink-400/15 to-orange-500/10 p-6 md:p-12 transition-all hover:scale-[1.01]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,114,182,0.15),transparent_50%)]" />

              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                {/* Left: Embedded Chat Bubbles */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl rounded-tl-sm border border-white/20 bg-white/95 backdrop-blur-xl p-4 shadow-xl max-w-sm transition-all group-hover:translate-y-[-4px]">
                    <p className="text-sm text-slate-700">{t('About.cards.human.bubble1')}</p>
                  </div>
                  <div className="relative rounded-2xl rounded-br-sm border border-rose-200/30 bg-gradient-to-br from-rose-400/20 to-orange-400/20 backdrop-blur-xl p-4 shadow-xl ml-4 md:ml-8 transition-all group-hover:translate-y-[-2px]">
                    <p className="text-sm text-white/90">{t('About.cards.human.bubble2')}</p>
                  </div>
                </div>

                {/* Right: Text Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">{t('About.cards.human.title')}</h3>
                  <p className="text-base text-slate-200 leading-relaxed">
                    {t('About.cards.human.desc')}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-rose-300">
                    <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                    <span>{t('About.cards.human.footer')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Voice Note Cards */}
      <section className="section-block">
        <div className="section-shell section-stack">
          <div className="section-heading">
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('Testimonials.title')}
            </h2>
            <p className="text-lg text-neutral-400 text-balance">
              {t('Testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 stagger-grid">
            {[
              { icon: "Briefcase", color: "emerald" },
              { icon: "TrendingUp", color: "indigo" },
              { icon: "CheckCircle2", color: "rose" }
            ].map((config, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/20"
              >
                <div className="space-y-6">
                  {/* Unified Premium Glass Badge */}
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                      {config.icon === 'Briefcase' && <Briefcase className="h-3 w-3 text-emerald-400" />}
                      {config.icon === 'TrendingUp' && <TrendingUp className="h-3 w-3 text-indigo-400" />}
                      {config.icon === 'CheckCircle2' && <CheckCircle2 className="h-3 w-3 text-rose-400" />}
                    </div>
                    <span className="text-[11px] font-bold tracking-tight text-white/90">{t(`Testimonials.items.${idx}.score`)}</span>
                  </div>

                  <p className="text-lg text-slate-200 leading-relaxed font-medium">“{t(`Testimonials.items.${idx}.quote`)}”</p>

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
                            height: `${20 + ((j * 13 + idx * 7) % 80)}%`
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
                    <p className="font-bold text-white text-sm">{t(`Testimonials.items.${idx}.name`)}</p>
                    <p className="text-xs text-neutral-400">{t(`Testimonials.items.${idx}.role`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-block">
        <div className="section-shell section-stack">
          <div className="section-heading">
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('FAQ.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2 max-w-5xl mx-auto">
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
                <p className="mt-4 text-base text-neutral-400 leading-relaxed pr-8">{t(`FAQ.items.${idx}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="section-block">
        <div className="section-shell">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-indigo-400/10 p-6 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,245,197,0.12),transparent_30%)]" />
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col gap-5 md:gap-6 w-full">
                <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
                  {t('FooterCTA.title')}
                </h2>
                <p className="text-base text-slate-200">
                  {t('FooterCTA.subtitle')}
                </p>
                <AppDownloadButtons
                  appStoreLink={appStore}
                  playStoreLink={playStore}
                  webLink={primaryCta}
                  className="w-full max-w-full mx-auto md:mx-0 px-0 items-center md:items-start lg:justify-start"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground >
  );
}
