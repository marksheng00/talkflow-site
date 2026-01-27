"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/navigation";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "简体中文", flag: "🇨🇳" },
    { code: "zh-Hant", label: "繁體中文", flag: "🇭🇰" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl border transition-all active:scale-90 text-2xl backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.2),0_0_1px_rgba(255,255,255,0.1)]",
                    isOpen
                        ? "bg-white/20 border-white/40"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                )}
                aria-label={`Current language: ${currentLang.label}`}
            >
                <span className="leading-none">{currentLang.flag}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute right-0 mt-3 w-12 rounded-xl bg-white/5 backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 p-1 flex flex-col gap-1.5"
                    >
                        {languages.map((lang) => (
                            <Link
                                key={lang.code}
                                href={pathname}
                                locale={lang.code}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-[10px] text-lg transition-all active:scale-90 relative group",
                                    locale === lang.code
                                        ? "bg-white/15"
                                        : "hover:bg-white/10"
                                )}
                                title={lang.label}
                            >
                                <span className="relative z-10 transition-transform duration-300 group-hover:scale-115">{lang.flag}</span>
                                {locale === lang.code && (
                                    <motion.div
                                        layoutId="active-lang-indicator"
                                        className="absolute inset-0 border border-white/30 rounded-[10px] bg-white/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
