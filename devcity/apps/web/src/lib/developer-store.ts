// ─── Developer Persistence ─────────────────────────────────────
// Persistent storage via Prisma + SQLite.
// Developers survive server restarts. Every search → upsert.

import { prisma } from "./prisma";
import type { CityBuilding } from "@devcity/types";

// Infer Developer type from Prisma client
type PrismaDevRow = Awaited<ReturnType<typeof prisma.developer.findUniqueOrThrow>>;
type PrismaDevRowSelect = { login: string };

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

// ─── Helpers ───────────────────────────────────────────────────

/** Convert Prisma Developer row to StoredDeveloper */
function toStored(row: PrismaDevRow): StoredDeveloper {
  return {
    login: row.login,
    name: row.name,
    avatar_url: row.avatar_url,
    contributions: row.contributions,
    public_repos: row.public_repos,
    total_stars: row.total_stars,
    followers: row.followers,
    district: row.district,
    rank: row.rank,
    dev_score: row.dev_score,
    visit_count: row.visit_count,
    kudos_count: row.kudos_count,
    claimed: row.claimed,
    owner_id: row.owner_id,
    last_seen: row.last_seen.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

// ─── CRUD Operations ───────────────────────────────────────────

/**
 * Upsert a developer record from fetched GitHub data.
 * Call this whenever a profile is viewed — keeps data fresh.
 * Uses database UPSERT to avoid duplicates.
 */
export async function upsertDeveloper(building: CityBuilding): Promise<StoredDeveloper> {
  const devScore = computeDevScore(building);

  const row = await prisma.developer.upsert({
    where: { login: building.login },
    update: {
      name: building.name,
      avatar_url: building.avatar_url,
      contributions: building.contributions,
      public_repos: building.public_repos,
      total_stars: building.total_stars,
      followers: building.followers,
      district: building.district,
      dev_score: devScore,
      visit_count: { increment: 1 },
      // claimed / owner_id are NOT updated — preserved across upserts
    },
    create: {
      login: building.login,
      name: building.name,
      avatar_url: building.avatar_url,
      contributions: building.contributions,
      public_repos: building.public_repos,
      total_stars: building.total_stars,
      followers: building.followers,
      district: building.district,
      dev_score: devScore,
      visit_count: 1,
      kudos_count: 0,
      claimed: false,
      owner_id: null,
    },
  });

  // Recompute ranks
  await recomputeRanks();

  return toStored(row);
}

/**
 * Get a stored developer by login. Returns null if never visited.
 */
export async function getDeveloper(login: string): Promise<StoredDeveloper | null> {
  const row = await prisma.developer.findUnique({ where: { login } });
  return row ? toStored(row) : null;
}

/**
 * Increment visit count for a developer.
 */
export async function incrementVisits(login: string): Promise<void> {
  await prisma.developer.update({
    where: { login },
    data: { visit_count: { increment: 1 } },
  }).catch(() => {
    // Ignore if developer doesn't exist
  });
}

/**
 * Give kudos to a developer.
 */
export async function giveKudos(login: string): Promise<number> {
  try {
    const row = await prisma.developer.update({
      where: { login },
      data: { kudos_count: { increment: 1 } },
    });
    return row.kudos_count;
  } catch {
    return 0;
  }
}

/**
 * Get the top N developers for the leaderboard.
 */
export async function getLeaderboard(
  sortBy: "contributions" | "total_stars" | "dev_score" | "followers" = "dev_score",
  limit: number = 50,
): Promise<LeaderboardEntry[]> {
  const rows: PrismaDevRow[] = await prisma.developer.findMany({
    orderBy: { [sortBy]: "desc" },
    take: limit,
  });

  return rows.map((d: PrismaDevRow, i: number) => ({
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
export async function getCityStats(): Promise<CityStats> {
  const [count, agg] = await Promise.all([
    prisma.developer.count(),
    prisma.developer.aggregate({
      _sum: {
        contributions: true,
        total_stars: true,
        public_repos: true,
      },
    }),
  ]);

  return {
    totalDevelopers: count,
    totalContributions: agg._sum.contributions ?? 0,
    totalStars: agg._sum.total_stars ?? 0,
    totalRepos: agg._sum.public_repos ?? 0,
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
  try {
    const row = await prisma.developer.update({
      where: { login },
      data: {
        claimed: true,
        owner_id: ownerId,
        last_seen: new Date(),
      },
    });
    return toStored(row);
  } catch {
    return null;
  }
}

/**
 * Get all stored developers. Used by the city page to render every
 * building that has been visited at least once.
 */
export async function getAllStoredDevelopers(): Promise<StoredDeveloper[]> {
  const rows = await prisma.developer.findMany();
  return rows.map(toStored);
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
async function recomputeRanks(): Promise<void> {
  const devs = await prisma.developer.findMany({
    orderBy: { dev_score: "desc" },
    select: { login: true },
  });

  // Batch update ranks
  const updates = devs.map((dev: PrismaDevRowSelect, i: number) =>
    prisma.developer.update({
      where: { login: dev.login },
      data: { rank: i + 1 },
    })
  );

  await prisma.$transaction(updates);
}
