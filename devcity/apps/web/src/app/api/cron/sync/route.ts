// ─── GET /api/cron/sync ────────────────────────────────────────
// Background sync job that refreshes stale developer data from GitHub.
// Designed to be called by Vercel Cron (see vercel.json) on a schedule,
// so the city data stays fresh even when no users are actively browsing.
//
// Security: requires a Bearer token matching the CRON_SECRET env var.
// Vercel Cron automatically sends this via the Authorization header.

import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUser, fetchGitHubStats, GitHubApiError } from "@/lib/github";
import { computeBuildingDimensions } from "@/lib/building";
import {
  getAllStoredDevelopers,
  upsertDeveloper,
  type StoredDeveloper,
} from "@/lib/developer-store";
import { invalidatePrefix } from "@/lib/cache";

/** Re-sync developers whose data is older than this threshold (1 hour). */
const STALE_THRESHOLD_MS = 60 * 60 * 1000;

/** Maximum developers to refresh per cron run to stay within rate limits. */
const MAX_PER_RUN = 20;

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Find stale developers ─────────────────────────────────────
  const now = Date.now();
  const allDevs = getAllStoredDevelopers();

  const staleDevs = allDevs
    .filter((dev) => {
      const updatedAt = new Date(dev.updated_at).getTime();
      return now - updatedAt > STALE_THRESHOLD_MS;
    })
    // Oldest first so the most stale records get refreshed first
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
    .slice(0, MAX_PER_RUN);

  if (staleDevs.length === 0) {
    return NextResponse.json({
      refreshed: 0,
      skipped: 0,
      errors: 0,
      message: "All developer data is up to date",
    });
  }

  // ── Refresh each stale developer ──────────────────────────────
  const results = await Promise.allSettled(staleDevs.map((dev) => refreshDeveloper(dev)));

  const refreshed = results.filter((r) => r.status === "fulfilled").length;
  const errors = results.filter((r) => r.status === "rejected").length;

  // Log failures (visible in Vercel Function logs)
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `[cron/sync] Failed to refresh ${staleDevs[i].login}:`,
        result.reason
      );
    }
  });

  return NextResponse.json({
    refreshed,
    skipped: allDevs.length - staleDevs.length,
    errors,
    total: allDevs.length,
    message: `Synced ${refreshed} developer(s)${errors > 0 ? `, ${errors} error(s)` : ""}`,
  });
}

// ─── Helpers ──────────────────────────────────────────────────

async function refreshDeveloper(dev: StoredDeveloper): Promise<void> {
  const login = dev.login;

  try {
    const [user, stats] = await Promise.all([
      fetchGitHubUser(login),
      fetchGitHubStats(login),
    ]);

    const dimensions = computeBuildingDimensions({
      contributions: stats.contributions,
      publicRepos: stats.public_repos,
      totalStars: stats.total_stars,
      followers: stats.followers,
    });

    await upsertDeveloper({
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      // upsertDeveloper preserves the existing rank from the store;
      // this field is a required placeholder that is not read by the function.
      rank: dev.rank ?? 0,
      contributions: stats.contributions,
      public_repos: stats.public_repos,
      total_stars: stats.total_stars,
      followers: stats.followers,
      kudos_count: dev.kudos_count,
      visit_count: dev.visit_count,
      dimensions,
      position: [0, 0],
      district: dev.district,
      cosmetics: [],
      highest_tier: null,
    });

    // Bust the per-user cache so next request gets fresh data
    invalidatePrefix(`github:${login}`);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      // User deleted — skip silently
      return;
    }
    throw error;
  }
}
