// ─── Ocean Surface ─────────────────────────────────────────────
// Animated water plane with vertex displacement for waves.
// Low-poly aesthetic matching the island theme.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanSurfaceProps {
  size?: number;
  color?: string;
  opacity?: number;
}

export default function OceanSurface({
  size = 500,
  color = "#1a6b8a",
  opacity = 0.85,
}: OceanSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, 64, 64);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [size]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position;
    const time = clock.elapsedTime;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Multi-frequency waves
      const wave1 = Math.sin(x * 0.05 + time * 0.8) * 0.3;
      const wave2 = Math.sin(z * 0.07 + time * 0.6) * 0.2;
      const wave3 = Math.sin((x + z) * 0.03 + time * 0.4) * 0.15;

      positions.setY(i, wave1 + wave2 + wave3 - 0.5);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow position={[0, -0.5, 0]}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}
