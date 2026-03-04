// ─── Enhanced GitHub Fetchers ──────────────────────────────────
// Additional API calls using the extended token scopes.
// These power advanced building features: health aura, gist art,
// org districts, package factories.

import type { GitHubRepo } from "@devcity/types";

const GITHUB_API = "https://api.github.com";

function getToken(): string {
  return process.env.GITHUB_TOKEN ?? "";
}

function headers(): HeadersInit {
  const token = getToken();
  const h: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevCity/0.1",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// ─── Commit Status (repo:status scope) ─────────────────────────
// Fetches CI/CD status for a repo's default branch.
// Green = passing, red = failing, yellow = pending.

export type CIStatus = "success" | "failure" | "pending" | "unknown";

export interface RepoHealth {
  repo: string;
  status: CIStatus;
  context: string;
  updatedAt: string;
}

/**
 * Get the combined commit status for a repo's default branch.
 * Uses the repo:status scope.
 */
export async function fetchRepoCommitStatus(
  owner: string,
  repo: string
): Promise<RepoHealth> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/HEAD/status`,
      {
        headers: headers(),
        next: { revalidate: 600 }, // 10 min cache (CI changes frequently)
      }
    );

    if (!res.ok) {
      return { repo, status: "unknown", context: "", updatedAt: "" };
    }

    const data = await res.json();
    const state = data.state as string;

    return {
      repo,
      status:
        state === "success" ? "success" :
        state === "failure" || state === "error" ? "failure" :
        state === "pending" ? "pending" :
        "unknown",
      context: data.statuses?.[0]?.context ?? "",
      updatedAt: data.statuses?.[0]?.updated_at ?? "",
    };
  } catch {
    return { repo, status: "unknown", context: "", updatedAt: "" };
  }
}

/**
 * Get overall health score for a developer's top repos.
 * Returns a 0–1 score representing CI health across repos.
 */
export async function fetchDevHealth(
  username: string,
  repos: GitHubRepo[]
): Promise<{ score: number; statuses: RepoHealth[] }> {
  // Check top 5 repos (avoid rate limit hammering)
  const topRepos = repos.slice(0, 5);

  const statuses = await Promise.all(
    topRepos.map((r) => fetchRepoCommitStatus(username, r.name))
  );

  const known = statuses.filter((s) => s.status !== "unknown");
  if (known.length === 0) return { score: 0.5, statuses };

  const successCount = known.filter((s) => s.status === "success").length;
  const score = successCount / known.length;

  return { score, statuses };
}

// ─── Gists (gist scope) ───────────────────────────────────────

export interface GistSummary {
  id: string;
  description: string;
  public: boolean;
  files: string[];
  createdAt: string;
  comments: number;
}

/**
 * Fetch a user's public gists.
 * Used for "street art" / billboards in the city.
 */
export async function fetchGists(username: string, limit = 10): Promise<GistSummary[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/gists?per_page=${limit}`,
      {
        headers: headers(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.map((g: Record<string, unknown>) => ({
      id: g.id as string,
      description: (g.description as string) || "Untitled gist",
      public: g.public as boolean,
      files: Object.keys(g.files as Record<string, unknown>),
      createdAt: g.created_at as string,
      comments: g.comments as number,
    }));
  } catch {
    return [];
  }
}

// ─── Organizations (read:org scope) ────────────────────────────

export interface OrgSummary {
  login: string;
  name: string;
  avatar_url: string;
  description: string;
}

/**
 * Fetch organizations a user belongs to.
 * Used for org-district placement and team buildings.
 */
export async function fetchOrgs(username: string): Promise<OrgSummary[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/orgs`,
      {
        headers: headers(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.map((o: Record<string, unknown>) => ({
      login: o.login as string,
      name: (o.description as string) || (o.login as string),
      avatar_url: o.avatar_url as string,
      description: (o.description as string) || "",
    }));
  } catch {
    return [];
  }
}

// ─── Packages (read:packages scope) ────────────────────────────

export interface PackageSummary {
  name: string;
  packageType: string;
  visibility: string;
  createdAt: string;
}

/**
 * Fetch packages published by a user.
 * Publishers get a "factory" cosmetic on their roof.
 */
export async function fetchPackages(username: string): Promise<PackageSummary[]> {
  try {
    // GitHub Packages API requires auth and returns packages for container/npm/etc.
    const res = await fetch(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/packages?package_type=npm&per_page=10`,
      {
        headers: {
          ...headers(),
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.map((p: Record<string, unknown>) => ({
      name: p.name as string,
      packageType: p.package_type as string,
      visibility: p.visibility as string,
      createdAt: p.created_at as string,
    }));
  } catch {
    return [];
  }
}

// ─── Following/Followers (user:follow scope) ───────────────────

export interface FollowConnection {
  login: string;
  avatar_url: string;
}

/**
 * Fetch who the user is following.
 * Used for the "neighbor" system — buildings of followed devs are nearby.
 */
export async function fetchFollowing(
  username: string,
  limit = 20
): Promise<FollowConnection[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/following?per_page=${limit}`,
      {
        headers: headers(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.map((u: Record<string, unknown>) => ({
      login: u.login as string,
      avatar_url: u.avatar_url as string,
    }));
  } catch {
    return [];
  }
}

// ─── Aggregate Enhanced Stats ──────────────────────────────────
// Fetches all enhanced data for a developer in parallel.

export interface EnhancedDevData {
  health: { score: number; statuses: RepoHealth[] };
  gists: GistSummary[];
  orgs: OrgSummary[];
  packages: PackageSummary[];
  following: FollowConnection[];
}

export async function fetchEnhancedDevData(
  username: string,
  repos: GitHubRepo[]
): Promise<EnhancedDevData> {
  const [health, gists, orgs, packages, following] = await Promise.all([
    fetchDevHealth(username, repos),
    fetchGists(username),
    fetchOrgs(username),
    fetchPackages(username),
    fetchFollowing(username),
  ]);

  return { health, gists, orgs, packages, following };
}
