// ─── CityCanvas ────────────────────────────────────────────────
// The root Three.js canvas component.
// Cinematic cyberpunk city renderer with starfield, neon grid ground,
// floating particles, volumetric bloom, district ground system,
// procedural roads, building plots, and district labels.

"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats, PerformanceMonitor, Stars, Grid, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import CityScene from "./CityScene";
import type { CityBuilding, District } from "@devcity/types";

interface CityCanvasProps {
  /** Array of buildings to render in the city */
  buildings: CityBuilding[];
  /** Districts in the city */
  districts?: District[];
  /** City theme name */
  theme?: string;
  /** Show performance stats overlay */
  showStats?: boolean;
  /** Callback when a building is clicked */
  onBuildingClick?: (login: string) => void;
}

export default function CityCanvas({
  buildings,
  districts = [],
  theme = "midnight",
  showStats = false,
  onBuildingClick,
}: CityCanvasProps) {
  const controlsRef = useRef(null);

  // Theme colors
  const themeColors = getThemeColors(theme);

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [200, 300, 350],
          fov: 50,
          near: 0.5,
          far: 10000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 2]}
        shadows
      >
        {/* Performance monitoring — auto-adjusts quality */}
        <PerformanceMonitor>
          {/* Sky color */}
          <color attach="background" args={[themeColors.sky]} />

          {/* ─── Starfield ─── */}
          <Stars
            radius={3000}
            depth={200}
            count={1500}
            factor={6}
            saturation={0.15}
            fade
            speed={0.3}
          />

          {/* ─── Lighting ─── */}
          {/* Ambient — base visibility */}
          <ambientLight intensity={0.6} />

          {/* Key light — main directional */}
          <directionalLight
            position={[20, 30, 20]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={500}
            shadow-camera-left={-300}
            shadow-camera-right={300}
            shadow-camera-top={300}
            shadow-camera-bottom={-300}
          />

          {/* Fill light — blue tint from left */}
          <directionalLight
            position={[-150, 200, -100]}
            intensity={0.35}
            color="#4466cc"
          />

          {/* Rim light — subtle highlight behind buildings */}
          <directionalLight
            position={[0, 80, -250]}
            intensity={0.15}
            color={themeColors.accent}
          />

          {/* Hemisphere light — sky/ground ambient fill */}
          <hemisphereLight
            args={["#2b3cff", "#080820", 0.35]}
          />

          {/* Ground point light — uplight glow */}
          <pointLight
            position={[0, 5, 0]}
            intensity={0.8}
            color={themeColors.accent}
            distance={200}
            decay={2}
          />

          {/* ─── Fog (exponential) ─── */}
          <fogExp2 attach="fog" args={["#020617", 0.0018]} />

          {/* ─── City Scene ─── */}
          <Suspense fallback={null}>
            <CityScene
              buildings={buildings}
              theme={theme}
              onBuildingClick={onBuildingClick}
            />
          </Suspense>

          {/* ─── Ground System ─── */}
          <CityGroundSystem
            buildings={buildings}
            districts={districts}
            themeColors={themeColors}
          />

          {/* ─── Floating Particles ─── */}
          <FloatingParticles count={140} color={themeColors.accent} />

          {/* ─── Post-processing ─── */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.6} />
          </EffectComposer>

          {/* ─── Camera Controls ─── */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={40}
            maxDistance={3000}
            target={[0, 80, 0]}
            enablePan
            panSpeed={0.8}
            rotateSpeed={0.5}
            zoomSpeed={1.0}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />

          {/* Debug stats */}
          {showStats && <Stats />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}

// ─── City Ground System ────────────────────────────────────────
// Structured ground with district tiles, roads, plots, borders, and labels.

interface GroundSystemProps {
  buildings: CityBuilding[];
  districts: District[];
  themeColors: ReturnType<typeof getThemeColors>;
}

function CityGroundSystem({ buildings, districts, themeColors }: GroundSystemProps) {
  return (
    <group>
      {/* Solid dark ground base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[8000, 8000]} />
        <meshStandardMaterial color={themeColors.ground} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Neon grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        cellSize={20}
        cellThickness={0.6}
        cellColor={themeColors.gridPrimary}
        sectionSize={100}
        sectionThickness={1.0}
        sectionColor={themeColors.gridAccent}
        fadeDistance={2000}
        fadeStrength={1.5}
        infiniteGrid
        side={THREE.DoubleSide}
      />

      {/* District ground tiles & borders */}
      {districts.map((district) => (
        <DistrictGround key={district.name} district={district} />
      ))}

      {/* Building plot tiles */}
      {buildings.map((b) => (
        <BuildingPlot
          key={b.login}
          position={[b.position[0], 0, b.position[1]]}
          width={b.dimensions.width + 4}
          depth={b.dimensions.depth + 4}
          district={b.district}
        />
      ))}

      {/* Procedural roads between districts */}
      <ProceduralRoads districts={districts} accentColor={themeColors.accent} />

      {/* Floating district labels */}
      {districts.map((district) => (
        <DistrictLabel key={`label-${district.name}`} district={district} />
      ))}
    </group>
  );
}

// ─── District Ground Tile ──────────────────────────────────────
// Tinted ground per district with elevation variation and glowing border.

function DistrictGround({ district }: { district: District }) {
  const [cx, cz] = district.center;
  const radius = district.radius;
  const color = new THREE.Color(district.color);

  // Subtle terrain elevation per district (±3 units, seeded)
  const elevation = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < district.name.length; i++) {
      hash = ((hash << 5) - hash + district.name.charCodeAt(i)) | 0;
    }
    return ((hash & 0xff) / 255) * 6 - 3; // -3 to +3
  }, [district.name]);

  // Border points for a hexagonal-ish shape
  const borderPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          cx + Math.cos(angle) * radius,
          elevation + 0.3,
          cz + Math.sin(angle) * radius
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [cx, cz, radius, elevation]);

  return (
    <group>
      {/* Tinted ground disc */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, elevation + 0.05, cz]}
        receiveShadow
      >
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial
          color={color.clone().multiplyScalar(0.15)}
          emissive={color}
          emissiveIntensity={0.02}
          roughness={0.92}
          metalness={0.08}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Glowing border ring — using lineSegments instead of line to avoid SVG conflict */}
      <lineSegments geometry={borderPoints}>
        <lineBasicMaterial
          color={district.color}
          transparent
          opacity={0.4}
          linewidth={2}
        />
      </lineSegments>

      {/* Inner glow ring at ground level */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, elevation + 0.15, cz]}
      >
        <ringGeometry args={[radius - 1, radius + 0.5, 32]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={0.6}
          toneMapped={false}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── Building Plot ─────────────────────────────────────────────
// Raised platform tile under each building.

function BuildingPlot({
  position,
  width,
  depth,
  district,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  district: string;
}) {
  const plotColor = useMemo(() => {
    const DISTRICT_COLORS: Record<string, string> = {
      frontend: "#64b5f6", backend: "#c8e64a", fullstack: "#ffd93d",
      devops: "#ff8a65", mobile: "#e040fb", data: "#4fc3f7",
      "ai-ml": "#f06292", security: "#ff6b6b", gamedev: "#aed581",
      "open-source": "#6bcb77",
    };
    return DISTRICT_COLORS[district] || "#ffd93d";
  }, [district]);

  return (
    <group position={position}>
      {/* Plot base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#0c0c18"
          emissive={plotColor}
          emissiveIntensity={0.03}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Plot edge glow */}
      <lineSegments position={[0, 0.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, 0.2, depth)]} />
        <lineBasicMaterial color={plotColor} transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

// ─── Procedural Roads ──────────────────────────────────────────
// Dark asphalt roads with neon lane lines connecting districts.

function ProceduralRoads({
  districts,
  accentColor,
}: {
  districts: District[];
  accentColor: string;
}) {
  const roads = useMemo(() => {
    if (districts.length < 2) return [];

    const roadSegments: {
      start: [number, number];
      end: [number, number];
      color: string;
    }[] = [];

    // Connect each district to the city center (0,0)
    for (const district of districts) {
      roadSegments.push({
        start: [0, 0],
        end: district.center,
        color: district.color,
      });
    }

    // Connect adjacent districts (by angle proximity)
    const sorted = [...districts].sort((a, b) => {
      const angleA = Math.atan2(a.center[1], a.center[0]);
      const angleB = Math.atan2(b.center[1], b.center[0]);
      return angleA - angleB;
    });

    for (let i = 0; i < sorted.length; i++) {
      const next = sorted[(i + 1) % sorted.length];
      roadSegments.push({
        start: sorted[i].center,
        end: next.center,
        color: accentColor,
      });
    }

    return roadSegments;
  }, [districts, accentColor]);

  return (
    <group>
      {roads.map((road, i) => {
        const dx = road.end[0] - road.start[0];
        const dz = road.end[1] - road.start[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        const midX = (road.start[0] + road.end[0]) / 2;
        const midZ = (road.start[1] + road.end[1]) / 2;
        const roadWidth = 6;

        return (
          <group key={`road-${i}`}>
            {/* Asphalt surface */}
            <mesh
              position={[midX, 0.08, midZ]}
              rotation={[-Math.PI / 2, 0, -angle]}
            >
              <planeGeometry args={[length, roadWidth]} />
              <meshStandardMaterial
                color="#0a0a12"
                roughness={0.85}
                metalness={0.15}
              />
            </mesh>

            {/* Center neon lane line */}
            <mesh
              position={[midX, 0.12, midZ]}
              rotation={[-Math.PI / 2, 0, -angle]}
            >
              <planeGeometry args={[length, 0.3]} />
              <meshStandardMaterial
                color={road.color}
                emissive={road.color}
                emissiveIntensity={0.6}
                toneMapped={false}
                transparent
                opacity={0.5}
              />
            </mesh>

            {/* Edge lane lines */}
            {[-roadWidth / 2 + 0.3, roadWidth / 2 - 0.3].map((offset, j) => (
              <mesh
                key={`lane-${i}-${j}`}
                position={[
                  midX + Math.sin(angle) * offset,
                  0.11,
                  midZ - Math.cos(angle) * offset,
                ]}
                rotation={[-Math.PI / 2, 0, -angle]}
              >
                <planeGeometry args={[length, 0.15]} />
                <meshStandardMaterial
                  color={road.color}
                  emissive={road.color}
                  emissiveIntensity={0.4}
                  toneMapped={false}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ─── District Labels ───────────────────────────────────────────
// Floating holographic billboard labels above each district.

function DistrictLabel({ district }: { district: District }) {
  const [cx, cz] = district.center;

  // Subtle float animation via ref
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = 120 + Math.sin(clock.elapsedTime * 0.5 + cx * 0.01) * 3;
    }
  });

  return (
    <group ref={groupRef} position={[cx, 120, cz]}>
      <Html
        center
        distanceFactor={400}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(5, 8, 16, 0.75)",
            border: `1px solid ${district.color}`,
            boxShadow: `0 0 20px ${district.color}33, 0 0 40px ${district.color}11`,
            backdropFilter: "blur(6px)",
            whiteSpace: "nowrap",
            fontFamily: "'Silkscreen', monospace",
            letterSpacing: "0.15em",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: district.color,
              textShadow: `0 0 10px ${district.color}66`,
              textTransform: "uppercase",
            }}
          >
            {district.displayName}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── Floating Particles ────────────────────────────────────────
// Ambient floating specks of light that drift through the city.

function FloatingParticles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = Math.random() * 600 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.008;
    // Gentle bobbing
    const positions = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const baseY = positions.getY(i);
      positions.setY(i, baseY + Math.sin(clock.elapsedTime * 0.5 + i) * 0.02);
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={2}
        color={color}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Theme Colors ──────────────────────────────────────────────

function getThemeColors(theme: string) {
  const themes: Record<
    string,
    {
      sky: string;
      ground: string;
      fog: string;
      accent: string;
      ambient: number;
      directional: number;
      gridPrimary: string;
      gridAccent: string;
    }
  > = {
    midnight: {
      sky: "#050810",
      ground: "#080c18",
      fog: "#050810",
      accent: "#c8e64a",
      ambient: 0.2,
      directional: 0.45,
      gridPrimary: "#0d1a3a",
      gridAccent: "#1a3a6a",
    },
    sunset: {
      sky: "#120818",
      ground: "#150a1a",
      fog: "#120818",
      accent: "#ff6b6b",
      ambient: 0.3,
      directional: 0.5,
      gridPrimary: "#2a1020",
      gridAccent: "#5a2040",
    },
    dawn: {
      sky: "#081520",
      ground: "#0a1a28",
      fog: "#081520",
      accent: "#64b5f6",
      ambient: 0.35,
      directional: 0.55,
      gridPrimary: "#0a2040",
      gridAccent: "#1a4070",
    },
    neon: {
      sky: "#060006",
      ground: "#0a000a",
      fog: "#060006",
      accent: "#e040fb",
      ambient: 0.15,
      directional: 0.35,
      gridPrimary: "#1a0030",
      gridAccent: "#4a0080",
    },
  };

  return themes[theme] ?? themes.midnight;
}
