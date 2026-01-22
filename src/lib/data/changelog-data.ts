export type ChangeType = "feature" | "fix" | "improvement" | "perf";

export interface ChangeLogItem {
    version: string;
    date: string;
    changes: {
        type: ChangeType;
        content: string;
    }[];
}

export const changelogData: ChangeLogItem[] = [
    {
        version: "v0.1.61",
        date: "2026-01-23",
        changes: [
            { type: "fix", content: "Removed mobile menu backdrop overlay to improve navigation reliability." },
            { type: "fix", content: "Resolved z-index stacking issues affecting mobile menu visibility." },
            { type: "improvement", content: "Enhanced body scroll locking mechanism for smoother mobile interactions." }
        ]
    },
    {
        version: "v0.1.55",
        date: "2026-01-23",
        changes: [
            { type: "perf", content: "Comprehensive SEO optimization including JSON-LD structured data and meta tags." },
            { type: "feature", content: "Added dynamic sitemap.xml and robots.txt generation." },
            { type: "improvement", content: "Optimized heading hierarchy (H1-H3) for better accessibility and search indexing." },
            { type: "improvement", content: "Enabled native Next.js image optimization." }
        ]
    },
    {
        version: "v0.1.50",
        date: "2026-01-22",
        changes: [
            { type: "feature", content: "Launched new high-performance landing page with Aurora aesthetics." },
            { type: "feature", content: "Implemented 'Roadmap' page with voting and acceleration features." },
            { type: "feature", content: "Added 'Pricing' page with monthly/yearly toggle." },
            { type: "improvement", content: "Integrated Sanity CMS for blog management." }
        ]
    },
    {
        version: "v0.1.0",
        date: "2026-01-01",
        changes: [
            { type: "feature", content: "Initial public beta release of talkflo." },
            { type: "feature", content: "Core AI voice role-play engine online." }
        ]
    }
];
