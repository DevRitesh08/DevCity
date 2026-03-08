// ─── Island Structures ─────────────────────────────────────────
// Renders repo buildings as island structures (cottages, lighthouses, etc.)
// Each structure type is determined by the repo's primary language/purpose.

"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "@/lib/building";

// ─── Structure Types ───────────────────────────────────────────

interface StructureConfig {
  shape: "lighthouse" | "cottage" | "workshop" | "tower" | "hut" | "totem";
  color: string;
  height: number;
}

const STRUCTURE_MAP: Record<string, StructureConfig> = {
  JavaScript: { shape: "cottage", color: "#f0db4f", height: 2.5 },
  TypeScript: { shape: "tower", color: "#3178c6", height: 3.0 },
  Python: { shape: "hut", color: "#306998", height: 2.0 },
  Rust: { shape: "workshop", color: "#dea584", height: 2.8 },
  Ruby: { shape: "cottage", color: "#cc342d", height: 2.2 },
  Go: { shape: "tower", color: "#00add8", height: 2.5 },
  "C++": { shape: "workshop", color: "#659ad2", height: 3.0 },
  C: { shape: "workshop", color: "#555555", height: 2.8 },
  Java: { shape: "tower", color: "#ed8b00", height: 3.2 },
  Swift: { shape: "lighthouse", color: "#fa7343", height: 3.5 },
  Kotlin: { shape: "cottage", color: "#7f52ff", height: 2.5 },
  PHP: { shape: "hut", color: "#777bb4", height: 2.0 },
  default: { shape: "cottage", color: "#95a5a6", height: 2.0 },
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

function Lighthouse({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Tower body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, height, 6]} />
        <meshStandardMaterial color="#f5f0e8" flatShading roughness={0.8} />
      </mesh>
      {/* Cone top */}
      <mesh position={[0, height + 0.3, 0]} castShadow>
        <coneGeometry args={[0.5, 0.8, 6]} />
        <meshStandardMaterial color="#8b4513" flatShading roughness={0.9} />
      </mesh>
      {/* Light beacon */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1.5}
        />
      </mesh>
      {/* Glow light */}
      <pointLight
        position={[0, height, 0]}
        color={color}
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
      {/* Walls */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[1.2, height, 1]} />
        <meshStandardMaterial
          color="#d4a76a"
          flatShading
          roughness={0.95}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height + 0.4, 0]} castShadow>
        <coneGeometry args={[1, 0.9, 4]} />
        <meshStandardMaterial color={color} flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}

function Workshop({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Wide base */}
      <mesh position={[0, height * 0.4, 0]} castShadow>
        <boxGeometry args={[1.6, height * 0.8, 1.2]} />
        <meshStandardMaterial
          color="#8b7355"
          flatShading
          roughness={0.95}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.5, height, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, height * 0.5, 6]} />
        <meshStandardMaterial color="#555" flatShading roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height * 0.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.15, 1.4]} />
        <meshStandardMaterial color={color} flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}

function Tower({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Stone tower */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, height, 8]} />
        <meshStandardMaterial
          color="#8a8a7a"
          flatShading
          roughness={0.9}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Flag on top */}
      <mesh position={[0.3, height + 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Flagpole */}
      <mesh position={[0, height + 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 4]} />
        <meshStandardMaterial color="#5a3a1a" flatShading />
      </mesh>
    </group>
  );
}

function Hut({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Round hut body */}
      <mesh position={[0, height * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.7, height * 0.6, 8]} />
        <meshStandardMaterial
          color="#c4a66a"
          flatShading
          roughness={0.95}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {/* Thatched roof */}
      <mesh position={[0, height * 0.7, 0]} castShadow>
        <coneGeometry args={[0.85, height * 0.6, 8]} />
        <meshStandardMaterial color={color} flatShading roughness={1} />
      </mesh>
    </group>
  );
}

function Totem({ color, height, hovered }: { color: string; height: number; hovered: boolean }) {
  return (
    <group>
      {/* Carved pole */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, height, 6]} />
        <meshStandardMaterial
          color="#6b4226"
          flatShading
          roughness={0.95}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      {/* Top ornament */}
      <mesh position={[0, height + 0.2, 0]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          flatShading
        />
      </mesh>
    </group>
  );
}
