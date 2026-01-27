-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    device_type TEXT, -- mobile / desktop / tablet
    country TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optimization: Index for faster querying
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Add RLS policies (Open for insert, restricted for read)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (anon) to insert events (tracking needs to be public)
CREATE POLICY "Allow public insert" ON analytics_events
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow ONLY service_role (backend/admin) to select/read
-- This prevents users from scraping your analytics data
CREATE POLICY "Allow service_role select" ON analytics_events
    FOR SELECT
    TO service_role
    USING (true);
