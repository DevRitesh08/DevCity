// ─── Island Terrain ────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL TERRAIN SETUP
// Renders a unique low-poly island from the username-seeded terrain.
// flatShading: true on ALL geometry. Always.

"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { generateIslandTerrain, getBiomeColor } from "@/lib/terrainNoise";
import { PALETTE } from "@/lib/palette";

interface IslandTerrainProps {
  username: string;
  radius?: number;
  resolution?: number;
  primaryLanguage?: string;
}

export default function IslandTerrain({
  username,
  radius = 20,
  resolution = 64,
  primaryLanguage = "default",
}: IslandTerrainProps) {
  const biomeColor = getBiomeColor(primaryLanguage);

  const { geometry, beachGeometry } = useMemo(() => {
    const vertices = generateIslandTerrain(username, radius, resolution);
    const size = resolution + 1;

    // Create main island geometry
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Generate indices for the grid
    const indices: number[] = [];
    for (let j = 0; j < resolution; j++) {
      for (let i = 0; i < resolution; i++) {
        const a = j * size + i;
        const b = j * size + i + 1;
        const c = (j + 1) * size + i;
        const d = (j + 1) * size + i + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    geo.setIndex(indices);
    geo.computeVertexNormals();

    // VISUAL_UPGRADE_SPEC v1.0 — Vertex colors from CANONICAL PALETTE
    const colors = new Float32Array(vertices.length);
    const grassColor = new THREE.Color(biomeColor);
    const sandColor = new THREE.Color(PALETTE.sand_beach);
    const rockColor = new THREE.Color(PALETTE.rock_warm);
    const snowColor = new THREE.Color(PALETTE.snow_cap);

    for (let i = 0; i < vertices.length; i += 3) {
      const height = vertices[i + 1];
      const dist = Math.sqrt(vertices[i] ** 2 + vertices[i + 2] ** 2) / radius;
      let color: THREE.Color;

      if (height < 0.2) {
        color = sandColor;
      } else if (height < radius * 0.12) {
        color = grassColor.clone().lerp(sandColor, 0.3);
      } else if (height < radius * 0.2) {
        color = grassColor;
      } else if (height < radius * 0.3) {
        color = rockColor.clone().lerp(grassColor, 0.3);
      } else {
        color = snowColor.clone().lerp(rockColor, 0.4);
      }

      // Fade to sand at edges
      if (dist > 0.85) {
        color.lerp(sandColor, (dist - 0.85) / 0.15);
      }

      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Beach ring geometry — flat disc at water level
    const beachGeo = new THREE.RingGeometry(radius * 0.88, radius * 1.05, 48);
    beachGeo.rotateX(-Math.PI / 2);

    return { geometry: geo, beachGeometry: beachGeo };
  }, [username, radius, resolution, biomeColor]);

  return (
    <group>
      {/* MAIN TERRAIN — VISUAL_UPGRADE_SPEC v1.0 — LAW 1 + LAW 2 */}
      <mesh geometry={geometry}>
        <meshLambertMaterial
          vertexColors
          flatShading
        />
      </mesh>

      {/* BEACH RING — VISUAL_UPGRADE_SPEC v1.0 — PALETTE.sand_beach */}
      <mesh geometry={beachGeometry} position={[0, 0.05, 0]}>
        <meshLambertMaterial
          color={PALETTE.sand_beach}
          flatShading
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
