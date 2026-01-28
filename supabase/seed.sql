-- =====================================================
-- SEED DATA for 3 separate tables
-- Run this AFTER the migration script
-- =====================================================

-- 1. Seed roadmap_items (Official Dev Roadmap)
INSERT INTO public.roadmap_items
  (title, description, status, category, eta, accelerations, start_date, target_date, progress, cover_image, detailed_content)
VALUES
  (
    'Adaptive Interview Simulator',
    'Dynamic interviewer that mirrors tone and asks deeper follow-ups as you improve. Features real-time sentiment analysis.',
    'building',
    'Feature',
    'Q1 2024',
    56,
    '2024-01-10',
    '2024-03-31',
    45,
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    $$Our AI interviewer is getting smarter. With adaptive sentiment analysis, it now mirrors your tone and asks progressively deeper follow-ups as you demonstrate mastery.

**📅 Development Timeline**

**January 2024** - Initial research and prototype
• Conducted user interviews with 50+ talkflo users
• Built sentiment analysis pipeline
• Tested 3 different conversation models

**February 2024** - Alpha testing (Current)
• 200 users testing adaptive responses
• 87% report improved engagement
• Average session length increased by 2.3x

**March 2024** - Public beta
• Planned rollout to all Pro users
• Multi-language support (Spanish, Mandarin, French)

**Key Features:**

✨ **Real-time tone matching** - AI adapts accent, pace, and energy level to match yours
🎯 **Context-aware follow-ups** - Deeper questions based on your previous answers
📈 **Difficulty scaling** - Automatically increases complexity as you improve
🧠 **Multi-turn memory** - Remembers context from earlier in the conversation$$
  ),
  (
    'Offline Warmup Drills',
    '5-minute offline audio drills to prep before meetings.',
    'shipping',
    'Content',
    'Feb 15',
    32,
    '2024-01-05',
    '2024-02-15',
    90,
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=400&fit=crop',
    $$Quick 5-minute warmup drills designed to activate your speaking muscles before important calls or meetings.

**📦 What's Included:**

🗣️ **Pronunciation Drills** - Targeted exercises for common problem sounds
🎵 **Intonation Exercises** - Practice rising/falling tones and stress patterns
💬 **Common Phrase Practice** - Business idioms and conversation starters
👅 **Tongue Twisters** - Improve clarity and articulation speed

**💾 Offline Mode:**

All drills are pre-downloaded so you can:
✅ Practice on the subway
✅ Warm up in a quiet corner before your interview
✅ Use it anywhere, no internet required$$
  ),
  (
    'Multi-speaker Logic',
    'Practice group calls with two AI participants.',
    'researching',
    'AI Core',
    'Q2 2024',
    20,
    '2024-02-01',
    '2024-06-30',
    15,
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
    $$Practice realistic group conversations with multiple AI participants who have distinct voices and personalities.

**🔬 Research Phase Overview**

We're in the early exploration stage, investigating how to create the most realistic group conversation training experience.

**Current Focus Areas:**

1️⃣ **Turn-taking Logic**
• Natural interruption patterns
• Polite interjection handling
• "Speaking over" detection and recovery

2️⃣ **Multi-speaker Emotion**
• Tracking sentiment across participants
• Group mood dynamics
• Conflict resolution scenarios$$
  ),
  (
    'Accent Mirroring v2',
    'Automatically subtly adjust the AI''s accent to match your target region.',
    'researching',
    'AI Core',
    'Research',
    15,
    '2024-01-20',
    '2024-05-01',
    5,
    'https://images.unsplash.com/photo-1576153192621-7a3be10b356e?w=800&h=400&fit=crop',
    $$The AI voice will subtly shift its accent to match your target English variant - whether that's American, British, Australian, or Indian English.

**🎯 Project Goals:**

Help users practice with the accent they'll encounter in their real-world scenarios:
• Job interviews in specific regions
• Business calls with international teams
• Exam preparation (IELTS, TOEFL regions)
• Relocation preparation$$
  ),
  (
    'Vocabulary Expansion',
    'Daily personalized word lists generated from errors.',
    'released',
    'Content',
    'released',
    45,
    '2024-01-01',
    '2024-01-15',
    100,
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    $$🎉 **Feature Now Live!**

Your personal vocabulary trainer that learns from your mistakes and builds custom word lists.

**✨ How It Works:**

1️⃣ **Automatic Error Detection**
As you practice, our AI identifies:
• Mispronounced words
• Misused vocabulary
• Words you avoid using
• Hesitation patterns

2️⃣ **Smart List Generation**
Every day at 8 AM, you receive:
• 5-10 new words tailored to your mistakes
• Example sentences in your industry context
• Audio pronunciations
• Memory tricks and mnemonics$$
  ),
  (
    'IOS App Launch',
    'The first version of talkflo for iPhone users.',
    'released',
    'UIUX',
    'released',
    100,
    '2024-01-01',
    '2024-01-10',
    100,
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    $$📱 **talkflo is now on iOS!**

After 4 months of development, we're thrilled to announce that iPhone users can now practice English speaking on the go.

**📱 iOS-Exclusive Features:**

🎙️ **AirPods Pro Integration**
Seamless audio with transparency mode - practice while walking

📲 **Lock Screen Widgets**
Daily streak counter and quick-start buttons

⌚ **Apple Watch Companion**
Start sessions, see progress rings$$
  );

-- 2. Seed community_ideas (User Submissions)
INSERT INTO public.community_ideas
  (title, description, category, status, upvotes, downvotes)
VALUES
  ('Dark mode for mobile app', 'I often study at night and the white background is too bright.', 'UIUX', 'open', 45, 0),
  ('German language support', 'Would love to practice German interview prep as well.', 'Content', 'open', 32, 0),
  ('Mock exam test', 'Add a visible countdown timer for Part 2 speaking.', 'under_review', 'AI Core', 90, 0),
  ('Export transcripts to PDF', 'I want to print my mistakes and show them to my tutor.', 'planned', 'Feature', 120, 0),
  ('Mobile app companion', 'A dedicated mobile app to manage tasks and view roadmap on the go. Push notifications for updates would be great.', 'under_review', 'UIUX', 85, 2),
  ('Legacy Import Tool', 'Allow importing data from older legacy systems. Not super critical but would help migration.', 'open', 'Feature', 12, 5);

-- 3. bug_reports table is intentionally left empty - users will submit bugs through the UI

-- Done!
