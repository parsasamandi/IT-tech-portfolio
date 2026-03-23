-- ============================================
-- IT Tech Portfolio — Supabase Database Migration
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up the database schema.

-- ==========================================
-- 1. Projects Table
-- Stores portfolio project entries.
-- ==========================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web Apps',
  image_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ==========================================
-- 2. Messages Table
-- Stores contact form submissions.
-- ==========================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for unread messages
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ==========================================
-- 3. Settings Table
-- Stores site configuration (single row).
-- ==========================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'ITTech Portfolio',
  tagline TEXT DEFAULT 'Next-Generation Technology Solutions',
  about_text TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings row
INSERT INTO settings (site_name, tagline, email)
VALUES ('ITTech Portfolio', 'Next-Generation Technology Solutions', 'contact@itportfolio.dev')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 4. Chat Logs Table
-- Stores AI chat conversation logs.
-- ==========================================
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for session lookup
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);

-- ==========================================
-- 5. Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Projects: public read, authenticated write
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Messages: only authenticated can read, anyone can insert
CREATE POLICY "Anyone can submit a message"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage messages"
  ON messages FOR ALL
  USING (auth.role() = 'authenticated');

-- Settings: public read, authenticated write
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Chat logs: anyone can insert, authenticated can read all
CREATE POLICY "Anyone can create chat logs"
  ON chat_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view chat logs"
  ON chat_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- ==========================================
-- 6. Auto-update updated_at trigger
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
