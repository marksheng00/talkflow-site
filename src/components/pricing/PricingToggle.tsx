"use client";

import { cn } from "@/lib/utils";
import { BillingCycle } from "@/lib/data/pricing-data";

interface PricingToggleProps {
    billingCycle: BillingCycle;
    onChange: (cycle: BillingCycle) => void;
}

export const PricingToggle = ({ billingCycle, onChange }: PricingToggleProps) => {
    // Helper to get button style based on active state (matching RoadmapClient)
    const getButtonStyle = (isActive: boolean) => cn(
        "relative flex-1 md:flex-initial px-4 md:px-8 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center flex items-center justify-center gap-2",
        isActive
            ? "bg-white text-slate-950 shadow-lg"
            : "text-slate-400 hover:text-white hover:bg-white/5"
    );

    return (
        <div className="flex items-center justify-center">
            <div className="flex p-1 gap-1 rounded-xl bg-white/5 border border-white/5 w-full md:w-fit">
                {/* Monthly Button */}
                <button
                    onClick={() => onChange("monthly")}
                    className={getButtonStyle(billingCycle === "monthly")}
                >
                    Monthly
                </button>

                {/* Quarterly Button */}
                <button
                    onClick={() => onChange("quarterly")}
                    className={getButtonStyle(billingCycle === "quarterly")}
                >
                    Quarterly
                    {/* Badge -10% */}
                    <span className={cn(
                        "rounded-md px-1.5 py-0.5 text-[9px] font-bold border transition-colors hidden md:inline-block",
                        billingCycle === "quarterly"
                            ? "bg-slate-950 text-white border-slate-800"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                        -10%
                    </span>
                </button>

                {/* Yearly Button */}
                <button
                    onClick={() => onChange("yearly")}
                    className={getButtonStyle(billingCycle === "yearly")}
                >
                    Yearly
                    {/* Badge -20% */}
                    <span className={cn(
                        "rounded-md px-1.5 py-0.5 text-[9px] font-bold border transition-colors hidden md:inline-block",
                        billingCycle === "yearly"
                            ? "bg-slate-950 text-white border-slate-800"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                        -20%
                    </span>
                </button>
            </div>
        </div>
    );
};
