"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Platform = "ios" | "android" | "desktop";

const detectPlatform = (): Platform | null => {
    if (typeof navigator === "undefined") return null;
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
    return "desktop";
};

export function usePlatform(): Platform | null {
    const subscribe = useCallback(() => () => undefined, []);
    return useSyncExternalStore(subscribe, detectPlatform, () => null);
}
