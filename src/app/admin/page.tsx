"use client";

import { useState, useEffect } from "react";
import { Bug, Lightbulb, Loader2, Activity, Monitor, User as UserIcon, Globe, Download, RotateCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { AdminContainer, AdminHeader, AdminButton } from "@/components/admin/ui/AdminKit";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type PresenceUser = {
    path: string;
    type: 'admin' | 'user';
    online_at: string;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        ideas: 0,
        bugs: 0,
    });
    const [downloadStats, setDownloadStats] = useState({
        ios: { day: 0, week: 0, month: 0 },
        android: { day: 0, week: 0, month: 0 },
        web: { day: 0, week: 0, month: 0 }
    });


    const [health, setHealth] = useState({
        database: { status: 'checking', latency: 0 },
        cms: { status: 'checking', latency: 0 },
        api: { status: 'checking', latency: 0 }
    });
    const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]); // Detailed presence objects
    const [loading, setLoading] = useState(true);
    const [pulse, setPulse] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // 1. System Health Check Function (Manual)
    const refreshHealth = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            setHealth(data);
            if (data.analytics && data.analytics.downloads) {
                setDownloadStats(data.analytics.downloads);
            }
        } catch (e) {
            console.error("Health check failed", e);
            setHealth({
                database: { status: 'error', latency: 0 },
                cms: { status: 'error', latency: 0 },
                api: { status: 'error', latency: 0 }
            });
        } finally {
            setRefreshing(false);
        }
    };

    // Initial Load
    useEffect(() => {
        refreshHealth();
    }, []);

    // 1. Fetch real DB metrics (Ideas/Bugs/Roadmap) - Analytics handled by Health API now
    useEffect(() => {
        const fetchRealStats = async () => {
            const [ideasRes, bugsRes] = await Promise.all([
                supabaseClient.from("community_ideas").select("id", { count: "exact" }).eq("status", "open"),
                supabaseClient.from("bug_reports").select("id", { count: "exact" }).not("status", "in", '("resolved","wont_fix")'),
            ]);

            setStats({
                ideas: ideasRes.count || 0,
                bugs: bugsRes.count || 0,
            });

            setLoading(false);
        };
        fetchRealStats();

        // 2. REAL-TIME PRESENCE (Global Footprints)
        const channel = supabaseClient.channel('global_presence', {
            config: {
                presence: {
                    key: 'admin-' + Math.random().toString(36).substr(2, 5),
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const users = Object.values(newState).flat() as unknown as PresenceUser[];
                setActiveUsers(users);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        path: '/admin',
                        type: 'admin',
                        online_at: new Date().toISOString()
                    });
                }
            });

        // 3. System Heartbeat (for subtle UI movement)
        const interval = setInterval(() => {
            setPulse(p => p + 1);
        }, 3000);

        return () => {
            clearInterval(interval);
            supabaseClient.removeChannel(channel);
        };
    }, []);



    return (
        <AdminContainer className="space-y-6">
            <AdminHeader title="Dashboard" className="border-b border-white/[0.05] pb-6" />


            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DenseMetric
                    label="Open Ideas"
                    value={loading ? "..." : stats.ideas.toString()}
                    icon={<Lightbulb className="w-4 h-4" />}
                />
                <DenseMetric
                    label="Online Now"
                    value={activeUsers.length.toString().padStart(2, '0')}
                    icon={<Activity className="w-4 h-4" />}
                    color="text-emerald-500"
                    isLive
                />
                <DenseMetric
                    label="Open Bugs"
                    value={loading ? "..." : stats.bugs.toString().padStart(2, '0')}
                    icon={<Bug className="w-4 h-4" />}
                    color="text-rose-400"
                />
                <DenseMetric
                    label="Total Downloads"
                    value={loading ? "..." : (downloadStats.ios.month + downloadStats.android.month + downloadStats.web.month).toString()}
                    icon={<Download className="w-4 h-4" />}
                    color="text-indigo-400"
                />
            </div>

            {/* System & Analytics List (Simplified) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border border-white/[0.05] rounded-xl bg-zinc-900/10 overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3" /> System Status
                        </h3>
                        <div className="flex items-center gap-2">
                            <AdminButton
                                variant="secondary"
                                size="sm"
                                loading={refreshing}
                                onClick={refreshHealth}
                                icon={<RotateCw className={cn("w-3 h-3", refreshing && "animate-spin")} />}
                            >
                                {refreshing ? 'Refreshing' : 'Refresh'}
                            </AdminButton>
                        </div>
                    </div>

                    <div className="divide-y divide-white/[0.05]">
                        {/* Real System Status */}
                        <InfrastructureRow
                            name="Supabase Database"
                            region="us-east-1"
                            status={health.database.status === 'operational' ? 'Operational' : 'Issue'}
                            load={`${health.database.latency}ms`}
                        />
                        <InfrastructureRow
                            name="Sanity CMS"
                            region="global"
                            status={health.cms.status === 'operational' ? 'Operational' : 'Issue'}
                            load={`${health.cms.latency}ms`}
                        />
                        <InfrastructureRow
                            name="Backend API"
                            region="vercel-edge"
                            status={health.api.status === 'online' ? 'Operational' : 'Issue'}
                            load={`${health.api.latency}ms`}
                        />
                        {/* Real Download Analytics */}
                        <AnalyticsRow
                            name="iOS App Store"
                            subtitle="Conversion"
                            stats={downloadStats.ios}
                        />
                        <AnalyticsRow
                            name="Google Play Store"
                            subtitle="Conversion"
                            stats={downloadStats.android}
                        />
                        <AnalyticsRow
                            name="Web Application"
                            subtitle="Conversion"
                            stats={downloadStats.web}
                        />
                    </div>
                </div>

                {/* Live Audit / User Footprints */}
                <div className="border border-white/[0.05] rounded-xl bg-zinc-900/10 flex flex-col min-h-[400px]">
                    <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
                        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Monitor className="w-3 h-3" /> Recent Activity
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeUsers.map((user, idx) => (
                            <div key={idx} className="flex items-start gap-3 group">
                                <div className={cn(
                                    "mt-1 p-1.5 rounded-md border shrink-0",
                                    user.type === 'admin' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                )}>
                                    <UserIcon className="w-3 h-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                            {user.type === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-600">Active</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-200 truncate">
                                        <Globe className="w-3 h-3 text-zinc-600" />
                                        <span className="font-mono bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5">{user.path || '/'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activeUsers.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                                <Activity className="w-8 h-8 mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No activity</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/[0.05] bg-black/20">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Total Online</span>
                            <span className="text-xs font-mono text-emerald-500 font-bold">{activeUsers.length.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminContainer>
    );
}



function DenseMetric({ label, value, icon, color = "text-zinc-400", isLive = false }: { label: string, value: string, icon: React.ReactNode, color?: string, isLive?: boolean }) {
    return (
        <div className="bg-[#09090b] border border-white/[0.04] p-5 rounded-xl flex items-center justify-between group transition-colors hover:border-white/[0.1] hover:bg-zinc-900/40">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-zinc-100 tracking-tight font-mono leading-none">
                        {value === "..." ? <Loader2 className="w-4 h-4 animate-spin text-zinc-700" /> : value}
                    </p>
                    {isLive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
            </div>
            <div className={cn("p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] group-hover:bg-white/[0.05] transition-colors", color)}>{icon}</div>
        </div>
    );
}

function InfrastructureRow({ name, region, status, load }: { name: string, region: string, status: string, load: string }) {
    return (
        <div className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-zinc-300">{name}</span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-tight">{region}</span>
            </div>
            <div className="flex items-center gap-12 text-xs">
                <div className="flex flex-col items-end w-20">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">Load</span>
                    <span className="font-mono text-zinc-400 text-[11px]">{load}</span>
                </div>
                <div className="flex flex-col items-end w-24">
                    <span className={cn(
                        "font-bold uppercase text-[9px] px-1.5 py-0.5 rounded border leading-none",
                        status === 'Operational' ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                            status === 'Processing' ? "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" : "text-zinc-500 bg-zinc-500/5 border-white/5"
                    )}>{status}</span>
                </div>
            </div>
        </div>
    );
}



function AnalyticsRow({ name, subtitle, stats }: { name: string, subtitle: string, stats: { day: number, week: number, month: number } }) {
    return (
        <div className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-zinc-300">{name}</span>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-tight">{subtitle}</span>
            </div>
            <div className="flex items-center gap-6">
                {/* Day */}
                <div className="flex flex-col items-end w-12 gap-0.5">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">24h</span>
                    <span className="font-mono text-zinc-300 text-[11px] font-bold">{stats.day}</span>
                </div>
                {/* Week */}
                <div className="flex flex-col items-end w-12 gap-0.5">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">7d</span>
                    <span className="font-mono text-zinc-300 text-[11px] font-bold">{stats.week}</span>
                </div>
                {/* Month */}
                <div className="flex flex-col items-end w-12 gap-0.5">
                    <span className="text-[8px] text-zinc-700 uppercase font-bold">30d</span>
                    <span className="font-mono text-zinc-300 text-[11px] font-bold">{stats.month}</span>
                </div>
            </div>
        </div>
    );
}
