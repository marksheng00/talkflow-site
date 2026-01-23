
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.stepsToReproduce) {
            return NextResponse.json(
                { error: 'Title and steps to reproduce are required' },
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

        const newBug = {
            id: randomUUID(),
            title: body.title,
            steps_to_reproduce: body.stepsToReproduce,
            expected_result: body.expectedResult,
            actual_result: body.actualResult,
            severity: body.severity,
            platform: body.platform,
            status: "reported",
            upvotes: 0,
        };

        const { data, error } = await supabase
            .from("bug_reports")
            .insert([newBug])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Map response key back to camelCase for frontend consistency if needed, 
        // but frontend usually displays whatever the DB returns or we can map it here.
        // For simplicity let's return the DB object, but ensure frontend handles snake_case if it reads directly,
        // OR we map it to our BugReport type.

        const mappedBug = {
            id: data.id,
            title: data.title,
            description: data.description,
            stepsToReproduce: data.steps_to_reproduce,
            expectedResult: data.expected_result,
            actualResult: data.actual_result,
            severity: data.severity,
            platform: data.platform,
            status: data.status,
            upvotes: data.upvotes,
            created_at: data.created_at,
        };

        return NextResponse.json(mappedBug);

    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
