// ─── /leaderboard ──────────────────────────────────────────────
// Leaderboard page — server component that fetches data + renders client.

import type { Metadata } from "next";
import { getLeaderboard, getCityStats } from "@/lib/developer-store";
import { getAchievements } from "@/lib/achievements";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard | DevCity",
  description: "Top developers in DevCity ranked by contributions, stars, and more",
};

export default function LeaderboardPage() {
  const entries = getLeaderboard("dev_score", 50);
  const stats = getCityStats();

  const enriched = entries.map((e) => ({
    ...e,
    achievementCount: getAchievements(e.login).length,
  }));

  return <LeaderboardClient entries={enriched} stats={stats} />;
}
