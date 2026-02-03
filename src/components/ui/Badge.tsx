import { cn } from "@/lib/utils";

export type BadgeTone =
    | "slate"
    | "emerald"
    | "teal"
    | "cyan"
    | "blue"
    | "indigo"
    | "purple"
    | "rose"
    | "amber"
    | "neutral";

export type BadgeVariant = "soft" | "solid" | "outline" | "ghost";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeStyleOptions {
    tone?: BadgeTone;
    variant?: BadgeVariant;
    size?: BadgeSize;
    interactive?: boolean;
    caps?: boolean;
    className?: string;
}

const base =
    "inline-flex items-center gap-1.5 rounded-lg border";

const sizeClasses: Record<BadgeSize, string> = {
    xs: "px-2 py-0.5 typo-badge-xs",
    sm: "px-2.5 py-0.5 typo-badge-sm",
    md: "px-3 py-1 typo-badge-md",
    lg: "px-4 py-2.5 typo-badge-lg",
};

const toneClasses: Record<BadgeTone, Record<BadgeVariant, string>> = {
    slate: {
        soft: "bg-slate-500/10 border-slate-500/20 text-slate-300",
        solid: "bg-slate-500 text-white border-slate-500",
        outline: "border-slate-500/30 text-slate-300",
        ghost: "bg-transparent border-transparent text-slate-300 hover:bg-white/5",
    },
    emerald: {
        soft: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
        solid: "bg-emerald-400 text-emerald-950 border-emerald-400",
        outline: "border-emerald-500/30 text-emerald-300",
        ghost: "bg-transparent border-transparent text-emerald-300 hover:bg-emerald-500/10",
    },
    teal: {
        soft: "bg-teal-500/10 border-teal-500/20 text-teal-300",
        solid: "bg-teal-400 text-teal-950 border-teal-400",
        outline: "border-teal-500/30 text-teal-300",
        ghost: "bg-transparent border-transparent text-teal-300 hover:bg-teal-500/10",
    },
    cyan: {
        soft: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
        solid: "bg-cyan-400 text-cyan-950 border-cyan-400",
        outline: "border-cyan-500/30 text-cyan-300",
        ghost: "bg-transparent border-transparent text-cyan-300 hover:bg-cyan-500/10",
    },
    blue: {
        soft: "bg-blue-500/10 border-blue-500/20 text-blue-300",
        solid: "bg-blue-400 text-blue-950 border-blue-400",
        outline: "border-blue-500/30 text-blue-300",
        ghost: "bg-transparent border-transparent text-blue-300 hover:bg-blue-500/10",
    },
    indigo: {
        soft: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
        solid: "bg-indigo-400 text-indigo-950 border-indigo-400",
        outline: "border-indigo-500/30 text-indigo-300",
        ghost: "bg-transparent border-transparent text-indigo-300 hover:bg-indigo-500/10",
    },
    purple: {
        soft: "bg-purple-500/10 border-purple-500/20 text-purple-300",
        solid: "bg-purple-400 text-purple-950 border-purple-400",
        outline: "border-purple-500/30 text-purple-300",
        ghost: "bg-transparent border-transparent text-purple-300 hover:bg-purple-500/10",
    },
    rose: {
        soft: "bg-rose-500/10 border-rose-500/20 text-rose-300",
        solid: "bg-rose-400 text-rose-950 border-rose-400",
        outline: "border-rose-500/30 text-rose-300",
        ghost: "bg-transparent border-transparent text-rose-300 hover:bg-rose-500/10",
    },
    amber: {
        soft: "bg-amber-500/10 border-amber-500/20 text-amber-300",
        solid: "bg-amber-400 text-amber-950 border-amber-400",
        outline: "border-amber-500/30 text-amber-300",
        ghost: "bg-transparent border-transparent text-amber-300 hover:bg-amber-500/10",
    },
    neutral: {
        soft: "bg-white/5 border-white/10 text-neutral-300",
        solid: "bg-white text-black border-white",
        outline: "border-white/20 text-neutral-300",
        ghost: "bg-transparent border-transparent text-neutral-300 hover:bg-white/5",
    },
};

export function badgeStyles({
    tone = "neutral",
    variant = "soft",
    size = "sm",
    interactive = false,
    caps = true,
    className,
}: BadgeStyleOptions = {}) {
    return cn(
        base,
        sizeClasses[size],
        toneClasses[tone][variant],
        caps ? "uppercase" : "normal-case",
        interactive && "transition-colors cursor-pointer",
        className
    );
}

export function Badge({
    tone = "neutral",
    variant = "soft",
    size = "sm",
    caps = true,
    className,
    children,
}: BadgeStyleOptions & { children: React.ReactNode }) {
    return (
        <span className={badgeStyles({ tone, variant, size, caps, className })}>
            {children}
        </span>
    );
}
