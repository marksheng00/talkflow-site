"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import packageJson from "../../../package.json";
import { useTranslations } from "next-intl";

const columnsRaw = [
  {
    title: "Product",
    items: [
      { label: "Voice role-play", href: "#product" },
      { label: "AI feedback", href: "#benefits" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Vision", href: "/vision" },
      { label: "Careers", href: "mailto:hello@talkflo.ai" },
      { label: "Support", href: "mailto:support@talkflo.ai" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "talkflo community", href: primaryCommunity() },
      { label: "Press", href: "mailto:press@talkflo.ai" },
      { label: "Privacy", href: "#" },
    ],
  },
];

function primaryCommunity() {
  return "https://talkflo.hicall.ai/callout-lite/en/talkflo";
}

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-white/10">
      <div className="section-shell grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <Image
              src="/talkflo_logo.png"
              alt="talkflo Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain block"
            />
            <div className="flex items-center gap-2">
              <p className="font-heading text-xl font-bold tracking-wide text-white">
                talkflo
              </p>
              <Link
                href="/changelog"
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
                aria-label="View Changelog"
              >
                v{packageJson.version}
              </Link>
            </div>
          </div>
        </div>
        {columnsRaw.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              {t(`columns.${column.title}`)}
            </p>
            <div className="space-y-3 text-sm text-slate-200">
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
        <div className="section-shell text-xs text-slate-500">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
