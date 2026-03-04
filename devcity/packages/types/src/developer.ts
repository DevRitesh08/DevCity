// ─── Developer Types ───────────────────────────────────────────
// Represents a developer in the DevCity system.

/** Supported platform identifiers for multi-platform integration */
export type PlatformId =
  | "github"
  | "gitlab"
  | "npm"
  | "stackoverflow"
  | "devto"
  | "leetcode"
  | "pypi"
  | "crates";

/** Achievement tier levels */
export type AchievementTier = "bronze" | "silver" | "gold" | "diamond";

/** Developer profile — the core entity in DevCity */
export interface Developer {
  /** Internal UUID */
  id: string;
  /** Primary GitHub username (login) */
  login: string;
  /** Display name from GitHub */
  name: string | null;
  /** Avatar URL */
  avatar_url: string;
  /** GitHub bio */
  bio: string | null;
  /** Location string */
  location: string | null;
  /** Personal website */
  website: string | null;
  /** Twitter/X handle */
  twitter: string | null;
  /** Company name */
  company: string | null;
  /** When they joined DevCity */
  created_at: string;
  /** Last data refresh */
  updated_at: string;
}

/** Aggregated stats across all connected platforms */
export interface DeveloperStats {
  developer_id: string;
  /** Total contributions (commits + MRs + answers etc.) */
  total_contributions: number;
  /** Total public repositories */
  total_repos: number;
  /** Total stars received */
  total_stars: number;
  /** Total followers across platforms */
  total_followers: number;
  /** Computed rank in the city (1 = tallest building) */
  rank: number;
  /** Unified DevScore (0–100 scale) */
  dev_score: number;
  /** Per-platform breakdown */
  platform_stats: PlatformStats[];
}

/** Stats from a single platform */
export interface PlatformStats {
  platform: PlatformId;
  username: string;
  contributions: number;
  repos: number;
  stars: number;
  followers: number;
  /** Platform-specific extra data */
  extra: Record<string, unknown>;
  last_synced_at: string;
}

/** Achievement unlocked by a developer */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  unlocked_at: string;
}

/** Daily check-in streak */
export interface Streak {
  developer_id: string;
  current_streak: number;
  longest_streak: number;
  last_checkin: string;
}
