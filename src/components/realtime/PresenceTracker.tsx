"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function PresenceTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) return;

        const supabaseClient = createClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        const channel = supabaseClient.channel('global_presence', {
            config: {
                presence: {
                    key: 'user-' + Math.random().toString(36).substr(2, 5),
                },
            },
        });

        channel
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        path: pathname,
                        type: pathname.includes('/admin') ? 'admin' : 'user',
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [pathname]);

    return null; // Side-effect only
}
