import type { Metadata } from "next";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = {
    title: "Changelog | talkflo",
    description: "See what's new in talkflo. We are shipping improvements and new features every week.",
    alternates: {
        canonical: "/changelog",
    },
    openGraph: {
        title: "Product Changelog | talkflo",
        description: "Track our journey and see the latest updates.",
    }
};

export default function ChangelogPage() {
    return <ChangelogClient />;
}
