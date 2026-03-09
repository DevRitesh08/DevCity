// ─── Ocean Surface ─────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL OCEAN SHADER
// Custom GLSL vertex/fragment shader for animated waves.
// Deep-to-shallow color gradient with foam highlights.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── VERTEX SHADER ─────────────────────────────────────────────────────────
const OCEAN_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uBigWavesElevation;
  uniform float uBigWavesFrequency;
  uniform float uBigWavesSpeed;

  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Two overlapping sine waves for organic feel
    float elevation =
      sin(modelPosition.x * uBigWavesFrequency + uTime * uBigWavesSpeed) *
      sin(modelPosition.z * uBigWavesFrequency * 0.8 + uTime * uBigWavesSpeed * 0.7) *
      uBigWavesElevation;

    // Small ripples on top
    elevation += sin(modelPosition.x * 3.0 + uTime * 2.0) * 0.02;
    elevation += sin(modelPosition.z * 2.5 + uTime * 1.7) * 0.015;

    modelPosition.y += elevation;

    vElevation = elevation;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

// ── FRAGMENT SHADER ───────────────────────────────────────────────────────
const OCEAN_FRAG = /* glsl */ `
  uniform vec3  uDepthColor;
  uniform vec3  uSurfaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;
  uniform float uAlpha;

  varying float vElevation;

  void main() {
    // Blend deep/surface color based on wave height
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = clamp(mixStrength, 0.0, 1.0);

    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Foam highlight at wave peaks
    float foam = smoothstep(0.05, 0.12, vElevation);
    color = mix(color, vec3(0.93, 0.96, 0.98), foam * 0.4);

    gl_FragColor = vec4(color, uAlpha);
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────
interface OceanSurfaceProps {
  size?: number;
  segments?: number;
  yPosition?: number;
}

export default function OceanSurface({
  size = 400,
  segments = 128,
  yPosition = -0.3,
}: OceanSurfaceProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.15 },
      uBigWavesFrequency: { value: 0.7 },
      uBigWavesSpeed: { value: 0.5 },
      uDepthColor: { value: new THREE.Color("#1a6b8a") }, // PALETTE.ocean_deep
      uSurfaceColor: { value: new THREE.Color("#4ecdc4") }, // PALETTE.ocean_shallow
      uColorOffset: { value: 0.12 },
      uColorMultiplier: { value: 5.0 },
      uAlpha: { value: 0.88 },
    }),
    []
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yPosition, 0]}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={OCEAN_VERT}
        fragmentShader={OCEAN_FRAG}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}
