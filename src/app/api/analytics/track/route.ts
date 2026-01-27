import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use SERVICE_ROLE key directly for analytics insertion if needed, 
// OR just use standard client since we enabled RLS for ANON inserts.
// Using standard ENV vars here which likely have anon key is fine due to policy.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event_name, page_url, referrer, device_type, country, metadata } = body;

        // Basic validation
        if (!event_name) {
            return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
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
