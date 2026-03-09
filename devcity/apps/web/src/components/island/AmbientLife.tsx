// ─── Ambient Life ──────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL PARTICLE SYSTEMS
// Fireflies + Shore Foam — make the island feel alive.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";

// ── FIREFLIES ─────────────────────────────────────────────────────────
// Golden floating points — visible at dusk/night
// VISUAL_UPGRADE_SPEC v1.0 — LAW 6: Bloom only on emissive objects

interface ParticleProps {
  count?: number;
  radius?: number;
}

export function FireflyParticles({ count = 40, radius = 15 }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.75 + radius * 0.1;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * 3.5 + 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.8 + phases[i]) * 0.003;
      pos[i * 3] += Math.cos(t * 0.3 + phases[i] * 1.3) * 0.001;
      pos[i * 3 + 2] += Math.sin(t * 0.25 + phases[i] * 0.9) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Pulse opacity — fireflies blink
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + Math.sin(t * 1.5) * 0.2;
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
        size={0.07}
        color={PALETTE.emit_firefly}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── SHORE FOAM ────────────────────────────────────────────────────────
// Ring of white foam particles at the island perimeter

export function ShoreFoam({ radius = 15, count = 80 }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 2;

      pos[i * 3] = Math.cos(angle) * (radius + jitter);
      pos[i * 3 + 1] = -0.1;
      pos[i * 3 + 2] = Math.sin(angle) * (radius + jitter);
    }
    return pos;
  }, [radius, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.2) * 0.25;
    mat.size = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
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
        size={0.35}
        color={PALETTE.ocean_foam}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
