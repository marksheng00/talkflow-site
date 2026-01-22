"use client";

import { useState, useEffect } from "react";

export type Platform = "ios" | "android" | "desktop";

export function usePlatform(): Platform {
    const [platform, setPlatform] = useState<Platform>("desktop");

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            setPlatform("ios");
        } else if (/android/.test(ua)) {
            setPlatform("android");
        } else {
            setPlatform("desktop");
        }
    }, []);

    return platform;
}
