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
