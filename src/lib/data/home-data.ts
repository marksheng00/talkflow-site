import { Mic2, Sparkles, Waves } from "lucide-react";

export const primaryCta = "https://talkflo.hicall.ai/callout-lite/en/talkflo";
export const playStore = "https://play.google.com/store/apps/details?id=io.aigaia.talkflo";
export const appStore = "https://apps.apple.com/us/app/talkflo-speak-english-better/id6746321404";

export const featureCards = [
    {
        title: "Adaptive voice role-play",
        copy: "Practice real-world dialogs with AI partners that shift tone, pace, and complexity as you improve.",
        icon: Mic2,
    },
    {
        title: "Instant coaching",
        copy: "Live pronunciation scoring, filler-word detection, and delivery tips after every turn.",
        icon: Sparkles,
    },
    {
        title: "Situational blueprints",
        copy: "Interview prep, travel, presentations, or negotiation drills—ready to launch in seconds.",
        icon: Waves,
    },
];

export const benefits = [
    "Native-like cadence and intonation feedback in real time.",
    "Role-play that adapts to confidence level and accent.",
    "Safe space to make mistakes with coaching from linguists and AI.",
    "Roadmap driven by community voting and task acceleration.",
];

export const proofPoints = [
    { label: "Learners worldwide", value: "180K+" },
    { label: "Average weekly sessions", value: "4.7" },
    { label: "Confidence lift after 14 days", value: "2.1x" },
];

export const highlights = [
    {
        title: "Feels like a human coach",
        desc: "Turn-taking, interruptions, and clarifying questions make every session feel natural.",
    },
    {
        title: "Feedback you can act on",
        desc: "Pronunciation heatmaps, pacing hints, and suggested rewrites delivered instantly.",
    },
    {
        title: "Transparent roadmap",
        desc: "Vote on what's next, accelerate tasks you care about, or submit your own ideas.",
    },
];

export const testimonials = [
    {
        quote: "TalkFlo feels like a calm coach in my ear. I stopped overthinking and finally sound confident in interviews.",
        name: "Andrea M.",
        title: "Product Manager relocating to Berlin",
    },
    {
        quote: "The role-play interruptions are the magic. It forced me to recover quickly, just like real customers do.",
        name: "Jason L.",
        title: "Customer Success lead",
    },
    {
        quote: "As an English teacher, I’m surprised by how precise the pacing and intonation feedback is.",
        name: "Mei Chen",
        title: "Language instructor",
    },
];

export const faqs = [
    {
        q: "Do I need the mobile app?",
        a: "No. You can start on web instantly. Mobile apps keep your sessions and feedback in sync across devices.",
    },
    {
        q: "How does the feedback work?",
        a: "We blend ASR, acoustic analysis, and linguist-built rubrics to give precise pacing, clarity, and filler-word feedback.",
    },
    {
        q: "Is my audio stored?",
        a: "Sessions are processed for feedback and stored only if you opt in. Supabase keys stay on the server side.",
    },
    {
        q: "Can I influence the roadmap?",
        a: "Yes. Submit ideas, vote, or accelerate tasks directly on the Roadmap page.",
    },
];

export interface FeedbackCardData {
    type: string;
    content: string;
    correction: string;
    color: string;
}

export const feedbackCards: FeedbackCardData[] = [
    {
        type: "Pronunciation",
        content: "Your 'th' sound in 'think' was a bit too forceful.",
        correction: "Try to soften the contact between your tongue and teeth.",
        color: "bg-blue-500/10 text-blue-200 border-blue-500/20",
    },
    {
        type: "Grammar",
        content: "She go to the store yesterday.",
        correction: "She **went** to the store yesterday.",
        color: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    },
    {
        type: "Vocabulary",
        content: "I want to make a decision.",
        correction: "Consider: 'I want to **reach** a decision' or 'decide'.",
        color: "bg-purple-500/10 text-purple-200 border-purple-500/20",
    },
    {
        type: "Tone",
        content: "No, that's wrong.",
        correction: "Softer: 'I see it differently' or 'I'm not sure I agree.'",
        color: "bg-amber-500/10 text-amber-200 border-amber-500/20",
    },
    {
        type: "Pacing",
        content: "160 words per minute",
        correction: "Great pace! You sounded confident and fluent.",
        color: "bg-cyan-500/10 text-cyan-200 border-cyan-500/20",
    },
    {
        type: "Filler Words",
        content: "Umm... like... you know...",
        correction: "Pause instead of using fillers to sound more authoritative.",
        color: "bg-rose-500/10 text-rose-200 border-rose-500/20",
    },
];
