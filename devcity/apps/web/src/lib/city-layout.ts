// ─── City Layout Generator ─────────────────────────────────────
// Computes the spatial layout of all buildings in the city.
// Handles grid placement, district zones, street gaps, and sizing.

import type { CityBuilding, CityLayout, District, CityPlaza, CityDecoration } from "@devcity/types";
import type { DistrictName } from "@devcity/types";

// ─── Layout Constants ──────────────────────────────────────────

/** Space between adjacent buildings */
const STREET_WIDTH = 8;
/** Extra gap for major avenues (every N buildings) */
const AVENUE_INTERVAL = 5;
const AVENUE_WIDTH = 16;
/** Padding within district boundaries */
const DISTRICT_PADDING = 20;

// ─── District Definitions ──────────────────────────────────────

interface DistrictZone {
  name: DistrictName;
  displayName: string;
  color: string;
  /** Angle in radians from city center — determines spatial placement */
  angle: number;
}

const DISTRICT_ZONES: DistrictZone[] = [
  { name: "frontend",    displayName: "Frontend Quarter",    color: "#64b5f6", angle: 0 },
  { name: "backend",     displayName: "Backend District",    color: "#c8e64a", angle: Math.PI * 0.4 },
  { name: "fullstack",   displayName: "Fullstack Heights",   color: "#ffd93d", angle: Math.PI * 0.8 },
  { name: "devops",      displayName: "DevOps Industrial",   color: "#ff8a65", angle: Math.PI * 1.2 },
  { name: "mobile",      displayName: "Mobile Row",          color: "#e040fb", angle: Math.PI * 1.6 },
  { name: "data",        displayName: "Data Lake",           color: "#4fc3f7", angle: Math.PI * 0.2 },
  { name: "ai-ml",       displayName: "AI Research Park",    color: "#f06292", angle: Math.PI * 0.6 },
  { name: "security",    displayName: "Security Compound",   color: "#ff6b6b", angle: Math.PI * 1.0 },
  { name: "gamedev",     displayName: "Game Arcade",         color: "#aed581", angle: Math.PI * 1.4 },
  { name: "open-source", displayName: "Open Source Commons", color: "#6bcb77", angle: Math.PI * 1.8 },
];

// ─── Main Layout Function ──────────────────────────────────────

/**
 * Generates the full city layout from an array of buildings.
 * Buildings are grouped by district, then placed in a radial grid
 * emanating from the city center.
 */
export function generateCityLayout(buildings: CityBuilding[]): CityLayout {
  if (buildings.length === 0) {
    return emptyLayout();
  }

  // Group buildings by district
  const districtGroups = groupByDistrict(buildings);

  // Compute district centers based on population
  const districts = computeDistrictCenters(districtGroups);

  // Place buildings within their districts
  const placedBuildings = placeBuildings(districtGroups, districts);

  // Generate decorations (street lamps, trees)
  const decorations = generateDecorations(placedBuildings, districts);

  // Generate plazas at district centers
  const plazas = generatePlazas(districts);

  return {
    buildings: placedBuildings,
    districts,
    plazas,
    decorations,
    rivers: [],   // Phase 1 feature
    bridges: [],  // Phase 1 feature
    stats: {
      total_developers: placedBuildings.length,
      total_contributions: placedBuildings.reduce((sum, b) => sum + b.contributions, 0),
      total_buildings: placedBuildings.length,
      live_users: 0,
    },
  };
}

// ─── Grouping ──────────────────────────────────────────────────

function groupByDistrict(buildings: CityBuilding[]): Map<string, CityBuilding[]> {
  const groups = new Map<string, CityBuilding[]>();

  for (const building of buildings) {
    const district = building.district || "fullstack";
    if (!groups.has(district)) {
      groups.set(district, []);
    }
    groups.get(district)!.push(building);
  }

  // Sort each district by contributions (descending) — tallest buildings near center
  for (const [, group] of groups) {
    group.sort((a, b) => b.contributions - a.contributions);
  }

  return groups;
}

// ─── District Centers ──────────────────────────────────────────

function computeDistrictCenters(
  groups: Map<string, CityBuilding[]>
): District[] {
  const districts: District[] = [];

  // Radius from city center scales with total population
  const totalBuildings = Array.from(groups.values()).reduce(
    (sum, g) => sum + g.length,
    0
  );
  const baseRadius = Math.max(80, Math.sqrt(totalBuildings) * 25);

  for (const zone of DISTRICT_ZONES) {
    const group = groups.get(zone.name);
    if (!group || group.length === 0) continue;

    // Position district center using radial layout
    const radius = baseRadius + group.length * 3;
    const cx = Math.cos(zone.angle) * radius;
    const cz = Math.sin(zone.angle) * radius;

    // District radius based on building count
    const districtRadius = Math.max(
      DISTRICT_PADDING * 2,
      Math.sqrt(group.length) * 20
    );

    districts.push({
      name: zone.name,
      displayName: zone.displayName,
      color: zone.color,
      center: [Math.round(cx), Math.round(cz)],
      radius: Math.round(districtRadius),
    });
  }

  return districts;
}

