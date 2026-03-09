# 🏝️ ISLEFOLIO — VISUAL UPGRADE SPECIFICATION
# Agent Reference Document v1.0
# Authority Level: MANDATORY — all visual decisions defer to this document
# Reference: bruno-simon.com (the aesthetic target)

---

## CURRENT STATE — WHAT IS WRONG

The current build produces a bland, grey, lifeless island because of these
specific technical failures. Every agent must know these and flag regressions:

```
FAILURE 1: MeshStandardMaterial everywhere
           → PBR lighting = plasticky, generic, wrong for low-poly
           → Fix: MeshLambertMaterial + flatShading on ALL geometry

FAILURE 2: Default grey/beige color palette
           → No personality, no warmth, no identity
           → Fix: Replace every color with the CANONICAL PALETTE below

FAILURE 3: Static blue plane for water
           → Looks like a swimming pool
           → Fix: Custom GLSL shader with wave vertex displacement

FAILURE 4: No post-processing
           → Scene looks flat, no cinematic quality
           → Fix: Bloom + HueSaturation + BrightnessContrast + Vignette

FAILURE 5: No atmospheric depth
           → No fog, no sky drama, horizon is hard and cold
           → Fix: Exponential fog + low-sun Sky config

FAILURE 6: Dead environment
           → Nothing moves, no particles, no life
           → Fix: Fireflies + shore foam + wind-driven foliage

FAILURE 7: Real-time lighting (directionalLight + ambientLight)
           → Expensive, inconsistent, wrong look for low-poly
           → Target: Baked textures from Blender (Phase 2+)
           → Interim: Remove all dynamic lights, use MeshLambertMaterial only

FAILURE 8: Built with Lovable.dev scaffold
           → Generic boilerplate, not production Three.js
           → Fix: Rewrite from scratch — Vite + R3F + Rapier
```

---

## THE LAW — RULES THAT CANNOT BE BROKEN

These are non-negotiable. Any agent suggesting otherwise is wrong.

```
LAW 1: NO MeshStandardMaterial on any island geometry
       Exception: UI elements only (not rendered in 3D scene)

LAW 2: NO smooth shading on terrain or structures
       flatShading: true on ALL geometry. Always.

LAW 3: NO static water plane
       Water must use the canonical OceanShader (defined below)

LAW 4: NO default Three.js grey (#808080, #888888, #999999)
       Every material must use a color from the CANONICAL PALETTE

LAW 5: NO real-time shadow casting on more than 3 objects
       Use baked lighting or MeshLambertMaterial without shadows

LAW 6: NO bloom on non-emissive objects
       Only lighthouse beam, windows, fireflies get emissive materials

LAW 7: NO hard horizon — fog is always active
       <fog attach="fog" args={[FOG_COLOR, 60, 200]} /> always present

LAW 8: NO empty sky — Sky component always configured (low sun = golden hour)
```

---

## CANONICAL COLOR PALETTE

These are the ONLY colors used in ISLEFOLIO. No exceptions.
Agents flag any hex code not in this list as a violation.

