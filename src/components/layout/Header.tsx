"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Product", link: "/#product" },
  { name: "Pricing", link: "/pricing" },
  { name: "Roadmap", link: "/roadmap" },
  { name: "Downloads", link: "/#downloads" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="hidden lg:flex">
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="relative z-20 flex items-center gap-4">
          <NavbarButton href="/login" variant="secondary">
            Login
          </NavbarButton>
          <NavbarButton href="/signup" variant="primary">
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative w-full text-neutral-400 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex w-full flex-col gap-4 pt-4">
            <NavbarButton
              href="/login"
              variant="secondary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavbarButton>
            <NavbarButton
              href="/signup"
              variant="primary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
