"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            // Optional: You can check if the email belongs to an admin here too
            // But usually we do it in the Layout for better protection
            router.push("/admin/roadmap");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-indigo-500/30">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Branding */}
                <div className="text-center mb-10 group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mb-6 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                        <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight">
                        TalkFlow Admin
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Restricted Access • System Security</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold py-3 px-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/10"
                                    placeholder="admin@talkflow.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold h-12 rounded-2xl hover:bg-indigo-50 px-6 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-[11px] text-slate-600 font-medium">
                    &copy; 2026 TalkFlow Systems. All rights reserved.
                </div>
            </div>
        </div>
    );
}
