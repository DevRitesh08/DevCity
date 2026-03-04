# DevCity — Project Progress

> Auto-maintained progress log. Updated after every incremental step.

---

## Architecture Decisions (Locked — No Re-Evaluation)

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo tool | pnpm workspaces + Turborepo | Fast installs, native workspaces, parallel task execution |
| Framework | Next.js 15 (App Router) | Server components, API routes, ISR, best React DX |
| 3D engine | Three.js + React Three Fiber | Declarative 3D in React, largest ecosystem, proven at scale |
| Database | Supabase (PostgreSQL + RLS) | Generous free tier, real-time, auth, RLS security |
| Styling | Tailwind CSS v4 | Utility-first, zero runtime, great DX with Intellisense |
| Types | Shared `@devcity/types` package | Single source of truth, consumed by all apps/packages |
| Build | Turborepo pipelines | Caching, dependency-aware builds, CI-ready |

---

## Completed Steps

### Step 1: Monorepo Scaffold ✅
- **Files**: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json`, `.gitignore`, `.npmrc`, `README.md`
- **Details**: pnpm 10.30.3, Turborepo 2.8.13, TypeScript 5.9.3 strict mode
- **Workspaces**: `apps/*`, `packages/*`

### Step 2: Next.js Web App ✅
- **Path**: `apps/web/`
- **Files**: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`
- **Details**: Next.js 15.5.12, React 19, port 3001, App Router, manual scaffold (OneDrive path workaround)

### Step 3: Tailwind + Design Theme ✅
- **Files**: `globals.css`, `layout.tsx`
- **Details**: Tailwind v4 with `@tailwindcss/postcss`, custom theme tokens (bg, accent, cream, muted), Silkscreen pixel font, dark mode, custom scrollbar, pixel button press effect, animations

### Step 4: Shared Types Package ✅
- **Path**: `packages/types/`
- **Files**: `index.ts`, `developer.ts`, `building.ts`, `platform.ts`, `city.ts`
- **Types defined**: `Developer`, `DeveloperStats`, `BuildingDimensions`, `CityBuilding`, `CityLayout`, `District`, `CityTheme`, `GitHubStats`, `GitHubRepo`, and 20+ more interfaces

### Step 5: Env Config + Supabase ✅
- **Files**: `env.ts`, `supabase.ts`, `supabase-server.ts`, `.env.example`, `.env.local`
- **SQL**: `supabase/migrations/001_foundation.sql` — 10+ tables with RLS
- **Tables**: `developers`, `developer_platforms`, `developer_repos`, `portfolio_projects`, `achievements`, `developer_achievements`, `streaks`, `cosmetic_items`, `developer_cosmetics`, `activity_feed`

### Step 6: GitHub API Integration ✅
- **Files**: `lib/github.ts`, `app/api/dev/[username]/route.ts`
- **Features**: REST + GraphQL fetchers, rate limit handling, 1hr cache, custom `GitHubApiError`, contribution graph via GraphQL, district inference from language map
- **Endpoint**: `GET /api/dev/[username]` → returns stats + building dimensions + district

### Step 7: Building Generation Logic ✅
- **Files**: `lib/building.ts`
- **Algorithm**: Logarithmic height from contributions (8–200 units), linear width from repos (6–30 units), depth at 0.75 ratio, lit percentage from stars+followers
- **Utilities**: `seededRandom()` (deterministic from username), `getBuildingColor()` (10-color palette)

### Step 8: Basic 3D Scene ✅
- **Files**: `components/city/CityCanvas.tsx`, `components/city/CityScene.tsx`
- **Dependencies**: three 0.183.2, @react-three/fiber 9.5.0, @react-three/drei 10.7.7, @react-three/postprocessing 3.0.4
- **Features**: Canvas with ACES tone mapping, OrbitControls, directional+ambient lighting, fog, bloom post-processing, 4000x4000 ground plane, PerformanceMonitor, 4 themes (midnight/sunset/dawn/neon)

### Step 9: Single Building Render ✅
- **Files**: `components/city/Building.tsx`
- **Features**: Box geometry body with computed dimensions, procedural windows on all 4 faces (lit/unlit based on litPercentage), roof cap with accent color, foundation ledge, roof features (antenna, AC units), hover tooltip with HTML overlay, click handler, emissive glow on hover animation
- **Determinism**: All visual variance derived from `seededRandom(login)` — same username always produces same building

### Step 10: City Layout Generator ✅
- **Files**: `lib/city-layout.ts`
- **Algorithm**: Radial district placement (10 districts at different angles from origin), grid-based building placement within districts (tallest near center), street gaps (8u) with avenues every 5 buildings (16u), auto-generated decorations (lamps, trees) and plazas
- **Functions**: `generateCityLayout()` (full city), `generateSingleBuildingLayout()` (single dev viewer)

### Step 11: Wire UI Search → 3D Canvas ✅
- **Files**: `components/SearchBar.tsx`, `app/dev/[username]/page.tsx`, `app/dev/[username]/DevProfileClient.tsx`, `app/dev/[username]/not-found.tsx`
- **Flow**: Landing page search → navigates to `/dev/[username]` → server component fetches GitHub data → computes building → passes to client component → renders 3D canvas with stats sidebar
- **UI**: Theme switcher (4 themes), building dimension stats, GitHub stats panel, avatar, district badge, accent color swatch

---

## Phase 1: Feature Enrichment

### Task 1: Loading & Error States ✅
- **Files**: `app/dev/[username]/error.tsx`, `app/dev/[username]/loading.tsx`
- **Error boundary**: Rate limit detection (403/429), user not found (404), generic errors with retry button
- **Loading skeleton**: Pixel-art themed with animated building construction visualization, pulsing header/sidebar blocks

### Task 2: Enhanced GitHub API ✅
- **Files**: `lib/github-enhanced.ts`
- **New fetchers**: `fetchRepoCommitStatus()` (CI/CD status), `fetchDevHealth()` (aggregate 0–1 health score), `fetchGists()`, `fetchOrgs()`, `fetchPackages()`, `fetchFollowing()`, `fetchEnhancedDevData()` (parallel aggregate)
- **Types**: `CIStatus`, `RepoHealth`, `GistSummary`, `OrgSummary`, `PackageSummary`, `FollowConnection`, `EnhancedDevData`
- **Scopes used**: `repo:status`, `gist`, `read:org`, `read:packages`, `user:follow`

### Task 3: Health Aura (UI + 3D) ✅
- **Sidebar**: Health badge showing HEALTHY (green) / UNSTABLE (amber) / FAILING (red) / NO CI (grey)
- **3D**: Ring geometry at building base with emissive glow colored by CI health score
- **Props chain**: `healthScore` optional prop through `CityCanvas` → `CityScene` → `Building`
- **CI details**: Per-repo PASS/FAIL/PEND status in sidebar

### Task 4: Enhanced Profile Sidebar ✅
- **Files**: `app/dev/[username]/DevProfileClient.tsx`, `app/dev/[username]/page.tsx`
- **New sections**: Top repos (with language + stars + links), CI health details, organizations (with avatars), published packages, gists
- **Data flow**: Server component fetches enhanced data → passes to client for rendering

### Task 5: City Overview Page ✅
- **Files**: `app/city/page.tsx`, `app/city/CityOverviewClient.tsx`
- **Featured devs**: 8 developers (torvalds, gaearon, sindresorhus, tj, yyx990803, ThePrimeagen, antirez, mitchellh)
- **Server component**: Parallel fetch of all buildings → passes to client
- **Client component**: Full 3D city with layout generator, building list sidebar (sorted by contributions), district legend, city stats overlay (buildings/contributions/stars/districts), click-to-navigate to individual profiles

### Task 6: In-Memory Caching ✅
- **Files**: `lib/cache.ts`
- **Features**: TTL-based in-memory cache with `cached()` wrapper, `invalidate()`, `invalidatePrefix()`, `clearCache()`, `getCacheStats()`
- **TTLs**: `TTL_USER` (10min), `TTL_STATS` (30min), `TTL_CI` (5min), `TTL_CITY` (1hr)
- **Integration**: Both `/dev/[username]` and `/city` pages use cached fetchers — no redundant API calls on repeat visits

### Task 7: Responsive + Mobile Controls ✅
- **Sidebar**: Slide-in overlay on mobile (`translate-x-full` → `translate-x-0`), toggle button (STATS/CLOSE on profile, LIST/CLOSE on city)
- **3D controls**: Explicit touch configuration on OrbitControls (ONE=ROTATE, TWO=DOLLY_PAN), reduced speeds for mobile
- **Stats overlay**: Hidden on `sm` breakpoint for city view

---

## Phase 2: Auth, Persistence, Achievements & Social

### Task 1: GitHub OAuth Auth Flow ✅
- **Files**: `lib/auth.ts`, `api/auth/login/route.ts`, `api/auth/callback/route.ts`, `api/auth/logout/route.ts`, `api/auth/session/route.ts`
- **Flow**: Login → redirect to GitHub OAuth → callback validates state → exchanges code for token → creates HTTP-only cookie session → redirects to `/dev/{login}`
- **Session**: Base64-encoded JSON in `devcity_session` cookie, 7-day TTL, CSRF state validation
- **Functions**: `getGitHubAuthUrl()`, `exchangeCodeForToken()`, `fetchAuthenticatedUser()`, `createSession()`, `getSession()`, `destroySession()`, `getSessionUser()`

### Task 2: Auth Context + Session Provider ✅
- **Files**: `components/AuthProvider.tsx`, `layout.tsx` (modified)
- **Context**: `AuthUser` type, `useAuth()` hook providing `user`, `loading`, `login()`, `logout()`, `refresh()`
- **Fetches**: `/api/auth/session` on mount to hydrate client-side auth state
- **Layout**: `<AuthProvider>` wraps all page content

### Task 3: Protected Routes + Nav Auth UI ✅
- **Files**: `components/UserNav.tsx`, `page.tsx` (modified), `DevProfileClient.tsx` (modified), `CityOverviewClient.tsx` (modified)
- **UserNav**: SIGN IN button when logged out → avatar dropdown (MY BUILDING, SETTINGS, EXPLORE CITY, SIGN OUT) when logged in
- **Integration**: Nav bar added to landing page, dev profile, and city overview headers

### Task 4: Dev Profile Persistence ✅
- **Files**: `lib/developer-store.ts`, `api/dev/[username]/kudos/route.ts`, `dev/[username]/page.tsx` (modified), `DevProfileClient.tsx` (modified)
- **Store**: In-memory Map with `StoredDeveloper` records — `upsertDeveloper()` on every profile view
- **Scoring**: `computeDevScore()` — commits 40%, stars 30%, repos 15%, followers 15% → 0–100 normalized
- **Ranking**: Auto-recomputed via `recomputeRanks()` after each upsert
- **UI**: Rank badge, DEV SCORE / VISITS / KUDOS grid in profile sidebar
- **Kudos API**: `POST /api/dev/{username}/kudos`

### Task 5: Achievement System ✅
- **Files**: `lib/achievements.ts`, `api/dev/[username]/achievements/route.ts`, `dev/[username]/page.tsx` (modified), `DevProfileClient.tsx` (modified)
- **20 achievements** across 4 tiers: bronze (5), silver (6), gold (4), diamond (4)
- **Engine**: `evaluateAchievements()` runs on every profile view, checks building stats + enhanced data against criteria
- **Tiers**: bronze → silver → gold → diamond, with tiered colors (#cd7f32 → #c0c0c0 → #ffd700 → #b9f2ff)
- **UI**: Sorted achievement list in sidebar with icon, name, description, tier badge
- **API**: `GET /api/dev/{username}/achievements`

### Task 6: Leaderboard Page + API ✅
- **Files**: `app/leaderboard/page.tsx`, `app/leaderboard/LeaderboardClient.tsx`, `api/leaderboard/route.ts`
- **Page**: Full-page leaderboard with city stats banner (total devs/commits/stars/repos)
- **Sort**: 4 sort modes — score, contributions, stars, followers (client-side re-sort)
- **Entries**: Rank medal (👑/🥈/🥉), avatar, name, score, commits, stars, followers, achievement count
- **Responsive**: Desktop table grid collapses to compact mobile view
- **API**: `GET /api/leaderboard?sort=dev_score&limit=50`

### Task 7: Real-time Presence ✅
- **Files**: `lib/presence.ts`, `api/dev/[username]/presence/route.ts`, `components/PresenceIndicator.tsx`, `DevProfileClient.tsx` (modified)
- **Engine**: In-memory presence map with 30s TTL, auto-cleanup on reads
- **Heartbeat**: Client polls `POST /api/dev/{login}/presence` every 15 seconds
- **UI**: Animated green dot + "N viewers now" indicator below profile avatar
- **API**: `GET /api/dev/{username}/presence` (count), `POST` (heartbeat + count)

### Task 8: Building Customization ✅
- **Files**: `lib/cosmetics.ts`, `api/dev/[username]/cosmetics/route.ts`, `components/BuildingCustomizer.tsx`, `DevProfileClient.tsx` (modified)
- **20 cosmetics** across 5 slots: roof (4), antenna (3), glow (4), banner (3), facade (3)
- **Unlock conditions**: "free", "achievement:{id}", "kudos:{cost}" — validated server-side
- **UI**: Tabbed customizer panel with slot tabs, cosmetic rows (icon, name, lock status, equip/remove buttons)
- **Auth-gated**: Only appears when viewing own profile while authenticated
- **API**: `GET/POST /api/dev/{username}/cosmetics`

---

## Build Verification Log

| Step | tsc --noEmit | next build | Notes |
|---|---|---|---|
| Step 1 | N/A | N/A | Infra only |
| Step 2 | ✅ 0 errors | ✅ 5.6s | Static pages generated |
| Step 4 | ✅ 0 errors | ✅ | Types package compiles |
| Step 7 | ✅ 0 errors | ✅ | Building logic verified |
| Step 9 | ✅ 0 errors | ✅ 7.4s | 3D components compile |
| Step 11 | ✅ 0 errors | ✅ 5.0s | All routes: /, /dev/[username], /api/dev/[username] |
| Phase 1 | ✅ 0 errors | ✅ 6.2s | All Phase 1 features + /city route |
| Phase 2 | ✅ 0 errors | ✅ 6.3s | 15 routes (4 auth + 5 dev API + leaderboard + pages) |

---

## File Tree (Current)

```
devcity/
├── package.json                           # Root workspace config
├── pnpm-workspace.yaml                    # Workspace definitions
├── turbo.json                             # Turborepo task config
├── tsconfig.json                          # Base TypeScript config
├── .gitignore                             # Git ignore rules
├── .npmrc                                 # pnpm settings
├── README.md                              # Project README
├── project_progress.md                    # This file
│
├── apps/web/                              # Next.js web application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── .env.example
│   ├── .env.local
│   └── src/
│       ├── app/
│       │   ├── layout.tsx                 # Root layout (pixel font, dark theme, AuthProvider)
│       │   ├── page.tsx                   # Landing page with search + nav bar
│       │   ├── globals.css                # Tailwind + design tokens
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   │   ├── login/route.ts     # GitHub OAuth redirect
│       │   │   │   ├── callback/route.ts  # OAuth callback handler
│       │   │   │   ├── logout/route.ts    # Session destroy
│       │   │   │   └── session/route.ts   # Current session check
│       │   │   ├── leaderboard/route.ts   # Leaderboard API
│       │   │   └── dev/[username]/
│       │   │       ├── route.ts           # GitHub data API endpoint
│       │   │       ├── kudos/route.ts     # Kudos POST endpoint
│       │   │       ├── achievements/route.ts # Achievements GET
│       │   │       ├── presence/route.ts  # Presence heartbeat + count
│       │   │       └── cosmetics/route.ts # Cosmetics equip/unequip
│       │   ├── city/
│       │   │   ├── page.tsx              # City overview (server)
│       │   │   └── CityOverviewClient.tsx # City 3D viewer (client)
│       │   ├── leaderboard/
│       │   │   ├── page.tsx              # Leaderboard (server)
│       │   │   └── LeaderboardClient.tsx  # Leaderboard (client)
│       │   └── dev/[username]/
│       │       ├── page.tsx              # Server component (data + achievements)
│       │       ├── DevProfileClient.tsx  # Client (3D + stats + achievements + customizer)
│       │       ├── not-found.tsx         # 404 for missing users
│       │       ├── error.tsx             # Error boundary
│       │       └── loading.tsx           # Pixel-art loading skeleton
│       ├── components/
│       │   ├── SearchBar.tsx             # Client search input
│       │   ├── AuthProvider.tsx          # Auth context + useAuth hook
│       │   ├── UserNav.tsx               # Auth-aware nav component
│       │   ├── PresenceIndicator.tsx     # Live viewer count indicator
│       │   ├── BuildingCustomizer.tsx    # Cosmetics equip UI
│       │   └── city/
│       │       ├── CityCanvas.tsx        # Three.js canvas root
│       │       ├── CityScene.tsx         # Building placement
│       │       └── Building.tsx          # Individual 3D building
│       └── lib/
│           ├── env.ts                    # Environment variable validation
│           ├── cache.ts                  # In-memory TTL cache
│           ├── auth.ts                   # GitHub OAuth + session management
│           ├── achievements.ts           # 20 achievements + evaluation engine
│           ├── cosmetics.ts              # 20 cosmetics + equip engine
│           ├── developer-store.ts        # Dev persistence + leaderboard + scoring
│           ├── presence.ts               # Real-time presence tracking
│           ├── supabase.ts               # Browser Supabase client
│           ├── supabase-server.ts        # Server Supabase clients
│           ├── github.ts                 # GitHub API client (REST + GraphQL)
│           ├── github-enhanced.ts        # Enhanced GitHub (CI, orgs, gists, packages)
│           ├── building.ts               # Building dimension calculator
│           └── city-layout.ts            # City spatial layout generator
│
├── packages/types/                        # Shared TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                      # Re-exports
│       ├── developer.ts                  # Developer & stats types
│       ├── building.ts                   # Building geometry types
│       ├── platform.ts                   # Platform connection types
│       └── city.ts                       # City layout & theme types
│
└── supabase/migrations/
    └── 001_foundation.sql                # Foundation database schema
```

---

## Pending / Next Steps

| Priority | Task | Status |
|---|---|---|
| P1 | Supabase project setup + run migrations | Requires user action |
| P1 | Persistent storage (upgrade in-memory → Supabase) | Phase 3 |
| P1 | GitHub OAuth App creation (for auth flow to work) | Requires user action |
| P2 | Multiple platform connections (GitLab, Bitbucket) | Phase 3 |
| P2 | City districts exploration mode | Phase 3 |
| P2 | 3D cosmetics rendering (apply equipped items to buildings) | Phase 3 |
| P3 | Monetization: premium cosmetics, analytics | Phase 3 |
| P3 | Social features: comments, city visits, notifications | Phase 3 |

---

## Known Issues

1. **OneDrive path**: `create-next-app` fails on OneDrive paths — workaround: manual scaffold
2. **Font warning**: Next.js warns about custom font in layout.tsx — cosmetic, no impact
3. **Lockfile warning**: Next.js detects multiple lockfiles (root package-lock.json + pnpm-lock.yaml) — cosmetic
4. **Supabase placeholders**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` use dev placeholders — real values needed for DB features
5. **GitHub token rotation**: Token was shared in chat session — must be regenerated
6. **OAuth App needed**: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` need a real GitHub OAuth App to test auth flow

---

*Last updated: Phase 2 — Auth, Achievements, Leaderboard, Presence, Customization complete (Tasks 1–8)*
