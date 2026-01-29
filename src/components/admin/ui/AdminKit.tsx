import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    description?: string;
    tag?: string;
    children?: React.ReactNode;
    className?: string;
}

export function AdminHeader({ title, description, tag, children, className }: AdminHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-1 pb-2 shrink-0", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                        {title}
                        {tag && (
                            <span className="text-[10px] font-mono text-zinc-500 font-normal px-2 py-0.5 bg-white/5 rounded border border-white/5 uppercase">
                                {tag}
                            </span>
                        )}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {children}
                </div>
            </div>
            {description && (
                <p className="text-sm text-zinc-500 max-w-2xl">{description}</p>
            )}
        </div>
    );
}

interface AdminContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminContainer({ children, className }: AdminContainerProps) {
    return (
        <div className={cn("p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-full flex flex-col", className)}>
            {children}
        </div>
    );
}

interface AdminBadgeProps {
    children: React.ReactNode;
    variant?: "indigo" | "emerald" | "rose" | "zinc" | "amber" | "blue";
    className?: string;
}

export function AdminBadge({ children, variant = "zinc", className }: AdminBadgeProps) {
    const variants = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/10",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/10",
        zinc: "bg-white/5 text-zinc-400 border-white/5",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/10",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    };

    return (
        <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-lg border",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

interface AdminStatusSelectorProps<T extends string> {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
    className?: string;
}

export function AdminStatusSelector<T extends string>({
    value,
    options,
    onChange,
    className,
}: AdminStatusSelectorProps<T>) {
    return (
        <div className={cn("relative group w-32", className)}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="w-full appearance-none bg-white/5 border border-white/5 rounded-lg py-2 pl-3 pr-8 text-[10px] font-bold uppercase tracking-wider text-zinc-400 outline-none hover:border-white/10 cursor-pointer transition-all"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-zinc-300 bg-[#09090b]">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                <ChevronDown className="w-3 h-3 text-zinc-500" />
            </div>
        </div>
    );
}
