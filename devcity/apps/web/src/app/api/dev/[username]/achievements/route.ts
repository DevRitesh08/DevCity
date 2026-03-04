// ─── GET /api/dev/[username]/achievements ──────────────────────
// Returns the unlocked achievements for a developer.

import { NextResponse } from "next/server";
import { getAchievements } from "@/lib/achievements";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { username } = await params;

  const achievements = getAchievements(username);

  return NextResponse.json({
    login: username,
    count: achievements.length,
    achievements,
  });
}
