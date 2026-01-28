"use client";

import { useCallback, useSyncExternalStore } from "react";
import { detectPlatform, type Platform } from "@/lib/device-detection";

export { type Platform };

export function usePlatform(): Platform | null {
    const subscribe = useCallback(() => () => undefined, []);
    return useSyncExternalStore(subscribe, detectPlatform, () => null);
}
