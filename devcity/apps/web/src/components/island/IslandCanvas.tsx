// ─── Island Canvas ─────────────────────────────────────────────
// The root Three.js canvas for ISLEFOLIO.
// Renders: ocean, island terrain, structures, sky, post-processing.

"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import IslandScene from "./IslandScene";
import type { RepoStructure } from "./IslandStructures";

interface IslandCanvasProps {
  username: string;
  repos: RepoStructure[];
  islandRadius?: number;
  primaryLanguage?: string;
  showStats?: boolean;
  onStructureClick?: (repo: RepoStructure) => void;
}

export default function IslandCanvas({
  username,
  repos,
  islandRadius = 20,
  primaryLanguage = "default",
  showStats = false,
  onStructureClick,
}: IslandCanvasProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [30, 25, 30],
          fov: 45,
          near: 0.5,
          far: 2000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 2]}
        shadows
      >
        <PerformanceMonitor>
          <Suspense fallback={null}>
            <IslandScene
              username={username}
              repos={repos}
              islandRadius={islandRadius}
              primaryLanguage={primaryLanguage}
              onStructureClick={onStructureClick}
            />
          </Suspense>

          {/* Post-processing — subtle for natural look */}
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.4} />
          </EffectComposer>

          {/* Camera controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 8}
            minDistance={10}
            maxDistance={120}
            target={[0, 2, 0]}
            panSpeed={0.5}
            rotateSpeed={0.4}
            zoomSpeed={0.8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />

          {showStats && <Stats />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
