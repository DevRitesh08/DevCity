// ─── /dev/[username] ───────────────────────────────────────────
// Developer profile page with 3D building viewer.
// Server-side data fetching → client-side 3D rendering.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchGitHubUser, fetchGitHubStats, GitHubApiError } from "@/lib/github";
import { fetchEnhancedDevData, type EnhancedDevData } from "@/lib/github-enhanced";
import { computeBuildingDimensions } from "@/lib/building";
import { cached, TTL_USER, TTL_STATS, TTL_CI } from "@/lib/cache";
import { upsertDeveloper, type StoredDeveloper } from "@/lib/developer-store";
import { evaluateAchievements, type UnlockedAchievement } from "@/lib/achievements";
import type { CityBuilding } from "@devcity/types";
import DevProfileClient from "./DevProfileClient";

// ─── Metadata ──────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | DevCity`,
    description: `View ${username}'s developer building in DevCity`,
  };
}

// ─── Data Fetching ─────────────────────────────────────────────

interface DevData {
  building: CityBuilding;
  enhanced: EnhancedDevData;
  topRepos: { name: string; language: string | null; stargazers_count: number; html_url: string }[];
  stored: StoredDeveloper;
  achievements: UnlockedAchievement[];
}

async function fetchDevData(username: string): Promise<DevData | null> {
  try {
    const [user, stats] = await Promise.all([
      cached(`github:user:${username}`, () => fetchGitHubUser(username), TTL_USER),
      cached(`github:stats:${username}`, () => fetchGitHubStats(username), TTL_STATS),
    ]);

    const dimensions = computeBuildingDimensions({
      contributions: stats.contributions,
      publicRepos: stats.public_repos,
      totalStars: stats.total_stars,
      followers: stats.followers,
    }, user.login);

    // Infer district from top repos
    const langCount: Record<string, number> = {};
    for (const repo of stats.top_repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + repo.stargazers_count;
      }
    }
    const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const district = inferDistrict(topLang);

    // Fetch enhanced data (CI status, gists, orgs, packages, following)
    const enhanced = await cached(
      `github:enhanced:${username}`,
      () => fetchEnhancedDevData(username, stats.top_repos),
      TTL_CI,
    );

    const building: CityBuilding = {
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      rank: 0,
      contributions: stats.contributions,
      public_repos: stats.public_repos,
      total_stars: stats.total_stars,
      followers: stats.followers,
      kudos_count: 0,
      visit_count: 0,
      dimensions,
      position: [0, 0],
      district,
      cosmetics: [],
      highest_tier: null,
    };

    const topRepos = stats.top_repos.slice(0, 6).map((r) => ({
      name: r.name,
      language: r.language,
      stargazers_count: r.stargazers_count,
      html_url: r.html_url,
    }));

    // Persist to store (upsert on every view)
    const stored = await upsertDeveloper(building);

    // Evaluate achievements
    const { all: achievements } = evaluateAchievements(building, enhanced, topRepos);

    return { building, enhanced, topRepos, stored, achievements };
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ─── District Inference ────────────────────────────────────────

const LANG_DISTRICT: Record<string, string> = {
  JavaScript: "frontend", TypeScript: "frontend", HTML: "frontend",
  CSS: "frontend", Vue: "frontend", Svelte: "frontend",
  Python: "backend", Java: "backend", Go: "backend",
  Ruby: "backend", PHP: "backend", "C#": "backend",
  Rust: "backend", Kotlin: "mobile", Swift: "mobile",
  Dart: "mobile", "Objective-C": "mobile",
  R: "data", Jupyter: "data", Julia: "data",
  Shell: "devops", Dockerfile: "devops", HCL: "devops",
  "C++": "gamedev", Lua: "gamedev", GDScript: "gamedev",
};

function inferDistrict(topLang: string): string {
  return LANG_DISTRICT[topLang] || "fullstack";
}

// ─── Page Component ────────────────────────────────────────────

export default async function DevProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await fetchDevData(username);

  if (!data) {
    notFound();
  }

  return (
    <DevProfileClient
      building={data.building}
      enhanced={data.enhanced}
      topRepos={data.topRepos}
      visits={data.stored.visit_count}
      kudos={data.stored.kudos_count}
      rank={data.stored.rank}
      devScore={data.stored.dev_score}
      achievements={data.achievements}
      claimed={data.stored.claimed}
    />
  );
}