```typescript
// src/lib/palette.ts — SINGLE SOURCE OF TRUTH FOR ALL COLORS

export const PALETTE = {
  // ── OCEAN ──────────────────────────────────────────────────────────────
  ocean_deep:      '#1a6b8a',   // deep water, far from shore
  ocean_shallow:   '#4ecdc4',   // near-shore teal
  ocean_foam:      '#e8f4f8',   // wave foam, shore edge
  ocean_fog:       '#c9e8f5',   // horizon mist color

  // ── TERRAIN ────────────────────────────────────────────────────────────
  sand_beach:      '#e8d5a3',   // beach perimeter, flat
  sand_dry:        '#c8a96e',   // higher dry sand
  grass_bright:    '#5a9c4f',   // sunny grass faces
  grass_mid:       '#4a7c59',   // standard grass (primary biome color)
  grass_shadow:    '#2d5a3d',   // shadowed grass faces
  rock_warm:       '#8b7355',   // generic rock/stone
  rock_dark:       '#5a4a3a',   // dark rock, cave faces
  mountain_peak:   '#d4c4a8',   // mountain top, near-snow
  snow_cap:        '#f0ece4',   // achievement unlock — peak reward

  // ── STRUCTURES ─────────────────────────────────────────────────────────
  wood_warm:       '#c4895a',   // cottage walls, warm wood
  wood_roof:       '#8b5e3c',   // darker roof beams
  stone_wall:      '#9b8b7a',   // stone cottage, workshop
  thatch_roof:     '#c9a84c',   // thatched roof, golden
  lighthouse_body: '#f5f0e8',   // white lighthouse tower
  lighthouse_top:  '#e84545',   // red lighthouse cap
  workshop_wall:   '#7a6a5a',   // aged workshop stone
  dock_wood:       '#a0754a',   // dock planks

  // ── BIOME PRIMARIES (one per language) ─────────────────────────────────
  biome_tropical:  '#4a7c59',   // JavaScript — lush green
  biome_pine:      '#2d5a3d',   // TypeScript — deep pine
  biome_savanna:   '#c4a87a',   // Python — warm tan
  biome_volcanic:  '#6b3a2a',   // Rust — dark volcanic
  biome_cherry:    '#8b4a5a',   // Ruby — cherry blossom earth
  biome_tundra:    '#7a9aaa',   // Go — cool grey-blue
  biome_ancient:   '#5a5040',   // C/C++ — aged stone
  biome_coastal:   '#4a8a7a',   // Swift — coastal teal
  biome_highland:  '#4a5a8a',   // Kotlin — highland blue
  biome_wetland:   '#5a7a5a',   // PHP — murky green

  // ── FOLIAGE ────────────────────────────────────────────────────────────
  tree_canopy:     '#3d7a4a',   // main tree color
  tree_canopy_2:   '#4a8a58',   // lighter canopy face
  tree_trunk:      '#7a5a3a',   // trunk brown
  palm_frond:      '#5a9c4f',   // palm tree fronds
  flower_yellow:   '#f0db4f',   // wildflowers, sun daisies
  flower_pink:     '#e8a0b4',   // cherry blossom petals

  // ── LIGHTING & ATMOSPHERE ──────────────────────────────────────────────
  sun_warm:        '#fff8e0',   // warm sunlight tint
  sky_day:         '#87ceeb',   // midday sky
  sky_golden:      '#f4a460',   // golden hour (Bruno Simon default)
  sky_dusk:        '#ff7043',   // dusk orange
  ambient_night:   '#1a1a2e',   // night sky

  // ── EMISSIVE (ONLY for bloom targets) ──────────────────────────────────
  emit_lighthouse: '#fff5a0',   // lighthouse beam (emissive)
  emit_window:     '#ffaa44',   // building windows at night (emissive)
  emit_firefly:    '#ffffaa',   // firefly particles (emissive)
  emit_campfire:   '#ff6b35',   // campfire glow (emissive)

  // ── UI ─────────────────────────────────────────────────────────────────
  ui_surface:      'rgba(10, 20, 35, 0.85)',  // panel background
  ui_border:       'rgba(78, 205, 196, 0.3)', // panel border (ocean teal)
  ui_text:         '#f5f0e8',                 // warm white text
  ui_text_dim:     'rgba(245,240,232,0.5)',   // dimmed label text
  ui_accent:       '#4ecdc4',                 // interactive accent
} as const

// Biome → primary color lookup (used by islandGenerator.ts)
export const BIOME_COLOR: Record<string, string> = {
  tropical:  PALETTE.biome_tropical,
  pine:      PALETTE.biome_pine,
  savanna:   PALETTE.biome_savanna,
  volcanic:  PALETTE.biome_volcanic,
  cherry:    PALETTE.biome_cherry,
  tundra:    PALETTE.biome_tundra,
  ancient:   PALETTE.biome_ancient,
  coastal:   PALETTE.biome_coastal,
  highland:  PALETTE.biome_highland,
  wetland:   PALETTE.biome_wetland,
}
```

---

## CANONICAL MATERIAL SYSTEM

### The 4 Materials Used in ISLEFOLIO

