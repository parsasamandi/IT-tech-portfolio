/**
 * Supabase Client Configuration
 *
 * Provides browser-side and server-side Supabase clients.
 * Uses environment variables from .env.local
 */
import { createClient } from "@supabase/supabase-js";

// Environment variables (safe defaults for development/demo mode)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabasePublishableKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "";

/**
 * Browser-side Supabase client (singleton)
 * Used in client components for auth and data fetching.
 */
if (!supabaseUrl) {
  console.error("Supabase Error: NEXT_PUBLIC_SUPABASE_URL is missing");
}
if (!supabasePublishableKey) {
  console.error("Supabase Error: Supabase Key (ANON_KEY or DEFAULT_KEY) is missing");
}
if (supabaseUrl && supabasePublishableKey) {
  console.log("Supabase client initialized successfully");
}

export const supabase = (supabaseUrl && supabasePublishableKey)
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabasePublishableKey);
};

/**
 * Create a server-side Supabase client
 * Used in API routes and server components.
 */
export const createServerClient = () => {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
