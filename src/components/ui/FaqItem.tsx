import { cn } from "@/lib/utils";

type FaqSize = "md" | "lg";

interface FaqItemProps {
    question: string;
    answer: string;
    size?: FaqSize;
    className?: string;
    summaryClassName?: string;
    bodyClassName?: string;
    iconClassName?: string;
}

const sizeClasses: Record<FaqSize, { details: string; summary: string; body: string }> = {
    md: {
        details: "p-6",
        summary: "typo-body-strong text-white",
        body: "typo-body text-neutral-400",
    },
    lg: {
        details: "p-8",
        summary: "typo-title text-white",
        body: "typo-body-lg text-neutral-400",
    },
};

export function FaqItem({
    question,
    answer,
    size = "md",
    className,
    summaryClassName,
    bodyClassName,
    iconClassName,
}: FaqItemProps) {
    const sizeStyle = sizeClasses[size];

    return (
        <details
            className={cn(
                "group rounded-3xl border border-white/10 bg-white/5 transition-all hover:bg-white/10",
                sizeStyle.details,
                className
            )}
        >
            <summary
                className={cn(
                    "flex cursor-pointer items-start justify-between gap-4 list-none",
                    sizeStyle.summary,
                    summaryClassName
                )}
            >
                <span>{question}</span>
                <span
                    className={cn(
                        "transition-transform group-open:rotate-45 typo-symbol leading-none",
                        iconClassName || "text-emerald-200"
                    )}
                >
                    +
                </span>
            </summary>
            <div className={cn("mt-4 pr-8", sizeStyle.body, bodyClassName)}>
                {answer}
            </div>
        </details>
    );
}
