"use client";
import { X, Lightbulb, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { categories } from "@/types/roadmap";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";

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

    if (!mounted) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            className="max-w-lg"
            showCloseButton={false}
        >
            <div className="relative p-6 md:p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white border border-white/10 transition-colors z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h2 className="typo-h3 text-white flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-emerald-500" />
                        {t("SubmitIdeaModal.title")}
                    </h2>
                    <p className="typo-body-sm text-slate-500 mt-1">{t("SubmitIdeaModal.subtitle")}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Title */}
                    <Field label={t("SubmitIdeaModal.fields.title")}>
                        <Input
                            placeholder={t("SubmitIdeaModal.placeholders.title")}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            minLength={3}
                            tone="emerald"
                        />
                    </Field>

                    {/* Category */}
                    <Field label={t("SubmitIdeaModal.fields.category")}>
                        <div className="flex flex-wrap gap-2">
                            {categories
                                .filter((c) => c !== "All")
                                .map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setForm({ ...form, category: cat })}
                                        className={buttonStyles({
                                            variant: form.category === cat ? "info" : "secondary",
                                            size: "sm",
                                            className:
                                                form.category === cat
                                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20"
                                                    : "text-slate-500 hover:text-slate-300",
                                        })}
                                    >
                                        {t.has(`Filters.Categories.${cat}`) ? t(`Filters.Categories.${cat}`) : cat}
                                    </button>
                                ))}
                        </div>
                    </Field>

                    {/* Description */}
                    <Field label={t("SubmitIdeaModal.fields.description")}>
                        <Textarea
                            placeholder={t("SubmitIdeaModal.placeholders.description")}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            minLength={12}
                            tone="emerald"
                            className="h-32 resize-none leading-relaxed"
                        />
                    </Field>

                    <button
                        disabled={submitting}
                        className={buttonStyles({
                            variant: "info",
                            size: "lg",
                            className: "w-full",
                        })}
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            t("SubmitIdeaModal.submit")
                        )}
                    </button>
                </form>
            </div>
        </Modal>
    );
}
