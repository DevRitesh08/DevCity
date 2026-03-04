// ─── GET /api/auth/login ────────────────────────────────────────
// Redirects user to GitHub OAuth authorization page.

import { NextResponse } from "next/server";
import { getGitHubAuthUrl } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET() {
  // Generate a random state parameter for CSRF protection
  const state = randomBytes(16).toString("hex");

  // Store state in a short-lived cookie for verification in callback
  const url = getGitHubAuthUrl(state);

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
