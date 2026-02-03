"use client";

import { cn } from "@/lib/utils";
import { BillingCycle } from "@/lib/data/pricing-data";
import { getToggleButtonStyle } from "@/components/ui/Tabs";
import { badgeStyles } from "@/components/ui/Badge";

interface PricingToggleProps {
    billingCycle: BillingCycle;
    onChange: (cycle: BillingCycle) => void;
}

export const PricingToggle = ({ billingCycle, onChange }: PricingToggleProps) => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex p-1 gap-1 rounded-2xl bg-white/5 border border-white/5 w-full md:w-fit">
                {/* Monthly Button */}
                <button
                    onClick={() => onChange("monthly")}
                    className={getToggleButtonStyle(billingCycle === "monthly")}
                >
                    Monthly
                </button>

                {/* Quarterly Button */}
                <button
                    onClick={() => onChange("quarterly")}
                    className={getToggleButtonStyle(billingCycle === "quarterly")}
                >
                    Quarterly
                    {/* Badge -10% */}
                    <span className={cn(
                        badgeStyles({
                            size: "xs",
                            tone: billingCycle === "quarterly" ? "slate" : "emerald",
                            variant: billingCycle === "quarterly" ? "solid" : "soft",
                        }),
                        "hidden md:inline-block"
                    )}>
                        -10%
                    </span>
                </button>

                {/* Yearly Button */}
                <button
                    onClick={() => onChange("yearly")}
                    className={getToggleButtonStyle(billingCycle === "yearly")}
                >
                    Yearly
                    {/* Badge -20% */}
                    <span className={cn(
                        badgeStyles({
                            size: "xs",
                            tone: billingCycle === "yearly" ? "slate" : "emerald",
                            variant: billingCycle === "yearly" ? "solid" : "soft",
                        }),
                        "hidden md:inline-block"
                    )}>
                        -20%
                    </span>
                </button>
            </div>
        </div>
    );
};
