/**
 * Supabase Client Configuration
 *
 * Provides browser-side and server-side Supabase clients.
 * Uses environment variables from .env.local
 */
import { createClient } from "@supabase/supabase-js";

// Environment variables (safe defaults for development/demo mode)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Browser-side Supabase client (singleton)
 * Used in client components for auth and data fetching.
 */
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

/**
 * Create a server-side Supabase client
 * Used in API routes and server components.
 */
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