```typescript
// src/lib/materials.ts

import { useMemo } from 'react'
import * as THREE from 'three'
import { PALETTE } from './palette'

// ── MATERIAL 1: TERRAIN ────────────────────────────────────────────────────
// Used by: IslandTerrain, BeachRing, MountainPeak
// Rule: flatShading ALWAYS true
export function useTerrainMaterial(color: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,     // ← THE LOW-POLY MAGIC. NEVER REMOVE.
  }), [color])
}

// ── MATERIAL 2: STRUCTURE ─────────────────────────────────────────────────
// Used by: all repo buildings (cottage, lighthouse, workshop, etc.)
// Rule: flatShading true, NO shadows on non-pinned structures
export function useStructureMaterial(color: string, emissive?: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
    emissive:          emissive ? new THREE.Color(emissive) : undefined,
    emissiveIntensity: emissive ? 1.5 : 0,
  }), [color, emissive])
}

// ── MATERIAL 3: FOLIAGE ───────────────────────────────────────────────────
// Used by: trees, bushes, grass tufts
// Rule: flatShading true, depthWrite false for small props
export function useFoliageMaterial(color: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
    side: THREE.DoubleSide,  // trees visible from below
  }), [color])
}

// ── MATERIAL 4: WATER (shader-based, not Lambert) ─────────────────────────
// See OceanShader section — entirely different system
// NEVER use MeshLambertMaterial or MeshStandardMaterial for water

// ─────────────────────────────────────────────────────────────────────────────
// BANNED MATERIALS — agents flag these on sight:
// ❌ new THREE.MeshStandardMaterial()   → too PBR, wrong look
// ❌ new THREE.MeshPhongMaterial()      → specular highlight = plasticky
// ❌ new THREE.MeshNormalMaterial()     → debug only, never in production
// ❌ new THREE.MeshBasicMaterial()      → ok ONLY for particles/sprites
//    (exception: baked texture mode in Phase 2+ uses MeshBasicMaterial)
```

---

## CANONICAL OCEAN SHADER

This is the ONLY acceptable water implementation. No substitutes.

```typescript
// src/components/island/OceanSurface.tsx
// COMPLETE FILE — copy exactly

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── VERTEX SHADER ─────────────────────────────────────────────────────────
const OCEAN_VERT = /* glsl */`
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
`

// ── FRAGMENT SHADER ───────────────────────────────────────────────────────
const OCEAN_FRAG = /* glsl */`
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
`

// ── COMPONENT ─────────────────────────────────────────────────────────────
interface OceanSurfaceProps {
  size?:      number   // world units, default 400
  segments?:  number   // geometry detail, default 128
  yPosition?: number   // vertical offset, default -0.3
}

export function OceanSurface({
  size      = 400,
  segments  = 128,
  yPosition = -0.3,
}: OceanSurfaceProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime:                { value: 0 },
    uBigWavesElevation:   { value: 0.15 },
    uBigWavesFrequency:   { value: 0.7 },
    uBigWavesSpeed:       { value: 0.5 },
    uDepthColor:          { value: new THREE.Color('#1a6b8a') },  // PALETTE.ocean_deep
    uSurfaceColor:        { value: new THREE.Color('#4ecdc4') },  // PALETTE.ocean_shallow
    uColorOffset:         { value: 0.12 },
    uColorMultiplier:     { value: 5.0 },
    uAlpha:               { value: 0.88 },
  }), [])

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

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
  )
}
```

---

## CANONICAL POST-PROCESSING STACK

```typescript
// src/components/island/IslandCanvas.tsx
// Add inside <Canvas> after your scene components

import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

// ── POST-PROCESSING ───────────────────────────────────────────────────────
// These exact values match the Bruno Simon feel.
// DO NOT change values arbitrarily — each was tuned for the ISLEFOLIO palette.

<EffectComposer multisampling={0}>  {/* multisampling=0 = better perf */}

  {/* BLOOM — only lights up emissive materials (lighthouse, windows, fireflies) */}
  <Bloom
    intensity={0.35}
    luminanceThreshold={0.55}    // below this brightness = no bloom
    luminanceSmoothing={0.9}
    kernelSize={KernelSize.MEDIUM}
    mipmapBlur                   // smoother bloom (R3F postprocessing v2+)
  />

  {/* COLOR GRADE — warm, slightly golden, tropical feel */}
  <HueSaturation
    blendFunction={BlendFunction.NORMAL}
    hue={0.02}           // tiny warm shift
    saturation={0.12}    // slightly more vivid
  />

  {/* CONTRAST — punch up the low-poly faces */}
  <BrightnessContrast
    brightness={0.02}
    contrast={0.12}
  />

  {/* VIGNETTE — focus the eye on the island center */}
  <Vignette
    darkness={0.45}
    offset={0.35}
    blendFunction={BlendFunction.NORMAL}
  />

</EffectComposer>

// ── REQUIRED: install if not present ─────────────────────────────────────
// npm install @react-three/postprocessing postprocessing
```