// ─── Building Placement ────────────────────────────────────────

/**
 * Places buildings in a grid pattern within each district.
 * Tallest buildings go near the district center.
 * Streets and avenues create natural gaps.
 */
function placeBuildings(
  groups: Map<string, CityBuilding[]>,
  districts: District[]
): CityBuilding[] {
  const placed: CityBuilding[] = [];

  for (const district of districts) {
    const group = groups.get(district.name);
    if (!group) continue;

    const [cx, cz] = district.center;

    // Compute grid dimensions — roughly square
    const cols = Math.max(1, Math.ceil(Math.sqrt(group.length)));

    for (let i = 0; i < group.length; i++) {
      const building = group[i];
      const row = Math.floor(i / cols);
      const col = i % cols;

      // Spacing: building width + street, with avenues at intervals
      const maxWidth = building.dimensions.width;
      const maxDepth = building.dimensions.depth;

      const streetX = col % AVENUE_INTERVAL === 0 ? AVENUE_WIDTH : STREET_WIDTH;
      const streetZ = row % AVENUE_INTERVAL === 0 ? AVENUE_WIDTH : STREET_WIDTH;

      const cellWidth = maxWidth + streetX;
      const cellDepth = maxDepth + streetZ;

      // Center the grid on the district center
      const gridOffsetX = -(cols * cellWidth) / 2;
      const gridOffsetZ = -(Math.ceil(group.length / cols) * cellDepth) / 2;

      const x = cx + gridOffsetX + col * cellWidth + cellWidth / 2;
      const z = cz + gridOffsetZ + row * cellDepth + cellDepth / 2;

      placed.push({
        ...building,
        position: [Math.round(x * 10) / 10, Math.round(z * 10) / 10],
      });
    }
  }

  return placed;
}

// ─── Decorations ───────────────────────────────────────────────

function generateDecorations(
  buildings: CityBuilding[],
  districts: District[]
): CityDecoration[] {
  const decorations: CityDecoration[] = [];

  // Add street lamps along avenues
  for (const district of districts) {
    const [cx, cz] = district.center;
    const r = district.radius;

    // Lamps at district borders
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      decorations.push({
        type: "lamp",
        position: [
          cx + Math.cos(angle) * r * 0.8,
          0,
          cz + Math.sin(angle) * r * 0.8,
        ],
        rotation: angle,
      });
    }

    // Trees around district perimeter
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      decorations.push({
        type: "tree",
        position: [
          cx + Math.cos(angle) * r,
          0,
          cz + Math.sin(angle) * r,
        ],
        rotation: 0,
      });
    }
  }

  return decorations;
}

// ─── Plazas ────────────────────────────────────────────────────

function generatePlazas(districts: District[]): CityPlaza[] {
  const plazas: CityPlaza[] = [];

  // Central plaza at city origin
  plazas.push({
    position: [0, 0],
    size: [40, 40],
    type: "fountain",
  });

  // Each district gets a small plaza at its center
  for (const district of districts) {
    plazas.push({
      position: district.center,
      size: [20, 20],
      type: "plaza",
    });
  }

  return plazas;
}

// ─── Helpers ───────────────────────────────────────────────────

function emptyLayout(): CityLayout {
  return {
    buildings: [],
    districts: [],
    plazas: [{ position: [0, 0], size: [40, 40], type: "fountain" }],
    decorations: [],
    rivers: [],
    bridges: [],
    stats: {
      total_developers: 0,
      total_contributions: 0,
      total_buildings: 0,
      live_users: 0,
    },
  };
}

// ─── Quick Layout for Single Developer ─────────────────────────
// When searching for a single dev, center them in the viewport.

export function generateSingleBuildingLayout(building: CityBuilding): CityLayout {
  return {
    buildings: [{ ...building, position: [0, 0] }],
    districts: [
      {
        name: (building.district as DistrictName) || "fullstack",
        displayName: building.district || "Fullstack Heights",
        color: "#ffd93d",
        center: [0, 0],
        radius: 60,
      },
    ],
    plazas: [{ position: [0, 0], size: [30, 30], type: "fountain" }],
    decorations: [],
    rivers: [],
    bridges: [],
    stats: {
      total_developers: 1,
      total_contributions: building.contributions,
      total_buildings: 1,
      live_users: 0,
    },
  };
}
