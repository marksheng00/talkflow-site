"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarLogo } from "@/components/ui/SiteNavbar";
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from "lucide-react";

type AuthStep = "initial" | "password";

export default function LoginClient() {
    const [step, setStep] = useState<AuthStep>("initial");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API check
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
        if (step === "initial" && email) {
            setStep("password");
        } else if (step === "password") {
            // Handle login/signup completion
            console.log("Submit", { email, password });
        }
    };

    const socialButtons = [
        {
            name: "Google",
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
            ),
        },
        {
            name: "Microsoft",
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
            ),
        },
        {
            name: "Apple",
            icon: (
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 46-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                </svg>
            ),
        },
    ];

    return (
        <AuroraBackground>
            <div className="absolute top-0 left-0 right-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center px-6 py-3 lg:px-10 lg:py-3">
                    <NavbarLogo />
                </div>
            </div>
            <div className="flex h-[100dvh] w-full items-center justify-center px-4 overflow-hidden py-4 md:py-12">
                <div className="w-full max-w-[400px]">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl">
                        <AnimatePresence mode="wait">
                            {step === "initial" && (
                                <motion.div
                                    key="initial"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-8 pt-8 md:pt-12 pb-8 md:pb-10"
                                >
                                    {/* Header */}
                                    <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-10 space-y-4 md:space-y-6">
                                        <div className="relative h-12 w-12 md:h-16 md:w-16">
                                            <Image
                                                src="/talkflo_logo.png"
                                                alt="talkflo"
                                                fill
                                                className="object-contain"
                                                quality={100}
                                                priority
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h1 className="font-heading text-[26px] font-bold text-white tracking-tight">
                                                Sign in or sign up
                                            </h1>
                                            <p className="text-slate-400 text-[15px]">
                                                Start creating with talkflo
                                            </p>
                                        </div>
                                    </div>

                                    {/* Social Buttons */}
                                    <div className="space-y-3">
                                        {socialButtons.map((btn) => (
                                            <button
                                                key={btn.name}
                                                className="relative w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 md:py-3 px-4 rounded-xl transition-all active:scale-[0.98] group"
                                            >
                                                {btn.icon}
                                                <span className="text-[14px] md:text-[15px] font-semibold">Continue with {btn.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="relative my-6 md:my-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/5" />
                                        </div>
                                        <div className="relative flex justify-center text-[13px] uppercase tracking-wide">
                                            <span className="bg-[#0e0e10] px-3 text-slate-500">
                                                Or
                                            </span>
                                        </div>
                                    </div>

                                    {/* Email Form */}
                                    <form onSubmit={handleContinue} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 md:py-3.5 text-white placeholder:text-slate-500 outline-none transition-all text-[14px] md:text-[15px]"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !email}
                                            className="w-full bg-white text-black hover:bg-slate-50 font-bold py-3 md:py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[14px] md:text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                "Continue"
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === "password" && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-6 md:p-8 pt-8 md:pt-12 pb-8 md:pb-10"
                                >
                                    <div className="flex flex-col items-center text-center mb-6 md:mb-10 space-y-4 md:space-y-6">
                                        <div className="relative h-12 w-12 md:h-16 md:w-16">
                                            <Image
                                                src="/talkflo_logo.png"
                                                alt="talkflo"
                                                fill
                                                className="object-contain"
                                                quality={100}
                                                priority
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h1 className="font-heading text-[26px] font-bold text-white tracking-tight">
                                                Create your account
                                            </h1>
                                            <p className="text-slate-400 text-[15px]">
                                                Set your password to continue
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                                                Email
                                            </label>
                                            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                                                <span className="text-[15px] text-slate-200 font-medium pl-1">{email}</span>
                                                <button
                                                    onClick={() => setStep("initial")}
                                                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pr-1"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>

                                        <form onSubmit={handleContinue} className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-transparent border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 md:py-3.5 text-white placeholder:text-slate-500 outline-none transition-all text-[14px] md:text-[15px] pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || !password}
                                                className="w-full bg-white text-black hover:bg-slate-50 font-bold py-3 md:py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[14px] md:text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    "Continue"
                                                )}
                                            </button>
                                        </form>

                                        <button
                                            onClick={() => setStep("initial")}
                                            className="w-full text-slate-500 hover:text-white text-sm font-medium transition-colors"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom branding */}
                    <div className="mt-6 md:mt-8 text-center space-y-1.5 opacity-60 hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                            from
                        </p>
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <span className="text-[13px] font-bold tracking-tight">BeyondThink</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}
