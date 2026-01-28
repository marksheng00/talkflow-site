"use client";

import { useCallback } from "react";
import { getDeviceType } from "@/lib/device-detection";

/**
 * Hook for tracking custom analytic events.
 * Use this to trigger events like 'download_clicked', 'signup_flow_start', etc.
 */
export function useAnalytics() {
    const trackEvent = useCallback((eventName: string, metadata: Record<string, any> = {}) => {
        // Collect basic context
        const payload = {
            event_name: eventName,
            page_url: typeof window !== 'undefined' ? window.location.href : '',
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            device_type: getDeviceType(),
            country: null, // Could be filled by Cloudflare/Vercel headers on backend if wanted, frontend usually knows timezone
            metadata
        };

        // Use beacon if available for ensuring delivery on navigation
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics/track', blob);
        } else {
            // Fallback fetch
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.error("Track failed", err));
        }
    }, []);

    return { trackEvent };
}
