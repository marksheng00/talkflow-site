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
  title: "TalkFlow | Real-time AI Speaking Coach & Conversation Practice",
  description:
    "TalkFlow helps you become fluent faster with live AI role-play, instant feedback, and a roadmap of upcoming features.",
  metadataBase: new URL("https://talkflow.hicall.ai"),
  openGraph: {
    title: "TalkFlow | Real-time AI Speaking Coach & Conversation Practice",
    description:
      "AI-powered English practice that feels like a real conversation. Instant feedback, adaptive role-play, and a transparent roadmap.",
    url: "https://talkflow.hicall.ai",
    siteName: "TalkFlow",
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
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <FluentBackground />
        <div className="relative z-10 min-h-screen bg-transparent text-slate-100 selection:bg-emerald-500/30">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
