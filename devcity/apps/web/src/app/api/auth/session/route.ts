// ─── GET /api/auth/session ──────────────────────────────────────
// Returns current session user data (without access token).
// Used by client components to check auth state.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Never expose the access token to the client
  return NextResponse.json({
    user: {
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      email: user.email,
    },
  });
}
