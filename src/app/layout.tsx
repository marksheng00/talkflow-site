import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    "talkflo helps you become fluent faster with live AI role-play, instant feedback, and a roadmap of upcoming features.",
  metadataBase: new URL("https://talkflo.hicall.ai"),
  openGraph: {
    title: "talkflo | Real-time AI Speaking Coach & Conversation Practice",
    description:
      "AI-powered English practice that feels like a real conversation. Instant feedback, adaptive role-play, and a transparent roadmap.",
    url: "https://talkflo.hicall.ai",
    siteName: "talkflo",
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
          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
