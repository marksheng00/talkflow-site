"use client";
import { X, Bug, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BugPlatform } from "@/types/roadmap";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";

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
                        <Bug className="h-6 w-6 text-rose-500" />
                        {t("ReportBugModal.title")}
                    </h2>
                    <p className="typo-body-sm text-slate-500 mt-1">{t("ReportBugModal.subtitle")}</p>
                </div>

                <form onSubmit={onBugSubmit} className="space-y-5">
                    {/* Title */}
                    <Field label={t("ReportBugModal.fields.title")}>
                        <Input
                            required
                            type="text"
                            placeholder={t("ReportBugModal.placeholders.title")}
                            value={bugForm.title}
                            onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                            tone="rose"
                        />
                    </Field>

                    {/* Platform Selection */}
                    <Field label={t("ReportBugModal.fields.platform")}>
                        <div className="flex gap-2">
                            {(["Web", "iOS", "Android"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setBugForm({ ...bugForm, platform: p })}
                                    className={buttonStyles({
                                        variant: bugForm.platform === p ? "danger" : "secondary",
                                        size: "sm",
                                        className:
                                            bugForm.platform === p
                                                ? "bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/20"
                                                : "text-slate-500 hover:text-slate-300",
                                    })}
                                >
                                    {t(`Filters.Platforms.${p}`)}
                                </button>
                            ))}
                        </div>
                    </Field>

                    {/* Description */}
                    <Field label={t("ReportBugModal.fields.steps")}>
                        <Textarea
                            required
                            rows={4}
                            placeholder={t("ReportBugModal.placeholders.steps")}
                            value={bugForm.steps}
                            onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
                            tone="rose"
                            className="resize-none"
                        />
                    </Field>

                    <button
                        disabled={bugSubmitting}
                        type="submit"
                        className={buttonStyles({
                            variant: "danger",
                            size: "lg",
                            className: "w-full",
                        })}
                    >
                        {bugSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            t("ReportBugModal.submit")
                        )}
                    </button>
                </form>
            </div>
        </Modal>
    );
}
