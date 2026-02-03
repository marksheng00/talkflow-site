"use client";

import { useRef, useState } from "react";
import { Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { badgeStyles } from "@/components/ui/Badge";
import { Link } from "@/navigation";
import type { BlogCategory } from "@/types/blog";

interface CategoriesSidebarProps {
    categories: BlogCategory[];
    categorySlug?: string;
    locale: string;
    labels: {
        categories: string;
        allPosts: string;
    };
}

const CLOSE_DELAY_MS = 350;

export function CategoriesSidebar({
    categories,
    categorySlug,
    locale,
    labels,
}: CategoriesSidebarProps) {
    const derivedOpenParent = categorySlug
        ? (categories.find((cat) => cat.slug.current === categorySlug)?.parent || categorySlug)
        : null;
    const [hoverParent, setHoverParent] = useState<string | null>(null);
    const openParent = hoverParent ?? derivedOpenParent;
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearCloseTimer = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };

    const scheduleClose = () => {
        clearCloseTimer();
        closeTimer.current = setTimeout(() => {
            setHoverParent(null);
        }, CLOSE_DELAY_MS);
    };

    const parents = categories.filter((cat) => !cat.parent);

    return (
        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-32">
            <p className="typo-label text-slate-500 mb-4 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                {labels.categories}
            </p>
            <nav className="flex flex-col space-y-1">
                <Link
                    href="/blog"
                    locale={locale}
                    className={badgeStyles({
                        tone: !categorySlug ? "teal" : "slate",
                        variant: !categorySlug ? "soft" : "ghost",
                        size: "lg",
                        caps: false,
                        interactive: true,
                        className: !categorySlug ? "border-transparent" : undefined,
                    })}
                >
                    {labels.allPosts}
                </Link>

                {parents.map((parent) => {
                    const children = categories.filter((c) => c.parent === parent.slug.current);
                    const isParentActive = categorySlug === parent.slug.current;
                    const isChildActive = children.some((c) => c.slug.current === categorySlug);
                    const isOpen = openParent === parent.slug.current || isChildActive;

                    return (
                        <div
                            key={parent.slug.current}
                            className="group relative"
                            onMouseEnter={() => {
                                clearCloseTimer();
                                setHoverParent(parent.slug.current);
                            }}
                            onMouseLeave={() => {
                                scheduleClose();
                            }}
                        >
                            <Link
                                href={`/blog?category=${parent.slug.current}`}
                                locale={locale}
                                className={cn(
                                    badgeStyles({
                                        tone: isParentActive ? "teal" : "slate",
                                        variant: isParentActive ? "soft" : "ghost",
                                        size: "lg",
                                        caps: false,
                                        interactive: true,
                                        className: isParentActive ? "border-transparent" : undefined,
                                    }),
                                    "flex items-center justify-between"
                                )}
                            >
                                {parent.title}
                                {children.length > 0 && (
                                    <ChevronRight
                                        className={cn(
                                            "w-3.5 h-3.5 transition-transform opacity-50 text-neutral-400 group-hover:text-white group-hover:opacity-100",
                                            isOpen ? "rotate-90 opacity-100 text-white" : "group-hover:rotate-90"
                                        )}
                                    />
                                )}
                            </Link>

                            {children.length > 0 && (
                                <div
                                    className={cn(
                                        "grid ml-4 mt-0.5 border-l border-white/10 pl-2 transition-[grid-template-rows,opacity] duration-200 origin-top",
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100 pointer-events-auto"
                                            : "grid-rows-[0fr] opacity-0 pointer-events-none"
                                    )}
                                    onMouseEnter={() => {
                                        clearCloseTimer();
                                        setHoverParent(parent.slug.current);
                                    }}
                                    onMouseLeave={() => {
                                        scheduleClose();
                                    }}
                                >
                                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                                        {children.map((child) => (
                                            <Link
                                                key={child.slug.current}
                                                href={`/blog?category=${child.slug.current}`}
                                                locale={locale}
                                                className={badgeStyles({
                                                    tone: categorySlug === child.slug.current ? "teal" : "slate",
                                                    variant: categorySlug === child.slug.current ? "soft" : "ghost",
                                                    size: "lg",
                                                    caps: false,
                                                    interactive: true,
                                                    className: categorySlug === child.slug.current ? "border-transparent" : undefined,
                                                })}
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}
