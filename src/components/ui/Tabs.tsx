"use client";

import { cn } from "@/lib/utils";

export interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
    variant?: 'default' | 'pills';
}

/**
 * Unified Tab component for consistent tab navigation across the app
 */
export function Tabs({ tabs, activeTab, onChange, className, variant = 'default' }: TabsProps) {
    if (variant === 'pills') {
        return (
            <div className={cn("flex p-1 gap-1 rounded-xl bg-white/5 border border-white/5", className)}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "flex-1 md:flex-initial px-4 md:px-8 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center flex items-center justify-center gap-2",
                            activeTab === tab.id
                                ? "bg-white text-slate-950 shadow-lg"
                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                        activeTab === tab.id
                            ? "text-white bg-white/10"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ============= Toggle Button Styles =============

/**
 * Get button style for toggle components (shared between PricingToggle and Roadmap tabs)
 */
export function getToggleButtonStyle(isActive: boolean): string {
    return cn(
        "relative flex-1 md:flex-initial px-4 md:px-8 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center flex items-center justify-center gap-2",
        isActive
            ? "bg-white text-slate-950 shadow-lg"
            : "text-neutral-400 hover:text-white hover:bg-white/5"
    );
}
