"use client";

import Link from "next/link";
import { MonitorPlay } from "lucide-react";
import { usePlatform } from "@/hooks/use-platform";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface AppDownloadButtonsProps {
    appStoreLink: string;
    playStoreLink: string;
    webLink: string;
}

const IOSIcon = () => (
    <svg viewBox="0 0 384 512" className="h-6 w-6 fill-black flex-shrink-0">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.6-79.1 23.9-100.1 60.5-42.2 73.1-10.8 181.8 30.5 241.6 20.2 29.2 44.1 61.9 75.8 60.7 30.3-1.2 41.8-19.3 78.4-19.3s47.1 19.3 78.9 18.7c32.3-.6 53.3-29.8 73-58.4 22.9-33.1 32.7-65.1 33-66.8-.7-.3-63.5-24.3-63.8-96.1zM288 80.1c15.6-18.8 26.2-44.8 23.3-70.9-22.3 1-49.3 15-65.3 33.8-14.4 16.8-26.9 43.1-23.5 68.3 24.8 1.9 49.3-12.4 65.5-31.2z" />
    </svg>
);

const AndroidIcon = () => (
    <svg viewBox="0 0 512 512" className="h-5 w-5 fill-black flex-shrink-0">
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
);

const StoreButton = ({
    href,
    icon: Icon,
    label,
    desktopLabel,
    isMobileLayout,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    desktopLabel?: string;
    isMobileLayout?: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            "group flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 whitespace-nowrap lg:w-auto lg:min-w-[200px]",
            isMobileLayout ? "flex-1 px-3" : "px-6"
        )}
    >
        <Icon />
        <span className="text-base font-bold text-black">
            {isMobileLayout ? label : (desktopLabel || label)}
        </span>
    </Link>
);

const WebButton = ({ href, isMobileLayout, label }: { href: string; isMobileLayout?: boolean; label: string }) => (
    <Link
        href={href}
        className={cn(
            "group flex h-14 w-full lg:w-auto lg:min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 lg:flex-initial whitespace-nowrap",
            isMobileLayout ? "flex-1 px-3" : "px-6"
        )}
    >
        <MonitorPlay className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors flex-shrink-0" />
        <span className="text-base font-medium text-slate-300 group-hover:text-white transition-colors">
            {label}
        </span>
    </Link>
);

export const AppDownloadButtons = ({
    appStoreLink,
    playStoreLink,
    webLink,
    className,
}: AppDownloadButtonsProps & { className?: string }) => {
    const t = useTranslations('HomePage.AppButtons');
    const platform = usePlatform();

    // Prevent hydration mismatch/flash by rendering a placeholder until platform is detected
    if (platform === null) {
        return <div className={cn("h-14 w-full", className)} aria-hidden="true" />;
    }

    return (
        <div className={cn("flex flex-col items-center gap-4 w-full mx-auto lg:max-w-none lg:justify-center", className)}>
            {/* Mobile: Platform + Web side by side */}
            {platform !== "desktop" && (
                <div className="grid grid-cols-2 w-full gap-3">
                    {platform === "ios" && (
                        <StoreButton
                            href={appStoreLink}
                            icon={IOSIcon}
                            label={t('download')}
                            isMobileLayout
                        />
                    )}

                    {platform === "android" && (
                        <StoreButton
                            href={playStoreLink}
                            icon={AndroidIcon}
                            label={t('download')}
                            isMobileLayout
                        />
                    )}

                    <WebButton href={webLink} isMobileLayout label={t('tryWeb')} />
                </div>
            )}

            {/* Desktop: All 3 buttons horizontal */}
            {platform === "desktop" && (
                <div className="flex flex-col md:flex-row w-full lg:w-auto gap-3">
                    <StoreButton
                        href={appStoreLink}
                        icon={IOSIcon}
                        label={t('ios')}
                    />
                    <StoreButton
                        href={playStoreLink}
                        icon={AndroidIcon}
                        label={t('android')}
                    />
                    <WebButton href={webLink} label={t('tryWeb')} />
                </div>
            )}
        </div>
    );
};
