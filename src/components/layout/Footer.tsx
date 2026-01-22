import Link from "next/link";
import Image from "next/image";
import packageJson from "../../../package.json";

const columns = [
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
      { label: "About", href: "#about" },
      { label: "Careers", href: "mailto:hello@talkflow.ai" },
      { label: "Support", href: "mailto:support@talkflow.ai" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "TalkFlow community", href: primaryCommunity() },
      { label: "Press", href: "mailto:press@talkflow.ai" },
      { label: "Privacy", href: "#" },
    ],
  },
];

function primaryCommunity() {
  return "https://talkflow.hicall.ai/callout-lite/en/talkflow";
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="section-shell grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/talkflow_logo.png"
              alt="TalkFlow Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain block"
            />
            <div className="flex items-center gap-2">
              <p className="font-heading text-xl font-bold tracking-wide text-white">
                TalkFlow
              </p>
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50 backdrop-blur-sm">
                v{packageJson.version}
              </span>
            </div>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              {column.title}
            </p>
            <div className="space-y-3 text-sm text-slate-200">
              {column.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-4">
        <div className="section-shell text-xs text-slate-500">
          <span>© {new Date().getFullYear()} TalkFlow. A product of BeyondThink LLC. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
