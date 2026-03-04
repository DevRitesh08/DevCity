// ─── Authentication Utilities ──────────────────────────────────
// GitHub OAuth flow + session management via HTTP-only cookies.
// Works standalone; ready for Supabase Auth upgrade later.

import { cookies } from "next/headers";
import { getServerEnv } from "./env";

// ─── Types ─────────────────────────────────────────────────────

export interface SessionUser {
  /** GitHub numeric ID */
  id: number;
  /** GitHub login */
  login: string;
  /** Display name */
  name: string | null;
  /** Avatar URL */
  avatar_url: string;
  /** Email (may be null if private) */
  email: string | null;
  /** GitHub OAuth access token (for user-scoped API calls) */
  accessToken: string;
}

export interface Session {
  user: SessionUser;
  expiresAt: number; // Unix ms
}

// ─── Constants ─────────────────────────────────────────────────

const SESSION_COOKIE = "devcity_session";
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── GitHub OAuth URLs ─────────────────────────────────────────

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

/**
 * Build the GitHub OAuth authorization URL.
 * Redirects user to GitHub to approve access.
 */
export function getGitHubAuthUrl(state: string): string {
  const env = getServerEnv();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001"}/api/auth/callback`,
    scope: "read:user user:email",
    state,
  });
  return `${GITHUB_AUTHORIZE}?${params.toString()}`;
}

/**
 * Exchange the OAuth code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const env = getServerEnv();
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description ?? data.error}`);
  }

  return data.access_token;
}

/**
 * Fetch the authenticated GitHub user using their access token.
 */
export async function fetchAuthenticatedUser(accessToken: string): Promise<SessionUser> {
  const res = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevCity/0.1",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub user: ${res.status}`);
  }

  const user = await res.json();
  return {
    id: user.id,
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    email: user.email,
    accessToken,
  };
}

// ─── Session Management ────────────────────────────────────────

/**
 * Create a session cookie for the authenticated user.
 * Uses base64-encoded JSON in an HTTP-only cookie.
 * In production, upgrade to encrypted JWT or Supabase sessions.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const session: Session = {
    user,
    expiresAt: Date.now() + SESSION_TTL,
  };

  const encoded = Buffer.from(JSON.stringify(session)).toString("base64");
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL / 1000,
  });
}

/**
 * Get the current session from cookies. Returns null if not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;

    const session: Session = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));

    // Check expiry
    if (session.expiresAt < Date.now()) {
      await destroySession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Destroy the current session (logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Quick helper — get session user or null.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
