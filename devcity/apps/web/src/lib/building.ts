// ─── Building Dimension Calculator ─────────────────────────────
// Converts developer stats into 3D building geometry.
// This is the core algorithm that makes every building unique.

import type { BuildingDimensions } from "@devcity/types";

/** Input stats needed to compute building dimensions */
export interface BuildingInput {
  contributions: number;
  publicRepos: number;
  totalStars: number;
  followers: number;
}

// ─── Tuning Constants ──────────────────────────────────────────
// These control the "feel" of the city skyline.

/** Minimum building height (even for 0-contribution devs) */
const MIN_HEIGHT = 30;
/** Maximum building height — top contributors get massive skyscrapers */
const MAX_HEIGHT = 800;

/** Floor height in city units */
const FLOOR_HEIGHT = 5;

/** Base windows per floor, increases with width */
const BASE_WINDOWS_PER_FLOOR = 3;

/** Scaling factor for hybrid log height formula */
const HEIGHT_SCALE = 4.0;

// ─── Width Constants ───────────────────────────────────────────
const MIN_WIDTH = 6;
const MAX_WIDTH = 22;

// ─── Main Function ─────────────────────────────────────────────

/**
 * Computes the 3D dimensions of a developer's building based on their stats.
 *
 * The algorithm:
 * - Height: logarithmic scaling of contributions (rewards consistency, not spam)
 * - Width: hybrid formula from repos + height (wider for more repos, avoids needle towers)
 * - Depth: proportional to width with slight random variation
 * - Window density: star-based illumination (popular = brighter)
 * - Glow strength: follower-based halo intensity
 */
export function computeBuildingDimensions(
  input: BuildingInput,
  login: string = "default"
): BuildingDimensions {
  // ── Height (from contributions) ──
  // Hybrid log scaling: log10(contributions+1)^3 * SCALE
  // Creates realistic skyscraper variation:
  // 100 commits → ~62u, 1k → ~138u, 10k → ~286u, 100k+ → ~530u, 200k → ~600u
  const rawHeight =
    input.contributions > 0
      ? Math.pow(Math.log10(input.contributions + 1), 3) * HEIGHT_SCALE
      : 0;
  const height = clamp(MIN_HEIGHT + rawHeight, MIN_HEIGHT, MAX_HEIGHT);

  // ── Width (from repos + height factor) ──
  // Hybrid: log2(repos+1)*2 gives breadth, height*0.05 prevents needle towers
  const baseWidth = Math.log2(input.publicRepos + 1) * 2;
  const heightFactor = height * 0.05;
  const width = clamp(baseWidth + heightFactor, MIN_WIDTH, MAX_WIDTH);

  // ── Depth (proportional to width with seeded variation) ──
  const rng = seededRandom(login + "_depth");
  const depthRatio = 0.85 + rng() * 0.3; // 0.85 to 1.15
  const depth = clamp(width * depthRatio, MIN_WIDTH * 0.85, MAX_WIDTH * 1.15);

  // ── Floor count ──
  const floors = Math.max(2, Math.floor(height / FLOOR_HEIGHT));

  // ── Windows per floor ──
  const windowsPerFloor = Math.max(
    BASE_WINDOWS_PER_FLOOR,
    Math.floor(width / 2.5)
  );
  const sideWindowsPerFloor = Math.max(2, Math.floor(depth / 3));

  // ── Window density (from stars) ──
  // More stars = brighter building. log2 scaling for smooth distribution.
  const windowDensity = clamp(
    Math.log2(input.totalStars + 1) * 0.1,
    0.1,
    0.8
  );

  // ── Lit percentage (same as windowDensity for rendering) ──
  const litPercentage = windowDensity;

  // ── Glow strength (from followers) ──
  // 10 followers → very subtle, 100 → noticeable, 1000 → visible, 10000+ → strong
  const glowStrength = clamp(
    Math.log10(input.followers + 1) * 0.3,
    0,
    1.5
  );

  return {
    height: Math.round(height * 10) / 10,
    width: Math.round(width * 10) / 10,
    depth: Math.round(depth * 10) / 10,
    floors,
    windowsPerFloor,
    sideWindowsPerFloor,
    litPercentage: Math.round(litPercentage * 100) / 100,
    glowStrength: Math.round(glowStrength * 100) / 100,
    windowDensity: Math.round(windowDensity * 100) / 100,
  };
}

// ─── Utility ───────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Seeded Random ─────────────────────────────────────────────
// Deterministic random based on a string seed.
// Used for consistent building appearance from the same username.

export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }

  return () => {
    hash = (hash * 16807 + 0) % 2147483647;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

// ─── District Color Map ────────────────────────────────────────
// Maps district names to their accent colors.
// Used by Building.tsx for district-aware coloring.

export const DISTRICT_COLORS: Record<string, string> = {
  frontend: "#64b5f6", // Blue
  backend: "#c8e64a", // Lime
  fullstack: "#ffd93d", // Yellow
  devops: "#ff8a65", // Orange
  mobile: "#e040fb", // Purple
  data: "#4fc3f7", // Cyan
  "ai-ml": "#f06292", // Pink
  security: "#ff6b6b", // Red
  gamedev: "#aed581", // Light Green
  "open-source": "#6bcb77", // Green
  "vibe-coder": "#9f7aea", // Violet
  creator: "#f0c040", // Gold
};

/**
 * Get the accent color for a building based on its district.
 * Falls back to fullstack yellow if district is unknown.
 */
export function getBuildingColor(login: string, district?: string): string {
  if (district && DISTRICT_COLORS[district]) {
    return DISTRICT_COLORS[district];
  }
  // Fallback: deterministic from login
  const rng = seededRandom(login);
  const colors = Object.values(DISTRICT_COLORS);
  return colors[Math.floor(rng() * colors.length)];
}
