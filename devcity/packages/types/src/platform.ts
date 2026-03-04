// ─── Platform Types ────────────────────────────────────────────
// Types for multi-platform data integration.

import type { PlatformId } from "./developer";

/** A connected platform account */
export interface PlatformConnection {
  id: string;
  developer_id: string;
  platform: PlatformId;
  platform_username: string;
  /** Whether we have a valid OAuth token */
  is_authenticated: boolean;
  /** Last successful data sync */
  last_synced_at: string | null;
  /** Raw stats from this platform */
  stats: PlatformRawStats;
}

/** Raw GitHub-specific stats */
export interface GitHubStats {
  login: string;
  contributions: number;
  public_repos: number;
  total_stars: number;
  followers: number;
  following: number;
  created_at: string;
  /** Top repositories (up to 20) */
  top_repos: GitHubRepo[];
}

/** A GitHub repository summary */
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  html_url: string;
}

/** Raw GitLab-specific stats (Phase 2) */
export interface GitLabStats {
  username: string;
  merge_requests: number;
  pipelines_run: number;
  projects: number;
  followers: number;
}

/** Raw npm-specific stats (Phase 2) */
export interface NpmStats {
  username: string;
  packages: number;
  weekly_downloads: number;
  total_downloads: number;
}

/** Raw Stack Overflow stats (Phase 2) */
export interface StackOverflowStats {
  user_id: number;
  reputation: number;
  answers: number;
  accepted_answers: number;
  badges: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

/** Union type for all platform stats */
export type PlatformRawStats =
  | { platform: "github"; data: GitHubStats }
  | { platform: "gitlab"; data: GitLabStats }
  | { platform: "npm"; data: NpmStats }
  | { platform: "stackoverflow"; data: StackOverflowStats }
  | { platform: "devto"; data: Record<string, unknown> }
  | { platform: "leetcode"; data: Record<string, unknown> };
