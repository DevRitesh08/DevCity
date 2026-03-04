// ─── /city ─────────────────────────────────────────────────────
// The city overview page — renders ALL developer buildings.
// Combines stored developers (from profile visits) with a
// featured seed list to ensure the city is never empty.

import type { Metadata } from "next";
import CityOverviewClient from "./CityOverviewClient";
import { fetchGitHubUser, fetchGitHubStats } from "@/lib/github";
import { computeBuildingDimensions } from "@/lib/building";
import { cached, TTL_CITY } from "@/lib/cache";
import { getAllStoredDevelopers, upsertDeveloper } from "@/lib/developer-store";
import type { CityBuilding } from "@devcity/types";

export const metadata: Metadata = {
  title: "City Overview | DevCity",
  description: "Explore the DevCity skyline — buildings powered by real GitHub data",
};

// Featured developers to populate the initial city
const FEATURED_DEVS = [
  "torvalds",
  "gaearon",
  "sindresorhus",
  "tj",
  "yyx990803",
  "ThePrimeagen",
  "antirez",
  "mitchellh",
];

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

async function fetchBuilding(username: string): Promise<CityBuilding | null> {
  try {
    const [user, stats] = await Promise.all([
      cached(`github:user:${username}`, () => fetchGitHubUser(username), TTL_CITY),
      cached(`github:stats:${username}`, () => fetchGitHubStats(username), TTL_CITY),
    ]);

    const dimensions = computeBuildingDimensions({
      contributions: stats.contributions,
      publicRepos: stats.public_repos,
      totalStars: stats.total_stars,
      followers: stats.followers,
    });

    const langCount: Record<string, number> = {};
    for (const repo of stats.top_repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + repo.stargazers_count;
      }
    }
    const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    return {
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
      position: [0, 0], // Will be computed by layout generator
      district: LANG_DISTRICT[topLang] || "fullstack",
      cosmetics: [],
      highest_tier: null,
    };
  } catch {
    console.warn(`Failed to fetch building for ${username}`);
    return null;
  }
}

export default async function CityPage() {
  // 1. Get all developers already stored from profile visits
  const storedDevs = await getAllStoredDevelopers();
  const storedLogins = new Set(storedDevs.map((d) => d.login));

  // 2. Seed featured devs that haven't been visited yet
  const unseededFeatured = FEATURED_DEVS.filter((u) => !storedLogins.has(u));
  const seededResults = await Promise.all(unseededFeatured.map(fetchBuilding));
  const seededBuildings = seededResults.filter((b): b is CityBuilding => b !== null);

  // Upsert seeded buildings so they persist in the store
  for (const b of seededBuildings) {
    await upsertDeveloper(b);
  }

  // 3. Convert stored developers into CityBuilding objects
  const storedBuildings: CityBuilding[] = storedDevs.map((d) => ({
    login: d.login,
    name: d.name || d.login,
    avatar_url: d.avatar_url,
    rank: d.rank ?? 0,
    contributions: d.contributions,
    public_repos: d.public_repos,
    total_stars: d.total_stars,
    followers: d.followers,
    kudos_count: d.kudos_count,
    visit_count: d.visit_count,
    dimensions: computeBuildingDimensions({
      contributions: d.contributions,
      publicRepos: d.public_repos,
      totalStars: d.total_stars,
      followers: d.followers,
    }),
    position: [0, 0],
    district: d.district,
    cosmetics: [],
    highest_tier: null,
  }));

  // 4. Merge: stored buildings + newly seeded (deduplicated)
  const allLogins = new Set(storedBuildings.map((b) => b.login));
  const freshSeeded = seededBuildings.filter((b) => !allLogins.has(b.login));
  const buildings = [...storedBuildings, ...freshSeeded];

  return <CityOverviewClient buildings={buildings} />;
}
