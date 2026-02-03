import { cn } from "@/lib/utils";
import React from "react";

type FieldTone = "emerald" | "rose" | "neutral";
type FieldVariant = "glass" | "transparent" | "admin";

interface FieldProps {
    label?: string;
    htmlFor?: string;
    hint?: string;
    className?: string;
    labelClassName?: string;
    hintClassName?: string;
    children: React.ReactNode;
}

const toneClasses: Record<FieldTone, string> = {
    emerald: "focus:border-emerald-500/50 focus:bg-white/[0.07]",
    rose: "focus:border-rose-500/50 focus:bg-white/[0.07]",
    neutral: "focus:border-white/20",
};

const variantClasses: Record<FieldVariant, string> = {
    glass: "bg-white/5 border border-white/10 text-white placeholder:text-slate-600",
    transparent: "bg-transparent border border-white/10 text-white placeholder:text-slate-500",
    admin: "bg-zinc-900 border border-white/[0.08] text-white placeholder:text-zinc-600",
};

const baseInput =
    "w-full rounded-2xl px-4 py-3 outline-none transition-all";

export function Field({
    label,
    htmlFor,
    hint,
    className,
    labelClassName,
    hintClassName,
    children,
}: FieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className={cn(
                        "typo-label text-slate-500",
                        labelClassName
                    )}
                >
                    {label}
                </label>
            )}
            {children}
            {hint && (
                <p className={cn("typo-body-sm text-slate-500", hintClassName)}>
                    {hint}
                </p>
            )}
        </div>
    );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    tone?: FieldTone;
    variant?: FieldVariant;
};

export function Input({
    tone = "neutral",
    variant = "glass",
    className,
    ...props
}: InputProps) {
    return (
        <input
            className={cn(
                baseInput,
                variantClasses[variant],
                toneClasses[tone],
                className
            )}
            {...props}
        />
    );
}

export type TextareaProps =
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        tone?: FieldTone;
        variant?: FieldVariant;
    };

export function Textarea({
    tone = "neutral",
    variant = "glass",
    className,
    ...props
}: TextareaProps) {
    return (
        <textarea
            className={cn(
                baseInput,
                variantClasses[variant],
                toneClasses[tone],
                className
            )}
            {...props}
        />
    );
}
