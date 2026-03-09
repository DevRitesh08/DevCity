// ─── Island Structures ─────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — LAW 1 + LAW 4
// Renders repo buildings as island structures (cottages, lighthouses, etc.)
// All materials: MeshLambertMaterial + flatShading. No exceptions.

"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "@/lib/building";
import { PALETTE } from "@/lib/palette";

// ─── Structure Types ───────────────────────────────────────────

interface StructureConfig {
  shape: "lighthouse" | "cottage" | "workshop" | "tower" | "hut" | "totem";
  color: string;
  height: number;
}

// VISUAL_UPGRADE_SPEC v1.0 — All colors from CANONICAL PALETTE
const STRUCTURE_MAP: Record<string, StructureConfig> = {
  JavaScript: { shape: "cottage", color: PALETTE.biome_tropical, height: 2.5 },
  TypeScript: { shape: "tower", color: PALETTE.biome_pine, height: 3.0 },
  Python: { shape: "hut", color: PALETTE.biome_savanna, height: 2.0 },
  Rust: { shape: "workshop", color: PALETTE.biome_volcanic, height: 2.8 },
  Ruby: { shape: "cottage", color: PALETTE.biome_cherry, height: 2.2 },
  Go: { shape: "tower", color: PALETTE.biome_tundra, height: 2.5 },
  "C++": { shape: "workshop", color: PALETTE.biome_ancient, height: 3.0 },
  C: { shape: "workshop", color: PALETTE.biome_ancient, height: 2.8 },
  Java: { shape: "tower", color: PALETTE.sky_golden, height: 3.2 },
  Swift: { shape: "lighthouse", color: PALETTE.biome_coastal, height: 3.5 },
  Kotlin: { shape: "cottage", color: PALETTE.biome_highland, height: 2.5 },
  PHP: { shape: "hut", color: PALETTE.biome_wetland, height: 2.0 },
  default: { shape: "cottage", color: PALETTE.rock_warm, height: 2.0 },
};

// ─── Repo Structure Data ───────────────────────────────────────

export interface RepoStructure {
  name: string;
  language: string | null;
  stars: number;
  url: string;
}

interface IslandStructuresProps {
  repos: RepoStructure[];
  islandRadius: number;
  username: string;
  onStructureClick?: (repo: RepoStructure) => void;
}

// ─── Main Component ────────────────────────────────────────────

export default function IslandStructures({
  repos,
  islandRadius,
  username,
  onStructureClick,
}: IslandStructuresProps) {
  const rng = useMemo(() => seededRandom(username + "_structures"), [username]);

  // Place structures in a spiral pattern on the island
  const placements = useMemo(() => {
    return repos.slice(0, 12).map((repo, i) => {
      const angle = (i / Math.max(repos.length, 1)) * Math.PI * 2 + rng() * 0.5;
      const dist = islandRadius * (0.25 + rng() * 0.45);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      // Approximate height on terrain
      const y = Math.max(0.5, (1 - (dist / islandRadius)) * islandRadius * 0.15);

      return { repo, x, y, z, angle };
    });
  }, [repos, islandRadius, rng]);

  return (
    <group>
      {placements.map(({ repo, x, y, z, angle }) => (
        <Structure
          key={repo.name}
          repo={repo}
          position={[x, y, z]}
          rotation={angle}
          onClick={() => onStructureClick?.(repo)}
        />
      ))}
    </group>
  );
}

// ─── Single Structure ──────────────────────────────────────────

interface StructureProps {
  repo: RepoStructure;
  position: [number, number, number];
  rotation: number;
  onClick?: () => void;
}

