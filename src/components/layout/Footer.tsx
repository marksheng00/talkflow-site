"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import packageJson from "../../../package.json";
import { useTranslations } from "next-intl";

const columnsRaw = [
  {
    title: "Product",
    items: [
      { label: "talkflo Overview", href: "/" },
      { label: "IELTS Killer", href: "/ielts" },
      { label: "Roadmap Visual", href: "/roadmap" },
      { label: "Ideas Feedback", href: "/roadmap#ideas" },
      { label: "Bugs Feedback", href: "/roadmap#bugs" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Vision", href: "/vision" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faq" },
      { label: "Support", href: "mailto:support@talkflo.ai" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
  {
    title: "Downloads",
    items: [
      { label: "Talkflo iOS App", href: "https://apps.apple.com/us/app/talkflo-speak-english-better/id6746321404" },
      { label: "Talkflo Android App", href: "https://play.google.com/store/apps/details?id=io.aigaia.talkflo" },
    ],
  },
  {
    title: "Follow US",
    items: [
      { label: "Facebook", href: "https://facebook.com/talkflo" },
      { label: "Instagram", href: "https://instagram.com/talkflo" },
      { label: "TikTok", href: "https://tiktok.com/@talkflo" },
      { label: "Twitter", href: "https://twitter.com/talkflo" },
      { label: "Xiaohongshu", href: "https://xiaohongshu.com" },
      { label: "YouTube", href: "https://youtube.com/@talkflo" },
    ],
  },
];

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-white/10">
      <div className="section-shell grid grid-cols-2 gap-10 py-12 md:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-4 col-span-2 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-1.5">
            <Image
              src="/talkflo_logo.png"
              alt="talkflo Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-2xl object-contain block"
            />
            <div className="flex items-center gap-2">
              <p className="typo-h4 text-white">
                talkflo
              </p>
            </div>
          </div>
          <Link
            href="/changelog"
            className="inline-block px-2 py-0.5 typo-caption rounded-lg bg-slate-800/50 text-neutral-400 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            aria-label="View Changelog"
          >
            v{packageJson.version}
          </Link>
        </div>
        {columnsRaw.map((column) => (
          <div key={column.title}>
            <p className="mb-4 typo-label text-neutral-400">
              {t(`columns.${column.title}`)}
            </p>
            <div className="space-y-3 typo-body-sm text-slate-200">
              {column.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block transition hover:text-white"
                >
                  {t(`items.${item.label}`)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-4">
        <div className="section-shell typo-body-sm text-slate-500">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
