import { cn } from "@/lib/utils";

export type CardVariant = "subtle" | "soft" | "outline" | "glass";
export type CardRadius = "xl" | "2xl" | "3xl";

interface CardStyleOptions {
    variant?: CardVariant;
    radius?: CardRadius;
    interactive?: boolean;
    className?: string;
}

const baseClasses = "relative overflow-hidden border border-white/10";

const variantClasses: Record<CardVariant, string> = {
    subtle: "bg-white/[0.02]",
    soft: "bg-white/5",
    outline: "bg-transparent",
    glass: "bg-white/[0.02] backdrop-blur-sm",
};

const radiusClasses: Record<CardRadius, string> = {
    xl: "rounded-2xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
};

const interactiveClasses: Record<CardVariant, string> = {
    subtle: "transition hover:bg-white/[0.04] hover:border-white/20",
    soft: "transition hover:bg-white/10 hover:border-white/20",
    outline: "transition hover:border-white/20",
    glass: "transition hover:bg-white/[0.04] hover:border-white/20",
};

export function cardStyles({
    variant = "subtle",
    radius = "3xl",
    interactive = false,
    className,
}: CardStyleOptions = {}) {
    return cn(
        baseClasses,
        variantClasses[variant],
        radiusClasses[radius],
        interactive && interactiveClasses[variant],
        className
    );
}
