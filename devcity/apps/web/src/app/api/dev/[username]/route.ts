// ─── GET /api/dev/[username] ────────────────────────────────────
// Fetches GitHub data for a developer and returns building-ready stats.
// This is the primary data endpoint for the city.

import { NextResponse } from "next/server";
import { fetchGitHubStats, fetchGitHubUser, GitHubApiError } from "@/lib/github";
import { computeBuildingDimensions } from "@/lib/building";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || username.length > 39) {
    return NextResponse.json(
      { error: "Invalid username", code: "INVALID_USERNAME" },
      { status: 400 }
    );
  }

  try {
    // Fetch GitHub data
    const [user, stats] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubStats(username),
    ]);

    // Compute building dimensions from stats
    const dimensions = computeBuildingDimensions({
      contributions: stats.contributions,
      publicRepos: stats.public_repos,
      totalStars: stats.total_stars,
      followers: stats.followers,
    });

    // Build the response
    const response = {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      location: user.location,
      website: user.blog,
      twitter: user.twitter_username,
      company: user.company,
      stats: {
        contributions: stats.contributions,
        public_repos: stats.public_repos,
        total_stars: stats.total_stars,
        followers: stats.followers,
        following: stats.following,
        top_repos: stats.top_repos.slice(0, 6), // Top 6 for portfolio windows
      },
      building: {
        dimensions,
        district: inferDistrict(stats.top_repos),
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error(`Error fetching dev/${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// ─── District Inference ────────────────────────────────────────
// Determines which city district a developer belongs to based on
// their most-used programming languages.

const DISTRICT_LANG_MAP: Record<string, string> = {
  // Frontend
  JavaScript: "frontend",
  TypeScript: "frontend",
  HTML: "frontend",
  CSS: "frontend",
  Vue: "frontend",
  Svelte: "frontend",
  // Backend
  Python: "backend",
  Java: "backend",
  Go: "backend",
  Ruby: "backend",
  PHP: "backend",
  "C#": "backend",
  // DevOps
  Shell: "devops",
  Dockerfile: "devops",
  HCL: "devops",
  Nix: "devops",
  // Mobile
  Swift: "mobile",
  Kotlin: "mobile",
  Dart: "mobile",
  "Objective-C": "mobile",
  // Data
  R: "data",
  Jupyter: "data",
  Julia: "data",
  // AI/ML
  // (Python is shared — we'll check repo topics for AI)
  // Systems / GameDev
  "C++": "gamedev",
  C: "gamedev",
  Rust: "gamedev",
  Lua: "gamedev",
  // Security
  Assembly: "security",
};

function inferDistrict(
  repos: { language: string | null; topics?: string[] }[]
): string {
  const langCounts: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.language) {
      const district = DISTRICT_LANG_MAP[repo.language] ?? "fullstack";
      langCounts[district] = (langCounts[district] ?? 0) + 1;
    }

    // Check for AI/ML topics
    const topics = repo.topics ?? [];
    if (
      topics.some((t) =>
        ["machine-learning", "deep-learning", "ai", "ml", "llm", "nlp", "tensorflow", "pytorch"].includes(t)
      )
    ) {
      langCounts["ai-ml"] = (langCounts["ai-ml"] ?? 0) + 2; // Weight AI topics higher
    }
  }

  // Return the district with the highest count, or 'fullstack' as default
  let maxDistrict = "fullstack";
  let maxCount = 0;
  for (const [district, count] of Object.entries(langCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxDistrict = district;
    }
  }

  return maxDistrict;
}
