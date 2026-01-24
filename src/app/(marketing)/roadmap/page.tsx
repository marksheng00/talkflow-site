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

import {
    listRoadmapItems,
    listCommunityIdeas,
    listBugReports
} from "@/lib/roadmap";

export default async function RoadmapPage() {
    // Fetch all data in parallel on the server
    const [tasks, ideas, bugs] = await Promise.all([
        listRoadmapItems(),
        listCommunityIdeas(),
        listBugReports()
    ]);

    return (
        <RoadmapClient
            initialTasks={tasks}
            initialIdeas={ideas}
            initialBugs={bugs}
        />
    );
}
