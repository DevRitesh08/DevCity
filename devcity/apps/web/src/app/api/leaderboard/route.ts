// ─── GET /api/leaderboard ──────────────────────────────────────
// Returns the top developers in DevCity, sorted by the requested criteria.

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard, getCityStats } from "@/lib/developer-store";
import { getAchievements } from "@/lib/achievements";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortBy = (searchParams.get("sort") || "dev_score") as
    | "contributions"
    | "total_stars"
    | "dev_score"
    | "followers";
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 100);

  const entries = await getLeaderboard(sortBy, limit);

  // Enrich with achievement counts
  const enriched = entries.map((e) => ({
    ...e,
    achievementCount: getAchievements(e.login).length,
  }));

  const stats = await getCityStats();

  return NextResponse.json({
    sort: sortBy,
    total: stats.totalDevelopers,
    stats,
    entries: enriched,
  });
}
