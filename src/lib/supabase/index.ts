import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============= Server-side Client =============

let cachedClient: SupabaseClient | null = null;

/**
 * Get server-side Supabase client (singleton pattern)
 * Uses service role key for admin operations
 */
export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cachedClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cachedClient;
}

// ============= Client-side Client =============

/**
 * Get public Supabase client for client-side usage
 * Uses anon key for public operations
 */
export function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase environment variables not configured');
    return null;
  }

  return createClient(url, key);
}

// ============= Type Exports =============

export type { SupabaseClient };
