# DevCity — Project Overview

> **Single source of truth for product vision, scope, and long-term roadmap.**
> Last updated: March 4, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience](#3-target-audience)
4. [Core Value Proposition](#4-core-value-proposition)
5. [Core Features](#5-core-features)
6. [System Capabilities](#6-system-capabilities)
7. [Competitive Advantage](#7-competitive-advantage)
8. [Technology Philosophy](#8-technology-philosophy)
9. [Future Roadmap](#9-future-roadmap)
10. [Long-Term Vision](#10-long-term-vision)
11. [Monetization Strategy](#11-monetization-strategy)
12. [Success Metrics](#12-success-metrics)

---

## 1. Project Overview

### What DevCity Is

DevCity is a **3D interactive visualization platform** that transforms GitHub developer profiles into living, breathing city buildings. Every developer becomes an architectural landmark — their contributions shape the height, their stars illuminate the windows, their repositories widen the foundation, and their followers expand its reach. Together, all developers form a sprawling digital metropolis that can be explored, compared, and celebrated.

DevCity is not a dashboard. It is not a leaderboard wrapped in a chart library. It is a **spatial, immersive experience** that makes developer identity tangible, shareable, and meaningful.

### Core Idea

Every developer has a story told through code — thousands of commits, hundreds of repositories, years of open-source contribution. Today, that story is buried inside flat profile pages and raw numbers that convey nothing about scale, impact, or growth. DevCity translates those numbers into a **visual language everyone understands**: architecture. A towering skyscraper for a prolific contributor. A glowing facade for a star magnet. A sprawling campus for a polyglot engineer. The metaphor is intuitive, the result is unforgettable.

### Vision

**To become the definitive visual identity layer for software developers worldwide** — the place where developer reputation is not just measured but experienced, where hiring managers explore candidates instead of scanning resumes, where open-source contributors see their impact rendered in three dimensions, and where developer communities find a shared space to inhabit.

### Mission

Build the most compelling, technically sophisticated, and broadly accessible platform for visualizing, celebrating, and gamifying developer contributions across every major code hosting platform — starting with GitHub and expanding to GitLab, Bitbucket, and beyond.

---

## 2. Problem Statement

### Problems in the Market

The software development ecosystem generates an extraordinary volume of contribution data — commits, pull requests, code reviews, issues, stars, forks, packages, CI/CD pipeline runs — but this data remains fundamentally **invisible to the people it matters most to**. The problems are structural and widespread:

**1. Developer identity is fragmented and flat.**
A developer's GitHub profile is a wall of green squares and a list of pinned repositories. There is no narrative, no sense of scale, no emotional resonance. A developer with 10,000 contributions looks nearly identical to one with 100 contributions when viewed through today's interfaces. The contribution graph is a heatmap, not a story.

**2. Recruiter and hiring team workflows are broken.**
Technical hiring still relies heavily on resumes, LinkedIn profiles, and self-reported skill lists. When recruiters do look at GitHub profiles, they encounter raw numbers that require domain expertise to interpret. There is no universally understood "developer score" and no visual shorthand for engineering capability. The result: qualified candidates are overlooked, and unqualified candidates game keyword-based filters.

**3. Open-source recognition is systemically undervalued.**
Millions of developers contribute to open-source projects without tangible recognition. Stars are the closest proxy for impact, but they measure repository popularity, not individual contribution quality. There is no cohesive system for recognizing sustained effort, cross-project contributions, or community leadership.

**4. Developer portfolios are static and unmemorable.**
Developers who want to showcase their work must build personal websites, maintain portfolio repositories, or rely on third-party resume builders. These are time-consuming to create, quickly become outdated, and lack the interactivity needed to communicate technical depth. A PDF resume cannot convey the experience of navigating through someone's entire engineering career.

**5. Community and competition have no shared space.**
Developer communities thrive on friendly competition — contribution streaks, star counts, framework adoption races — but there is no shared, visual arena where this competition plays out. Leaderboards exist as spreadsheets or niche tools. There is no persistent, explorable world where developers coexist and compare.

### Why Existing Solutions Are Insufficient

| Existing Solution | Limitation |
|---|---|
| GitHub Profile README | Static markdown, no interactivity, no 3D, requires manual maintenance |
| GitHub Skyline | Beautiful but read-only, single-year snapshots, no persistence, no social layer |
| Git-City (original) | Proof of concept only — limited API, no auth, no achievements, no persistence, no mobile support |
| LinkedIn | Not developer-focused, no code metrics, no visual representation |
| Stack Overflow Developer Story | Deprecated, was text-based, no GitHub integration |
| CodersRank / GitRoll | Dashboard-based, no immersive visualization, limited gamification |
| WakaTime | Time-tracking focused, not portfolio or identity focused |

No existing product combines **3D immersive visualization**, **real-time data aggregation**, **gamification with achievements**, **social features**, and **cross-platform developer identity** into a single platform. DevCity fills this gap entirely.

---

## 3. Target Audience

### Primary Users

#### 1. Individual Developers

**Who they are:** Software engineers at all levels — from junior developers building their first portfolio to senior engineers with decades of contributions. Includes open-source maintainers, hobbyist programmers, and professional developers working at companies of all sizes.

**Needs and motivations:**
- A compelling, low-effort way to showcase their work beyond a resume
- Recognition for sustained contribution effort, not just viral repositories
- Gamification that makes consistent coding more rewarding
- A visual identity that can be shared on social media, embedded in portfolios, or linked in job applications
- Fun — the intrinsic enjoyment of seeing their work rendered as a building they can customize

**How DevCity serves them:** Automatic profile generation from GitHub data, achievement system that rewards consistency and breadth, building customization that creates personal attachment, shareable profile URLs that work as living portfolios.

#### 2. Startup Founders and Product Teams

**Who they are:** Technical founders evaluating potential hires, CTOs building engineering teams, product managers assessing vendor engineering quality, and startup accelerators evaluating technical co-founders.

**Needs and motivations:**
- Quick visual assessment of engineering capability without deep GitHub spelunking
- Understanding of contribution patterns — sustained effort vs. sporadic activity
- Insight into technology breadth (polyglot vs. specialist)
- Culture-fit signals — open-source engagement, community involvement, collaboration patterns

**How DevCity serves them:** Instantly interpretable visual profiles, achievement badges that encode capability signals, leaderboard comparisons across candidates, city overview that shows team composition.

#### 3. Engineering Managers and Developer Relations Teams

**Who they are:** Engineering leaders responsible for team morale and recognition, DevRel professionals building community engagement programs, and HR teams running employer branding campaigns.

**Needs and motivations:**
- Internal recognition tools that celebrate engineering accomplishments
- Community engagement mechanics that drive participation
- Employer branding through team visualization (our engineering city)
- Event engagement — hackathon leaderboards, contribution challenges

**How DevCity serves them:** Team city views, organization-level dashboards, embeddable visualizations, achievement-driven engagement campaigns.

#### 4. Businesses and Enterprises

**Who they are:** Technology companies using open-source heavily, enterprises evaluating vendor technical depth, and organizations building internal developer platforms.

**Needs and motivations:**
- Vendor assessment — visualize the engineering teams behind critical dependencies
- Internal developer productivity visualization
- Compliance and contribution tracking for open-source policies
- Recruitment pipeline integration

**How DevCity serves them:** Organization profiles, API access for integration with internal tools, white-label options, enterprise SSO, and advanced analytics.

### Secondary Users

- **Students and bootcamp graduates** seeking a portfolio that stands out from identical resume templates
- **Conference organizers** wanting to display speaker engineering credentials visually
- **Open-source foundations** seeking contribution visualization across their projects
- **Content creators** (tech YouTubers, bloggers) who want visually compelling developer content

---

## 4. Core Value Proposition

### Why DevCity Exists

Developer contribution data is one of the richest signals of engineering capability available, yet it remains trapped in interfaces designed for code review, not for identity. DevCity exists to **unlock the identity value of contribution data** by transforming it into an experience that is instantly understandable, emotionally engaging, and socially shareable.

### What Makes It Valuable

**For developers:** DevCity is the most compelling portfolio they will ever have — one that builds itself automatically, grows with every commit, and never goes out of date. It transforms invisible work into visible accomplishment. The gamification layer (achievements, ranks, cosmetics) creates ongoing engagement. The social layer (kudos, presence, leaderboard) creates community.

**For organizations:** DevCity provides a visual assessment layer that compresses hours of GitHub profile review into seconds of exploration. A building's height, glow, district, and achievement tier communicate what would otherwise require reading through hundreds of repositories.

**For the ecosystem:** DevCity establishes a new standard for developer identity — one that is visual, interactive, persistent, and platform-agnostic. As it expands beyond GitHub, it becomes the first truly cross-platform developer reputation system.

### Why Users Will Choose DevCity

1. **Zero setup cost.** Enter a GitHub username. Your building exists immediately. No configuration, no manual data entry, no maintenance.

2. **Emotionally resonant.** Numbers on a profile page don't generate pride. A towering, glowing skyscraper that you built commit by commit absolutely does.

3. **Socially viral.** A 3D building is inherently shareable. Screenshots and links travel across Twitter, LinkedIn, Discord, and Slack in ways that flat profile pages never will.

4. **Continuously fresh.** Buildings update on every visit — new contributions raise the height, new stars light more windows. Your DevCity profile is always current.

5. **Deeper than alternatives.** Achievements, CI health aura, multi-platform aggregation, and cosmetic customization create a depth of engagement that no other developer profile tool offers.

---

## 5. Core Features

### 5.1 3D Building Visualization

**What it does:** Transforms a developer's GitHub metrics into a procedurally generated 3D building rendered in real-time using Three.js and React Three Fiber. The building's dimensions are computed from contributions (height), repositories (width), stars (lit windows), and followers (depth). Each building is deterministic — the same username always produces the same building — ensuring consistency across visits.

**Why it matters:** Visualization creates instant comprehension. A tall building communicates prolific output. Bright windows communicate community impact. The metaphor requires no explanation and transcends language barriers.

**Example usage:** A developer shares their profile link (`devcity.dev/dev/torvalds`) on Twitter. Recipients click through and immediately see a massive, fully-lit skyscraper — instantly understanding they are looking at one of the most impactful engineers in history. No reading required.

---

### 5.2 City Overview & Exploration

**What it does:** Aggregates all viewed developer buildings into a shared city landscape. Buildings are organized into districts by primary programming language (frontend, backend, mobile, data, devops, gamedev, fullstack). Users can fly through the city using orbital camera controls, click any building to visit that developer's profile, and compare buildings side-by-side.

**Why it matters:** The city creates a **shared space** where developers coexist. It transforms individual profiles into a community experience. District organization provides instant insight into the technology composition of the developer population.

**Example usage:** A hiring manager exploring the city notices a cluster of tall buildings in the backend district. They click through each one, comparing contribution patterns and achievement tiers, building a shortlist of candidates in minutes instead of hours.

---

### 5.3 Achievement System

**What it does:** Evaluates 20 achievements across four tiers (bronze, silver, gold, diamond) on every profile view. Achievements are awarded for contribution milestones (First Commit, Centurion, Thousand Commits, Legendary), star milestones (Stargazer, Rising Star, Star Magnet, Galaxy Star), community engagement (Social Coder, Influencer, Mega Influencer), technical breadth (Polyglot, Repo Builder, Fifty Repos), and platform engagement (Team Player, Gist Master, Green Pipeline, Org Contributor, Package Author).

**Why it matters:** Achievements provide **structured recognition** that raw numbers cannot. A developer with the "Polyglot" badge has demonstrated breadth. One with "Green Pipeline" maintains CI discipline. The tier system (bronze → diamond) creates aspirational goals that drive continued engagement.

**Example usage:** A developer checks their profile and sees they just unlocked "Rising Star" (silver tier) after crossing 100 total stars. They share the achievement on social media, driving traffic to their DevCity profile and encouraging peers to check their own.

---

### 5.4 GitHub OAuth Authentication

**What it does:** Provides secure GitHub OAuth login flow with CSRF-protected state parameter, HTTP-only session cookies with 7-day TTL, and a React context provider that makes authentication state available to all client components. Authenticated users gain access to personalized features including building customization, self-identification on the leaderboard, and account-linked settings.

**Why it matters:** Authentication unlocks the **personal layer** of DevCity — turning it from a read-only visualization tool into an identity platform where developers claim, customize, and promote their buildings.

**Example usage:** A developer clicks "Sign In," authorizes via GitHub, and is immediately redirected to their own building. They see the customization panel appear, allowing them to equip cosmetics and personalize their building's appearance.

---

### 5.5 Developer Leaderboard

**What it does:** Ranks all developers who have been viewed on the platform by a composite DevScore (commits 40%, stars 30%, repos 15%, followers 15%, normalized to 0–100). Supports four sort modes: score, contributions, stars, and followers. Displays aggregate city statistics (total developers, total commits, total stars, total repos) and enriches each entry with achievement count.

**Why it matters:** Competition drives engagement. The leaderboard creates a **persistent ranking** that incentivizes contribution and return visits. The sort modes allow different definitions of success — a developer with massive star counts but modest commit counts sees a different leaderboard than a volume contributor.

**Example usage:** A developer climbs from rank #47 to rank #12 after a month of heavy open-source contributions. They share their leaderboard position as social proof of their engineering output.

---

### 5.6 DevScore & Profile Persistence

**What it does:** Computes a unified 0–100 developer score using a weighted formula across four dimensions. Persists developer records with visit counts, kudos counts, rank positions, and timestamps. Automatically recomputes global rankings after every profile view. Tracks visit history to measure profile engagement over time.

**Why it matters:** DevScore provides a **single number that approximates engineering impact** — easy to understand, easy to compare, and automatically updated. Visit and kudos tracking create a social feedback loop that drives community engagement.

**Example usage:** A developer includes their DevScore in their email signature: "DevScore: 74 — view my building at devcity.dev/dev/jsmith." Recipients understand the number's significance from context and can click through for the full visual experience.

---

### 5.7 Kudos System

**What it does:** Allows any visitor to give kudos to a developer's profile via a simple POST action. Kudos counts are persistent, publicly visible on profiles, and factor into cosmetic unlock conditions. The system is intentionally low-friction — no authentication required to give kudos, encouraging generous recognition.

**Why it matters:** Kudos create a **peer recognition layer** that is independent of GitHub metrics. A developer who writes excellent documentation or mentors others may not have the highest commit count, but community kudos capture the respect they've earned.

**Example usage:** After finding a developer's open-source library incredibly helpful, a user visits their DevCity profile and gives kudos. The developer later sees their kudos count has risen, unlocking a new cosmetic option for their building.

---

### 5.8 Real-Time Presence

**What it does:** Tracks which users are currently viewing which developer profiles using a heartbeat-based presence system. Viewers send a heartbeat POST every 15 seconds; entries expire after 30 seconds of inactivity. An animated indicator shows the current viewer count on each profile.

**Why it matters:** Presence transforms static profiles into **living spaces**. Seeing "3 viewers now" on your profile creates a sense of activity and importance. It provides social proof that drives further engagement.

**Example usage:** A developer shares their profile link during a conference talk. Attendees visit simultaneously, and the presenter can see the viewer count climbing in real-time — a live measure of audience engagement.

---

### 5.9 Building Customization

**What it does:** Provides 20 cosmetic items across 5 building slots (roof, antenna, glow, banner, facade) that authenticated users can equip on their own buildings. Cosmetics are unlocked through three mechanisms: free (available to all), achievement-gated (requires specific achievement), and kudos-gated (requires minimum kudos count). The customizer panel features tabbed slot navigation with real-time equip/unequip actions.

**Why it matters:** Customization creates **personal ownership and attachment**. A building that a developer has personally styled becomes an identity asset they care about maintaining and sharing. Achievement-gated cosmetics create aspirational goals, and kudos-gated cosmetics create incentive for community engagement.

**Example usage:** A developer with the "Legendary" achievement (5,000+ contributions) unlocks the exclusive "Spire Roof" cosmetic — a tall pointed spire visible from across the city. They equip it, making their building instantly recognizable in the city view.

---

### 5.10 Enhanced GitHub Intelligence

**What it does:** Goes beyond basic GitHub profile data to aggregate CI/CD pipeline status (commit status API), public gists, organization memberships, published packages, and following connections. Computes a composite health score (0–1) from CI statuses across monitored repositories. Renders a colored health aura ring around 3D buildings.

**Why it matters:** Shallow GitHub data (repos, stars, followers) only tells part of the story. CI health reveals engineering discipline. Organization membership reveals collaboration scope. Packages reveal ecosystem contribution. This depth creates a **more complete and honest developer portrait**.

**Example usage:** A recruiter notices a developer with modest star counts but a bright green health aura and multiple organization badges. The CI health and org membership signal professional discipline and team collaboration — qualities not captured by stars alone.

---

### 5.11 Multi-Theme 3D Engine

**What it does:** Supports four visual themes for the 3D city: Midnight (deep blue/black), Sunset (purple/orange tones), Dawn (navy/blue gradient), and Neon (hot pink/cyberpunk). Each theme adjusts fog color, ground plane, ambient lighting, directional lighting, and bloom intensity. Theme selection is per-user and per-session.

**Why it matters:** Aesthetic choice increases personal connection to the platform. Themes also serve functional purposes — Neon theme emphasizes glowing buildings, Dawn theme provides better visibility for dense city views.

**Example usage:** A developer takes a screenshot of their building in Neon theme for their Twitter header image, creating a cyberpunk-styled developer identity visual.

---

## 6. System Capabilities

### Automation

DevCity is designed around **zero-manual-effort profile generation**. The entire pipeline — from GitHub username input to 3D building rendering — is fully automated:

- **Data ingestion:** GitHub REST and GraphQL APIs are called automatically on every profile visit. User, repository, contribution, CI status, organization, gist, and package data are fetched in parallel.
- **Building computation:** Dimensions, colors, window configurations, and district assignments are computed deterministically from raw data using logarithmic normalization and seeded randomization.
- **Achievement evaluation:** All 20 achievements are evaluated automatically on every visit. New unlocks are detected and persisted without any user action.
- **Rank recomputation:** Global leaderboard ranks are recalculated after every profile view, ensuring the leaderboard is always current.
- **Presence tracking:** Viewer presence is managed through automated heartbeats with TTL-based cleanup — no manual session management required.

### AI Integration Readiness

The architecture is designed for AI integration across several dimensions:

- **AI-powered profile summaries:** Natural language descriptions of a developer's strengths, generated from their building metrics and achievement profile.
- **Smart recommendations:** "Developers like you" suggestions based on similarity in contribution patterns, technology stacks, and achievement profiles.
- **Automated code analysis:** Deeper repository analysis using AI to assess code quality, documentation completeness, and architectural patterns beyond raw metrics.
- **Conversational search:** Natural language queries like "Show me Go developers with over 500 contributions and CI passing" mapped to city exploration.

### Dashboards

- **Developer profile dashboard:** Building visualization, stats sidebar, achievement list, customizer panel, presence indicator — all on a single page.
- **City overview dashboard:** Aggregate city statistics (total buildings, contributions, stars, districts), building list with sort/filter, 3D city exploration.
- **Leaderboard dashboard:** Global ranking with multi-sort capability, per-developer score breakdown, achievement count enrichment.

### Workflows

- **Profile visit workflow:** Username → GitHub API fetch (cached) → building computation → achievement evaluation → developer store upsert → rank recomputation → 3D render.
- **Authentication workflow:** Login redirect → GitHub OAuth → callback validation → session creation → profile redirect.
- **Customization workflow:** Authenticate → view own profile → open customizer → browse cosmetics per slot → check unlock status → equip/unequip → persist selection.
- **Social workflow:** Visit profile → give kudos → presence heartbeat → view leaderboard → explore city.

### Analytics

The platform generates rich analytics data suitable for both internal product decisions and user-facing insights:

- **Profile visit counts** per developer (tracked in developer store)
- **Kudos velocity** — rate of kudos accumulation over time
- **Achievement unlock rates** — which achievements are most/least common
- **Presence patterns** — peak viewing times, concurrent viewer counts
- **Leaderboard movement** — rank changes over time
- **District composition** — technology distribution across the developer population
- **Cache hit rates** — API efficiency metrics

### Integrations

Current integrations:

| Integration | Status | Description |
|---|---|---|
| GitHub REST API | ✅ Active | User profiles, repository data, stars, followers |
| GitHub GraphQL API | ✅ Active | Contribution calendar, detailed statistics |
| GitHub Commit Status API | ✅ Active | CI/CD pipeline health |
| GitHub Gists API | ✅ Active | Public gist discovery |
| GitHub Organizations API | ✅ Active | Org membership enumeration |
| GitHub Packages API | ✅ Active | Published package discovery |
| GitHub OAuth | ✅ Active | Authentication and identity |

Planned integrations:

| Integration | Phase | Description |
|---|---|---|
| GitLab API | Phase 3 | Merge requests, pipelines, project data |
| Bitbucket API | Phase 3 | Pull requests, repositories, team data |
| Supabase (PostgreSQL) | Phase 3 | Persistent storage, real-time subscriptions |
| Discord Bot | Phase 3 | Notifications, profile sharing, leaderboard commands |
| Slack App | Phase 3 | Team city embeds, achievement notifications |
| VS Code Extension | Phase 4 | In-editor DevCity profile and city view |
| npm/PyPI/Crates.io | Phase 4 | Package download metrics for building dimensions |

---

## 7. Competitive Advantage

### Speed

DevCity renders a complete 3D developer profile in **under 2 seconds** from username input to full interactive 3D scene. This is achieved through:

- **Parallel API fetching:** User data, stats, and enhanced data are fetched concurrently using `Promise.all`.
- **Aggressive caching:** TTL-based in-memory cache (10min for user data, 30min for stats, 5min for CI, 1hr for city) eliminates redundant API calls.
- **Server-side computation:** Building dimensions and achievement evaluation happen on the server — the client receives pre-computed data and only handles rendering.
- **Dynamic imports:** Three.js and React Three Fiber are loaded only when needed via `next/dynamic`, keeping initial page load fast.

### AI-Native Architecture

The platform is built from the ground up with AI integration in mind:

- **Structured data layer:** Every developer's data flows through typed interfaces (`CityBuilding`, `EnhancedDevData`, `StoredDeveloper`) that are ready to be consumed by AI models for classification, recommendation, and natural language generation.
- **Evaluation engine pattern:** The achievement system uses a pluggable check-function architecture that naturally extends to AI-based checks (code quality scoring, commit message analysis, documentation completeness).
- **Scoring framework:** DevScore's weighted formula is designed to be upgraded to an ML-based scoring model as training data accumulates.

### Automation-First Design

Every feature in DevCity is built to work **without user intervention**:

- Profiles generate themselves from public GitHub data.
- Achievements evaluate and unlock automatically.
- Rankings recompute on every interaction.
- Presence tracks and cleans up automatically.
- Buildings update their dimensions on every visit with fresh data.

This stands in stark contrast to portfolio tools that require manual curation, badge systems that require self-nomination, or leaderboards that require admin management.

### Scalable Architecture

The technology choices are deliberately scalable:

- **Monorepo with Turborepo:** Parallel builds, dependency-aware caching, easy addition of new apps (mobile, CLI, API-only).
- **Next.js App Router:** Server components for data fetching, client components for interactivity, API routes for backend logic — all in one deployment.
- **Shared type system:** `@devcity/types` package ensures type safety across all packages and applications, preventing interface drift as the team grows.
- **Database-ready stores:** All in-memory stores (developer, achievement, cosmetic, presence) are designed with identical interfaces to their Supabase equivalents, enabling migration without changing consuming code.

### Developer-Friendly Infrastructure

DevCity is built **by developers, for developers**, and this shows in the infrastructure:

- **TypeScript strict mode everywhere** — zero `any` types, full type inference.
- **Clean separation of concerns** — data fetching (server), rendering (client), computation (lib), types (shared package).
- **pnpm workspaces** — fast installs, strict dependency resolution, no phantom dependencies.
- **Incremental adoption** — each feature is independently deployable and independently testable.

---

## 8. Technology Philosophy

### Modular Architecture

DevCity follows a **strict modular architecture** where every capability is encapsulated in a focused module with clear boundaries:

- **`lib/github.ts`** → GitHub API communication (REST + GraphQL)
- **`lib/github-enhanced.ts`** → Extended GitHub intelligence (CI, orgs, packages)
- **`lib/building.ts`** → Building dimension computation
- **`lib/city-layout.ts`** → Spatial city layout algorithm
- **`lib/achievements.ts`** → Achievement definitions and evaluation engine
- **`lib/cosmetics.ts`** → Cosmetic catalog and equip management
- **`lib/developer-store.ts`** → Developer persistence and leaderboard
- **`lib/presence.ts`** → Real-time presence tracking
- **`lib/auth.ts`** → Authentication and session management
- **`lib/cache.ts`** → TTL-based in-memory caching

Each module exports typed interfaces and pure functions. No module directly imports from another's internals. This enables independent testing, replacement, and optimization of any single module without affecting the rest of the system.

### Scalable Infrastructure

The infrastructure is designed to grow from a single-developer project to a production platform serving millions of profiles:

**Current state (Phase 0–2):**
- In-memory stores for rapid development and zero-dependency operation
- Single Next.js deployment handles both frontend and API
- TTL-based caching prevents API rate limits

**Migration path (Phase 3+):**
- Supabase PostgreSQL replaces in-memory stores (schema already defined in `001_foundation.sql`)
- Edge Functions handle compute-intensive operations (building generation, achievement evaluation)
- CDN-cached static assets for 3D models and textures
- WebSocket connections replace polling for real-time presence

The key architectural decision is that **all stores expose identical interfaces** regardless of backend — consuming code calls `upsertDeveloper()` whether the implementation writes to a Map or a PostgreSQL table.

### Clean Design

The visual design follows a **consistent pixel-art aesthetic** that reinforces the gaming metaphor:

- **Silkscreen pixel font** — all text uses a monospaced pixel font for retro gaming feel
- **Dark theme with accent palette** — deep backgrounds (#0a0e1a), warm cream text (#e8e0d0), vibrant accent (#00ffaa)
- **Pixel borders** — 2px solid borders on all interactive elements, no rounded corners
- **Minimal animation** — subtle glow pulses and hover effects, never distracting from content
- **Responsive by default** — sidebars slide in on mobile, stats collapse gracefully, 3D controls adapt to touch

The design language is intentional: it communicates that DevCity is a **game-like experience**, not an enterprise dashboard. This distinction is critical for adoption among individual developers.

### AI-Assisted Development

The development of DevCity itself leverages AI-assisted workflows:

- **AI pair programming** for rapid feature implementation with strict type safety
- **Automated type checking** after every change ensures zero regressions
- **Build verification** at every milestone catches integration issues immediately
- **Progress documentation** is maintained automatically, eliminating knowledge loss

This AI-assisted development methodology is also a product feature: DevCity is a showcase of what AI-augmented engineering can produce — a full-stack 3D platform built with production-grade engineering discipline at startup speed.

---

## 9. Future Roadmap

### Phase 1 — Foundation & Feature Enrichment ✅ COMPLETE

**Delivered:**
- Monorepo scaffold (pnpm + Turborepo + TypeScript strict)
- Next.js 15 web application with App Router
- Tailwind v4 pixel-art design system
- Shared `@devcity/types` package
- GitHub API integration (REST + GraphQL)
- Building generation algorithm
- 3D rendering engine (Three.js + R3F)
- City layout generator with districts
- Search → 3D render pipeline
- Loading states, error boundaries
- Enhanced GitHub intelligence (CI, orgs, gists, packages)
- Health aura system (UI + 3D)
- City overview page with featured developers
- In-memory caching with TTL
- Responsive design + mobile 3D controls

### Phase 2 — Auth, Social & Gamification ✅ COMPLETE

**Delivered:**
- GitHub OAuth authentication flow
- Session management (HTTP-only cookies)
- Auth context + React provider
- Protected routes + nav auth UI
- Developer profile persistence + DevScore + ranking
- Kudos system
- 20-achievement system (4 tiers, auto-evaluation)
- Leaderboard page + API (4 sort modes)
- Real-time presence tracking + UI
- Building cosmetic system (20 items, 5 slots)
- Building customizer UI (auth-gated)

### Phase 3 — Persistence, Multi-Platform & Community (NEXT)

**Planned deliverables:**

| Feature | Description | Impact |
|---|---|---|
| **Supabase migration** | Replace all in-memory stores with PostgreSQL + RLS | Data persistence across restarts, multi-instance deployment |
| **Real-time subscriptions** | Supabase Realtime for presence, kudos, achievements | True real-time without polling overhead |
| **GitLab integration** | Merge request, pipeline, and project data | 30M+ additional developer profiles |
| **Bitbucket integration** | Pull request and repository data | Enterprise developer coverage |
| **3D cosmetic rendering** | Render equipped cosmetics on Three.js buildings | Visual differentiation in city view |
| **Social profiles** | Bio, links, skills, highlighted projects | Richer developer identity beyond raw metrics |
| **Activity feed** | Timeline of achievements, rank changes, kudos | Community discovery and engagement |
| **Embeddable widgets** | SVG/iframe badges for READMEs and websites | Viral distribution through developer profiles |
| **API v1** | Public REST API for third-party integrations | Platform ecosystem foundation |
| **Discord/Slack bots** | Profile sharing, leaderboard, achievement alerts | Community channel integration |

### Phase 4 — AI Intelligence & Platform Expansion

**Planned deliverables:**

| Feature | Description | Impact |
|---|---|---|
| **AI profile summaries** | GPT-generated natural language developer summaries | Instant understanding for non-technical audiences |
| **Smart recommendations** | "Similar developers" based on contribution patterns | Discovery and networking |
| **Code quality scoring** | AI analysis of repository code quality, documentation | Deeper building dimension: "quality" axis |
| **Natural language search** | "Show me Rust developers with 1000+ contributions" | Intuitive city exploration |
| **AI achievement generation** | Dynamic achievements based on emerging patterns | Fresh engagement without manual curation |
| **VS Code extension** | In-editor profile view, achievement notifications | Developer workflow integration |
| **Package metrics** | npm/PyPI/Crates.io download counts | Building dimensions from package ecosystem impact |
| **Team/org cities** | Organization-level city views | Enterprise product offering |
| **Mobile app** | Native iOS/Android 3D city exploration | Mobile-first engagement |

### Phase 5 — Ecosystem & Enterprise

**Planned deliverables:**

| Feature | Description | Impact |
|---|---|---|
| **Developer API marketplace** | Third-party apps built on DevCity data | Platform ecosystem moat |
| **Enterprise SSO** | SAML/OIDC for corporate deployments | Enterprise sales readiness |
| **White-label cities** | Custom-branded city instances for organizations | Revenue from enterprise customization |
| **Recruitment tools** | Candidate pipeline view, comparison mode | Recruiter product vertical |
| **Certification badges** | Platform-certified skill validation | Trust layer for hiring |
| **Premium cosmetics marketplace** | User-created and platform-exclusive cosmetics | Revenue through virtual goods |
| **Cross-platform identity** | Unified profile across GitHub + GitLab + Bitbucket | The universal developer identity |

---

## 10. Long-Term Vision

### The Universal Developer Identity Platform

In its ultimate form, DevCity becomes the **visual identity layer of the internet for software developers**. Every developer has a building. Every team has a district. Every company has a city. The platform transcends any single code hosting provider, aggregating contributions from GitHub, GitLab, Bitbucket, npm, PyPI, Crates.io, Docker Hub, and more into a single, unified representation.

### An AI-Powered Developer Intelligence Platform

As AI capabilities mature, DevCity evolves from visualization into **intelligence**:

- **For developers:** AI coaches that analyze contribution patterns and suggest areas for growth. "Your commit consistency dropped 30% this month — here are strategies to maintain your streak."
- **For hiring teams:** AI-powered candidate matching that goes beyond keyword matching. "Based on their contribution patterns, code quality, and technology breadth, this developer is a 94% match for your senior backend role."
- **For the ecosystem:** Trend analysis across the entire developer population. "TypeScript adoption grew 12% this quarter. Here's where the growth is coming from."

### An Ecosystem of Tools

DevCity's modular architecture enables it to grow into a **suite of interconnected products**:

- **DevCity Web** — The core 3D city experience (current product)
- **DevCity API** — Public API for third-party developers
- **DevCity CLI** — Terminal-based profile viewer and achievement tracker
- **DevCity for VS Code** — In-editor integration
- **DevCity for Teams** — Organization-level city management
- **DevCity for Recruiters** — Hiring-focused candidate visualization
- **DevCity Mobile** — Native 3D city exploration on iOS and Android
- **DevCity Widgets** — Embeddable profile components for any website

### A Developer Infrastructure Product

At the infrastructure level, DevCity's scoring algorithms, achievement evaluation engine, and cross-platform identity resolution are valuable **as primitives** that other products can build on. The platform can expose:

- **Score-as-a-service:** Any application can query a developer's DevScore via API.
- **Achievement-as-a-service:** Custom achievement definitions that evaluate against DevCity's aggregated data.
- **Identity-as-a-service:** Verified developer profiles that serve as portable credentials across platforms.

This positions DevCity not just as a consumer product but as a **developer infrastructure company** — a layer that other products depend on.

---

## 11. Monetization Strategy

### Revenue Streams

#### 1. Freemium Subscription Plans

| Tier | Price | Features |
|---|---|---|
| **Free** | $0/month | Single platform (GitHub), basic building, 5 cosmetic slots, public profile, leaderboard |
| **Pro** | $8/month | Multi-platform (GitHub + GitLab + Bitbucket), premium cosmetics, AI profile summary, analytics dashboard, priority data refresh |
| **Team** | $15/user/month | Organization city, team leaderboard, embeddable widgets, API access (1000 req/day) |
| **Enterprise** | Custom | SSO, white-label, unlimited API, dedicated support, custom achievements, SLA |

The free tier is deliberately generous — it must be compelling enough that developers adopt DevCity widely, creating the network effects that make paid tiers valuable.

#### 2. Premium Cosmetics Marketplace

A virtual goods marketplace where developers can purchase exclusive building cosmetics:

- **Platform-exclusive cosmetics:** Rare building styles, animated effects, unique materials (e.g., holographic facades, particle effects, seasonal themes)
- **Creator cosmetics:** User-designed cosmetics submitted, curated, and sold through a revenue-share model
- **Seasonal collections:** Limited-time cosmetic drops tied to events (Hacktoberfest, conferences, holidays)

Virtual goods monetization has proven enormously successful in gaming (Fortnite, Roblox) and has direct applicability to DevCity's visual, identity-driven experience. Expected price range: $1–$10 per cosmetic item.

#### 3. Enterprise Services

- **White-label deployments:** Custom-branded DevCity instances for large engineering organizations (annual license)
- **Recruitment pipeline integration:** API access for ATS (Applicant Tracking System) integration, candidate comparison views, and automated scoring
- **Compliance reporting:** Open-source contribution tracking and policy enforcement dashboards
- **Custom achievement programs:** Organization-specific achievements tied to internal engineering goals

#### 4. API Access Tiers

| Tier | Rate Limit | Price |
|---|---|---|
| Free | 100 req/day | $0 |
| Developer | 5,000 req/day | $29/month |
| Business | 50,000 req/day | $199/month |
| Enterprise | Unlimited | Custom |

API monetization grows as third-party developers build on DevCity's data and scoring infrastructure.

#### 5. Platform Licensing

For organizations that want to run DevCity internally:

- **Self-hosted license:** Deploy DevCity on private infrastructure with internal-only data
- **Custom integrations:** Professional services for integrating DevCity with internal tools (Jira, Confluence, internal dashboards)

### Revenue Projections (Conservative Estimate)

| Timeline | Revenue Source | Monthly Revenue |
|---|---|---|
| Month 6 | Pro subscriptions (500 users × $8) | $4,000 |
| Month 12 | Pro (2,000 × $8) + Cosmetics ($3,000) | $19,000 |
| Month 18 | Pro (5,000 × $8) + Team (50 teams × $15 × 5) + Cosmetics ($8,000) + API ($2,000) | $53,750 |
| Month 24 | Pro (10,000 × $8) + Team (200 × $15 × 5) + Enterprise (5 × $2,000) + Cosmetics ($20,000) + API ($5,000) | $130,000 |

---

## 12. Success Metrics

### Primary Success Metrics

#### 1. User Growth

| Metric | Definition | Target (12 months) |
|---|---|---|
| **Profiles Viewed** | Unique GitHub usernames visualized | 100,000 |
| **Registered Users** | Developers who have authenticated via GitHub OAuth | 15,000 |
| **Monthly Active Users** | Users who visit at least once per month | 8,000 |
| **Weekly Active Users** | Users who visit at least once per week | 3,000 |

User growth is the foundation metric. DevCity's value increases with every developer in the city — network effects drive compounding growth.

#### 2. Product Adoption

| Metric | Definition | Target (12 months) |
|---|---|---|
| **Profiles with Achievements** | % of viewed profiles that have ≥1 achievement | 85% |
| **Customization Rate** | % of authenticated users who equip ≥1 cosmetic | 40% |
| **Leaderboard Engagement** | Monthly visits to /leaderboard | 10,000 |
| **Social Shares** | Profile links shared (tracked via referrer) | 5,000/month |
| **City Exploration Sessions** | /city page visits with >30s session | 3,000/month |

Adoption metrics reveal whether features are genuinely engaging or merely present. The customization rate is a particularly strong signal — users who customize their building have formed a personal attachment.

#### 3. Automation & System Health

| Metric | Definition | Target |
|---|---|---|
| **Cache Hit Rate** | % of API calls served from cache | >70% |
| **Achievement Evaluation Latency** | Time to evaluate all 20 achievements | <50ms |
| **Profile Render Time** | Username input to interactive 3D scene | <2 seconds |
| **API Error Rate** | % of GitHub API calls that fail | <2% |
| **Presence Accuracy** | Viewer count accuracy vs. actual connected clients | >95% |

System health metrics ensure the platform remains fast, reliable, and efficient as it scales.

#### 4. Customer Retention

| Metric | Definition | Target (12 months) |
|---|---|---|
| **Day-1 Retention** | % of new users who return within 24 hours | 25% |
| **Day-7 Retention** | % of new users who return within 7 days | 15% |
| **Day-30 Retention** | % of new users who return within 30 days | 10% |
| **Pro Churn Rate** | Monthly % of Pro subscribers who cancel | <5% |
| **NPS Score** | Net Promoter Score from user surveys | >50 |

Retention is the ultimate test of product-market fit. The targets above are aggressive but achievable given the engagement loop: new achievements unlock on every contribution, leaderboard ranks shift with every profile view, and building dimensions evolve with every commit.

### Leading Indicators

These early signals predict long-term success:

- **Viral coefficient:** Average number of new users generated per existing user's profile share
- **Time in city:** Average session duration on /city (longer = more engaging)
- **Kudos per profile:** Average kudos given per profile visit (higher = stronger community)
- **Achievement unlock velocity:** Average time between successive achievement unlocks per user
- **Return visit frequency:** How often existing users return to view their own profile

### Tracking Infrastructure

All metrics will be tracked through:

- **Server-side analytics:** Built into API routes (visit counts, cache stats, achievement evaluations)
- **Client-side analytics:** Page view tracking, session duration, interaction events
- **Database queries:** Aggregate metrics from Supabase (post-migration)
- **External tools:** PostHog or Mixpanel for behavioral analytics, Sentry for error tracking

---

## Appendix: Current Technical Stack

| Layer | Technology | Version |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | pnpm 10.30.3, Turbo 2.8.13 |
| Framework | Next.js (App Router) | 15.5.12 |
| UI Library | React | 19 |
| Language | TypeScript (strict mode) | 5.9.3 |
| 3D Engine | Three.js | 0.183.2 |
| 3D React Bindings | React Three Fiber | 9.5.0 |
| 3D Helpers | React Three Drei | 10.7.7 |
| Post-Processing | React Three Postprocessing | 3.0.4 |
| Styling | Tailwind CSS | v4 |
| Database (planned) | Supabase (PostgreSQL + RLS) | 2.98.0 |
| Runtime | Node.js | 22.14.0 |
| Platform | Windows | — |

---

*This document is the single source of truth for DevCity's product vision, scope, and roadmap. It should be updated whenever significant strategic decisions are made or major features are delivered.*
