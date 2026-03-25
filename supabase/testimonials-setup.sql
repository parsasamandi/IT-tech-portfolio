-- Testimonials Table Setup
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Public read access for testimonials'
  ) THEN
    CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable insert for testimonials'
  ) THEN
    CREATE POLICY "Enable insert for testimonials" ON testimonials FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable update for testimonials'
  ) THEN
    CREATE POLICY "Enable update for testimonials" ON testimonials FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable delete for testimonials'
  ) THEN
    CREATE POLICY "Enable delete for testimonials" ON testimonials FOR DELETE USING (true);
  END IF;
END $$;

-- Notify pgrst to reload schema cache
NOTIFY pgrst, 'reload schema';
