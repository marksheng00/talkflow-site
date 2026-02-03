"use client";

import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarButton } from "@/components/ui/SiteNavbar";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <AuroraBackground className="flex min-h-screen flex-col items-center justify-center text-center">
            <div className="z-10 flex flex-col items-center justify-center space-y-4">
                <h1 className="typo-h1 text-white">{t('title')}</h1>
                <p className="typo-subtitle-lg text-neutral-400">{t('subtitle')}</p>
                <p className="typo-body text-slate-500 text-balance max-w-md">
                    {t('description')}
                </p>
                <NavbarButton
                    href="/"
                    variant="primary"
                    className="mt-4 px-8 py-3"
                >
                    {t('button')}
                </NavbarButton>
            </div>
        </AuroraBackground>
    )
}
