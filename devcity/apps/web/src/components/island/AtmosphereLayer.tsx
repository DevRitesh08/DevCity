// ─── Atmosphere Layer ──────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL LIGHTING SETUP
// Sky + fog + lights — the complete atmosphere system.
// Renders golden-hour look matching Bruno Simon aesthetic.

"use client";

import { Sky } from "@react-three/drei";

export default function AtmosphereLayer() {
  return (
    <>
      {/* FOG — always active, creates depth and mystery */}
      {/* VISUAL_UPGRADE_SPEC v1.0 — LAW 7: NO hard horizon */}
      <fog attach="fog" args={["#c9e8f5", 60, 200]} />

      {/* SKY — low sun = warm golden hour (Bruno Simon's signature look) */}
      {/* VISUAL_UPGRADE_SPEC v1.0 — LAW 8: NO empty sky */}
      <Sky
        distance={450000}
        sunPosition={[0.5, 0.12, -1]}
        inclination={0.54}
        azimuth={0.28}
        turbidity={7}
        rayleigh={2.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />

      {/* AMBIENT — very subtle, warm, fills shadows softly */}
      <ambientLight intensity={0.35} color="#fff8e0" />

      {/* DIRECTIONAL — single sun light, low angle, warm */}
      {/* VISUAL_UPGRADE_SPEC v1.0 — Phase 1: castShadow false */}
      <directionalLight
        position={[30, 25, -20]}
        intensity={1.2}
        color="#fff8e0"
        castShadow={false}
      />

      {/* Hemisphere light for sky/ground color bounce */}
      <hemisphereLight args={["#87ceeb", "#c8a96e", 0.3]} />
    </>
  );
}
