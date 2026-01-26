"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";
import {
    LayoutDashboard, Map, Lightbulb, Bug, FileText,
    ExternalLink, LogOut, Loader2
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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const isLoginPage = pathname?.includes("/admin/login"); // Verify user is whitelisted

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
                <body className="bg-[#09090b] flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
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
            <body className="bg-[#09090b] antialiased">
                <div className="flex min-h-screen text-zinc-300 font-sans selection:bg-indigo-500/20">
                    {/* Sidebar */}
                    <aside className="w-[240px] border-r border-white/[0.04] flex flex-col bg-[#09090b] sticky top-0 h-screen z-50">
                        {/* Header */}
                        <div className="h-14 flex items-center px-4 border-b border-white/[0.04]">
                            <div className="flex items-center gap-2.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/talkflo_logo.png" alt="talkflo" className="w-6 h-6 object-contain" />
                                <span className="text-[13px] font-semibold tracking-tight text-zinc-100">talkflo Admin</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
                            <p className="px-2 pb-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Platform</p>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-all duration-200 group ${isActive
                                            ? "bg-zinc-900 text-zinc-100 font-medium"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? "text-zinc-100" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                                        <span className="text-[13px]">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="mt-6 pt-4 border-t border-white/[0.04]">
                                <p className="px-2 pb-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">External</p>
                                <a
                                    href="http://localhost:3333"
                                    target="_blank"
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 transition-all duration-200 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                                    <span className="text-[13px]">Sanity Studio</span>
                                </a>
                            </div>
                        </nav>

                        {/* User Footer */}
                        <div className="p-2 border-t border-white/[0.04] bg-[#09090b]">
                            <div className="px-2 py-2 rounded-md hover:bg-zinc-900/50 flex items-center gap-3 transition-colors group cursor-default">
                                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className="text-[12px] font-medium text-zinc-300 truncate group-hover:text-white transition-colors">Admin User</p>
                                    <p className="text-[10px] text-zinc-600 truncate font-mono">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 -mr-1 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                                    title="Sign out"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 bg-[#09090b] flex flex-col">
                        {/* Optional Topbar or Breadcrumb could go here */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Pro-tip: Add max-width constraint for readability if content assumes it, but for dashboards full width is often better */}
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
