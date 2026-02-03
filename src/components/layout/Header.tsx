"use client";

import { useState } from "react";
import { Link, usePathname } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/SiteNavbar";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "简体中文", flag: "🇨🇳" },
  { code: "zh-Hant", label: "繁體中文", flag: "🇭🇰" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false); // Added new state
  const [langHovered, setLangHovered] = useState<number | null>(null);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { name: t('product'), link: "/" },
    { name: t('pricing'), link: "/pricing" },
    { name: t('roadmap'), link: "/roadmap" },
    { name: t('vision'), link: "/vision" },
    { name: t('blog'), link: "/blog" },
    { name: t('downloads'), link: "/#downloads" },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="hidden lg:flex">
        <NavbarLogo />

        {/* Center: Nav Items OR Language Selection */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            {isLangOpen ? (
              <motion.div
                key="lang-select"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-1"
                onMouseLeave={() => setLangHovered(null)}
              >
                {languages.map((lang, idx) => {
                  const isActive = locale === lang.code;
                  const isHovered = langHovered === idx;
                  const showHighlight = isHovered || (langHovered === null && isActive);

                  return (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code}
                      onClick={() => setIsLangOpen(false)}
                      onMouseEnter={() => setLangHovered(idx)}
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-2 rounded-2xl typo-body-sm-strong transition-colors",
                        showHighlight ? "text-white" : "text-neutral-400"
                      )}
                    >
                      {showHighlight && (
                        <motion.div
                          layoutId="lang-pill"
                          className={cn(
                            "absolute inset-0 h-full w-full rounded-2xl bg-white/10",
                            isActive && !isHovered && "bg-white/5"
                          )}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      <span className="typo-flag leading-none relative z-10">{lang.flag}</span>
                      <span className="relative z-10">{lang.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="nav-items"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <NavItems items={navItems} className="static translate-x-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-20 flex items-center gap-4">
          {/* Desktop Lang Switcher Toggle */}
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={cn(
              "relative flex items-center justify-center p-2 rounded-2xl transition-colors typo-flag-button h-10 w-10",
              isLangOpen ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            {isLangOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <span className="leading-none relative z-20">{currentLang.flag}</span>
            )}
          </button>

          <NavbarButton href="/login" variant="primary">
            {t('signup')}
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader className="relative flex items-center h-full">
          {/* Unified Dynamic Spacing Area */}
          <div className="flex-1 flex items-center min-w-0 relative h-full">
            {/* Logo Area */}
            <div className={cn(
              "transition-all duration-300 transform origin-left shrink-0",
              isMobileLangOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
            )}>
              <NavbarLogo />
            </div>

            {/* Unified Language & Toggle List */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-end px-0">
              {isMobileLangOpen ? (
                <div
                  className={cn(
                    "flex items-center justify-between w-full h-full",
                    "overflow-x-auto no-scrollbar",
                    "pl-1"
                  )}
                >
                  {/* All Flags - F1 anchors to Logo's left edge via justify-between */}
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code}
                      onClick={() => setIsMobileLangOpen(false)}
                      className={cn(
                        "flex items-center justify-center rounded-2xl transition-all shrink-0",
                        "w-[clamp(2.1rem,9vw,2.3rem)] h-[clamp(2.1rem,9vw,2.3rem)]",
                        locale === lang.code
                          ? "bg-white/10 text-white"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      <span className="typo-flag-responsive">{lang.flag}</span>
                    </Link>
                  ))}

                  <button
                    onClick={() => setIsMobileLangOpen(false)}
                    className={cn(
                      "flex items-center justify-center transition-all shrink-0",
                      "w-[clamp(2.1rem,9vw,2.3rem)] h-[clamp(2.1rem,9vw,2.3rem)]",
                      "text-white"
                    )}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-1 items-center justify-end w-full h-full"
                >
                  <button
                    onClick={() => {
                      setIsMobileLangOpen(true);
                      setIsMobileMenuOpen(false); // Close menu when opening lang switcher
                    }}
                    className={cn(
                      "flex items-center justify-center rounded-2xl transition-all",
                      "w-[clamp(2.1rem,9vw,2.3rem)] h-[clamp(2.1rem,9vw,2.3rem)]",
                      "text-neutral-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="typo-flag-responsive">{currentLang.flag}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Right Control Group */}
          <div className="shrink-0 relative z-20 ml-2">
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (!isMobileMenuOpen) setIsMobileLangOpen(false); // Close lang switcher when opening menu
              }}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
        >
          {navItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative flex w-full items-center gap-3 text-neutral-400 hover:text-white"
            >
              <span className="typo-body-lg-strong">{item.name}</span>
            </Link>
          ))}
          <div className="flex w-full flex-col gap-4 pt-4">
            <NavbarButton
              href="/login"
              variant="primary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('signup')}
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
