import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { client as sanityClient } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const startTotal = performance.now();
    const healthData = {
        database: { status: 'unknown', latency: 0 },
        cms: { status: 'unknown', latency: 0 },
        api: { status: 'online', latency: 0 },
        analytics: {
            downloads: {
                ios: { day: 0, week: 0, month: 0 },
                android: { day: 0, week: 0, month: 0 },
                web: { day: 0, week: 0, month: 0 }
            }
        }
    };

    // 1. Check Supabase & Fetch Analytics (Server-side)
    try {
        const sbStart = performance.now();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Fallback but assumes Service Key exists for analytics

        // Public client for latency check
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Admin client for restricted analytics data
        const adminSupabase = createClient(supabaseUrl, serviceKey);

        // Date boundaries
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Parallel execution: database check + analytics fetch
        const [latencyCheck, analyticsCheck] = await Promise.all([
            supabase.from('roadmap_items').select('count', { count: 'exact', head: true }),
            adminSupabase.from('analytics_events')
                .select('metadata, created_at')
                .eq('event_name', 'download_click')
                .gte('created_at', thirtyDaysAgo.toISOString()) // Filter last 30 days
        ]);

        const sbEnd = performance.now();

        healthData.database.latency = Math.round(sbEnd - sbStart);
        healthData.database.status = latencyCheck.error ? 'error' : 'operational';

        // Process Analytics Data securely on server
        if (analyticsCheck.data) {
            analyticsCheck.data.forEach((event: any) => {
                let meta = event.metadata;
                if (typeof meta === 'string') {
                    try { meta = JSON.parse(meta); } catch (e) { }
                }
                const target = meta?.target_platform || meta?.target;
                const eventDate = new Date(event.created_at);

                let platformKey: 'ios' | 'android' | 'web' | null = null;
                if (target === 'ios') platformKey = 'ios';
                else if (target === 'android') platformKey = 'android';
                else if (target === 'web') platformKey = 'web';

                if (platformKey) {
                    // Month (30d) - Base: Includes everything fetched (since we filtered by 30 days)
                    healthData.analytics.downloads[platformKey].month++;

                    // Week (7d)
                    if (eventDate >= sevenDaysAgo) {
                        healthData.analytics.downloads[platformKey].week++;
                    }

                    // Day (24h)
                    if (eventDate >= oneDayAgo) {
                        healthData.analytics.downloads[platformKey].day++;
                    }
                }
            });
        }

    } catch (e) {
        console.error("Supabase/Analytics Error:", e);
        healthData.database.status = 'error';
    }

    // 2. Check Sanity
    try {
        const sanityStart = performance.now();
        // Lightweight query just to check connection
        await sanityClient.fetch(`count(*[_type == "post"])`);
        const sanityEnd = performance.now();

        healthData.cms.latency = Math.round(sanityEnd - sanityStart);
        healthData.cms.status = 'operational';
    } catch (e) {
        healthData.cms.status = 'error';
    }

    // 3. API Self Latency
    const endTotal = performance.now();
    healthData.api.latency = Math.round(endTotal - startTotal);

    return NextResponse.json(healthData);
}
