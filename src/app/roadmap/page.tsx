import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
    title: "Roadmap | talkflo AI Development Stack",
    description: "Follow the development of talkflo. See our public roadmap, submit character ideas, report bugs, and vote on upcoming features.",
    alternates: {
        canonical: "/roadmap",
    },
    openGraph: {
        title: "Public Roadmap | talkflo",
        description: "Building the future of AI English practice in public.",
    }
};

export default function RoadmapPage() {
    return <RoadmapClient />;
}
