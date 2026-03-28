-- Add working hours to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '[{"day":"Mon - Fri","time":"9:00 AM - 6:00 PM"},{"day":"Saturday","time":"Closed"},{"day":"Sunday","time":"Closed"}]'::jsonb;
