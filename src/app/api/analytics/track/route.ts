import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event_name, page_url, referrer, device_type, country, metadata } = body;

        // Basic validation
        if (!event_name) {
            return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            console.warn('Supabase client not available, logging event instead');
            console.log('Analytics event:', { event_name, page_url, referrer, device_type, country, metadata });
            return NextResponse.json({ success: true, cached: true });
        }

        // Insert into Supabase
        const { error } = await supabase.from('analytics_events').insert({
            event_name,
            page_url,
            referrer,
            device_type,
            country,
            metadata
        });

        if (error) {
            console.error('Analytics Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Analytics Handler Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
