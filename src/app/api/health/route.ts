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
    };

    // 1. Check Supabase
    try {
        const sbStart = performance.now();
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { error } = await supabase.from('roadmap_items').select('count', { count: 'exact', head: true });
        const sbEnd = performance.now();

        healthData.database.latency = Math.round(sbEnd - sbStart);
        healthData.database.status = error ? 'error' : 'operational';
    } catch (e) {
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
