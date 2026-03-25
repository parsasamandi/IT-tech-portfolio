-- Run this in Supabase SQL editor to add About Section fields to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'Driving Digital Transformation',
ADD COLUMN IF NOT EXISTS about_paragraph1 TEXT DEFAULT 'With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale. Our team combines deep technical expertise with creative problem-solving.',
ADD COLUMN IF NOT EXISTS about_paragraph2 TEXT DEFAULT 'From startups to enterprise clients, we''ve helped organizations across industries modernize their tech stacks, optimize workflows, and launch products that users love.',
ADD COLUMN IF NOT EXISTS about_stats JSONB DEFAULT '[
  {"value": 150, "suffix": "+", "label": "Projects Completed"},
  {"value": 80, "suffix": "+", "label": "Happy Clients"},
  {"value": 12, "suffix": "+", "label": "Years Experience"},
  {"value": 99, "suffix": "%", "label": "Client Satisfaction"}
]'::jsonb;
