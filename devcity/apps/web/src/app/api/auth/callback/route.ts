// ─── GET /api/auth/callback ─────────────────────────────────────
// Handles the GitHub OAuth callback after user authorizes.
// Exchanges code for token, fetches user, creates session.

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchAuthenticatedUser, createSession } from "@/lib/auth";

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

    // Create session cookie
    await createSession(user);

    // Clear the oauth_state cookie
    const response = NextResponse.redirect(`${baseUrl}/dev/${user.login}`);
    response.cookies.delete("oauth_state");
    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
