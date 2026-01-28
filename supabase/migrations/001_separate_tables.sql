-- =====================================================
-- MIGRATION: Separate roadmap_items into 3 tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create community_ideas table
CREATE TABLE IF NOT EXISTS public.community_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'planned', 'declined')),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    cover_image TEXT,
    submitter_id UUID,  -- For future user authentication
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create bug_reports table
CREATE TABLE IF NOT EXISTS public.bug_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    steps_to_reproduce TEXT,
    expected_result TEXT,
    actual_result TEXT,
    severity TEXT DEFAULT 'minor' CHECK (severity IN ('minor', 'major', 'blocker')),
    platform TEXT CHECK (platform IN ('iOS', 'Android', 'Web')),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'fixing', 'resolved', 'wont_fix')),
    upvotes INTEGER DEFAULT 0,
    reporter_id UUID,  -- For future user authentication
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Keep roadmap_items for official dev roadmap only
-- First, let's backup the current data
CREATE TABLE IF NOT EXISTS public.roadmap_items_backup AS SELECT * FROM public.roadmap_items;

-- 4. Migrate Ideas from roadmap_items to community_ideas
INSERT INTO public.community_ideas (title, description, category, status, upvotes, downvotes, created_at)
SELECT 
    title,
    description,
    category,
    CASE 
        WHEN status = 'idea' THEN 'open'
        WHEN status = 'idea_review' THEN 'under_review'
        WHEN status = 'idea_planned' THEN 'planned'
        WHEN status = 'backlog' THEN 'open'
        ELSE 'open'
    END as status,
    upvotes,
    downvotes,
    created_at
FROM public.roadmap_items
WHERE status IN ('idea', 'idea_review', 'idea_planned', 'backlog');

-- 5. Delete ideas from roadmap_items (keep only official roadmap)
DELETE FROM public.roadmap_items 
WHERE status IN ('idea', 'idea_review', 'idea_planned', 'backlog');

-- 6. Update roadmap_items status constraint (remove idea statuses)
-- First drop old constraint if exists
ALTER TABLE public.roadmap_items DROP CONSTRAINT IF EXISTS roadmap_items_status_check;

-- Add new constraint for roadmap-only statuses
ALTER TABLE public.roadmap_items ADD CONSTRAINT roadmap_items_status_check 
CHECK (status IN ('researching', 'building', 'shipping', 'released', 'done'));

-- 7. Add source_idea_id to roadmap_items for traceability (optional link)
ALTER TABLE public.roadmap_items 
ADD COLUMN IF NOT EXISTS source_idea_id UUID REFERENCES public.community_ideas(id);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_ideas_status ON public.community_ideas(status);
CREATE INDEX IF NOT EXISTS idx_community_ideas_created ON public.community_ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON public.bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created ON public.bug_reports(created_at DESC);

-- 9. Enable RLS (Row Level Security) for all tables
ALTER TABLE public.community_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- 10. Create policies for public read access
CREATE POLICY "Anyone can read ideas" ON public.community_ideas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ideas" ON public.community_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ideas" ON public.community_ideas FOR UPDATE USING (true);

CREATE POLICY "Anyone can read bugs" ON public.bug_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bugs" ON public.bug_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bugs" ON public.bug_reports FOR UPDATE USING (true);

-- Done!
-- After running this, you'll have:
-- - roadmap_items: Official dev roadmap (6 items from your seed)
-- - community_ideas: User-submitted ideas (6 items migrated)
-- - bug_reports: Empty, ready for bug submissions
