"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
    LayoutDashboard, Map, Lightbulb, Bug, FileText,
    ExternalLink, LogOut, Loader2, ShieldCheck
} from "lucide-react";
import "@/app/globals.css";

// ADMIN WHITELIST
const ADMIN_EMAILS = [
    "markshengcn@gmail.com", // Add your verified email here
    "admin@talkflow.ai"
];

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const isLoginPage = pathname?.includes("/admin/login");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                if (!isLoginPage) {
                    router.push("/admin/login");
                }
                setLoading(false);
            } else {
                const userEmail = session.user.email;
                if (!ADMIN_EMAILS.includes(userEmail || "")) {
                    // Not an admin
                    await supabase.auth.signOut();
                    router.push("/admin/login?error=unauthorized");
                    setLoading(false);
                } else {
                    setUser(session.user);
                    if (isLoginPage) {
                        router.push("/admin/roadmap");
                    }
                    setLoading(false);
                }
            }
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && !isLoginPage) {
                router.push("/admin/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [isLoginPage, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <html lang="en">
                <body className="bg-slate-950 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-slate-500 text-sm font-medium animate-pulse tracking-widest uppercase">Securing Session</p>
                    </div>
                </body>
            </html>
        );
    }

    // Don't show sidebar on login page
    if (isLoginPage) {
        return <html lang="en"><body>{children}</body></html>;
    }

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Roadmap", href: "/admin/roadmap", icon: Map },
        { name: "Ideas", href: "/admin/ideas", icon: Lightbulb },
        { name: "Bugs", href: "/admin/bugs", icon: Bug },
        { name: "Changelog", href: "/admin/changelog", icon: FileText },
    ];

    return (
        <html lang="en" className="dark">
            <body className="bg-slate-950">
                <div className="flex min-h-screen text-white font-sans selection:bg-indigo-500/30">
                    {/* Sidebar */}
                    <aside className="w-64 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-3xl sticky top-0 h-screen">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">TalkFlow Admin</span>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                            ? "bg-indigo-500/10 text-indigo-400 font-bold"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="pt-4 mt-4 border-t border-white/5">
                                <p className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">External Tools</p>
                                <a
                                    href="http://localhost:3333"
                                    target="_blank"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all group"
                                >
                                    <ExternalLink className="w-5 h-5 group-hover:stroke-emerald-400" />
                                    <span className="text-sm font-medium">Sanity Studio</span>
                                </a>
                            </div>
                        </nav>

                        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 relative group overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 bg-[#020202]">
                        <div className="p-10 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