---

## CANONICAL LIGHTING SETUP

```typescript
// src/components/island/AtmosphereLayer.tsx
// The complete lighting + sky + fog system

import { Sky } from '@react-three/drei'

export function AtmosphereLayer() {
  return (
    <>
      {/* FOG — always active, creates depth and mystery */}
      {/* Color matches the sky horizon — seamless blend */}
      <fog attach="fog" args={['#c9e8f5', 60, 200]} />

      {/* SKY — low sun = warm golden hour (Bruno Simon's signature look) */}
      <Sky
        distance={450000}
        sunPosition={[0.5, 0.12, -1]}   // LOW and to the side = golden hour
        inclination={0.54}
        azimuth={0.28}
        turbidity={7}                    // slight atmospheric haze
        rayleigh={2.5}                   // atmospheric scattering (blue sky)
        mieCoefficient={0.005}
        mieDirectionalG={0.85}           // forward scattering = sun glow
      />

      {/* AMBIENT — very subtle, warm, fills shadows softly */}
      {/* Keep intensity LOW — the palette does the work, not the lights */}
      <ambientLight intensity={0.35} color="#fff8e0" />

      {/* DIRECTIONAL — single sun light, low angle, warm */}
      {/* castShadow ONLY on this one light — performance law */}
      <directionalLight
        position={[30, 25, -20]}         // matches sunPosition direction
        intensity={1.2}
        color="#fff8e0"                  // PALETTE.sun_warm
        castShadow={false}               // NO real-time shadows in Phase 1
      />

      {/* Optional: Hemisphere light for sky/ground color bounce */}
      <hemisphereLight
        args={['#87ceeb', '#c8a96e', 0.3]}  // sky color, ground color, intensity
      />
    </>
  )
}

// ── SHADOW POLICY ─────────────────────────────────────────────────────────
// Phase 1 (now):    castShadow: false everywhere. Performance > realism.
// Phase 2 (later):  Bake shadows in Blender → MeshBasicMaterial + baked texture.
//                   This is how Bruno Simon does it. Zero real-time shadow cost.
// NEVER:            castShadow: true on instanced structures (kill the GPU).
```

---

## CANONICAL TERRAIN SETUP

```typescript
// src/components/island/IslandTerrain.tsx
// How terrain must look — flat shading, correct colors, beach ring

import { useMemo } from 'react'
import * as THREE from 'three'
import { PALETTE } from '../../lib/palette'

export function IslandTerrain({ username, radius, biome }: IslandTerrainProps) {
  // ── TERRAIN GEOMETRY ────────────────────────────────────────────────────
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      radius * 2, radius * 2,
      63, 63             // 64x64 grid — enough for low-poly, not too heavy
    )
    geo.rotateX(-Math.PI / 2)

    const positions = geo.attributes.position.array as Float32Array
    const noise     = createNoise2D(seededRandom(hashUsername(username)))

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]

      // Island mask — circular falloff so edges go underwater
      const dist = Math.sqrt(x * x + z * z) / radius
      const mask = Math.max(0, 1 - Math.pow(dist, 1.8))

      // Layered noise for natural terrain
      const elevation =
        noise(x * 0.08, z * 0.08) * 5 +   // big hills
        noise(x * 0.25, z * 0.25) * 2 +   // medium bumps
        noise(x * 0.7,  z * 0.7)  * 0.5   // fine detail

      positions[i + 1] = Math.max(0, elevation * mask)
    }

    geo.computeVertexNormals()           // required for flat shading
    geo.attributes.position.needsUpdate = true
    return geo
  }, [username, radius])

  // ── BEACH RING ──────────────────────────────────────────────────────────
  // A flat disc slightly larger than island base, at water level
  // This gives the appearance of a sandy beach perimeter
  const beachGeo = useMemo(() => {
    const geo = new THREE.RingGeometry(
      radius * 0.7,  // inner radius (under terrain)
      radius * 1.05, // outer radius (extends to water)
      32             // segments — 32 is enough for a round beach
    )
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [radius])

  return (
    <group>
      {/* MAIN TERRAIN */}
      <mesh geometry={terrainGeo} receiveShadow={false}>
        <meshLambertMaterial
          color={PALETTE.BIOME_COLOR[biome] ?? PALETTE.grass_mid}
          flatShading={true}             // ← THE RULE. ALWAYS HERE.
        />
      </mesh>

      {/* BEACH RING */}
      <mesh geometry={beachGeo} position={[0, 0.05, 0]}>
        <meshLambertMaterial
          color={PALETTE.sand_beach}
          flatShading={true}
        />
      </mesh>
    </group>
  )
}
```

