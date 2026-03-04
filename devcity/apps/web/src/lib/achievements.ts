// ─── Achievement Engine ────────────────────────────────────────
// Defines all achievements and checks which ones a developer has unlocked.
// Achievements are evaluated on every profile view, new ones get added.

import type { CityBuilding, AchievementTier } from "@devcity/types";
import type { EnhancedDevData } from "./github-enhanced";

// ─── Types ─────────────────────────────────────────────────────

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  /** Check function — returns true if unlocked */
  check: (ctx: AchievementContext) => boolean;
}

export interface UnlockedAchievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  unlockedAt: string;
}

interface AchievementContext {
  building: CityBuilding;
  enhanced: EnhancedDevData;
  topRepos: { language: string | null; stargazers_count: number }[];
}

// ─── Achievement Definitions ───────────────────────────────────

export const ACHIEVEMENTS: AchievementDef[] = [
  // ─── Bronze (Easy) ───────────────────────
  {
    id: "first_commit",
    name: "First Commit",
    description: "Have at least 1 contribution",
    tier: "bronze",
    icon: "🌱",
    check: (ctx) => ctx.building.contributions >= 1,
  },
  {
    id: "open_source_citizen",
    name: "Open Source Citizen",
    description: "Have at least 5 public repositories",
    tier: "bronze",
    icon: "📦",
    check: (ctx) => ctx.building.public_repos >= 5,
  },
  {
    id: "stargazer",
    name: "Stargazer",
    description: "Earn at least 10 total stars",
    tier: "bronze",
    icon: "⭐",
    check: (ctx) => ctx.building.total_stars >= 10,
  },
  {
    id: "social_coder",
    name: "Social Coder",
    description: "Have at least 10 followers",
    tier: "bronze",
    icon: "👥",
    check: (ctx) => ctx.building.followers >= 10,
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Be a member of at least 1 organization",
    tier: "bronze",
    icon: "🏢",
    check: (ctx) => ctx.enhanced.orgs.length >= 1,
  },

  // ─── Silver (Medium) ─────────────────────
  {
    id: "centurion",
    name: "Centurion",
    description: "Reach 100 contributions in a year",
    tier: "silver",
    icon: "💯",
    check: (ctx) => ctx.building.contributions >= 100,
  },
  {
    id: "rising_star",
    name: "Rising Star",
    description: "Earn 100 total stars across all repos",
    tier: "silver",
    icon: "🌟",
    check: (ctx) => ctx.building.total_stars >= 100,
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Use 5 or more different programming languages",
    tier: "silver",
    icon: "🗣️",
    check: (ctx) => {
      const langs = new Set(ctx.topRepos.map((r) => r.language).filter(Boolean));
      return langs.size >= 5;
    },
  },
  {
    id: "gist_master",
    name: "Gist Master",
    description: "Have at least 5 public gists",
    tier: "silver",
    icon: "📝",
    check: (ctx) => ctx.enhanced.gists.length >= 5,
  },
  {
    id: "repo_builder",
    name: "Repo Builder",
    description: "Have at least 20 public repositories",
    tier: "silver",
    icon: "🏗️",
    check: (ctx) => ctx.building.public_repos >= 20,
  },
  {
    id: "green_pipeline",
    name: "Green Pipeline",
    description: "Have CI passing on all monitored repos",
    tier: "silver",
    icon: "✅",
    check: (ctx) => ctx.enhanced.health.score >= 0.9 && ctx.enhanced.health.statuses.length > 0,
  },

  // ─── Gold (Hard) ─────────────────────────
  {
    id: "thousand_commits",
    name: "Thousand Commits",
    description: "Reach 1,000 contributions in a year",
    tier: "gold",
    icon: "🔥",
    check: (ctx) => ctx.building.contributions >= 1000,
  },
  {
    id: "star_magnet",
    name: "Star Magnet",
    description: "Earn 1,000 total stars",
    tier: "gold",
    icon: "🧲",
    check: (ctx) => ctx.building.total_stars >= 1000,
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Have at least 500 followers",
    tier: "gold",
    icon: "📢",
    check: (ctx) => ctx.building.followers >= 500,
  },
  {
    id: "org_contributor",
    name: "Org Contributor",
    description: "Be a member of 3 or more organizations",
    tier: "gold",
    icon: "🏛️",
    check: (ctx) => ctx.enhanced.orgs.length >= 3,
  },
  {
    id: "package_author",
    name: "Package Author",
    description: "Have at least 1 published package",
    tier: "gold",
    icon: "📦",
    check: (ctx) => ctx.enhanced.packages.length >= 1,
  },

  // ─── Diamond (Elite) ─────────────────────
  {
    id: "legendary",
    name: "Legendary",
    description: "Reach 5,000 contributions in a year",
    tier: "diamond",
    icon: "💎",
    check: (ctx) => ctx.building.contributions >= 5000,
  },
  {
    id: "galaxy_star",
    name: "Galaxy Star",
    description: "Earn 10,000 total stars",
    tier: "diamond",
    icon: "🌌",
    check: (ctx) => ctx.building.total_stars >= 10000,
  },
  {
    id: "mega_influencer",
    name: "Mega Influencer",
    description: "Have 5,000+ followers",
    tier: "diamond",
    icon: "👑",
    check: (ctx) => ctx.building.followers >= 5000,
  },
  {
    id: "fifty_repos",
    name: "Fifty Repos",
    description: "Have at least 50 public repositories",
    tier: "diamond",
    icon: "🏙️",
    check: (ctx) => ctx.building.public_repos >= 50,
  },
];

// ─── Achievement Store (in-memory) ─────────────────────────────

const unlockedStore = new Map<string, Map<string, UnlockedAchievement>>();

/**
 * Evaluate all achievements for a developer and return newly unlocked ones.
 * Persists unlocked achievements in memory (upgrade to DB later).
 */
export function evaluateAchievements(
  building: CityBuilding,
  enhanced: EnhancedDevData,
  topRepos: { language: string | null; stargazers_count: number }[],
): { all: UnlockedAchievement[]; newlyUnlocked: UnlockedAchievement[] } {
  const ctx: AchievementContext = { building, enhanced, topRepos };

  if (!unlockedStore.has(building.login)) {
    unlockedStore.set(building.login, new Map());
  }
  const userAchievements = unlockedStore.get(building.login)!;
  const newlyUnlocked: UnlockedAchievement[] = [];

  for (const def of ACHIEVEMENTS) {
    // Skip already unlocked
    if (userAchievements.has(def.id)) continue;

    try {
      if (def.check(ctx)) {
        const unlocked: UnlockedAchievement = {
          id: def.id,
          name: def.name,
          description: def.description,
          tier: def.tier,
          icon: def.icon,
          unlockedAt: new Date().toISOString(),
        };
        userAchievements.set(def.id, unlocked);
        newlyUnlocked.push(unlocked);
      }
    } catch {
      // If a check fails, skip it silently
    }
  }

  return {
    all: Array.from(userAchievements.values()),
    newlyUnlocked,
  };
}

/**
 * Get all unlocked achievements for a developer.
 */
export function getAchievements(login: string): UnlockedAchievement[] {
  return Array.from(unlockedStore.get(login)?.values() ?? []);
}

/**
 * Tier sort order for display (diamond first).
 */
export const TIER_ORDER: Record<AchievementTier, number> = {
  diamond: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
};

/**
 * Tier colors for display.
 */
export const TIER_COLORS: Record<AchievementTier, string> = {
  diamond: "#b9f2ff",
  gold: "#ffd700",
  silver: "#c0c0c0",
  bronze: "#cd7f32",
};