function Structure({ repo, position, rotation, onClick }: StructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const config = STRUCTURE_MAP[repo.language ?? ""] ?? STRUCTURE_MAP.default;
  const scale = 0.8 + Math.min(repo.stars, 100) / 100;

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  // Gentle float animation on hover
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const floatY = hovered ? Math.sin(clock.elapsedTime * 3) * 0.1 : 0;
      groupRef.current.position.y = position[1] + floatY;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Structure geometry based on type */}
      {config.shape === "lighthouse" && <Lighthouse color={config.color} height={config.height} hovered={hovered} />}
      {config.shape === "cottage" && <Cottage color={config.color} height={config.height} hovered={hovered} />}
      {config.shape === "workshop" && <Workshop color={config.color} height={config.height} hovered={hovered} />}
      {config.shape === "tower" && <Tower color={config.color} height={config.height} hovered={hovered} />}
      {config.shape === "hut" && <Hut color={config.color} height={config.height} hovered={hovered} />}
      {config.shape === "totem" && <Totem color={config.color} height={config.height} hovered={hovered} />}

      {/* Hover tooltip */}
      {hovered && (
        <Html center position={[0, config.height + 1.5, 0]} style={{ pointerEvents: "none" }}>
          <div className="isle-tooltip">
            <div className="font-bold text-sm">{repo.name}</div>
            <div className="text-xs opacity-70">
              {repo.language ?? "Unknown"} · ★{repo.stars}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Structure Geometries ──────────────────────────────────────

function Lighthouse({ height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Tower body — VISUAL_UPGRADE_SPEC v1.0 — PALETTE.lighthouse_body */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, height, 6]} />
        <meshLambertMaterial color={PALETTE.lighthouse_body} flatShading />
      </mesh>
      {/* Cone top — PALETTE.lighthouse_top */}
      <mesh position={[0, height + 0.3, 0]}>
        <coneGeometry args={[0.5, 0.8, 6]} />
        <meshLambertMaterial color={PALETTE.lighthouse_top} flatShading />
      </mesh>
      {/* Light beacon — emissive allowed (LAW 6 exception) */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshLambertMaterial
          color={PALETTE.emit_lighthouse}
          emissive={new THREE.Color(PALETTE.emit_lighthouse)}
          emissiveIntensity={hovered ? 3 : 1.5}
        />
      </mesh>
      {/* Glow light */}
      <pointLight
        position={[0, height, 0]}
        color={PALETTE.emit_lighthouse}
        intensity={hovered ? 3 : 1}
        distance={8}
        decay={2}
      />
    </group>
  );
}

function Cottage({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Walls — PALETTE.wood_warm */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.2, height, 1]} />
        <meshLambertMaterial
          color={PALETTE.wood_warm}
          flatShading
          emissive={hovered ? new THREE.Color(PALETTE.emit_window) : undefined}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Roof — biome accent color */}
      <mesh position={[0, height + 0.4, 0]}>
        <coneGeometry args={[1, 0.9, 4]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function Workshop({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Wide base — PALETTE.workshop_wall */}
      <mesh position={[0, height * 0.4, 0]}>
        <boxGeometry args={[1.6, height * 0.8, 1.2]} />
        <meshLambertMaterial
          color={PALETTE.workshop_wall}
          flatShading
          emissive={hovered ? new THREE.Color(PALETTE.emit_window) : undefined}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Chimney — PALETTE.rock_dark */}
      <mesh position={[0.5, height, 0]}>
        <cylinderGeometry args={[0.15, 0.2, height * 0.5, 6]} />
        <meshLambertMaterial color={PALETTE.rock_dark} flatShading />
      </mesh>
      {/* Roof — biome accent color */}
      <mesh position={[0, height * 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.8, 0.15, 1.4]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function Tower({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Stone tower — PALETTE.stone_wall */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.4, 0.6, height, 8]} />
        <meshLambertMaterial
          color={PALETTE.stone_wall}
          flatShading
          emissive={hovered ? new THREE.Color(PALETTE.emit_window) : undefined}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Flag on top — biome accent */}
      <mesh position={[0.3, height + 0.5, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      {/* Flagpole — PALETTE.rock_dark */}
      <mesh position={[0, height + 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 4]} />
        <meshLambertMaterial color={PALETTE.rock_dark} flatShading />
      </mesh>
    </group>
  );
}

function Hut({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Round hut body — PALETTE.wood_warm */}
      <mesh position={[0, height * 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.7, height * 0.6, 8]} />
        <meshLambertMaterial
          color={PALETTE.wood_warm}
          flatShading
          emissive={hovered ? new THREE.Color(PALETTE.emit_window) : undefined}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Thatched roof — biome accent color */}
      <mesh position={[0, height * 0.7, 0]}>
        <coneGeometry args={[0.85, height * 0.6, 8]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function Totem({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Carved pole — PALETTE.tree_trunk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.25, height, 6]} />
        <meshLambertMaterial
          color={PALETTE.tree_trunk}
          flatShading
        />
      </mesh>
      {/* Top ornament — emissive allowed for totem glow */}
      <mesh position={[0, height + 0.2, 0]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshLambertMaterial
          color={color}
          emissive={hovered ? new THREE.Color(color) : undefined}
          emissiveIntensity={hovered ? 2 : 0.5}
          flatShading
        />
      </mesh>
    </group>
  );
}