---

## CANONICAL FOLIAGE SYSTEM

```typescript
// src/components/island/IslandFoliage.tsx
// Trees placed by noise — never random, always deterministic per username

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PALETTE } from '../../lib/palette'

// ── LOW-POLY TREE (3 stacked cones) ──────────────────────────────────────
// This is the Bruno Simon tree style exactly
function LowPolyTree({ position }: { position: THREE.Vector3 }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />   {/* 6-sided = low-poly */}
        <meshLambertMaterial color={PALETTE.tree_trunk} flatShading />
      </mesh>
      {/* Bottom canopy (widest) */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[1.2, 1.4, 7]} />              {/* 7-sided cone */}
        <meshLambertMaterial color={PALETTE.grass_shadow} flatShading />
      </mesh>
      {/* Middle canopy */}
      <mesh position={[0, 2.9, 0]}>
        <coneGeometry args={[0.9, 1.2, 6]} />
        <meshLambertMaterial color={PALETTE.tree_canopy} flatShading />
      </mesh>
      {/* Top canopy (narrowest) */}
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.55, 1.0, 5]} />
        <meshLambertMaterial color={PALETTE.tree_canopy_2} flatShading />
      </mesh>
    </group>
  )
}

// ── PALM TREE (coastal biome) ─────────────────────────────────────────────
function PalmTree({ position }: { position: THREE.Vector3 }) {
  return (
    <group position={position}>
      {/* Slightly curved trunk using a tapered cylinder */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.18, 4, 6]} />
        <meshLambertMaterial color={PALETTE.tree_trunk} flatShading />
      </mesh>
      {/* Fronds — 5 elongated cones splayed outward */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(deg * Math.PI / 180) * 0.8,
            4.2,
            Math.sin(deg * Math.PI / 180) * 0.8,
          ]}
          rotation={[0.6, deg * Math.PI / 180, 0]}
        >
          <coneGeometry args={[0.15, 1.8, 4]} />
          <meshLambertMaterial color={PALETTE.palm_frond} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── INSTANCED TREE PLACEMENT ──────────────────────────────────────────────
export function IslandFoliage({ username, radius, biome }: FoliageProps) {
  const treeCount = Math.floor(radius * 1.5)   // more trees on bigger islands

  const treePositions = useMemo(() => {
    const noise  = createNoise2D(seededRandom(hashUsername(username) + 1))
    const trees: THREE.Vector3[] = []
    const attempts = treeCount * 4  // try 4x more than needed, discard bad positions

    for (let i = 0; i < attempts && trees.length < treeCount; i++) {
      const angle = (i / attempts) * Math.PI * 2 * 7  // golden angle spiral
      const dist  = (i / attempts) * radius * 0.75

      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist

      // Only place trees where noise says "forested"
      const forestNoise = noise(x * 0.15, z * 0.15)
      if (forestNoise < 0.1) continue       // sparse area — skip

      // Don't place trees at exact center (leave space for structures)
      if (dist < radius * 0.15) continue

      // Don't place trees on beach ring
      if (dist > radius * 0.85) continue

      trees.push(new THREE.Vector3(x, 0, z))  // y set by terrain raycast
    }
    return trees
  }, [username, radius, treeCount])

  const TreeComponent = biome === 'coastal' ? PalmTree : LowPolyTree

  return (
    <group>
      {treePositions.map((pos, i) => (
        <TreeComponent key={i} position={pos} />
      ))}
    </group>
  )
}
```

---

## CANONICAL PARTICLE SYSTEMS

