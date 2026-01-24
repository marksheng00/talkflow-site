import type { Metadata } from "next";
import VisionClient from "./VisionClient";

export const metadata: Metadata = {
    title: "Vision | talkflo Communication OS",
    description: "We are building the operating system for human communication. From AI simulations to the open metaverse.",
    alternates: {
        canonical: "/vision",
    },
    openGraph: {
        title: "The Vision | talkflo",
        description: "Solving human communication with AI.",
        images: ["/og-vision.png"], // Ideally create this asset later
    }
};

export default function VisionPage() {
    return <VisionClient />;
}
