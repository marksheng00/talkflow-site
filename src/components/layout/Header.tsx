"use client";

import { useState } from "react";
// import Link from "next/link"; // Removed in favor of "@/navigation" used inside SiteNavbar or here?
// Wait, Header uses Link directly in MobileNavMenu loop.
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const navItems = [
    { name: t('product'), link: "/" },
    { name: t('pricing'), link: "/pricing" },
    { name: t('roadmap'), link: "/roadmap" },
    { name: t('vision'), link: "/vision" },
    { name: t('blog'), link: "/blog" },
    { name: t('downloads'), link: "/#downloads" },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="hidden lg:flex">
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="relative z-20 flex items-center gap-4">
          <LanguageSwitcher />
          <NavbarButton href="/login" variant="primary">
            {t('signup')}
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              <span className="text-lg font-medium">{item.name}</span>
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
