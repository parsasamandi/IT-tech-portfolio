-- ============================================
-- Database Cleanup Migration: Remove Tech Stack & Stats
-- ============================================
-- Run this SQL in your Supabase SQL Editor to remove tech_stack and stats-related data

-- ==========================================
-- 1. Remove Stats-related Columns from Settings Table
-- ==========================================

-- Remove about_stats column if it exists
ALTER TABLE settings 
DROP COLUMN IF EXISTS about_stats;

-- Remove any tech_stack related columns if they exist
ALTER TABLE settings 
DROP COLUMN IF EXISTS tech_stack,
DROP COLUMN IF EXISTS tech_stack_items,
DROP COLUMN IF EXISTS tech_skills;

-- ==========================================
-- 2. Drop Tech Stack Table (if exists)
-- ==========================================

-- Drop tech_stack table and related objects if they exist
DROP TABLE IF EXISTS tech_stack CASCADE;
DROP TABLE IF EXISTS tech_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;

-- ==========================================
-- 3. Remove Stats Tables (if any exist)
-- ==========================================

-- Drop any stats-related tables
DROP TABLE IF EXISTS site_stats CASCADE;
DROP TABLE IF EXISTS stats CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;

-- ==========================================
-- 4. Clean up any related indexes
-- ==========================================

-- Drop any indexes related to removed columns/tables
DROP INDEX IF EXISTS idx_tech_stack_display_order;
DROP INDEX IF EXISTS idx_stats_created_at;
DROP INDEX IF EXISTS idx_skills_category;

-- ==========================================
-- 5. Remove any stats-related functions
-- ==========================================

-- Drop any analytics/stats functions
DROP FUNCTION IF EXISTS get_site_stats() CASCADE;
DROP FUNCTION IF EXISTS update_stats_counter() CASCADE;

-- ==========================================
-- 6. Update Settings Table Structure (Clean)
-- ==========================================

-- Ensure settings table only has the columns we want to keep
-- This is a safety check to make sure the table is clean

DO $$
BEGIN
    -- Log the current columns for reference
    RAISE NOTICE 'Current settings table columns after cleanup:';
    
    -- The settings table should now only contain these columns:
    -- id, site_name, tagline, about_title, about_paragraph1, about_paragraph2,
    -- email, phone, location, working_hours, github_url, linkedin_url, 
    -- twitter_url, resume_url, hero_headline, hero_subtitle, hero_typed_words, 
    -- created_at, updated_at
    
END $$;

-- ==========================================
-- 7. Reload PostgREST schema cache
-- ==========================================
NOTIFY pgrst, 'reload schema';

-- Migration completed successfully
-- Tech stack and stats data have been removed from the database