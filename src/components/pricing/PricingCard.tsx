import { useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { PricingTier, BillingCycle } from "@/lib/data/pricing-data";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
                "relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-white/[0.02] p-6 md:p-8 transition-all hover:bg-white/[0.04]",
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
                    <h3 className={cn("font-heading text-2xl font-bold text-white", isUltra && "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400")}>
                        {tier.name}
                    </h3>
                    <p className="text-sm text-slate-400">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                    {isCustom ? (
                        <span className="text-4xl font-bold text-white">Custom</span>
                    ) : (
                        <>
                            <span className="text-4xl font-bold text-white flex">
                                $<AnimatedPrice value={price} />
                            </span>
                            <span className="text-slate-500">/mo</span>
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
                            <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Button */}
            <Link
                href={tier.name === "Free" ? "/signup" : tier.name === "Pro" ? "/signup?plan=pro" : "/contact"}
                className={cn(
                    "relative z-10 flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold transition-all active:scale-95",
                    tier.highlight
                        ? "bg-white !text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        : isUltra
                            ? "bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] hover:bg-emerald-400"
                            : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                )}
            >
                {tier.cta}
            </Link>
        </div>
    );
};
