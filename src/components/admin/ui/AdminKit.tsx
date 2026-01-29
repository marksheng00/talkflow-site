import { cn } from "@/lib/utils";
import { ChevronDown, Search, Loader2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface AdminHeaderProps {
    title: React.ReactNode;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function AdminHeader({ title, description, children, className }: AdminHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                    {typeof title === 'string' ? (
                        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                    ) : (
                        title
                    )}
                </div>
                {description && <p className="text-zinc-500 text-sm">{description}</p>}
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

interface AdminContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminContainer({ children, className }: AdminContainerProps) {
    return (
        <div className={cn("p-6 space-y-4 animate-in fade-in duration-700 flex-1 flex flex-col min-h-0 overflow-hidden", className)}>
            {children}
        </div>
    );
}

interface AdminDetailHeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
    children?: React.ReactNode;
    className?: string;
}

export function AdminDetailHeader({ title, subtitle, onBack, children, className }: AdminDetailHeaderProps) {
    return (
        <div className={cn("h-16 flex items-center justify-between px-6 bg-[#0c0c0e] shrink-0 border-b border-white/[0.05]", className)}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                >
                    <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold text-zinc-100 line-clamp-1 max-w-md">
                        {title}
                    </h2>
                    {subtitle && (
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter leading-none">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

interface AdminBadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'emerald' | 'rose' | 'amber' | 'blue' | 'zinc' | 'purple';
    className?: string;
    dot?: boolean;
}

export function AdminBadge({ children, variant = 'primary', className, dot }: AdminBadgeProps) {
    const variants = {
        primary: "bg-white/5 text-white border-white/10",
        secondary: "bg-zinc-900 text-zinc-400 border-white/5",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        zinc: "bg-zinc-800 text-zinc-400 border-zinc-700",
    };

    const dots = {
        primary: "bg-white",
        secondary: "bg-zinc-500",
        emerald: "bg-emerald-400",
        rose: "bg-rose-400",
        amber: "bg-amber-400",
        blue: "bg-blue-400",
        purple: "bg-purple-400",
        zinc: "bg-zinc-500",
    };

    return (
        <span className={cn(
            "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit",
            variants[variant],
            className
        )}>
            {dot && <span className={cn("w-1 h-1 rounded-full animate-pulse", dots[variant])} />}
            {children}
        </span>
    );
}

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    loading?: boolean;
    children?: React.ReactNode;
}

export function AdminButton({
    variant = 'primary',
    size = 'md',
    icon,
    loading,
    children,
    className,
    disabled,
    ...props
}: AdminButtonProps) {
    const variants = {
        primary: "bg-zinc-100 hover:bg-white text-black font-bold shadow-lg",
        secondary: "bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-zinc-100 hover:border-white/20 shadow-sm",
        danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20",
        ghost: "hover:bg-white/5 text-zinc-500 hover:text-white",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-[10px] gap-1.5",
        md: "px-4 py-2 text-xs gap-2",
        lg: "px-6 py-3 text-sm gap-2.5",
    };

    return (
        <button
            className={cn(
                "rounded-lg transition-all flex items-center justify-center font-bold uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
            {children}
        </button>
    );
}

interface AdminSearchProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
    size?: 'sm' | 'md';
}

export function AdminSearch({ placeholder, onSearch, className, size = 'md' }: AdminSearchProps) {
    const paddings = size === 'sm' ? "py-1.5" : "py-2";
    const textSizes = size === 'sm' ? "text-[10px]" : "text-xs";

    return (
        <div className={cn("relative group", className)}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-zinc-100 transition-colors">
                <Search className="w-4 h-4" />
            </div>
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                onChange={(e) => onSearch(e.target.value)}
                className={cn(
                    "block w-full pl-9 pr-4 bg-zinc-900 border border-white/[0.08] rounded-lg font-bold uppercase tracking-tight text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-zinc-800 transition-all shadow-sm",
                    paddings,
                    textSizes
                )}
            />
        </div>
    );
}

interface AdminStatusSelectorProps<T extends string> {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}

export function AdminStatusSelector<T extends string>({ value, options, onChange, className, size = 'md' }: AdminStatusSelectorProps<T>) {
    const paddings = size === 'sm' ? "py-1.5" : "py-2";
    const textSizes = size === 'sm' ? "text-[10px]" : "text-xs";

    return (
        <div className={cn("relative w-fit min-w-[200px]", className)}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className={cn(
                    "appearance-none block w-full bg-zinc-900 border border-white/[0.08] rounded-lg px-4 pr-10 font-bold text-zinc-100 focus:outline-none focus:border-white/20 transition-all cursor-pointer shadow-sm uppercase tracking-tight",
                    paddings,
                    textSizes
                )}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white font-bold uppercase">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500 border-l border-white/5 ml-2 pl-2">
                <ChevronDown className="w-3.5 h-3.5" />
            </div>
        </div>
    );
}

interface AdminSegmentedControlProps<T extends string> {
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function AdminSegmentedControl<T extends string>({ options, value, onChange, className }: AdminSegmentedControlProps<T>) {
    return (
        <div className={cn("flex bg-black p-0.5 rounded-xl border border-white/[0.05] shadow-inner", className)}>
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "px-4 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap",
                            isActive
                                ? "bg-zinc-100 text-black shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
                                : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    className?: string;
}

export function AdminPagination({ currentPage, totalPages, onPageChange, totalItems, className }: AdminPaginationProps) {
    if (totalItems === 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        const gap = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - gap && i <= currentPage + gap)) {
                pages.push(i);
            } else if (i === currentPage - gap - 1 || i === currentPage + gap + 1) {
                pages.push('...');
            }
        }
        return [...new Set(pages)];
    };

    return (
        <div className={cn("flex items-center justify-between px-4 py-3 border-t border-white/[0.05] bg-black/5 shrink-0", className)}>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {totalItems} <span className="opacity-50">Results</span>
                </span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((p, i) => (
                        p === '...' ? (
                            <span key={`gap-${i}`} className="px-2 text-[10px] text-zinc-600 font-bold">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p as number)}
                                className={cn(
                                    "min-w-[28px] h-7 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                                    currentPage === p
                                        ? "bg-zinc-100 text-black shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
