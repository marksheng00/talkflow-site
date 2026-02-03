import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { PricingTier, BillingCycle } from "@/lib/data/pricing-data";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { cardStyles } from "@/components/ui/Card";

interface PricingCardProps {
    tier: PricingTier;
    billingCycle: BillingCycle;
}

const AnimatedPrice = ({ value }: { value: number }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
};

export const PricingCard = ({ tier, billingCycle }: PricingCardProps) => {
    const price = tier.price[billingCycle];
    const isCustom = tier.name === "Team"; // Keep for legacy check support if needed, though we renamed to Ultra
    const isUltra = tier.name === "Ultra";

    return (
        <div
            className={cn(
                cardStyles({
                    variant: "subtle",
                    interactive: true,
                    className:
                        "flex h-full flex-col justify-between p-6 md:p-8",
                }),
                tier.highlight
                    ? "border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                    : isUltra
                        ? "border-emerald-500/50 shadow-[0_0_40px_rgba(52,211,153,0.1)]"
                    : "border-white/10"
            )}
        >
            {tier.highlight && (
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-[60px]" />
            )}

            {/* Ultra Gradient Background Effect */}
            {isUltra && (
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px]" />
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="mb-6 space-y-2">
                    <h2 className={cn("typo-h3 text-white", isUltra && "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400")}>
                        {tier.name}
                    </h2>
                    <p className="typo-body-sm text-neutral-400">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                    {isCustom ? (
                        <span className="typo-h2 text-white">Custom</span>
                    ) : (
                        <>
                            <span className="typo-h2 text-white flex">
                                $<AnimatedPrice value={price} />
                            </span>
                            <span className="typo-body-sm text-slate-500">/mo</span>
                        </>
                    )}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-4">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <CheckCircle2
                                className={cn(
                                    "mt-0.5 h-5 w-5 shrink-0",
                                    tier.highlight || isUltra ? "text-emerald-400" : "text-slate-500"
                                )}
                            />
                            <span className="typo-body-sm text-slate-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Button */}
            <Link
                href={tier.name === "Free" ? "/signup" : tier.name === "Pro" ? "/signup?plan=pro" : "/contact"}
                className={cn(
                    "relative z-10 w-full",
                    buttonStyles({
                        variant: tier.highlight
                            ? "primary"
                            : isUltra
                                ? "gradient"
                                : "secondary",
                        size: "lg",
                    })
                )}
            >
                {tier.cta}
            </Link>
        </div>
    );
};
