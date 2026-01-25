import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Map, Lightbulb, Bug, FileText, ExternalLink, LogOut } from "lucide-react";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Roadmap", href: "/admin/roadmap", icon: Map },
        { name: "Ideas", href: "/admin/ideas", icon: Lightbulb },
        { name: "Bugs", href: "/admin/bugs", icon: Bug },
        { name: "Changelog", href: "/admin/changelog", icon: FileText },
    ];

    return (
        <html lang="en">
            <body>
                <div className="flex min-h-screen bg-slate-950 text-white font-sans">
                    {/* Sidebar */}
                    <aside className="w-64 border-r border-white/10 flex flex-col bg-slate-900/50">
                        <div className="p-6 border-b border-white/10 flex items-center gap-3">
                            <img src="/talkflo_logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                            <span className="font-bold text-lg">TalkFlo Admin</span>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            ))}

                            <div className="pt-4 mt-4 border-t border-white/10">
                                <p className="px-3 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">External</p>
                                <a
                                    href="http://localhost:3333"
                                    target="_blank"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors group"
                                >
                                    <ExternalLink className="w-5 h-5 group-hover:stroke-emerald-400" />
                                    <span className="font-medium text-sm">Blog CMS (Sanity)</span>
                                </a>
                            </div>
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            {/* Placeholder for User Profile / Logout */}
                            <div className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">A</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">Admin</p>
                                    <p className="text-xs text-slate-500 truncate">admin@talkflo.ai</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
