// ─── POST /api/dev/[username]/claim ────────────────────────────
// Claim ownership of a building. Only the matching GitHub user
// (authenticated via OAuth) can claim their own building.
// No auth required to VIEW profiles — only to CLAIM.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDeveloper, claimDeveloper } from "@/lib/developer-store";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  const { username } = await params;

  // Must be authenticated
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Can only claim your own building
  if (user.login !== username) {
    return NextResponse.json(
      { error: "You can only claim your own building" },
      { status: 403 },
    );
  }

  // Building must exist in the store (i.e. profile has been visited at least once)
  const existing = await getDeveloper(username);
  if (!existing) {
    return NextResponse.json(
      { error: "Building not found — visit the profile first" },
      { status: 404 },
    );
  }

  // Already claimed?
  if (existing.claimed) {
    return NextResponse.json({ already: true, claimed: true, login: username });
  }

  // Claim it
  const updated = await claimDeveloper(username, String(user.id));
  if (!updated) {
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    claimed: true,
    login: updated.login,
    owner_id: updated.owner_id,
  });
}
