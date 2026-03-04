// ─── Building Cosmetics Engine ─────────────────────────────────
// Defines available cosmetics, manages equipped items per user.
// Cosmetics are unlocked via achievements or purchased with kudos.

export type CosmeticSlot = "roof" | "antenna" | "glow" | "banner" | "facade";

export interface CosmeticDef {
  id: string;
  name: string;
  description: string;
  slot: CosmeticSlot;
  icon: string;
  /** How to unlock — "free" | "achievement:{id}" | "kudos:{cost}" */
  unlockCondition: string;
  /** Preview color for UI */
  previewColor: string;
}

export interface EquippedCosmetic {
  cosmeticId: string;
  slot: CosmeticSlot;
  equippedAt: string;
}

// ─── Cosmetic Catalog ──────────────────────────────────────────

export const COSMETICS: CosmeticDef[] = [
  // ─── Roof Styles ─────────────────────────
  {
    id: "roof_flat",
    name: "Flat Roof",
    description: "Clean modern flat roof",
    slot: "roof",
    icon: "🏢",
    unlockCondition: "free",
    previewColor: "#4a5568",
  },
  {
    id: "roof_pyramid",
    name: "Pyramid Roof",
    description: "Sleek pyramid topper",
    slot: "roof",
    icon: "🔺",
    unlockCondition: "kudos:10",
    previewColor: "#c0a060",
  },
  {
    id: "roof_dome",
    name: "Dome Roof",
    description: "Rounded glass dome",
    slot: "roof",
    icon: "🏛️",
    unlockCondition: "achievement:centurion",
    previewColor: "#88ccff",
  },
  {
    id: "roof_spire",
    name: "Spire Roof",
    description: "Tall pointed spire — for legends",
    slot: "roof",
    icon: "🗼",
    unlockCondition: "achievement:legendary",
    previewColor: "#ffd700",
  },

  // ─── Antenna ─────────────────────────────
  {
    id: "antenna_basic",
    name: "Basic Antenna",
    description: "Simple radio antenna",
    slot: "antenna",
    icon: "📡",
    unlockCondition: "free",
    previewColor: "#718096",
  },
  {
    id: "antenna_satellite",
    name: "Satellite Dish",
    description: "Powerful signal dish",
    slot: "antenna",
    icon: "🛰️",
    unlockCondition: "kudos:20",
    previewColor: "#a0aec0",
  },
  {
    id: "antenna_lightning",
    name: "Lightning Rod",
    description: "Crackles with energy",
    slot: "antenna",
    icon: "⚡",
    unlockCondition: "achievement:thousand_commits",
    previewColor: "#ecc94b",
  },

  // ─── Glow Effects ───────────────────────
  {
    id: "glow_none",
    name: "No Glow",
    description: "Keep it subtle",
    slot: "glow",
    icon: "⬛",
    unlockCondition: "free",
    previewColor: "#2d3748",
  },
  {
    id: "glow_pulse",
    name: "Pulse Glow",
    description: "Gentle pulsing aura",
    slot: "glow",
    icon: "💫",
    unlockCondition: "kudos:5",
    previewColor: "#63b3ed",
  },
  {
    id: "glow_fire",
    name: "Fire Aura",
    description: "Flames lick the base — for top contributors",
    slot: "glow",
    icon: "🔥",
    unlockCondition: "achievement:star_magnet",
    previewColor: "#f56565",
  },
  {
    id: "glow_diamond",
    name: "Diamond Shimmer",
    description: "Prismatic diamond sparkle",
    slot: "glow",
    icon: "💎",
    unlockCondition: "achievement:galaxy_star",
    previewColor: "#b9f2ff",
  },

  // ─── Banner ──────────────────────────────
  {
    id: "banner_none",
    name: "No Banner",
    description: "Keep the facade clean",
    slot: "banner",
    icon: "🚫",
    unlockCondition: "free",
    previewColor: "#2d3748",
  },
  {
    id: "banner_flag",
    name: "Flag Banner",
    description: "A waving flag on top",
    slot: "banner",
    icon: "🏁",
    unlockCondition: "kudos:15",
    previewColor: "#48bb78",
  },
  {
    id: "banner_neon",
    name: "Neon Sign",
    description: "Neon sign with your name",
    slot: "banner",
    icon: "💡",
    unlockCondition: "achievement:rising_star",
    previewColor: "#ed64a6",
  },

  // ─── Facade ──────────────────────────────
  {
    id: "facade_default",
    name: "Default Facade",
    description: "Standard building facade",
    slot: "facade",
    icon: "🧱",
    unlockCondition: "free",
    previewColor: "#4a5568",
  },
  {
    id: "facade_glass",
    name: "Glass Facade",
    description: "Reflective glass panels",
    slot: "facade",
    icon: "🪟",
    unlockCondition: "kudos:25",
    previewColor: "#81e6d9",
  },
  {
    id: "facade_hologram",
    name: "Hologram Facade",
    description: "Futuristic holographic panels",
    slot: "facade",
    icon: "🌈",
    unlockCondition: "achievement:influencer",
    previewColor: "#9f7aea",
  },
];

// ─── Equipped Store (in-memory) ────────────────────────────────

const equippedStore = new Map<string, Map<CosmeticSlot, EquippedCosmetic>>();

/**
 * Get all equipped cosmetics for a user.
 */
export function getEquippedCosmetics(login: string): EquippedCosmetic[] {
  return Array.from(equippedStore.get(login)?.values() ?? []);
}

/**
 * Equip a cosmetic for a user. Replaces any existing cosmetic in that slot.
 */
export function equipCosmetic(login: string, cosmeticId: string): boolean {
  const def = COSMETICS.find((c) => c.id === cosmeticId);
  if (!def) return false;

  if (!equippedStore.has(login)) {
    equippedStore.set(login, new Map());
  }

  equippedStore.get(login)!.set(def.slot, {
    cosmeticId: def.id,
    slot: def.slot,
    equippedAt: new Date().toISOString(),
  });

  return true;
}

/**
 * Unequip a cosmetic from a slot.
 */
export function unequipCosmetic(login: string, slot: CosmeticSlot): boolean {
  return equippedStore.get(login)?.delete(slot) ?? false;
}

/**
 * Check if a cosmetic is unlocked for a user based on achievements and kudos.
 */
export function isCosmeticUnlocked(
  condition: string,
  unlockedAchievementIds: Set<string>,
  kudosCount: number,
): boolean {
  if (condition === "free") return true;

  if (condition.startsWith("achievement:")) {
    const achId = condition.slice("achievement:".length);
    return unlockedAchievementIds.has(achId);
  }

  if (condition.startsWith("kudos:")) {
    const cost = parseInt(condition.slice("kudos:".length), 10);
    return kudosCount >= cost;
  }

  return false;
}
