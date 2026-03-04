// ─── Supabase Client (Browser) ─────────────────────────────────
// Singleton client for use in client components.

import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "./env";

let browserClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns a Supabase client configured for browser-side usage.
 * Uses the anon key — all queries go through RLS.
 */
export function createBrowserSupabase() {
  if (browserClient) return browserClient;

  const env = getPublicEnv();
  browserClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}
