---
description: "Phase 2 — Data + Auth MVP. Connect real GitHub data and let users claim buildings. Weeks 4-7."
---

# Phase 2 — Data + Auth MVP

> **Duration:** Weeks 4-7
> **Goal:** Connect real GitHub data and let users claim buildings.
> **Lead:** DATA-RUNNER
> **Support:** GHOST-PROTOCOL, GRID-OPS, CHROME-SMITH, NEON-ARCHITECT, CORTEX

## Mission Sequence

### Step 1: GitHub Data Pipeline (DATA-RUNNER)
1. Build GitHub API client (REST + GraphQL) with rate limit tracking
2. Create seed script to populate top 500 developers
3. Implement ranking algorithm (composite score)
4. Build district assignment logic (language → cyberpunk district)

### Step 2: Database Population (GRID-OPS)
1. Extend Prisma schema with all developer fields
2. Create seed command in package.json
3. Set up Supabase project and connect Prisma
4. Create city snapshot query (single optimized Prisma query)

### Step 3: Authentication (GHOST-PROTOCOL)
1. Configure Supabase GitHub OAuth
2. Build sign-in / callback API routes
3. Create auth middleware for protected routes
4. Build `getAuthUser()` and `requireAuth()` helpers

### Step 4: Building Claiming (GHOST-PROTOCOL + DATA-RUNNER)
1. Create `/api/claim` endpoint
2. Verify user matches building owner
3. Update building claimed status
4. Trigger activity feed event

### Step 5: Profile Pages (CHROME-SMITH)
1. Build `/dev/[username]/page.tsx` with cyberpunk styling
2. Stats display: contributions, repos, stars, streak, rank
3. Achievement showcase grid
4. "Visit in City" button (links to city view focused on building)

### Step 6: City Integration (NEON-ARCHITECT)
1. Load real data into city scene (replace hardcoded data)
2. Click building → show developer info panel
3. Search functionality (find and fly to building)
4. Minimap with holographic styling

### Step 7: Deploy (GRID-OPS + CORTEX)
1. Configure Vercel project
2. Set environment variables
3. Deploy and verify production build
4. CI pipeline passing on all PRs

## Success Criteria
- [ ] City renders real GitHub developer data
- [ ] Users can sign in with GitHub and claim buildings
- [ ] Developer profile pages work with cyberpunk UI
- [ ] Search finds developers and camera flies to their building
- [ ] Deployed and accessible on Vercel
