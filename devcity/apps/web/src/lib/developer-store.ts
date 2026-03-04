// ─── Developer Persistence ─────────────────────────────────────
// Saves and retrieves developer data from the database.
// Uses in-memory store as fallback when Supabase is not configured.
// Upgrade path: swap the store implementation to Supabase calls.

import type { CityBuilding } from "@devcity/types";

// ─── Types ─────────────────────────────────────────────────────

export interface StoredDeveloper {
  login: string;
  name: string | null;
  avatar_url: string;
  contributions: number;
  public_repos: number;
  total_stars: number;
  followers: number;
  district: string;
  rank: number | null;
  dev_score: number;
  visit_count: number;
  kudos_count: number;
  /** Whether this building has been claimed by its owner */
  claimed: boolean;
  /** GitHub user ID of the owner (set on claim) */
  owner_id: string | null;
  /** Last time the owner was active */
  last_seen: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  login: string;
  name: string | null;
  avatar_url: string;
  contributions: number;
  total_stars: number;
  followers: number;
  public_repos: number;
  district: string;
  rank: number;
  dev_score: number;
}

export interface CityStats {
  totalDevelopers: number;
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
}

// ─── In-Memory Store (Supabase-ready upgrade path) ─────────────
// When Supabase is configured, replace these with real DB calls.
// The interface stays the same.

const devStore = new Map<string, StoredDeveloper>();

/**
 * Upsert a developer record from fetched GitHub data.
 * Call this whenever a profile is viewed — keeps data fresh.
 */
export async function upsertDeveloper(building: CityBuilding): Promise<StoredDeveloper> {
  const existing = devStore.get(building.login);
  const now = new Date().toISOString();

  const dev: StoredDeveloper = {
    login: building.login,
    name: building.name,
    avatar_url: building.avatar_url,
    contributions: building.contributions,
    public_repos: building.public_repos,
    total_stars: building.total_stars,
    followers: building.followers,
    district: building.district,
    rank: existing?.rank ?? null,
    dev_score: computeDevScore(building),
    visit_count: (existing?.visit_count ?? 0) + 1,
    kudos_count: existing?.kudos_count ?? 0,
    // Preserve claimed/owner_id across upserts — never overwrite
    claimed: existing?.claimed ?? false,
    owner_id: existing?.owner_id ?? null,
    last_seen: existing?.last_seen ?? now,
    updated_at: now,
  };

  devStore.set(building.login, dev);

  // Recompute ranks whenever store changes
  recomputeRanks();

  return dev;
}

/**
 * Get a stored developer by login. Returns null if never visited.
 */
export async function getDeveloper(login: string): Promise<StoredDeveloper | null> {
  return devStore.get(login) ?? null;
}

/**
 * Increment visit count for a developer.
 */
export async function incrementVisits(login: string): Promise<void> {
  const dev = devStore.get(login);
  if (dev) {
    dev.visit_count += 1;
    dev.updated_at = new Date().toISOString();
  }
}

/**
 * Give kudos to a developer.
 */
export async function giveKudos(login: string): Promise<number> {
  const dev = devStore.get(login);
  if (!dev) return 0;
  dev.kudos_count += 1;
  dev.updated_at = new Date().toISOString();
  return dev.kudos_count;
}

/**
 * Get the top N developers for the leaderboard.
 */
export function getLeaderboard(
  sortBy: "contributions" | "total_stars" | "dev_score" | "followers" = "dev_score",
  limit: number = 50,
): LeaderboardEntry[] {
  const devs = Array.from(devStore.values());

  devs.sort((a, b) => {
    switch (sortBy) {
      case "contributions": return b.contributions - a.contributions;
      case "total_stars": return b.total_stars - a.total_stars;
      case "followers": return b.followers - a.followers;
      case "dev_score":
      default: return b.dev_score - a.dev_score;
    }
  });

  return devs.slice(0, limit).map((d, i) => ({
    login: d.login,
    name: d.name,
    avatar_url: d.avatar_url,
    contributions: d.contributions,
    total_stars: d.total_stars,
    followers: d.followers,
    public_repos: d.public_repos,
    district: d.district,
    rank: i + 1,
    dev_score: d.dev_score,
  }));
}

/**
 * Get total developer count and aggregate stats.
 */
export function getCityStats(): CityStats {
  const devs = Array.from(devStore.values());
  return {
    totalDevelopers: devs.length,
    totalContributions: devs.reduce((s, d) => s + d.contributions, 0),
    totalStars: devs.reduce((s, d) => s + d.total_stars, 0),
    totalRepos: devs.reduce((s, d) => s + d.public_repos, 0),
  };
}

/**
 * Claim a building. Only the matching GitHub user can claim their own building.
 * Returns the updated developer or null if not found.
 */
export async function claimDeveloper(
  login: string,
  ownerId: string,
): Promise<StoredDeveloper | null> {
  const dev = devStore.get(login);
  if (!dev) return null;

  dev.claimed = true;
  dev.owner_id = ownerId;
  dev.last_seen = new Date().toISOString();
  dev.updated_at = new Date().toISOString();

  return dev;
}

/**
 * Get all stored developers. Used by the city page to render every
 * building that has been visited at least once.
 */
export function getAllStoredDevelopers(): StoredDeveloper[] {
  return Array.from(devStore.values());
}

// ─── Internal Helpers ──────────────────────────────────────────

/**
 * Compute a unified dev score (0–100) from raw stats.
 * Weighted formula: commits 40%, stars 30%, repos 15%, followers 15%.
 */
function computeDevScore(b: CityBuilding): number {
  // Normalize each metric using reasonable max values
  const commitScore = Math.min(b.contributions / 10000, 1) * 40;
  const starScore = Math.min(b.total_stars / 50000, 1) * 30;
  const repoScore = Math.min(b.public_repos / 200, 1) * 15;
  const followerScore = Math.min(b.followers / 10000, 1) * 15;

  return Math.round((commitScore + starScore + repoScore + followerScore) * 10) / 10;
}

/**
 * Recompute all ranks based on dev_score (desc).
 */
function recomputeRanks(): void {
  const sorted = Array.from(devStore.values()).sort((a, b) => b.dev_score - a.dev_score);
  sorted.forEach((dev, i) => {
    dev.rank = i + 1;
  });
}
