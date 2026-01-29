"use client";

import { createPortal } from "react-dom";
import { X, Lightbulb, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { categories } from "@/types/roadmap";

interface SubmitIdeaModalProps {
    mounted: boolean;
    isOpen: boolean;
    onClose: () => void;
    form: { title: string; category: string; description: string };
    setForm: (form: { title: string; category: string; description: string }) => void;
    submitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function SubmitIdeaModal({
    mounted,
    isOpen,
    onClose,
    form,
    setForm,
    submitting,
    onSubmit,
}: SubmitIdeaModalProps) {
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
                    <h3 className="text-2xl font-heading font-bold text-white leading-tight flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-emerald-500" />
                        {t("SubmitIdeaModal.title")}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{t("SubmitIdeaModal.subtitle")}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t("SubmitIdeaModal.fields.title")}
                        </label>
                        <input
                            placeholder={t("SubmitIdeaModal.placeholders.title")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            minLength={3}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t("SubmitIdeaModal.fields.category")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories
                                .filter((c) => c !== "All")
                                .map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setForm({ ...form, category: cat })}
                                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${form.category === cat
                                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                            : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                            }`}
                                    >
                                        {t.has(`Filters.Categories.${cat}`) ? t(`Filters.Categories.${cat}`) : cat}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t("SubmitIdeaModal.fields.description")}
                        </label>
                        <textarea
                            placeholder={t("SubmitIdeaModal.placeholders.description")}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none leading-relaxed"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            minLength={12}
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full h-14 bg-emerald-500 text-black rounded-xl font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            t("SubmitIdeaModal.submit")
                        )}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
