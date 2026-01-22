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
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
        if (latest > 10) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            // Ensure Navbar has a high z-index to stay above the portal overlay if top-aligned
            className={cn("fixed inset-x-0 top-0 z-[60] w-full", className)}
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

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
    isMenuOpen?: boolean;
}



export const MobileNav = ({ children, className, visible, isMenuOpen }: MobileNavProps) => {
    const blurValue = (visible || isMenuOpen) ? "blur(12px)" : "blur(0px)";

    // When menu is open, force the navbar to be "full width" and "top aligned" (reset to default state)
    // regardless of scroll position. This ensures the menu panel aligns perfectly with the header.
    const isPillState = visible && !isMenuOpen;

    return (
        <motion.div
            animate={{
                backdropFilter: blurValue,
                boxShadow: isPillState
                    ? "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.04)"
                    : "none",
                width: isPillState ? "92%" : "100%",
                paddingRight: isPillState ? "16px" : "16px", // Keep padding consistent or adjust if needed
                paddingLeft: isPillState ? "16px" : "16px",
                borderRadius: isPillState ? "24px" : "0px",
                y: isPillState ? 12 : 0,
            }}
            style={{ WebkitBackdropFilter: blurValue }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden",
                isPillState
                    ? "bg-white/10 border border-white/20 shadow-lg backdrop-blur-xl backdrop-saturate-150"
                    : "backdrop-blur-none", // You might want a background when menu is open?
                className,
                // When menu is open, we might want to enforce a background so the navbar text is legible 
                // against the page content if it's transparent. 
                isMenuOpen && "bg-[#020617]"
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
    onClose,
}: MobileNavMenuProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // "Perfect" Implementation using Portal for EVERYTHING that pops out.
    // 1. Navbar stays in its own stacking context (z-60).
    // 2. Portal renders directly to body (z-50).
    // 3. Inside Portal:
    //    a. Backdrop: fixed top-[72px] inset-x/bottom z-[30] (Below menu)
    //    b. Menu: fixed top-[84px] z-[50] (Above backdrop)
    // This allows the backdrop to blur the page content starting below the navbar,
    // while the menu sits cleanly on top of the backdrop.
    // Navbar visual region is NOT covered by the backdrop because backdrop starts at top-72px.

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[50] lg:hidden pointer-events-none">
                    {/* 
                       Backdrop Overlay 
                       - Starts below the navbar (top-[72px]) to avoid blurring/covering the logo
                       - pointer-events-auto so it catches clicks
                    */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-[72px] inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* 
                       Menu Panel
                       - Positioned fixed relative to viewport, mimicking 'absolute' placement
                       - Starts slightly below the overlay start for spacing (top-[84px])
                       - pointer-events-auto so the menu itself is interactive
                    */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 30,
                        }}
                        className={cn(
                            "fixed left-4 right-4 top-[84px] z-[60] rounded-3xl bg-[#020617] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden max-h-[70vh] flex flex-col pointer-events-auto",
                            className
                        )}
                    >
                        <div className="absolute inset-0 z-0">
                            <AuroraBackground className="h-full w-full opacity-30 pointer-events-none" />
                        </div>

                        <div className="relative z-10 flex w-full flex-col items-start justify-start gap-4 px-6 py-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
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
            className="relative z-20 flex items-center gap-1.5 py-1 text-sm font-normal text-white"
        >
            <Image
                src="/talkflo_logo.png"
                alt="talkflo Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="font-bold text-white tracking-wide text-xl">talkflo</span>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    children,
    className,
    variant = "primary",
    as,
    ...props
}: NavbarButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
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
                {...props}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={cn(baseStyles, variantStyles[variant], className)}
            {...(props as any)}
        >
            {children}
        </button>
    );
};
