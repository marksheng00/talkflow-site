"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: Heading[];
    translation?: string;
}

export function TableOfContents({ headings, translation }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="hidden lg:block sticky top-24 self-start w-64 shrink-0">
            <p className="typo-label text-white mb-4">{translation || "On this page:"}</p>
            <nav className="relative">
                {/* Render a continuous line if needed, but styling shows individual items have borders */}
                <ul className="space-y-4">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                    setActiveId(heading.id);
                                }}
                                className={cn(
                                    "block typo-body-sm transition-all duration-200",
                                    activeId === heading.id
                                        ? "text-emerald-400 typo-body-sm-strong"
                                        : "text-neutral-400 hover:text-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "relative pl-4 py-3 rounded-r-2xl border-l-4 transition-all duration-200",
                                    activeId === heading.id
                                        ? "bg-emerald-500/10 border-emerald-500"
                                        : "border-transparent hover:border-slate-700"
                                )}>
                                    {heading.text}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
