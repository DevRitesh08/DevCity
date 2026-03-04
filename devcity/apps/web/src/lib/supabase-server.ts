// ─── Supabase Client (Server) ──────────────────────────────────
// For use in Server Components, API routes, and server actions.
// Uses the service role key — bypasses RLS.

import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerEnv } from "./env";

/**
 * Returns a Supabase admin client for server-side operations.
 * ⚠ Never expose this client to the browser.
 */
export function getSupabaseAdmin() {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  return createClient(publicEnv.SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Returns a Supabase client using anon key for server components.
 * Use when you want RLS to apply.
 */
export function createServerSupabase() {
  const env = getPublicEnv();

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
