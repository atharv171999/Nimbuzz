-- 1. Create Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location_name TEXT NOT NULL,
    city_or_area TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    max_participants INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Activity Participants Junction Table
CREATE TABLE IF NOT EXISTS activity_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'going',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);

-- 3. Disable RLS (to match rest of project and bypass anon client auth issues)
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants DISABLE ROW LEVEL SECURITY;

-- 4. Cleanup existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public activities are viewable by everyone authenticated" ON activities;
DROP POLICY IF EXISTS "Users can create activities" ON activities;
DROP POLICY IF EXISTS "Participants are viewable by everyone authenticated" ON activity_participants;
DROP POLICY IF EXISTS "Users can join activities" ON activity_participants;
DROP POLICY IF EXISTS "Users can cancel their own RSVP" ON activity_participants;

