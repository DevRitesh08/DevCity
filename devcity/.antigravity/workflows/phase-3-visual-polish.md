---
description: "Phase 3 — Visual Polish + Districts. Make every district visually unique and the city feel alive. Weeks 8-12."
---

# Phase 3 — Visual Polish + Districts

> **Duration:** Weeks 8-12
> **Goal:** Make every district visually unique and the city feel alive.
> **Lead:** NEON-ARCHITECT
> **Support:** CHROME-SMITH, DATA-RUNNER, CORTEX

## Mission Sequence

### Step 1: District Architecture Styles (NEON-ARCHITECT)
Implement all 8 distinct cyberpunk architectural styles:

1. **Neon Alley** (Frontend) — Glass towers with LED façades, animated holographic signs, transparent walls
2. **The Forge** (Backend) — Industrial megastructures, smoke stacks with data steam, heavy steel girders
3. **Neural District** (Data/AI) — Domed research labs, floating data orbs, bioluminescent surfaces
4. **Sky Deck** (Mobile) — Sleek curved towers, glass walkways, wireless signal wave animations
5. **Grid Zero** (DevOps) — Server rack buildings, blinking LED arrays, cooling fan vents
6. **Pixel Heights** (GameDev) — Colorful voxel-influenced structures, floating power-up cubes, portals
7. **The Vault** (Security) — Fortress-style bunkers, firewall barriers, scanner beams
8. **Downtown Core** (Top 50) — Ultra-tall chrome spires, holographic crowns, searchlight beams, drones

### Step 2: Advanced Environment (NEON-ARCHITECT)
1. Elevated highway with hovercars (light trails on path)
2. Digital river with flowing data particles + holographic fish easter egg
3. Neon-lit suspension bridges with glowing cables
4. Street-level ambient life (pedestrian silhouettes, delivery drones)

### Step 3: Building States (NEON-ARCHITECT)
1. Active buildings: full neon glow, animated windows, data particles
2. Inactive (30+ days): building goes dark, windows flicker out, digital "rust"
3. Recently claimed: neon pulse celebration animation
4. Real-time commit pulse: windows flash white in ripple pattern + data beam to sky

### Step 4: LOD System (NEON-ARCHITECT)
1. LOD 0 (< 200 units): Full geometry + all effects
2. LOD 1 (200-600): Simplified geometry + static glow
3. LOD 2 (600-1200): Billboard imposter sprites
4. LOD 3 (> 1200): Culled

### Step 5: Camera System (NEON-ARCHITECT)
1. Cinematic intro sequence (8 seconds, skippable)
2. Orbit, Fly, Street, Cinematic, Focus modes
3. Smooth transitions between modes
4. Depth-of-field on Focus mode

### Step 6: Performance Optimization (NEON-ARCHITECT + CORTEX)
1. Profile and optimize to < 20 draw calls
2. Ensure 60fps with 1000+ buildings on mid-range GPU
3. Lazy-load all 3D components with `next/dynamic` + `ssr: false`
4. Bundle size check: Three.js excluded from initial load

## Success Criteria
- [ ] All 8 district styles are visually distinct and stunning
- [ ] Elevated highway and digital river are functional
- [ ] Building inactive/active states work dynamically
- [ ] LOD system maintains 60fps with full city
- [ ] Cinematic intro plays on first visit
- [ ] Overall visual matches "Blade Runner meets GitHub" vision
