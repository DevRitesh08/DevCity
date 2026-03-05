---
description: "Phase 5 — Sharing + Embeds. Make DevCity spread virally with embeddable components, badges, and social sharing. Weeks 19-24."
---

# Phase 5 — Sharing + Embeds

> **Duration:** Weeks 19-24
> **Goal:** Make DevCity spread virally.
> **Lead:** BROADCAST
> **Support:** CHROME-SMITH, DATA-RUNNER, NEON-ARCHITECT, CORTEX

## Mission Sequence

### Step 1: @devcity/card React Component (BROADCAST)
1. Build React component rendering mini 3D building with neon glow
2. Show key stats (contributions, stars, streak)
3. Three themes: cyberpunk-dark (default), cyberpunk-light, minimal
4. Package for npm publishing
5. Test in multiple React versions

### Step 2: @devcity/widget Web Component (BROADCAST)
1. Build Custom Element (`<devcity-card>`)
2. Lightweight: < 50KB including mini 3D renderer
3. Sandboxed iframe option for maximum compatibility
4. Works in any HTML page without framework dependencies

### Step 3: GitHub README Badge (BROADCAST + DATA-RUNNER)
1. Dynamic SVG generation (GET /api/badge/:username.svg)
2. Building silhouette + key stats
3. Cyberpunk color scheme (dark bg, neon text)
4. Edge caching with daily updates

### Step 4: OG Image Generation (BROADCAST)
1. Server-side PNG generation (1200×630)
2. Cyberpunk-styled with building preview + stats
3. Used for social media link previews
4. Aggressive caching (24-hour CDN TTL)

### Step 5: Screenshot Export (BROADCAST + NEON-ARCHITECT)
1. High-res PNG from 3D canvas
2. DevCity logo watermark
3. Share button → download or copy to clipboard

### Step 6: Career Timeline Video (BROADCAST + ORACLE)
1. Animated timeline: building rising from ground with year markers
2. Major events annotated: "First 100-star repo" → neon crown
3. Music builds as city grows
4. 15-30 second MP4 clip
5. Pro feature (requires subscription)

### Step 7: City Comparison (BROADCAST + CHROME-SMITH)
1. Compare two developers side-by-side
2. Stats comparison table
3. Shareable comparison URL

### Step 8: Social Sharing (BROADCAST)
1. Social sharing deeplinks (Twitter, LinkedIn)
2. Pre-filled sharing text with stats
3. OG images in link previews

### Step 9: Testing (CORTEX)
1. Test card component in isolation
2. Test widget in vanilla HTML
3. Test badge SVG generation
4. Test OG image caching

## Success Criteria
- [ ] `@devcity/card` published on npm and working in React apps
- [ ] `<devcity-card>` custom element works in any HTML page
- [ ] README badge generates valid SVG with developer stats
- [ ] OG images display correctly on Twitter/LinkedIn
- [ ] Screenshot export produces high-res PNG
- [ ] Every embed = permanent DevCity advertising
