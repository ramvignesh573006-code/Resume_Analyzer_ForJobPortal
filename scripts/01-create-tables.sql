-- =============================================
-- TABLE 1: users
-- Stores every user who signs up via Supabase Auth
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE 2: resume_image
-- Stores uploaded resume files (PDF / Word)
-- Includes user name & email as denormalised fields
-- =============================================
CREATE TABLE IF NOT EXISTS resume_image (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Denormalised user info for easy querying
  user_name     TEXT NOT NULL,
  user_email    TEXT NOT NULL,
  -- File metadata
  file_name     TEXT NOT NULL,
  file_url      TEXT NOT NULL DEFAULT '',
  file_content  TEXT,                      -- raw extracted text
  selected_role TEXT NOT NULL,
  is_custom_role BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE 3: analysis_results
-- Stores final analysis of each uploaded resume
-- Includes user name & email as denormalised fields
-- =============================================
CREATE TABLE IF NOT EXISTS analysis_results (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id        UUID NOT NULL REFERENCES resume_image(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Denormalised user info
  user_name        TEXT NOT NULL,
  user_email       TEXT NOT NULL,
  -- Scores
  keyword_score    DECIMAL(5,2),
  format_score     DECIMAL(5,2),
  structure_score  DECIMAL(5,2),
  skills_score     DECIMAL(5,2),
  ats_score        DECIMAL(5,2),
  overall_score    DECIMAL(5,2),
  -- Detailed JSONB results
  keyword_details  JSONB,
  format_details   JSONB,
  structure_details JSONB,
  skills_details   JSONB,
  ats_details      JSONB,
  suggestions      JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_image   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies: users
-- =============================================
DROP POLICY IF EXISTS "users_select_own"  ON users;
DROP POLICY IF EXISTS "users_update_own"  ON users;
DROP POLICY IF EXISTS "users_insert_own"  ON users;

CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- RLS Policies: resume_image
-- =============================================
DROP POLICY IF EXISTS "resume_image_select" ON resume_image;
DROP POLICY IF EXISTS "resume_image_insert" ON resume_image;
DROP POLICY IF EXISTS "resume_image_update" ON resume_image;
DROP POLICY IF EXISTS "resume_image_delete" ON resume_image;

CREATE POLICY "resume_image_select" ON resume_image FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "resume_image_insert" ON resume_image FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "resume_image_update" ON resume_image FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "resume_image_delete" ON resume_image FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies: analysis_results
-- =============================================
DROP POLICY IF EXISTS "analysis_results_select" ON analysis_results;
DROP POLICY IF EXISTS "analysis_results_insert" ON analysis_results;

CREATE POLICY "analysis_results_select" ON analysis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analysis_results_insert" ON analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Indexes for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_resume_image_user_id       ON resume_image(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id   ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_resume_id ON analysis_results(resume_id);

-- =============================================
-- Trigger: auto-create user profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
