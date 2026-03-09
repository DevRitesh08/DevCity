// ─── Island Foliage ────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL FOLIAGE SYSTEM
// 3-cone stacked low-poly trees (Bruno Simon style).
// Placed deterministically using username seed.

"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";
import { seededRandom } from "@/lib/building";

// ── LOW-POLY TREE (3 stacked cones) ──────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — Canonical tree geometry
function LowPolyTree({ position }: { position: THREE.Vector3 }) {
  return (
    <group position={position}>
      {/* Trunk — 6-sided cylinder for low-poly feel */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
        <meshLambertMaterial color={PALETTE.tree_trunk} flatShading />
      </mesh>
      {/* Bottom canopy (widest) */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[1.2, 1.4, 7]} />
        <meshLambertMaterial color={PALETTE.grass_shadow} flatShading />
      </mesh>
      {/* Middle canopy */}
      <mesh position={[0, 2.9, 0]}>
        <coneGeometry args={[0.9, 1.2, 6]} />
        <meshLambertMaterial color={PALETTE.tree_canopy} flatShading />
      </mesh>
      {/* Top canopy (narrowest) */}
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.55, 1.0, 5]} />
        <meshLambertMaterial color={PALETTE.tree_canopy_2} flatShading />
      </mesh>
    </group>
  );
}

// ── PALM TREE (coastal biome) ─────────────────────────────────────────────
function PalmTree({ position }: { position: THREE.Vector3 }) {
  return (
    <group position={position}>
      {/* Slightly curved trunk */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.18, 4, 6]} />
        <meshLambertMaterial color={PALETTE.tree_trunk} flatShading />
      </mesh>
      {/* Fronds — 5 elongated cones splayed outward */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((deg * Math.PI) / 180) * 0.8,
            4.2,
            Math.sin((deg * Math.PI) / 180) * 0.8,
          ]}
          rotation={[0.6, (deg * Math.PI) / 180, 0]}
        >
          <coneGeometry args={[0.15, 1.8, 4]} />
          <meshLambertMaterial color={PALETTE.palm_frond} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ── INSTANCED TREE PLACEMENT ──────────────────────────────────────────────

interface FoliageProps {
  username: string;
  radius: number;
  biome?: string;
}

export default function IslandFoliage({
  username,
  radius,
  biome = "tropical",
}: FoliageProps) {
  const treeCount = Math.floor(radius * 1.5);

  const treePositions = useMemo(() => {
    const rng = seededRandom(username + "_foliage");
    const trees: THREE.Vector3[] = [];
    const attempts = treeCount * 4;

    for (let i = 0; i < attempts && trees.length < treeCount; i++) {
      const angle = (i / attempts) * Math.PI * 2 * 7; // golden angle spiral
      const dist = (i / attempts) * radius * 0.75;

      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      // Sparse areas — use seeded noise approximation
      const n = Math.sin(x * 0.15 + rng() * 10) * Math.cos(z * 0.15 + rng() * 10);
      if (n < -0.3) continue; // skip sparse zones

      // Don't place at center (leave room for structures)
      if (dist < radius * 0.15) continue;

      // Don't place on beach ring
      if (dist > radius * 0.85) continue;

      // Approximate terrain height
      const heightFactor = Math.max(0, 1 - dist / radius);
      const y = heightFactor * radius * 0.12;

      trees.push(new THREE.Vector3(x, y, z));
    }
    return trees;
  }, [username, radius, treeCount]);

  const TreeComponent = biome === "coastal" ? PalmTree : LowPolyTree;

  return (
    <group>
      {treePositions.map((pos, i) => (
        <TreeComponent key={i} position={pos} />
      ))}
    </group>
  );
}