```typescript
// src/components/island/AmbientLife.tsx
// Fireflies + Shore Foam — the two particle systems that make the island "alive"

// ── FIREFLIES ─────────────────────────────────────────────────────────────
// Visible at dusk/night — golden floating points
// They are what makes Bruno's portfolio feel magical

export function FireflyParticles({ count = 40, radius = 15 }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, phases } = useMemo(() => {
    const pos    = new Float32Array(count * 3)
    const phases = new Float32Array(count)       // random phase offset per firefly

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r     = Math.random() * radius * 0.75 + radius * 0.1  // avoid center and edge

      pos[i * 3]     = Math.cos(angle) * r
      pos[i * 3 + 1] = Math.random() * 3.5 + 0.3   // float 0.3–3.8 units high
      pos[i * 3 + 2] = Math.sin(angle) * r
      phases[i]      = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases }
  }, [count, radius])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t   = state.clock.elapsedTime
    const pos = pointsRef.current.geometry.attributes.position
                  .array as Float32Array

    for (let i = 0; i < count; i++) {
      // Float up and down gently
      pos[i * 3 + 1] += Math.sin(t * 0.8 + phases[i]) * 0.003

      // Drift sideways very slowly
      pos[i * 3]     += Math.cos(t * 0.3 + phases[i] * 1.3) * 0.001
      pos[i * 3 + 2] += Math.sin(t * 0.25 + phases[i] * 0.9) * 0.001
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Pulse opacity — fireflies blink
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = 0.35 + Math.sin(t * 1.5) * 0.2
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={PALETTE.emit_firefly}     // #ffffaa
        transparent
        opacity={0.5}
        sizeAttenuation                  // perspective scaling
        depthWrite={false}               // don't occlude geometry behind
        blending={THREE.AdditiveBlending} // glowing add blend
      />
    </points>
  )
}

// ── SHORE FOAM ────────────────────────────────────────────────────────────
// Ring of white foam particles at the island perimeter
// Appears to be the ocean meeting the beach

export function ShoreFoam({ radius = 15, count = 80 }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const jitter = (Math.random() - 0.5) * 2   // ±1 unit of beach width variation

      pos[i * 3]     = Math.cos(angle) * (radius + jitter)
      pos[i * 3 + 1] = -0.1    // just below water surface
      pos[i * 3 + 2] = Math.sin(angle) * (radius + jitter)
    }
    return pos
  }, [radius, count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const mat = pointsRef.current.material as THREE.PointsMaterial
    // Foam pulses with a wave rhythm
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.2) * 0.25
    mat.size    = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        color={PALETTE.ocean_foam}       // #e8f4f8
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
```

---

## CANONICAL SCENE COMPOSITION

```typescript
// src/components/island/IslandScene.tsx
// THE CORRECT ORDER of elements in the scene
// Order matters for depth sorting and visual layering

export function IslandScene({ username }: { username: string }) {
  const island = useIslandStore(s => s.islands[username])

  return (
    <>
      {/* 1. ATMOSPHERE — must be first, sets sky + fog */}
      <AtmosphereLayer />

      {/* 2. OCEAN — rendered BEFORE island (depth sorting) */}
      <OceanSurface />

      {/* 3. SHORE FOAM — at waterline, above ocean */}
      {island && <ShoreFoam radius={island.radius} />}

      {/* 4. ISLAND TERRAIN — the main landmass */}
      {island && (
        <IslandTerrain
          username={username}
          radius={island.radius}
          biome={island.biome}
        />
      )}

      {/* 5. FOLIAGE — sits on terrain */}
      {island && (
        <IslandFoliage
          username={username}
          radius={island.radius}
          biome={island.biome}
        />
      )}

      {/* 6. STRUCTURES — repo buildings, portfolio buildings */}
      {island && <IslandStructures island={island} />}

      {/* 7. PARTICLES — above everything */}
      {island && <FireflyParticles radius={island.radius} />}

      {/* 8. POST-PROCESSING — last, wraps everything */}
      <PostProcessingStack />
    </>
  )
}
```

---

## AGENT ENFORCEMENT RULES

Every agent in the ISLEFOLIO ecosystem must enforce this spec.
When reviewing any file, check against the following:

### TIDE WATCHER — add these checks

