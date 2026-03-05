// ─── CityCanvas ────────────────────────────────────────────────
// The root Three.js canvas component.
// Cyberpunk city renderer with neon rain, volumetric fog,
// reflective wet streets, aurora skybox, and dramatic post-processing.

"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stats,
  PerformanceMonitor,
  MeshReflectorMaterial,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import CityScene from "./CityScene";
import NeonRain from "./NeonRain";
import VolumetricFog from "./VolumetricFog";
import CyberpunkSkybox from "./CyberpunkSkybox";
import type { CityBuilding } from "@devcity/types";

interface CityCanvasProps {
  /** Array of buildings to render in the city */
  buildings: CityBuilding[];
  /** Show performance stats overlay */
  showStats?: boolean;
  /** Callback when a building is clicked */
  onBuildingClick?: (login: string) => void;
  /** Map of login → CI health score (0–1) */
  healthScores?: Record<string, number>;
}

export default function CityCanvas({
  buildings,
  showStats = false,
  onBuildingClick,
  healthScores,
}: CityCanvasProps) {
  const controlsRef = useRef(null);

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
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        shadows
      >
        {/* Performance monitoring — auto-adjusts quality */}
        <PerformanceMonitor>
          {/* ─── Skybox ─── */}
          <color attach="background" args={["#050010"]} />
          <CyberpunkSkybox />

          {/* ─── Lighting ─── */}
          {/* Main ambient — very low for dramatic neon contrast */}
          <ambientLight intensity={0.08} color="#1a1a3a" />

          {/* Key light — cool purple-blue from above */}
          <directionalLight
            position={[150, 400, 100]}
            intensity={0.2}
            color="#6644aa"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={1000}
            shadow-camera-left={-400}
            shadow-camera-right={400}
            shadow-camera-top={400}
            shadow-camera-bottom={-400}
          />

          {/* Fill light — cyan from below-left */}
          <directionalLight
            position={[-200, 50, -150]}
            intensity={0.1}
            color="#00FFFF"
          />

          {/* Rim light — magenta from behind for cyberpunk edge */}
          <directionalLight
            position={[0, 100, -300]}
            intensity={0.12}
            color="#FF00FF"
          />

          {/* Ground uplights — neon glow bouncing off wet streets */}
          <pointLight
            position={[0, 3, 0]}
            intensity={0.5}
            color="#00FFFF"
            distance={300}
            decay={2}
          />
          <pointLight
            position={[200, 3, -100]}
            intensity={0.3}
            color="#FF00FF"
            distance={250}
            decay={2}
          />

          {/* ─── Fog ─── */}
          <fog attach="fog" args={["#050015", 400, 3500]} />

          {/* ─── City Scene ─── */}
          <Suspense fallback={null}>
            <CityScene
              buildings={buildings}
              onBuildingClick={onBuildingClick}
              healthScores={healthScores}
            />
          </Suspense>

          {/* ─── Wet Reflective Ground ─── */}
          <WetGround />

          {/* ─── Volumetric Fog ─── */}
          <VolumetricFog
            layers={8}
            color="#0d0528"
            opacity={0.06}
            height={150}
          />

          {/* ─── Neon Rain ─── */}
          <NeonRain
            count={6000}
            color="#88ddff"
            opacity={0.12}
            speed={2.5}
          />

          {/* ─── Floating Particles ─── */}
          <FloatingParticles count={200} />

          {/* ─── Post-processing ─── */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.7} />
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

// ─── Wet Reflective Ground ─────────────────────────────────────
// Dark surface with subtle reflections — wet cyberpunk streets.

function WetGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[6000, 6000]} />
      <MeshReflectorMaterial
        mirror={0.15}
        resolution={512}
        mixBlur={8}
        mixStrength={0.6}
        roughness={0.95}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080810"
        metalness={0.3}
      />
    </mesh>
  );
}

// ─── Floating Particles ────────────────────────────────────────
// Ambient floating specks of light that drift through the city.

function FloatingParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyanColor = new THREE.Color("#00FFFF");
    const magentaColor = new THREE.Color("#FF00FF");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = Math.random() * 600 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      // Randomly cyan or magenta
      const c = Math.random() > 0.5 ? cyanColor : magentaColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.005;
    const positions = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const baseY = positions.getY(i);
      positions.setY(i, baseY + Math.sin(clock.elapsedTime * 0.3 + i) * 0.015);
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={2.5}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
