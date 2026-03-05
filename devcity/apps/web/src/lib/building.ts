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

/** Minimum building width — narrower for skyscraper proportions */
const MIN_WIDTH = 5;
/** Maximum building width */
const MAX_WIDTH = 18;
/** Width per public repo */
const WIDTH_PER_REPO = 0.15;

/** Depth is proportional to width */
const DEPTH_RATIO = 0.8;
const MIN_DEPTH = 4;

/** Floor height in city units */
const FLOOR_HEIGHT = 5;

/** Base windows per floor, increases with width */
const BASE_WINDOWS_PER_FLOOR = 3;

// ─── Main Function ─────────────────────────────────────────────

/**
 * Computes the 3D dimensions of a developer's building based on their stats.
 *
 * The algorithm:
 * - Height: logarithmic scaling of contributions (rewards consistency, not spam)
 * - Width: linear scaling of public repos (wider = more projects)
 * - Depth: proportional to width (keeps buildings looking good)
 * - Lit windows: based on stars and recent activity
 */
export function computeBuildingDimensions(input: BuildingInput): BuildingDimensions {
  // ── Height (from contributions) ──
  // Power-curve scaling: small devs get recognizable buildings,
  // top contributors get massive skyscrapers that dominate the skyline.
  // 100 commits → ~50u, 1000 → ~105u, 10k → ~280u, 150k → ~800u (capped)
  const rawHeight =
    input.contributions > 0
      ? Math.pow(input.contributions, 0.5) * 2.5
      : 0;
  const height = clamp(MIN_HEIGHT + rawHeight, MIN_HEIGHT, MAX_HEIGHT);

  // ── Width (from public repos) ──
  const rawWidth = input.publicRepos * WIDTH_PER_REPO;
  const width = clamp(MIN_WIDTH + rawWidth, MIN_WIDTH, MAX_WIDTH);

  // ── Depth ──
  const depth = clamp(width * DEPTH_RATIO, MIN_DEPTH, MAX_WIDTH * DEPTH_RATIO);

  // ── Floor count ──
  const floors = Math.max(2, Math.floor(height / FLOOR_HEIGHT));

  // ── Windows per floor ──
  const windowsPerFloor = Math.max(
    BASE_WINDOWS_PER_FLOOR,
    Math.floor(width / 2.5)
  );
  const sideWindowsPerFloor = Math.max(2, Math.floor(depth / 3));

  // ── Lit percentage (from stars + followers) ──
  // More stars = more lit windows. Clamped to 0.1–0.95.
  const starFactor = Math.min(1, input.totalStars / 500);
  const followerFactor = Math.min(1, input.followers / 200);
  const litPercentage = clamp(
    0.1 + starFactor * 0.5 + followerFactor * 0.2,
    0.1,
    0.95
  );

  // ── Glow strength (from followers) ──
  // More followers = stronger building glow. Clamped to 0–1.5.
  const glowStrength = clamp(input.followers / 1000 * 1.5, 0, 1.5);

  // ── Window density (from stars) ──
  // More stars = denser window illumination. Clamped to 0.1–0.8.
  const windowDensity = clamp(0.1 + Math.min(1, input.totalStars / 1000) * 0.7, 0.1, 0.8);

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

// ─── Color Generation ──────────────────────────────────────────
// Generates a building's accent color from their username.

const BUILDING_PALETTES = [
  "#00FFFF", // Cyan (primary)
  "#FF00FF", // Magenta
  "#39FF14", // Neon Green
  "#0066FF", // Electric Blue
  "#FF1493", // Deep Pink
  "#FFB000", // Amber
  "#8B5CF6", // Purple
  "#00CCFF", // Sky Cyan
  "#FF4488", // Hot Pink
  "#44FF88", // Mint
];

export function getBuildingColor(login: string): string {
  const rng = seededRandom(login);
  return BUILDING_PALETTES[Math.floor(rng() * BUILDING_PALETTES.length)];
}
