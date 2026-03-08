// ─── Sky Atmosphere ────────────────────────────────────────────
// Natural sky with sun and clouds for the island world.
// Adapts to real-time day/night cycle.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";
import { computeDayNightState } from "@/lib/gameLoop";

export default function SkyAtmosphere() {
  const dayNight = useMemo(() => computeDayNightState(), []);

  // Sun position based on time of day
  const sunPosition = useMemo((): [number, number, number] => {
    const angle = dayNight.timeOfDay * Math.PI * 2 - Math.PI / 2;
    const elevation = Math.sin(angle);
    const x = Math.cos(angle) * 100;
    const y = Math.max(elevation * 100, -20);
    const z = -50;
    return [x, y, z];
  }, [dayNight.timeOfDay]);

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        inclination={0.5}
        azimuth={0.25}
        turbidity={dayNight.isNight ? 20 : 8}
        rayleigh={dayNight.isNight ? 0.1 : 2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Main sunlight */}
      <directionalLight
        position={sunPosition}
        intensity={dayNight.isNight ? 0.1 : 1.2}
        color={new THREE.Color(...dayNight.sunColor)}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Ambient light — warm for day, cool for night */}
      <ambientLight
        intensity={dayNight.ambientIntensity}
        color={dayNight.isNight ? "#2a3a5a" : "#fff5e6"}
      />

      {/* Hemisphere light for natural outdoor feel */}
      <hemisphereLight
        args={[
          dayNight.isNight ? "#1a2a4a" : "#87ceeb",
          "#4a7c59",
          dayNight.isNight ? 0.2 : 0.4,
        ]}
      />

      {/* Fog for depth */}
      <fog
        attach="fog"
        args={[dayNight.isNight ? "#0a1a2a" : "#c9e8f5", 80, 300]}
      />

      {/* Floating cloud particles */}
      <CloudParticles isNight={dayNight.isNight} />
    </>
  );
}

// ─── Cloud Particles ───────────────────────────────────────────

function CloudParticles({ isNight }: { isNight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 300;
      pos[i * 3 + 1] = 30 + Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }

    return { positions: pos };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const time = clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      // Slow drift
      const x = pos.getX(i) + Math.sin(time * 0.1 + i) * 0.02;
      pos.setX(i, x > 150 ? -150 : x);
    }
    pos.needsUpdate = true;
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
        color={isNight ? "#4a5a7a" : "#ffffff"}
        size={8}
        transparent
        opacity={isNight ? 0.15 : 0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
