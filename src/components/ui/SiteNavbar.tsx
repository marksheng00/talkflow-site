"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { AuroraBackground } from "./AuroraBackground";

interface NavItem {
    name: string;
    link: string;
    icon?: React.ReactNode;
}

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: NavItem[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

interface MobileNavToggleProps {
    isOpen: boolean;
    onClick: () => void;
}

interface NavbarButtonProps {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
                    : child
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    const blurValue = visible ? "blur(12px)" : "blur(0px)";

    return (
        <motion.div
            animate={{
                backdropFilter: blurValue,
                boxShadow: visible
                    ? "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.04)"
                    : "none",
                width: visible ? "auto" : "100%",
                y: visible ? 20 : 0,
            }}
            style={{ WebkitBackdropFilter: blurValue }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative mx-auto flex max-w-7xl items-center justify-between self-start rounded-2xl bg-transparent px-6 py-3 lg:px-10 lg:py-3",
                visible
                    ? "bg-white/10 border border-white/20 min-w-[600px] gap-8 shadow-lg backdrop-blur-xl backdrop-saturate-150"
                    : "backdrop-blur-none",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute left-1/2 -translate-x-1/2 hidden flex-row items-center gap-2 text-sm font-medium text-neutral-400 lg:flex",
                className
            )}
        >
            {items.map((item, idx) => (
                <Link
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className="relative flex items-center gap-2 px-4 py-2 text-neutral-400 transition-colors hover:text-white"
                    key={item.link}
                    href={item.link}
                >
                    {hovered === idx && (
                        <motion.div
                            layoutId="hovered"
                            className="absolute inset-0 h-full w-full rounded-lg bg-white/10"
                        />
                    )}
                    {item.icon && <span className="relative z-20 h-4 w-4">{item.icon}</span>}
                    <span className="relative z-20">{item.name}</span>
                </Link>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    const blurValue = visible ? "blur(12px)" : "blur(0px)";

    return (
        <motion.div
            animate={{
                backdropFilter: blurValue,
                boxShadow: visible
                    ? "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.04)"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "16px" : "0px",
                paddingLeft: visible ? "16px" : "0px",
                borderRadius: visible ? "24px" : "2rem",
                y: visible ? 12 : 0,
            }}
            style={{ WebkitBackdropFilter: blurValue }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden",
                visible
                    ? "bg-white/10 border border-white/20 shadow-lg backdrop-blur-xl backdrop-saturate-150"
                    : "backdrop-blur-none",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 50,
                    }}
                    className={cn(
                        "absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#020617] border border-white/10 shadow-2xl overflow-hidden",
                        className
                    )}
                    id="mobile-nav-menu-aurora-v2"
                >
                    <div className="absolute inset-0 z-0">
                        <AuroraBackground className="h-full w-full opacity-50 pointer-events-none">
                            {/* No children needed, just background */}
                        </AuroraBackground>
                    </div>

                    <div className="relative z-10 flex w-full flex-col items-start justify-start gap-4 px-6 py-6">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export const MobileNavToggle = ({ isOpen, onClick }: MobileNavToggleProps) => {
    return isOpen ? (
        <X className="h-6 w-6 text-white cursor-pointer" onClick={onClick} />
    ) : (
        <Menu className="h-6 w-6 text-white cursor-pointer" onClick={onClick} />
    );
};

export const NavbarLogo = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center gap-2.5 py-1 text-sm font-normal text-white"
        >
            <Image
                src="/talkflow_logo.png"
                alt="TalkFlow Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="font-bold text-white tracking-wide text-xl">TalkFlow</span>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    children,
    className,
    variant = "primary",
    ...props
}: NavbarButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    // Increased consistency: uniform padding structure
    // Primary: slightly more horizontal padding (px-6) for prominent CTAfeel
    // Buttons match h-9 (36px) to h-10 (40px) visual range 
    const baseStyles =
        "relative z-20 flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95";

    const variantStyles = {
        primary:
            "bg-white !text-black font-bold hover:bg-slate-50 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
        secondary:
            "bg-white/5 border border-white/10 text-white hover:bg-white/15",
        dark: "bg-black text-white border border-white/10 hover:bg-neutral-900",
        gradient:
            "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90",
    };

    if (href) {
        return (
            <Link
                href={href}
                className={cn(baseStyles, variantStyles[variant], className)}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={cn(baseStyles, variantStyles[variant], className)}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
};
