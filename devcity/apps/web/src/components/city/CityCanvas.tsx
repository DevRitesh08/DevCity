// ─── CityCanvas ────────────────────────────────────────────────
// The root Three.js canvas component.
// Cinematic cyberpunk city renderer with starfield, neon grid ground,
// floating particles, volumetric bloom, and dramatic lighting.

"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats, PerformanceMonitor, Stars, Grid } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import CityScene from "./CityScene";
import type { CityBuilding } from "@devcity/types";

interface CityCanvasProps {
  /** Array of buildings to render in the city */
  buildings: CityBuilding[];
  /** City theme name */
  theme?: string;
  /** Show performance stats overlay */
  showStats?: boolean;
  /** Callback when a building is clicked */
  onBuildingClick?: (login: string) => void;
  /** Map of login → CI health score (0–1) */
  healthScores?: Record<string, number>;
}

export default function CityCanvas({
  buildings,
  theme = "midnight",
  showStats = false,
  onBuildingClick,
  healthScores,
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
              healthScores={healthScores}
            />
          </Suspense>

          {/* ─── Neon Grid Ground ─── */}
          <NeonGround
            groundColor={themeColors.ground}
            gridColor={themeColors.gridPrimary}
            gridAccent={themeColors.gridAccent}
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

// ─── Neon Grid Ground ──────────────────────────────────────────
// A dark base plane + glowing cyberpunk grid lines.

function NeonGround({
  groundColor,
  gridColor,
  gridAccent,
}: {
  groundColor: string;
  gridColor: string;
  gridAccent: string;
}) {
  return (
    <group>
      {/* Solid dark ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[8000, 8000]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Neon grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        cellSize={20}
        cellThickness={0.6}
        cellColor={gridColor}
        sectionSize={100}
        sectionThickness={1.0}
        sectionColor={gridAccent}
        fadeDistance={2000}
        fadeStrength={1.5}
        infiniteGrid
        side={THREE.DoubleSide}
      />
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
