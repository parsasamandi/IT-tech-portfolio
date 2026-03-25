-- 1. Create the blog_articles table
CREATE TABLE public.blog_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  image_url text,
  tags text[] DEFAULT array[]::text[],
  date date NOT NULL,
  read_time text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow anyone to read articles (Public Access)
CREATE POLICY "Allow public read access on blog_articles"
  ON public.blog_articles
  FOR SELECT
  USING (true);

-- 4. Create Policy: Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to manage blog_articles"
  ON public.blog_articles
  FOR ALL
  USING (auth.role() = 'authenticated');
