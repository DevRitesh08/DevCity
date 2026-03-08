// ─── Island Scene ──────────────────────────────────────────────
// Composes all island elements: terrain, ocean, structures, sky,
// nature elements (trees, particles).

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import IslandTerrain from "./IslandTerrain";
import OceanSurface from "./OceanSurface";
import IslandStructures, { type RepoStructure } from "./IslandStructures";
import SkyAtmosphere from "./SkyAtmosphere";
import { seededRandom } from "@/lib/building";

interface IslandSceneProps {
  username: string;
  repos: RepoStructure[];
  islandRadius: number;
  primaryLanguage: string;
  onStructureClick?: (repo: RepoStructure) => void;
}

export default function IslandScene({
  username,
  repos,
  islandRadius,
  primaryLanguage,
  onStructureClick,
}: IslandSceneProps) {
  return (
    <>
      {/* Sky and lighting */}
      <SkyAtmosphere />

      {/* Ocean */}
      <OceanSurface size={400} />

      {/* Island terrain */}
      <IslandTerrain
        username={username}
        radius={islandRadius}
        primaryLanguage={primaryLanguage}
      />

      {/* Repo structures on the island */}
      <IslandStructures
        repos={repos}
        islandRadius={islandRadius}
        username={username}
        onStructureClick={onStructureClick}
      />

      {/* Low-poly trees scattered on the island */}
      <IslandTrees username={username} islandRadius={islandRadius} />

      {/* Shore foam particles */}
      <ShoreFoam islandRadius={islandRadius} />
    </>
  );
}

// ─── Low-Poly Trees ────────────────────────────────────────────
// Instanced cone clusters scattered on the island terrain.

function IslandTrees({ username, islandRadius }: { username: string; islandRadius: number }) {
  const rng = useMemo(() => seededRandom(username + "_trees"), [username]);

  const trees = useMemo(() => {
    const count = 30;
    const result: { position: [number, number, number]; scale: number; color: string }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = islandRadius * (0.2 + rng() * 0.55);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = Math.max(0.5, (1 - dist / islandRadius) * islandRadius * 0.12);
      const scale = 0.5 + rng() * 1.0;

      const colors = ["#2d6b2e", "#3a7c3a", "#4a8c3a", "#2a5a2a", "#5a9a4a"];
      const color = colors[Math.floor(rng() * colors.length)];

      result.push({ position: [x, y, z], scale, color });
    }
    return result;
  }, [islandRadius, rng]);

  return (
    <group>
      {trees.map((tree, i) => (
        <group key={i} position={tree.position} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 1.0, 5]} />
            <meshStandardMaterial color="#6b4226" flatShading roughness={0.95} />
          </mesh>
          {/* Canopy — stacked cones */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <coneGeometry args={[0.6, 1.0, 6]} />
            <meshStandardMaterial color={tree.color} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow>
            <coneGeometry args={[0.45, 0.8, 6]} />
            <meshStandardMaterial color={tree.color} flatShading roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Shore Foam Particles ──────────────────────────────────────

function ShoreFoam({ islandRadius }: { islandRadius: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 2;
      const r = islandRadius * 0.92 + jitter;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [islandRadius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const time = clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const y = 0.2 + Math.sin(time * 2 + i * 0.5) * 0.15;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.4}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
