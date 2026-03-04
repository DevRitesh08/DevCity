// ─── Building Types ────────────────────────────────────────────
// A building is the 3D representation of a developer in the city.

import type { AchievementTier } from "./developer";

/** How GitHub data maps to building geometry */
export interface BuildingDimensions {
  /** Height in city units — derived from total contributions */
  height: number;
  /** Width in city units — derived from total repositories */
  width: number;
  /** Depth in city units — derived from repo diversity or fixed ratio */
  depth: number;
  /** Number of rendered floors */
  floors: number;
  /** Windows facing front per floor */
  windowsPerFloor: number;
  /** Windows on the sides per floor */
  sideWindowsPerFloor: number;
  /** 0–1, how many windows are lit (from stars/activity) */
  litPercentage: number;
  /** 0–1.5, follower-based building glow intensity */
  glowStrength: number;
  /** 0.1–0.8, star-based window illumination density */
  windowDensity: number;
}

/** The complete building data for rendering */
export interface CityBuilding {
  /** Developer's GitHub login */
  login: string;
  /** Display name */
  name: string;
  /** Avatar URL */
  avatar_url: string;
  /** Computed rank in the city */
  rank: number;
  /** Raw contribution count */
  contributions: number;
  /** Public repo count */
  public_repos: number;
  /** Total stars */
  total_stars: number;
  /** Total followers */
  followers: number;
  /** Number of kudos received */
  kudos_count: number;
  /** Number of building visits */
  visit_count: number;
  /** Building geometry */
  dimensions: BuildingDimensions;
  /** Position in the city grid [x, z] */
  position: [number, number];
  /** Which district this building belongs to */
  district: string;
  /** Active cosmetic items */
  cosmetics: BuildingCosmetic[];
  /** Highest achievement tier earned */
  highest_tier: AchievementTier | null;
}

/** A cosmetic item applied to a building */
export interface BuildingCosmetic {
  /** Item type: crown, aura, face, roof, etc. */
  slot: CosmeticSlot;
  /** Specific item ID within the slot */
  item_id: string;
  /** Display name */
  name: string;
}

/** Available cosmetic slots on a building */
export type CosmeticSlot =
  | "crown"
  | "aura"
  | "face"
  | "roof"
  | "base"
  | "antenna"
  | "sign";

/** Portfolio project shown as a clickable window */
export interface PortfolioWindow {
  /** Repository full name (e.g., "user/repo") */
  repo: string;
  /** Project name */
  name: string;
  /** Short description */
  description: string | null;
  /** Primary language */
  language: string | null;
  /** Tech stack tags */
  tech_stack: string[];
  /** Star count */
  stars: number;
  /** Fork count */
  forks: number;
  /** Which window position (1–6) */
  position: number;
  /** Is it pinned by the user */
  pinned: boolean;
}
