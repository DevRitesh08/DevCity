// ─── City Types ────────────────────────────────────────────────
// Types for the city layout, districts, and decorations.

/** District names matching developer specializations */
export type DistrictName =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "mobile"
  | "data"
  | "ai-ml"
  | "security"
  | "gamedev"
  | "open-source";

/** District metadata */
export interface District {
  name: DistrictName;
  displayName: string;
  /** Hex color for the district */
  color: string;
  /** Position of district center in city grid */
  center: [number, number];
  /** Radius of the district */
  radius: number;
}

/** City-level statistics */
export interface CityStats {
  total_developers: number;
  total_contributions: number;
  total_buildings: number;
  live_users: number;
}

/** A plaza / park in the city */
export interface CityPlaza {
  position: [number, number];
  size: [number, number];
  type: "park" | "plaza" | "fountain";
}

/** Street decoration element */
export interface CityDecoration {
  type: "lamp" | "bench" | "tree" | "car" | "sign";
  position: [number, number, number];
  rotation: number;
}

/** River segment */
export interface CityRiver {
  path: [number, number][];
  width: number;
}

/** Bridge over a river */
export interface CityBridge {
  position: [number, number];
  rotation: number;
  length: number;
}

/** Full city layout data */
export interface CityLayout {
  buildings: import("./building").CityBuilding[];
  districts: District[];
  plazas: CityPlaza[];
  decorations: CityDecoration[];
  rivers: CityRiver[];
  bridges: CityBridge[];
  stats: CityStats;
}

/** Theme configuration for the city */
export interface CityTheme {
  name: string;
  sky: string;
  ground: string;
  fog: string;
  accent: string;
  shadow: string;
  ambient: number;
  directional: number;
}

/** Predefined city themes */
export const CITY_THEMES: Record<string, CityTheme> = {
  midnight: {
    name: "Midnight",
    sky: "#0a0e1a",
    ground: "#111827",
    fog: "#0a0e1a",
    accent: "#c8e64a",
    shadow: "#6a7a20",
    ambient: 0.3,
    directional: 0.5,
  },
  sunset: {
    name: "Sunset",
    sky: "#1a0a1e",
    ground: "#1e1020",
    fog: "#1a0a1e",
    accent: "#ff6b6b",
    shadow: "#8b3a3a",
    ambient: 0.4,
    directional: 0.6,
  },
  dawn: {
    name: "Dawn",
    sky: "#0d1b2a",
    ground: "#1b2838",
    fog: "#0d1b2a",
    accent: "#64b5f6",
    shadow: "#375a7f",
    ambient: 0.45,
    directional: 0.7,
  },
  neon: {
    name: "Neon",
    sky: "#0a000a",
    ground: "#120012",
    fog: "#0a000a",
    accent: "#e040fb",
    shadow: "#7b1fa2",
    ambient: 0.25,
    directional: 0.4,
  },
};
