import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "talkflo | Real-time AI Speaking Coach & Conversation Practice",
  description:
    "Master English fluency with talkflo. Real-time AI role-play, instant pronunciation feedback, and professional coaching for IELTS, TOEFL and job interviews.",
  keywords: ["AI English Speaking", "IELTS Practice", "TOEFL Speaking", "English Fluency", "AI Coach", "Language Learning"],
  metadataBase: new URL("https://talkflo.hicall.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "talkflo | Real-time AI Speaking Coach & Conversation Practice",
    description:
      "AI-powered English practice that feels like a real conversation. Instant feedback, adaptive role-play, and a transparent roadmap.",
    url: "https://talkflo.hicall.ai",
    siteName: "talkflo",
    locale: "en_US",
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
    title: "talkflo | Real-time AI Speaking Coach",
    description: "Master English fluency with instant AI feedback. Try talkflo today.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import FluentBackground from "@/components/ui/FluentBackground";

// ... (keep imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased overflow-x-hidden`}>
        <FluentBackground />
        <div className="relative z-10 min-h-screen bg-transparent text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
