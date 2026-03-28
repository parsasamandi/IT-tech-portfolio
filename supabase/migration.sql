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


-- ============================================================
-- 7. SYSPLAT FULL CONTENT SEED
-- ============================================================
-- Run this entire section once in the Supabase SQL Editor.
-- It populates every database-driven section of the website:
--   settings (About + Contact), testimonials, projects, blog_articles
-- ============================================================


-- 7a. Ensure About + Contact columns exist on settings --------
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS about_title      TEXT,
  ADD COLUMN IF NOT EXISTS about_paragraph1 TEXT,
  ADD COLUMN IF NOT EXISTS about_paragraph2 TEXT,
  ADD COLUMN IF NOT EXISTS about_stats      JSONB,
  ADD COLUMN IF NOT EXISTS working_hours    JSONB;


-- 7b. Site settings (About + Contact) ------------------------
-- UPDATE forces correct values regardless of old column defaults.
UPDATE settings SET
  site_name         = 'SYSPLAT',
  tagline           = 'Intelligent Digital Platforms',
  about_title       = 'About SYSPLAT',
  about_paragraph1  = 'SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each "Plat" represents a dedicated platform built with precision, performance, and modern engineering.',
  about_paragraph2  = 'We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses.',
  about_stats       = '[{"value":11,"suffix":"+","label":"Digital Platforms"},{"value":50,"suffix":"+","label":"Happy Clients"},{"value":100,"suffix":"+","label":"Projects Delivered"},{"value":99,"suffix":"%","label":"Client Satisfaction"}]'::jsonb,
  email             = 'contact@sysplat.com',
  phone             = '',
  location          = 'Vancouver, BC',
  working_hours     = '[{"day":"Mon - Fri","time":"9:00 AM - 6:00 PM"},{"day":"Saturday","time":"Closed"},{"day":"Sunday","time":"Closed"}]'::jsonb,
  github_url        = 'https://github.com',
  linkedin_url      = 'https://linkedin.com',
  twitter_url       = 'https://twitter.com',
  updated_at        = now();

-- Seed a row if the table is still empty.
INSERT INTO settings (
  site_name, tagline,
  about_title, about_paragraph1, about_paragraph2, about_stats,
  email, phone, location, working_hours,
  github_url, linkedin_url, twitter_url
)
SELECT
  'SYSPLAT',
  'Intelligent Digital Platforms',
  'About SYSPLAT',
  'SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each "Plat" represents a dedicated platform built with precision, performance, and modern engineering.',
  'We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses.',
  '[{"value":11,"suffix":"+","label":"Digital Platforms"},{"value":50,"suffix":"+","label":"Happy Clients"},{"value":100,"suffix":"+","label":"Projects Delivered"},{"value":99,"suffix":"%","label":"Client Satisfaction"}]'::jsonb,
  'contact@sysplat.com', '', 'Vancouver, BC',
  '[{"day":"Mon - Fri","time":"9:00 AM - 6:00 PM"},{"day":"Saturday","time":"Closed"},{"day":"Sunday","time":"Closed"}]'::jsonb,
  'https://github.com', 'https://linkedin.com', 'https://twitter.com'
WHERE NOT EXISTS (SELECT 1 FROM settings);


-- 7c. Testimonials -------------------------------------------
DELETE FROM testimonials;

INSERT INTO testimonials (name, role, content, rating, featured) VALUES
(
  'CEO, Retail Company',
  'CEO',
  'SYSPLAT transformed our business with a complete digital ecosystem. From website to CRM to AI automation — everything works seamlessly.',
  5, true
),
(
  'Marketing Director',
  'Marketing Director',
  'Their marketing and content platforms helped us triple our online engagement in 90 days.',
  5, true
),
(
  'Clinic Manager',
  'Clinic Manager',
  'The Appointment Plat and CRM Plat saved us hours of manual work every week.',
  5, true
);


-- 7d. Projects (Portfolio) -----------------------------------
DELETE FROM projects;

INSERT INTO projects (title, description, category, image_url, tags, live_url, github_url, featured) VALUES
(
  'Corporate Website Redesign',
  'High-performance corporate website with modern design, SEO optimization, and a headless CMS for seamless content management.',
  'Websites', '',
  ARRAY['Next.js','Tailwind CSS','Headless CMS','SEO'],
  '#', '', true
),
(
  'E-Commerce Store',
  'Full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.',
  'Websites', '',
  ARRAY['React','Stripe','Node.js','PostgreSQL'],
  '#', '', true
),
(
  'AI Customer Support Chatbot',
  'Multilingual AI-powered chatbot with lead qualification, CRM integration, and automated customer support flows.',
  'AI & Chatbots', '',
  ARRAY['OpenAI','NLP','CRM Integration','Multilingual'],
  '#', '', true
),
(
  'CRM Dashboard Platform',
  'Custom CRM with lead tracking, sales pipeline automation, reporting, and real-time analytics for enterprise clients.',
  'CRM & Dashboards', '',
  ARRAY['React','TypeScript','PostgreSQL','Analytics'],
  '#', '', true
),
(
  'Clinic Booking System',
  'Online appointment scheduling with calendar sync, automated reminders, payment integration, and staff management.',
  'Booking Systems', '',
  ARRAY['Next.js','Calendar API','Stripe','Automation'],
  '#', '', false
),
(
  'Social Media Growth Campaign',
  'End-to-end digital marketing campaign with SEO, social ads, content strategy, and analytics-driven optimization.',
  'Marketing', '',
  ARRAY['SEO','Social Ads','Analytics','Content Strategy'],
  '#', '', false
),
(
  'Loyalty Management System',
  'Points & rewards platform with tiered memberships, gamification, CRM integration, and customer behavior analytics.',
  'CRM & Dashboards', '',
  ARRAY['Loyalty','Gamification','CRM','Analytics'],
  '#', '', false
),
(
  'Gym & Fitness Platform',
  'Digital fitness system with member management, class scheduling, trainer dashboards, and subscription billing.',
  'Booking Systems', '',
  ARRAY['Member Mgmt','Scheduling','Billing','Dashboards'],
  '#', '', false
);


-- 7e. Blog Articles ------------------------------------------
DELETE FROM blog_articles;

INSERT INTO blog_articles (title, excerpt, image_url, tags, date, read_time, slug) VALUES
(
  'Why Every Business Needs a Digital Platform in 2026',
  'Discover how modular digital platforms can accelerate growth, automate operations, and elevate your business presence.',
  '',
  ARRAY['Business','Digital Platforms','Strategy'],
  '2026-01-15', '6 min read', 'business-digital-platform-2026'
),
(
  'AI Chatbots: The Future of Customer Engagement',
  'How AI-powered chatbots are revolutionizing customer support, lead qualification, and sales automation across industries.',
  '',
  ARRAY['AI','Chatbots','Automation'],
  '2026-02-10', '7 min read', 'ai-chatbots-customer-engagement'
),
(
  'Building a Loyalty Management System That Works',
  'A deep dive into points & rewards, gamification, and customer retention strategies that drive lifetime value.',
  '',
  ARRAY['Loyalty','CRM','Retention'],
  '2026-03-01', '8 min read', 'loyalty-management-system'
);


-- 7f. Reload PostgREST schema cache --------------------------
NOTIFY pgrst, 'reload schema';
