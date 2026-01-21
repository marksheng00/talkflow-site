"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface PricingToggleProps {
    isYearly: boolean;
    onChange: (isYearly: boolean) => void;
}

export const PricingToggle = ({ isYearly, onChange }: PricingToggleProps) => {
    return (
        <div className="flex items-center justify-center gap-4">
            <span
                className={cn(
                    "text-sm font-medium transition-colors cursor-pointer",
                    !isYearly ? "text-white" : "text-slate-500"
                )}
                onClick={() => onChange(false)}
            >
                Monthly
            </span>

            <div
                className="relative h-8 w-14 cursor-pointer rounded-full bg-white/10 p-1"
                onClick={() => onChange(!isYearly)}
            >
                <motion.div
                    className="h-6 w-6 rounded-full bg-white shadow-sm"
                    animate={{ x: isYearly ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </div>

            <span
                className={cn(
                    "text-sm font-medium transition-colors cursor-pointer flex items-center gap-2",
                    isYearly ? "text-white" : "text-slate-500"
                )}
                onClick={() => onChange(true)}
            >
                Yearly
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    Save 20%
                </span>
            </span>
        </div>
    );
};
