"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";
import {
    LayoutDashboard, Map, Lightbulb, Bug, FileText,
    LogOut, Loader2, Database, ChevronLeft, ChevronRight, Tag
} from "lucide-react";
import "@/app/globals.css";
import { Outfit, Hanken_Grotesk } from "next/font/google";

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
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("adminSidebarCollapsed") === "true";
        }
        return false;
    });

    const pathname = usePathname();
    const router = useRouter();

    const isLoginPage = pathname?.includes("/admin/login"); // Verify user is whitelisted

    useEffect(() => {
        const checkAuth = async () => {
            // ... (keep auth logic same as before) ...
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
        // ... (keep subscription logic same)
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

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("adminSidebarCollapsed", String(newState));
    };

    if (loading) {
        // ... (keep loading screen)
        return (
            <html lang="en">
                <body className={`${heading.variable} ${body.variable} bg-[#09090b] flex items-center justify-center min-h-screen`}>
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                </body>
            </html>
        );
    }

    // Don't show sidebar on login page
    if (isLoginPage) {
        return <html lang="en"><body className={`${heading.variable} ${body.variable} antialiased`}>{children}</body></html>;
    }

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Roadmap", href: "/admin/roadmap", icon: Map },
        { name: "Ideas", href: "/admin/ideas", icon: Lightbulb },
        { name: "Bugs", href: "/admin/bugs", icon: Bug },
        { name: "Changelog", href: "/admin/changelog", icon: FileText },
        { name: "Blog Posts", href: "/admin/blog", icon: Database },
        { name: "Blog Categories", href: "/admin/categories", icon: Tag },
        // { name: "Studio", href: "/admin/studio", icon: ExternalLink },
    ];

    return (
        <html lang="en" className="dark">
            <body className={`${heading.variable} ${body.variable} bg-[#09090b] antialiased overflow-hidden`}>
                <div className="flex h-screen text-zinc-300 font-sans selection:bg-indigo-500/20 overflow-hidden">
                    {/* Sidebar */}
                    <aside
                        className={`${isCollapsed ? "w-[70px]" : "w-[240px]"
                            } border-r border-white/[0.04] flex flex-shrink-0 flex-col bg-[#09090b] h-full z-50 transition-all duration-300 ease-in-out relative`}
                    >
                        {/* Header */}
                        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-white/[0.04] shrink-0 overflow-hidden`}>
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/talkflo_logo.png" alt="talkflo" className="w-10 h-10 object-contain shrink-0" />
                                {!isCollapsed && (
                                    <div className="flex flex-col leading-tight whitespace-nowrap opacity-100 transition-opacity duration-300">
                                        <span className="text-[16px] font-bold tracking-tight text-white">talkflo</span>
                                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">Admin</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
                            {!isCollapsed && <p className="px-2 pb-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap">Menu</p>}
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={isCollapsed ? item.name : undefined}
                                        target={(item as any).external ? "_blank" : undefined}
                                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-2 py-2 rounded-md transition-all duration-200 group ${isActive
                                            ? "bg-zinc-900 text-zinc-100 font-medium"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-zinc-100" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                                        {!isCollapsed && <span className="text-[13px] whitespace-nowrap">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Toggle Button (Absolute on border) */}
                        <button
                            onClick={toggleSidebar}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#09090b] border border-white/[0.1] rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-50 hover:bg-zinc-800"
                            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
                        >
                            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        </button>

                        {/* User Footer */}
                        <div className={`p-2 border-t border-white/[0.04] bg-[#09090b] shrink-0 overflow-hidden`}>
                            <div className={`px-2 py-2 rounded-md hover:bg-zinc-900/50 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-colors group cursor-default`}>
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <div className="flex-1 min-w-0 overflow-hidden text-left">
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
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 bg-[#09090b] flex flex-col h-full overflow-hidden">
                        {/* Optional Topbar or Breadcrumb could go here */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {children}
                        </div>
                    </main>
                </div>
            </body >
        </html >
    );
}
