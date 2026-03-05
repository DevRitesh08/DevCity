---
description: "Phase 1 — Cyberpunk Prototype. Prove the 3D rendering works and looks stunning. Weeks 1-3."
---

# Phase 1 — Cyberpunk Prototype

> **Duration:** Weeks 1-3
> **Goal:** Prove the cyberpunk city 3D rendering works and looks stunning.
> **Lead:** NEON-ARCHITECT
> **Support:** GRID-OPS, DATA-RUNNER, CHROME-SMITH, CORTEX

## Mission Sequence

### Step 1: Foundation (GRID-OPS)
1. Clean up repo: add `dev.db` and `tsconfig.tsbuildinfo` to `.gitignore`
2. Set up Prisma schema with Developer + Building models
3. Create `.env.example` with all required variables
4. Configure Supabase project (local dev or hosted)
5. Run initial migration

### Step 2: 3D Scene Setup (NEON-ARCHITECT)
1. Install dependencies: `@react-three/fiber`, `drei`, `postprocessing`, `three`, `zustand`
2. Create `CityCanvas.tsx` — Canvas + EffectComposer (Bloom, Vignette, ChromAb)
3. Create `CyberpunkSkybox.tsx` — Twilight gradient background
4. Create `VolumetricFog.tsx` — Layered purple/blue fog planes
5. Create ground plane with MeshReflectorMaterial (wet streets)
6. Add basic ambient + directional lighting (cyan/purple tones)

### Step 3: Buildings (NEON-ARCHITECT)
1. Create `CyberpunkBuilding.tsx` — Single building with neon edge material
2. Create building geometry generator (variable floors, width, depth)
3. Apply emissive neon outline material (custom ShaderMaterial)
4. Add window texture with animated glow (canvas texture atlas)
5. Create `InstancedTowers.tsx` — GPU-instanced version for 100+ buildings

### Step 4: Environment (NEON-ARCHITECT)
1. `NeonRain.tsx` — GPU particle rain system
2. `CyberStreetElements.tsx` — LED road markings, cyber-trees, lamp posts
3. Street layout: dark road with cyan LED lane lines
4. Basic camera controls (OrbitControls from drei)

### Step 5: Test Data (DATA-RUNNER)
1. Create hardcoded test dataset (20 developers with varied stats)
2. Implement `generateCityLayout()` — spiral grid placement
3. Map test data → building dimensions → render

### Step 6: Landing UI (CHROME-SMITH)
1. Create Neon Terminal base styles in `globals.css`
2. Build search bar component (NeonInput + HoloButton)
3. Build stat overlay panel (NeonPanel)
4. Loading screen with "INITIALIZING..." terminal animation

### Step 7: Quality Gate (CORTEX)
1. Set up ESLint + Prettier config
2. Create GitHub Actions CI workflow (lint + typecheck + build)
3. Add basic component smoke tests

## Success Criteria
- [ ] City renders with 100+ neon buildings at 60fps
- [ ] Rain, fog, bloom effects are all working
- [ ] Buildings have varied heights based on contribution data
- [ ] Ground is reflective (wet street effect)
- [ ] Camera orbit controls work smoothly
- [ ] Looks unmistakably cyberpunk (not pixel art)
