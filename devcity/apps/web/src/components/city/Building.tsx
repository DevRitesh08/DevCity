// ─── Building ──────────────────────────────────────────────────
// Renders a single developer's building as a cyberpunk skyscraper.
// Features:
//   - Massive height scaling from developer stats (up to 800 units)
//   - Neon edge wireframe outlines for cyberpunk aesthetic
//   - Glowing windows with warm/cool lit patterns
//   - Rooftop beacon lights on tall buildings (>150 height)
//   - Neon base ring glow
//   - Hover interactions with glow pulse
//   - Deterministic appearance from username seed

"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { CityBuilding } from "@devcity/types";
import { seededRandom, getBuildingColor } from "@/lib/building";

// ─── Constants ─────────────────────────────────────────────────

/** Gap between window rows — taller floors for tall buildings */
const FLOOR_HEIGHT = 5;
/** Window inset from building edge */
const WINDOW_INSET = 0.3;
/** Window dimensions */
const WINDOW_WIDTH = 1.0;
const WINDOW_HEIGHT = 1.6;
/** Unlit window color */
const WINDOW_DARK = "#0a0a1a";
/** Lit window color range — warmer and brighter */
const WINDOW_LIT_COLORS = [
  "#00FFFF", "#33DDFF", "#66EEFF", "#FFFFFF",
  "#88CCFF", "#AADDFF", "#CC88FF", "#FF88DD",
];

/** Threshold for "tall" buildings that get special rooftop features */
const TALL_THRESHOLD = 150;
/** Threshold for "skyscraper" tier */
const SKYSCRAPER_THRESHOLD = 350;

// ─── Props ─────────────────────────────────────────────────────

interface BuildingProps {
  building: CityBuilding & { x: number; z: number };
  position: [number, number, number];
  theme: string;
  onClick?: () => void;
  /** CI health score 0–1 (undefined = no CI data) */
  healthScore?: number;
}

// ─── Component ─────────────────────────────────────────────────

