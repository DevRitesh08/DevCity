# 🏝️ ISLEFOLIO — GitHub Copilot Instructions
# Location: YOUR_PROJECT/.github/copilot-instructions.md
# Copilot reads this automatically in Agent Mode. Keep it updated.

## Project Identity
- **Product**: ISLEFOLIO — living developer islands as complete digital addresses
- **Tagline**: "Your island on the internet."
- **Stack**: Three.js r168 + React Three Fiber + Rapier.js + Next.js 15 + Supabase + Vite

## Visual Identity — LOCKED
- **Aesthetic**: Low-poly island nature (reference: bruno-simon.com)
- **Primary Colors**: `#1a6b8a` (ocean) / `#4a7c59` (forest) / `#f0db4f` (sun/sand)
- **Font**: Amatic SC (display) + Nunito (body)
- **NEVER**: neon, cyberpunk, pixel-art city, skyscrapers, fly controls

## Architecture Rules (Copilot MUST follow these)

### Three.js Rules
```typescript
// ✅ ALWAYS wrap geometry/material creation in useMemo
const geometry = useMemo(() => new THREE.PlaneGeometry(r, r, 63, 63), [r])

// ✅ ALWAYS dispose in useEffect cleanup
useEffect(() => {
  return () => { geometry.dispose(); material.dispose() }
}, [])

// ✅ ALWAYS use InstancedMesh for > 5 same-type structures
// ❌ NEVER create Three.js objects in render body (recreated every frame)
// ❌ NEVER use MeshStandardMaterial on > 50 instanced objects (use MeshLambertMaterial)
```

### Island Generator Rules
```typescript
// ✅ ALWAYS clamp island radius
const radius = Math.max(8, Math.min(40, Math.log2(contributions + 1) * 3))

// ✅ ALWAYS default biome
const biome = biomeMap[language?.charAt(0).toUpperCase() + language?.slice(1)] ?? 'tropical'

// ✅ ALWAYS handle zero contributions
const safeContributions = contributions ?? 0
```

### Game Loop (Bruno Simon Pattern)
```typescript
// Tick priorities — DO NOT change these:
// 0:   Input
// 3:   Rapier physics world.step()
// 7:   Camera lerp
// 8:   Day/night uniforms + weather
// 9:   Wind + ocean foam
// 10:  Foliage + lighthouse beacon
// 998: renderer.render()
```

### Biome Map
```
JavaScript  → tropical   → #f0db4f + #4a7c59
TypeScript  → pine       → #3178c6 + #2d5a3d
Python      → savanna    → #ff8c42 + #c4a87a
Rust        → volcanic   → #ce4320 + #6b6b6b
Ruby        → cherry     → #cc342d + #ffb7c5
Go          → tundra     → #00add8 + #e8f0f5
C/C++       → ancient    → #555555 + #8b7355
Swift       → coastal    → #f05138 + #4ecdc4
Kotlin      → highland   → #7f52ff + #2d5a3d
PHP         → wetland    → #777bb4 + #4a7c59
```

### File Structure
```
src/
├── components/island/        ← 3D island rendering (R3F only)
├── components/portfolio/     ← Portfolio UI (TownHall, Totems, etc.)
├── components/ui/            ← 2D interface (search, minimap, modals)
├── lib/                      ← Pure functions (no React, no Three.js)
├── stores/                   ← Zustand state only
└── app/api/                  ← API routes only
```

### Performance Budget
```
Draw calls (single island): < 30
Triangle count (island):    < 20,000
Texture memory:             < 64 MB
Bundle size (Three.js):     < 400 KB gzipped
Target FPS (desktop):       60
Target FPS (mobile):        30
```

## What Copilot Should Suggest
- `useMemo` for any Three.js object creation
- `useEffect` cleanup for any Three.js resource
- `InstancedMesh` when rendering multiple same-type objects
- `?.` optional chaining on any GitHub API data access
- `?? 'tropical'` fallback on any biome/language lookup
- Rapier `RigidBody` with `colliders="trimesh"` for terrain

## What Copilot Should NEVER Suggest
- `new THREE.MeshStandardMaterial()` for instanced objects
- GitHub API calls inside React component bodies
- `any` TypeScript type without a comment explaining why
- `localStorage` (not supported in artifacts/R3F context)
- Direct Zustand state mutation: `store.array.push(item)` → wrong

## Agent Ecosystem
The project has 6 AI agents in `.antigravity/agents/` that run automatically.
When Copilot suggests a fix, check if STORM DETECTOR already flagged the same issue.
Agent reports are in `.antigravity/reports/` — read them before making large changes.
