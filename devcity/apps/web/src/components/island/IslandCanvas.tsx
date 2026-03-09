// ─── Island Canvas ─────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL POST-PROCESSING STACK
// The root Three.js canvas for ISLEFOLIO.
// 8. POST-PROCESSING — last in scene, wraps everything.

"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";
import IslandScene from "./IslandScene";
import type { RepoStructure } from "./IslandStructures";

interface IslandCanvasProps {
  username: string;
  repos: RepoStructure[];
  islandRadius?: number;
  primaryLanguage?: string;
  onStructureClick?: (repo: RepoStructure) => void;
}

export default function IslandCanvas({
  username,
  repos,
  islandRadius = 20,
  primaryLanguage = "default",
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

          {/* VISUAL_UPGRADE_SPEC v1.0 — CANONICAL POST-PROCESSING STACK */}
          <EffectComposer multisampling={0}>
            {/* BLOOM — only emissive materials (lighthouse, windows, fireflies) */}
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.9}
              kernelSize={KernelSize.MEDIUM}
              mipmapBlur
            />

            {/* COLOR GRADE — warm, slightly golden, tropical feel */}
            <HueSaturation
              blendFunction={BlendFunction.NORMAL}
              hue={0.02}
              saturation={0.12}
            />

            {/* CONTRAST — punch up the low-poly faces */}
            <BrightnessContrast brightness={0.02} contrast={0.12} />

            {/* VIGNETTE — focus the eye on the island center */}
            <Vignette
              darkness={0.45}
              offset={0.35}
              blendFunction={BlendFunction.NORMAL}
            />
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
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