export default function Building({
  building,
  position,
  theme: _theme = "midnight", // eslint-disable-line @typescript-eslint/no-unused-vars
  onClick,
  healthScore,
}: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const beaconRef = useRef<THREE.Mesh>(null);

  const { dimensions, login } = building;
  const { height, width, depth, floors, windowsPerFloor, sideWindowsPerFloor, litPercentage } =
    dimensions;

  // Deterministic accent color for this building
  const accentColor = useMemo(() => getBuildingColor(login), [login]);

  // ─── Neon Edge Wireframe ───────────────────────────────────
  const edgeGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(width, height, depth);
    return new THREE.EdgesGeometry(box);
  }, [width, height, depth]);

  // Pre-compute which windows are lit (deterministic)
  const windowPattern = useMemo(() => {
    const pattern: boolean[][] = [];
    const r = seededRandom(login + "_windows");
    for (let floor = 0; floor < floors; floor++) {
      const row: boolean[] = [];
      const totalWindows = windowsPerFloor + sideWindowsPerFloor * 2;
      for (let w = 0; w < totalWindows; w++) {
        row.push(r() < litPercentage);
      }
      pattern.push(row);
    }
    return pattern;
  }, [login, floors, windowsPerFloor, sideWindowsPerFloor, litPercentage]);

  // Pick a lit window color per lit window (deterministic)
  const litColors = useMemo(() => {
    const r = seededRandom(login + "_litcolor");
    return windowPattern.flat().map((lit) =>
      lit ? WINDOW_LIT_COLORS[Math.floor(r() * WINDOW_LIT_COLORS.length)] : WINDOW_DARK
    );
  }, [login, windowPattern]);

  // Building body color — dark with subtle blue tint
  const bodyColor = useMemo(() => {
    const r = seededRandom(login + "_body");
    const base = 0.06 + r() * 0.05; // darker: 0.06–0.11
    return new THREE.Color(base, base, base + 0.03);
  }, [login]);

  const roofColor = useMemo(() => {
    return new THREE.Color(accentColor).multiplyScalar(0.7);
  }, [accentColor]);

  // ─── Animations ─────────────────────────────────────────────
  const emissiveIntensity = useRef(0);

  useFrame(({ clock }, delta) => {
    // Hover glow
    const target = hovered ? 0.2 : 0.03;
    emissiveIntensity.current += (target - emissiveIntensity.current) * delta * 8;
    if (groupRef.current) {
      const mesh = groupRef.current.children[0] as THREE.Mesh;
      if (mesh?.material && "emissiveIntensity" in mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          emissiveIntensity.current;
      }
    }

    // Beacon pulse for tall buildings
    if (beaconRef.current && height > TALL_THRESHOLD) {
      const pulse = (Math.sin(clock.elapsedTime * 2 + height) + 1) * 0.5;
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5 + pulse * 2.5;
    }
  });

  const handlePointerOver = useCallback((e: THREE.Event) => {
    (e as unknown as { stopPropagation: () => void }).stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      onClick?.();
    },
    [onClick]
  );

  // ─── Window Geometry ───────────────────────────────────────
  // Limit window rendering for very tall buildings to avoid perf issues
  const maxRenderedFloors = Math.min(floors, 60);

  const windowMeshes = useMemo(() => {
    const meshes: {
      position: [number, number, number];
      color: string;
      rotation?: [number, number, number];
    }[] = [];

    let colorIdx = 0;
    const halfW = width / 2;
    const halfD = depth / 2;

    for (let floor = 0; floor < maxRenderedFloors; floor++) {
      const y = floor * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.6;

      // Front face (–Z)
      const frontSpacing = (width - WINDOW_INSET * 2) / windowsPerFloor;
      for (let w = 0; w < windowsPerFloor; w++) {
        const x = -halfW + WINDOW_INSET + frontSpacing * (w + 0.5);
        meshes.push({
          position: [x, y, -halfD - 0.05],
          color: litColors[colorIdx % litColors.length],
        });
        colorIdx++;
      }

      // Back face (+Z)
      for (let w = 0; w < windowsPerFloor; w++) {
        const x = -halfW + WINDOW_INSET + frontSpacing * (w + 0.5);
        meshes.push({
          position: [x, y, halfD + 0.05],
          color: litColors[colorIdx % litColors.length],
          rotation: [0, Math.PI, 0],
        });
        colorIdx++;
      }

      // Left face (–X)
      const sideSpacing = (depth - WINDOW_INSET * 2) / sideWindowsPerFloor;
      for (let w = 0; w < sideWindowsPerFloor; w++) {
        const z = -halfD + WINDOW_INSET + sideSpacing * (w + 0.5);
        meshes.push({
          position: [-halfW - 0.05, y, z],
          color: litColors[colorIdx % litColors.length],
          rotation: [0, -Math.PI / 2, 0],
        });
        colorIdx++;
      }

      // Right face (+X)
      for (let w = 0; w < sideWindowsPerFloor; w++) {
        const z = -halfD + WINDOW_INSET + sideSpacing * (w + 0.5);
        meshes.push({
          position: [halfW + 0.05, y, z],
          color: litColors[colorIdx % litColors.length],
          rotation: [0, Math.PI / 2, 0],
        });
        colorIdx++;
      }
    }

    return meshes;
  }, [width, depth, maxRenderedFloors, windowsPerFloor, sideWindowsPerFloor, litColors]);

  // ─── Roof Features ─────────────────────────────────────────

  const roofFeatures = useMemo(() => {
    const r = seededRandom(login + "_roof");
    const features: { type: "antenna" | "ac"; pos: [number, number, number] }[] = [];

    // Antenna — taller on taller buildings
    if (r() > 0.3) {
      const antennaHeight = height > SKYSCRAPER_THRESHOLD ? 15 : height > TALL_THRESHOLD ? 10 : 6;
      features.push({
        type: "antenna",
        pos: [
          (r() - 0.5) * width * 0.3,
          height + antennaHeight / 2,
          (r() - 0.5) * depth * 0.3,
        ],
      });
    }

    // AC units
    const acCount = Math.floor(r() * 3);
    for (let i = 0; i < acCount; i++) {
      features.push({
        type: "ac",
        pos: [
          (r() - 0.5) * width * 0.6,
          height + 0.6,
          (r() - 0.5) * depth * 0.6,
        ],
      });
    }

    return features;
  }, [login, width, depth, height]);

  // ─── Render ────────────────────────────────────────────────

  return (
    <group ref={groupRef} position={position}>
      {/* ── Main building body ── */}
      <mesh
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={accentColor}
          emissiveIntensity={0.03}
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* ── Neon Edge Wireframe ── */}
      <lineSegments
        position={[0, height / 2, 0]}
        geometry={edgeGeo}
      >
        <lineBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.5 : 0.12}
          linewidth={1}
        />
      </lineSegments>

      {/* ── Accent stripe — horizontal neon band at 2/3 height ── */}
      <mesh position={[0, height * 0.67, 0]}>
        <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          toneMapped={false}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* ── Roof cap ── */}
      <mesh position={[0, height + 0.25, 0]} castShadow>
        <boxGeometry args={[width + 0.3, 0.5, depth + 0.3]} />
        <meshStandardMaterial
          color={roofColor}
          emissive={accentColor}
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* ── Base / foundation ── */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[width + 0.6, 1.0, depth + 0.6]} />
        <meshStandardMaterial
          color="#0d0d1a"
          emissive={accentColor}
          emissiveIntensity={0.05}
          roughness={0.95}
        />
      </mesh>

      {/* ── Neon base ring ── */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            Math.max(width, depth) * 0.55,
            Math.max(width, depth) * 0.55 + 0.4,
            32,
          ]}
        />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.2}
          toneMapped={false}
          transparent
          opacity={hovered ? 0.7 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Health aura ring ── */}
      {healthScore !== undefined && (
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              Math.max(width, depth) * 0.7,
              Math.max(width, depth) * 0.7 + 0.8,
              32,
            ]}
          />
          <meshStandardMaterial
            color={
              healthScore >= 0.7 ? "#4ade80" :
                healthScore >= 0.4 ? "#fbbf24" :
                  "#f87171"
            }
            emissive={
              healthScore >= 0.7 ? "#4ade80" :
                healthScore >= 0.4 ? "#fbbf24" :
                  "#f87171"
            }
            emissiveIntensity={0.8}
            toneMapped={false}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── Rooftop beacon — tall buildings get a pulsing light ── */}
      {height > TALL_THRESHOLD && (
        <mesh ref={beaconRef} position={[0, height + 2, 0]}>
          <sphereGeometry args={[height > SKYSCRAPER_THRESHOLD ? 2.0 : 1.2, 8, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* ── Skyscraper spire — very tall buildings get a dramatic spire ── */}
      {height > SKYSCRAPER_THRESHOLD && (
        <mesh position={[0, height + 12, 0]}>
          <cylinderGeometry args={[0.1, 1.0, 24, 6]} />
          <meshStandardMaterial
            color="#444"
            emissive={accentColor}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* ── Windows ── */}
      {windowMeshes.map((win, i) => (
        <mesh
          key={i}
          position={[
            win.position[0],
            win.position[1] + height / 2 - (maxRenderedFloors * FLOOR_HEIGHT) / 2,
            win.position[2],
          ]}
          rotation={win.rotation ? new THREE.Euler(...win.rotation) : undefined}
        >
          <planeGeometry args={[WINDOW_WIDTH, WINDOW_HEIGHT]} />
          <meshStandardMaterial
            color={win.color}
            emissive={win.color !== WINDOW_DARK ? win.color : "#000000"}
            emissiveIntensity={win.color !== WINDOW_DARK ? 1.2 : 0}
            toneMapped={win.color !== WINDOW_DARK ? false : true}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* ── Roof features ── */}
      {roofFeatures.map((feature, i) => {
        if (feature.type === "antenna") {
          const antennaH = height > SKYSCRAPER_THRESHOLD ? 15 : height > TALL_THRESHOLD ? 10 : 6;
          return (
            <mesh key={`roof-${i}`} position={feature.pos}>
              <cylinderGeometry args={[0.12, 0.2, antennaH, 4]} />
              <meshStandardMaterial
                color="#666"
                emissive={accentColor}
                emissiveIntensity={0.5}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          );
        }
        if (feature.type === "ac") {
          return (
            <mesh key={`roof-${i}`} position={feature.pos}>
              <boxGeometry args={[1.2, 0.9, 1.2]} />
              <meshStandardMaterial color="#222" roughness={0.95} />
            </mesh>
          );
        }
        return null;
      })}

      {/* ── Hover tooltip ── */}
      {hovered && (
        <Html
          position={[0, height + (height > SKYSCRAPER_THRESHOLD ? 30 : 12), 0]}
          center
          distanceFactor={200}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="px-4 py-2 text-center font-mono text-sm text-white whitespace-nowrap"
            style={{
              background: "rgba(5, 8, 16, 0.95)",
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 15px ${accentColor}44, 0 0 30px ${accentColor}22`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="font-bold text-base" style={{ color: accentColor }}>
              {building.name || building.login}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {building.contributions.toLocaleString()} contributions · ★{building.total_stars.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              HEIGHT {Math.round(height)}u · {building.public_repos} repos
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
