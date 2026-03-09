// src/lib/palette.ts — SINGLE SOURCE OF TRUTH FOR ALL COLORS
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL PALETTE

export const PALETTE = {
  // ── OCEAN ──────────────────────────────────────────────────────────────
  ocean_deep:      '#1a6b8a',   // deep water, far from shore
  ocean_shallow:   '#4ecdc4',   // near-shore teal
  ocean_foam:      '#e8f4f8',   // wave foam, shore edge
  ocean_fog:       '#c9e8f5',   // horizon mist color

  // ── TERRAIN ────────────────────────────────────────────────────────────
  sand_beach:      '#e8d5a3',   // beach perimeter, flat
  sand_dry:        '#c8a96e',   // higher dry sand
  grass_bright:    '#5a9c4f',   // sunny grass faces
  grass_mid:       '#4a7c59',   // standard grass (primary biome color)
  grass_shadow:    '#2d5a3d',   // shadowed grass faces
  rock_warm:       '#8b7355',   // generic rock/stone
  rock_dark:       '#5a4a3a',   // dark rock, cave faces
  mountain_peak:   '#d4c4a8',   // mountain top, near-snow
  snow_cap:        '#f0ece4',   // achievement unlock — peak reward

  // ── STRUCTURES ─────────────────────────────────────────────────────────
  wood_warm:       '#c4895a',   // cottage walls, warm wood
  wood_roof:       '#8b5e3c',   // darker roof beams
  stone_wall:      '#9b8b7a',   // stone cottage, workshop
  thatch_roof:     '#c9a84c',   // thatched roof, golden
  lighthouse_body: '#f5f0e8',   // white lighthouse tower
  lighthouse_top:  '#e84545',   // red lighthouse cap
  workshop_wall:   '#7a6a5a',   // aged workshop stone
  dock_wood:       '#a0754a',   // dock planks

  // ── BIOME PRIMARIES (one per language) ─────────────────────────────────
  biome_tropical:  '#4a7c59',   // JavaScript — lush green
  biome_pine:      '#2d5a3d',   // TypeScript — deep pine
  biome_savanna:   '#c4a87a',   // Python — warm tan
  biome_volcanic:  '#6b3a2a',   // Rust — dark volcanic
  biome_cherry:    '#8b4a5a',   // Ruby — cherry blossom earth
  biome_tundra:    '#7a9aaa',   // Go — cool grey-blue
  biome_ancient:   '#5a5040',   // C/C++ — aged stone
  biome_coastal:   '#4a8a7a',   // Swift — coastal teal
  biome_highland:  '#4a5a8a',   // Kotlin — highland blue
  biome_wetland:   '#5a7a5a',   // PHP — murky green

  // ── FOLIAGE ────────────────────────────────────────────────────────────
  tree_canopy:     '#3d7a4a',   // main tree color
  tree_canopy_2:   '#4a8a58',   // lighter canopy face
  tree_trunk:      '#7a5a3a',   // trunk brown
  palm_frond:      '#5a9c4f',   // palm tree fronds
  flower_yellow:   '#f0db4f',   // wildflowers, sun daisies
  flower_pink:     '#e8a0b4',   // cherry blossom petals

  // ── LIGHTING & ATMOSPHERE ──────────────────────────────────────────────
  sun_warm:        '#fff8e0',   // warm sunlight tint
  sky_day:         '#87ceeb',   // midday sky
  sky_golden:      '#f4a460',   // golden hour (Bruno Simon default)
  sky_dusk:        '#ff7043',   // dusk orange
  ambient_night:   '#1a1a2e',   // night sky

  // ── EMISSIVE (ONLY for bloom targets) ──────────────────────────────────
  emit_lighthouse: '#fff5a0',   // lighthouse beam (emissive)
  emit_window:     '#ffaa44',   // building windows at night (emissive)
  emit_firefly:    '#ffffaa',   // firefly particles (emissive)
  emit_campfire:   '#ff6b35',   // campfire glow (emissive)

  // ── UI ─────────────────────────────────────────────────────────────────
  ui_surface:      'rgba(10, 20, 35, 0.85)',  // panel background
  ui_border:       'rgba(78, 205, 196, 0.3)', // panel border (ocean teal)
  ui_text:         '#f5f0e8',                 // warm white text
  ui_text_dim:     'rgba(245,240,232,0.5)',   // dimmed label text
  ui_accent:       '#4ecdc4',                 // interactive accent
} as const

// Biome → primary color lookup (used by terrain and structures)
export const BIOME_COLOR: Record<string, string> = {
  tropical:  PALETTE.biome_tropical,
  pine:      PALETTE.biome_pine,
  savanna:   PALETTE.biome_savanna,
  volcanic:  PALETTE.biome_volcanic,
  cherry:    PALETTE.biome_cherry,
  tundra:    PALETTE.biome_tundra,
  ancient:   PALETTE.biome_ancient,
  coastal:   PALETTE.biome_coastal,
  highland:  PALETTE.biome_highland,
  wetland:   PALETTE.biome_wetland,
}

// Language → biome color (for structure accent colors)
export const LANGUAGE_COLOR: Record<string, string> = {
  JavaScript: PALETTE.biome_tropical,
  TypeScript: PALETTE.biome_pine,
  Python:     PALETTE.biome_savanna,
  Rust:       PALETTE.biome_volcanic,
  Ruby:       PALETTE.biome_cherry,
  Go:         PALETTE.biome_tundra,
  'C++':      PALETTE.biome_ancient,
  C:          PALETTE.biome_ancient,
  Java:       PALETTE.sky_golden,
  Swift:      PALETTE.biome_coastal,
  Kotlin:     PALETTE.biome_highland,
  PHP:        PALETTE.biome_wetland,
}
