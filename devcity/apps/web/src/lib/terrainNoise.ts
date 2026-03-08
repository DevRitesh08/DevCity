// ─── Terrain Noise Generator ───────────────────────────────────
// Generates unique low-poly island terrain from a username seed.
// Each developer gets a unique island shape using simplex noise.

import { createNoise2D } from "simplex-noise";

/**
 * Generates a height-map for an island terrain mesh.
 * The island shape is circular with noise-driven elevation,
 * producing a unique island for each username.
 */
export function generateIslandTerrain(
  username: string,
  radius: number = 20,
  resolution: number = 64
): Float32Array {
  const seed = hashString(username);
  // Simple seeded PRNG for deterministic noise
  let s = seed;
  const prng = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
  const noise2D = createNoise2D(prng);

  const size = resolution + 1;
  const vertices = new Float32Array(size * size * 3);

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const idx = (j * size + i) * 3;

      // Map grid to [-1, 1] centered coordinates
      const nx = (i / resolution) * 2 - 1;
      const nz = (j / resolution) * 2 - 1;

      // Distance from center (0-1)
      const dist = Math.sqrt(nx * nx + nz * nz);

      // Island falloff — circle mask with soft edge
      const falloff = Math.max(0, 1 - dist * 1.1);
      const islandMask = falloff * falloff * (3 - 2 * falloff); // smoothstep

      // Multi-octave noise for terrain detail
      const freq1 = 2.0;
      const freq2 = 4.0;
      const freq3 = 8.0;

      const n1 = noise2D(nx * freq1, nz * freq1) * 0.5;
      const n2 = noise2D(nx * freq2 + 5.3, nz * freq2 + 1.7) * 0.25;
      const n3 = noise2D(nx * freq3 + 9.1, nz * freq3 + 3.4) * 0.125;

      const noiseValue = n1 + n2 + n3;

      // Combine noise with island mask
      const elevation = noiseValue * islandMask;

      // Mountain peak near center (driven by username)
      const peakOffset = ((seed % 100) / 100 - 0.5) * 0.3;
      const peakDist = Math.sqrt(
        (nx - peakOffset) ** 2 + (nz + peakOffset * 0.5) ** 2
      );
      const peak = Math.max(0, 1 - peakDist * 2.5) * islandMask * 0.6;

      const height = (elevation + peak) * radius * 0.5;

      // World-space coordinates
      vertices[idx] = nx * radius;
      vertices[idx + 1] = Math.max(height, -0.2); // Clamp just below water
      vertices[idx + 2] = nz * radius;
    }
  }

  return vertices;
}

/**
 * Gets the biome color for a programming language
 */
export function getBiomeColor(language: string): string {
  const BIOME_COLORS: Record<string, string> = {
    JavaScript: "#4a7c59",  // Tropical Forest green
    TypeScript: "#2d5a3f",  // Pine Heights
    Python: "#8b7d3c",      // Savanna gold-green
    Rust: "#8b4513",        // Volcanic brown
    Ruby: "#cc6699",        // Cherry Blossom pink
    Go: "#6ba3a0",          // Tundra blue-green
    "C++": "#7a6b5d",       // Ancient Ruins stone
    C: "#7a6b5d",           // Ancient Ruins stone
    Swift: "#5a8fa8",       // Coastal blue
    Kotlin: "#6b8e5a",      // Highland green
    PHP: "#5a7a5a",         // Wetland green
    Java: "#3a6b3a",        // Dense Jungle
    Shell: "#8a7a5a",       // Beach sand
    default: "#4a7c59",     // Default island green
  };
  return BIOME_COLORS[language] ?? BIOME_COLORS.default;
}

/** Hash a string to a deterministic integer */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}