```
VISUAL CHECK 1: Any MeshStandardMaterial in 3D components?
  → CRITICAL. Replace with MeshLambertMaterial + flatShading: true

VISUAL CHECK 2: Any color not in PALETTE?
  → HIGH. Replace with nearest PALETTE equivalent

VISUAL CHECK 3: Water implemented as static plane?
  → CRITICAL. Must use OceanSurface with shader

VISUAL CHECK 4: No fog in scene?
  → HIGH. Add <fog attach="fog" args={['#c9e8f5', 60, 200]} />

VISUAL CHECK 5: EffectComposer absent or missing Bloom?
  → HIGH. Add canonical PostProcessingStack

VISUAL CHECK 6: flatShading: true missing from terrain/structure material?
  → HIGH. This is the low-poly look. It must be present.

VISUAL CHECK 7: Trees using SphereGeometry?
  → MEDIUM. Use stacked ConeGeometry (3 cones) per canonical spec

VISUAL CHECK 8: Any emissive material on non-glowing object?
  → MEDIUM. Only lighthouse, windows, fireflies, campfire get emissive
```

### STORM DETECTOR — auto-fix patterns

```typescript
// AUTO-FIX (confidence 0.97): MeshStandardMaterial → MeshLambertMaterial
// Before: new THREE.MeshStandardMaterial({ color: '#4a7c59' })
// After:  new THREE.MeshLambertMaterial({ color: '#4a7c59', flatShading: true })

// AUTO-FIX (confidence 0.95): Missing flatShading
// Before: <meshLambertMaterial color={color} />
// After:  <meshLambertMaterial color={color} flatShading />

// PROPOSE (confidence 0.82): Off-palette color
// Flag the specific hex, suggest nearest PALETTE value
```

### WAVE RIDER — performance checks for visual systems

```
VISUAL PERF CHECK 1: Ocean shader segment count
  → If segments > 256: flag HIGH (too many vertices, diminishing returns)
  → If segments < 64:  flag MEDIUM (too few, waves look blocky)
  → Target: 128 segments

VISUAL PERF CHECK 2: Particle count
  → Fireflies > 100: flag MEDIUM (mobile will struggle)
  → Shore foam > 200: flag MEDIUM
  → Combined all particles > 400: flag HIGH

VISUAL PERF CHECK 3: Post-processing effects count
  → More than 6 active effects: flag MEDIUM (GPU fill rate)
  → EffectComposer multisampling > 0: flag HIGH (expensive with effects)

VISUAL PERF CHECK 4: Tree geometry
  → Each tree = 4 cone meshes. 30 trees = 120 mesh draw calls.
  → If tree count > 20: recommend InstancedMesh for cones
```

---

## PHASE 2 UPGRADE — BAKED BLENDER LIGHTING

*For agents to understand the future state — do not implement now*

```
Current (Phase 1):
  MeshLambertMaterial + single ambient + directional light
  Looks: good low-poly, acceptable shadows

Target (Phase 2 — Week 4+):
  MeshBasicMaterial + baked texture from Blender
  Looks: Bruno Simon quality — realistic lighting at zero runtime cost

How to get there:
  1. Model island in Blender (low-poly, < 2000 tris)
  2. UV unwrap the entire island as one mesh
  3. Add a sun lamp in Blender at same angle as Three.js sun
  4. Bake: Cycles → Bake → Combined (includes AO, shadows, color bounce)
  5. Export texture as 2048x2048 PNG
  6. Export mesh as .glb
  7. In Three.js:
     const bakedTexture = useTexture('/models/island-baked.png')
     bakedTexture.flipY = false  // Blender vs Three.js UV difference
     <meshBasicMaterial map={bakedTexture} />
  8. Remove all lights from scene
  
Agent rule: When Phase 2 begins, MeshLambertMaterial on terrain components
becomes a flag (should be replaced with baked MeshBasicMaterial).
```

---

## VISUAL QA CHECKLIST

Run this before every deploy. Agents check every item.

```
□ Ocean has animated wave movement (not static)
□ Sky is golden hour (sun is LOW, not noon)
□ Fog is visible at medium distance
□ All terrain faces are flat-shaded (low-poly look visible)
□ Trees are 3-cone stacked design (not spheres)
□ Bloom is active (lighthouse glows when emissive material present)
□ Color palette is warm (no cold grey, no default Three.js colors)
□ Beach ring exists (sand perimeter around terrain base)
□ Particles visible (fireflies at night OR shore foam at beach edge)
□ No plastic-looking PBR highlights (MeshStandardMaterial eliminated)
□ Scene renders at > 45fps on a mid-range machine
□ Post-processing doesn't make the scene too dark or oversaturated
```

---

*ISLEFOLIO Visual Upgrade Specification — v1.0*
*Agents: this document supersedes any previous visual guidance*
*Last reference: bruno-simon.com — study it before implementing*
