// ─── GET /api/auth/callback ─────────────────────────────────────
// Handles the GitHub OAuth callback after user authorizes.
// Exchanges code for token, fetches user, creates session.
// NOTE: We set cookies directly on the NextResponse because
// the cookies() API from next/headers doesn't reliably attach
// to a manually returned NextResponse in Route Handlers.

import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  fetchAuthenticatedUser,
  encodeSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

  // Validate state parameter (CSRF protection)
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_state`);
  }

  // Must have a code
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);

    // Fetch the authenticated user's profile
    const user = await fetchAuthenticatedUser(accessToken);

    // Build redirect response with ALL cookies set directly on it
    const response = NextResponse.redirect(`${baseUrl}/dev/${user.login}`);

    // Set session cookie on the response (not via cookies() API)
    response.cookies.set(SESSION_COOKIE_NAME, encodeSessionCookie(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    // Clear the oauth_state cookie
    response.cookies.delete("oauth_state");

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
