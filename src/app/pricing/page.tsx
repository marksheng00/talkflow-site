import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
    title: "Pricing | talkflo AI Speaking Coach",
    description: "Check out our simple and transparent pricing plans. Start practicing English for free or upgrade for unlimited AI coaching and role-plays.",
    alternates: {
        canonical: "/pricing",
    },
    openGraph: {
        title: "Pricing | talkflo AI",
        description: "Start for free and upgrade for real-time AI English coaching.",
    }
};

export default function PricingPage() {
    return <PricingClient />;
}
