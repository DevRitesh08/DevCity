// ─── Environment Variable Validation ───────────────────────────
// Centralized env access with runtime validation.
// Fail fast if required variables are missing.

/** Server-side only environment variables */
export function getServerEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    GITHUB_TOKEN: requireEnv("GITHUB_TOKEN"),
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  };
}

/** Client-safe environment variables (NEXT_PUBLIC_*) */
export function getPublicEnv() {
  return {
    SUPABASE_URL: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001",
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "DevCity",
  };
}

/** Throw if an env var is missing */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // In development, we allow placeholder values for easier setup
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠ Missing env var: ${key} — using placeholder`);
      return `placeholder_${key}`;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
