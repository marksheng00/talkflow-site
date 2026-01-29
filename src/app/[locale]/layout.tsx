import type { Metadata } from "next";
import { Outfit, Hanken_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { locales, Locale } from "@/i18n/config";
import "../globals.css";
import FluentBackground from "@/components/ui/FluentBackground";
import PresenceTracker from "@/components/realtime/PresenceTracker";

const heading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: ["AI English Speaking", "IELTS Practice", "TOEFL Speaking", "English Fluency", "AI Coach", "Language Learning"],
    metadataBase: new URL("https://talkflo.hicall.ai"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: "https://talkflo.hicall.ai",
      siteName: "talkflo",
      locale: locale === 'zh' ? 'zh_CN' : locale === 'zh-Hant' ? 'zh_TW' : locale === 'ko' ? 'ko_KR' : locale === 'es' ? 'es_ES' : locale === 'ja' ? 'ja_JP' : 'en_US',
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "talkflo - Real-time AI Speaking Coach",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages in layout:', error);
    messages = {};
  }

  return (
    <html lang={locale}>
      <body className={`${heading.variable} ${body.variable} antialiased overflow-x-hidden`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FluentBackground />
          <PresenceTracker />
          <div className="relative z-10 min-h-screen bg-transparent text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
