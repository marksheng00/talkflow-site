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
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center justify-center p-2 rounded-lg transition-colors text-2xl h-10 w-10",
                    isOpen
                        ? "bg-white/10 text-white"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
                aria-label={`Current language: ${currentLang.label}`}
            >
                <span className="leading-none relative z-20">{currentLang.flag}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute right-0 top-full mt-4 min-w-[160px] rounded-2xl bg-[#0F172A]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] z-50 p-1.5 flex flex-col origin-top-right overflow-hidden"
                    >
                        <div className="flex flex-col gap-0.5">
                            {languages.map((lang) => (
                                <Link
                                    key={lang.code}
                                    href={pathname}
                                    locale={lang.code}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "relative flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                        locale === lang.code
                                            ? "bg-white/10 text-white"
                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    )}
                                    title={lang.label}
                                >
                                    <span className="text-xl leading-none filter drop-shadow-lg">{lang.flag}</span>
                                    <span className="text-sm font-medium tracking-wide">{lang.label}</span>

                                    {locale === lang.code && (
                                        <motion.div
                                            layoutId="active-lang-indicator"
                                            className="absolute inset-0 rounded-xl bg-white/5 border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
