
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation (you can enhance this with Zod if you want strict validation here too)
        if (!body.title || !body.description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        const newIdea = {
            id: randomUUID(),
            title: body.title,
            description: body.description,
            category: body.category,
            status: "open",
            upvotes: 0,
            downvotes: 0
        };

        const { data, error } = await supabase
            .from("community_ideas")
            .insert([newIdea])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
