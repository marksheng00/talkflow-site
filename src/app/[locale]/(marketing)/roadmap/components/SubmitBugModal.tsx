"use client";

import { createPortal } from "react-dom";
import { X, Bug, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BugPlatform } from "@/types/roadmap";

interface SubmitBugModalProps {
    mounted: boolean;
    isOpen: boolean;
    onClose: () => void;
    bugForm: { title: string; steps: string; expected: string; actual: string; platform: BugPlatform };
    setBugForm: (form: { title: string; steps: string; expected: string; actual: string; platform: BugPlatform }) => void;
    bugSubmitting: boolean;
    onBugSubmit: (e: React.FormEvent) => void;
}

export function SubmitBugModal({
    mounted,
    isOpen,
    onClose,
    bugForm,
    setBugForm,
    bugSubmitting,
    onBugSubmit,
}: SubmitBugModalProps) {
    const t = useTranslations('RoadmapPage');

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10 transition-colors z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bug className="h-6 w-6 text-rose-500" />
                        {t("ReportBugModal.title")}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{t("ReportBugModal.subtitle")}</p>
                </div>

                <form onSubmit={onBugSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("ReportBugModal.fields.title")}
                        </label>
                        <input
                            required
                            type="text"
                            placeholder={t("ReportBugModal.placeholders.title")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors"
                            value={bugForm.title}
                            onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                        />
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("ReportBugModal.fields.platform")}
                        </label>
                        <div className="flex gap-2">
                            {(["Web", "iOS", "Android"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setBugForm({ ...bugForm, platform: p })}
                                    className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${bugForm.platform === p
                                        ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                                        : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                        }`}
                                >
                                    {t(`Filters.Platforms.${p}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("ReportBugModal.fields.steps")}
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder={t("ReportBugModal.placeholders.steps")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
                            value={bugForm.steps}
                            onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={bugSubmitting}
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
                    >
                        {bugSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            t("ReportBugModal.submit")
                        )}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
