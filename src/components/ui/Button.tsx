import { cn } from "@/lib/utils";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "gradient"
    | "dark"
    | "danger"
    | "warning"
    | "info"
    | "accent";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export type ButtonWeight = "medium" | "bold";

interface ButtonStyleOptions {
    variant?: ButtonVariant;
    size?: ButtonSize;
    weight?: ButtonWeight;
    fullWidth?: boolean;
    className?: string;
}

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-10 px-4",
    md: "h-12 px-6",
    lg: "h-14 px-8",
    xl: "h-16 px-10",
};

const textClasses: Record<ButtonSize, Record<ButtonWeight, string>> = {
    sm: {
        medium: "typo-button-sm-medium",
        bold: "typo-button-sm",
    },
    md: {
        medium: "typo-button-md-medium",
        bold: "typo-button-md",
    },
    lg: {
        medium: "typo-button-lg-medium",
        bold: "typo-button-lg",
    },
    xl: {
        medium: "typo-button-xl-medium",
        bold: "typo-button-xl",
    },
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-white !text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]",
    secondary:
        "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
    outline: "border border-white/10 text-white hover:bg-white/5",
    gradient:
        "bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] hover:opacity-95",
    dark: "bg-black text-white border border-white/10 hover:bg-neutral-900",
    danger:
        "bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-500",
    warning:
        "bg-amber-600 text-white shadow-lg shadow-amber-900/20 hover:bg-amber-500",
    info:
        "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500",
    accent:
        "bg-teal-500 !text-black shadow-lg shadow-teal-900/20 hover:bg-teal-400",
};

export function buttonStyles({
    variant = "primary",
    size = "md",
    weight = "bold",
    fullWidth = false,
    className,
}: ButtonStyleOptions = {}) {
    return cn(
        baseClasses,
        sizeClasses[size],
        textClasses[size][weight],
        variantClasses[variant],
        fullWidth && "w-full",
        className
    );
}
