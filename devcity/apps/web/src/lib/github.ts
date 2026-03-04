// ─── GitHub API Client ─────────────────────────────────────────
// Fetches developer data from the GitHub REST + GraphQL APIs.
// Handles rate limiting, caching headers, and error mapping.

import type { GitHubStats, GitHubRepo } from "@devcity/types";

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/** Get the configured GitHub token */
function getToken(): string {
  return process.env.GITHUB_TOKEN ?? "";
}

/** Standard headers for GitHub API requests */
function headers(): HeadersInit {
  const token = getToken();
  const h: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevCity/0.1",
  };
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  return h;
}

/** Custom error for GitHub API failures */
export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

// ─── REST API Calls ────────────────────────────────────────────

/** Fetch a GitHub user profile */
export async function fetchGitHubUser(username: string): Promise<GitHubUserResponse> {
  const res = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, {
    headers: headers(),
    next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
  });

  if (res.status === 404) {
    throw new GitHubApiError(`User '${username}' not found`, 404, "NOT_FOUND");
  }
  if (res.status === 403) {
    throw new GitHubApiError("GitHub API rate limit exceeded", 403, "RATE_LIMITED");
  }
  if (!res.ok) {
    throw new GitHubApiError(`GitHub API error: ${res.status}`, res.status, "API_ERROR");
  }

  return res.json();
}

/** Fetch a user's top repositories (sorted by stars) */
export async function fetchGitHubRepos(
  username: string,
  limit: number = 20
): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=stars&direction=desc&per_page=${limit}&type=owner`,
    {
      headers: headers(),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new GitHubApiError(`Failed to fetch repos for ${username}`, res.status, "API_ERROR");
  }

  const repos = await res.json();

  return repos.map((repo: GitHubRepoResponse) => ({
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    topics: repo.topics ?? [],
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    html_url: repo.html_url,
  }));
}

/** Fetch contribution count via GraphQL (last year) */
export async function fetchContributions(username: string): Promise<number> {
  const token = getToken();
  if (!token) {
    // Without a token, we can't use GraphQL — return 0
    console.warn("No GITHUB_TOKEN set — contribution count will be 0");
    return 0;
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`GraphQL error for ${username}: ${res.status}`);
    return 0;
  }

  const data = await res.json();
  return (
    data?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0
  );
}

// ─── Aggregate Builder ─────────────────────────────────────────

/**
 * Fetches all GitHub data for a username and returns a unified GitHubStats object.
 * This is the main entry point for the GitHub integration.
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  // Run user profile, repos, and contributions in parallel
  const [user, repos, contributions] = await Promise.all([
    fetchGitHubUser(username),
    fetchGitHubRepos(username),
    fetchContributions(username),
  ]);

  // Calculate total stars across all repos
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  return {
    login: user.login,
    contributions,
    public_repos: user.public_repos,
    total_stars: totalStars,
    followers: user.followers,
    following: user.following,
    created_at: user.created_at,
    top_repos: repos,
  };
}

// ─── Response Types (GitHub API shapes) ────────────────────────

interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepoResponse {
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
