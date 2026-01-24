"use client";

import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarButton } from "@/components/ui/SiteNavbar";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <AuroraBackground className="flex min-h-screen flex-col items-center justify-center text-center">
            <div className="z-10 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-6xl font-black text-white md:text-8xl">{t('title')}</h2>
                <p className="text-xl text-slate-400">{t('subtitle')}</p>
                <p className="max-w-md text-slate-500 text-balance">
                    {t('description')}
                </p>
                <NavbarButton
                    href="/"
                    variant="primary"
                    className="mt-4 rounded-xl px-8 py-3 text-base"
                >
                    {t('button')}
                </NavbarButton>
            </div>
        </AuroraBackground>
    )
}
