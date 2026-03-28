-- Add About Section fields to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS about_title      TEXT DEFAULT 'About SYSPLAT',
ADD COLUMN IF NOT EXISTS about_paragraph1 TEXT DEFAULT 'SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each "Plat" represents a dedicated platform built with precision, performance, and modern engineering.',
ADD COLUMN IF NOT EXISTS about_paragraph2 TEXT DEFAULT 'We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses.',
ADD COLUMN IF NOT EXISTS about_stats      JSONB DEFAULT '[{"value":11,"suffix":"+","label":"Digital Platforms"},{"value":50,"suffix":"+","label":"Happy Clients"},{"value":100,"suffix":"+","label":"Projects Delivered"},{"value":99,"suffix":"%","label":"Client Satisfaction"}]'::jsonb;
