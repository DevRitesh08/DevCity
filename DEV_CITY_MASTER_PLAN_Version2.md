# ⚡ DEV CITY — MASTER PLAN (CYBERPUNK EDITION)

> **"Your code powers a neon-lit metropolis. Every commit lights a window. Every repo raises a tower. Welcome to DevCity."**

**Author:** DevRitesh08
**Date:** 2026-03-04
**Status:** Strategic Blueprint v2.0 — Cyberpunk Rebrand

---

## Table of Contents

1. [Reverse Engineering Git-City (What They Built)](#step-1--reverse-engineering-git-city)
2. [DevCity Current State](#step-2--devcity-current-state)
3. [The Cyberpunk Vision — Why We Are NOT a Replica](#step-3--the-cyberpunk-vision)
4. [Advanced Features](#step-4--advanced-features)
5. [Cyberpunk UI/UX Design System](#step-5--cyberpunk-uiux-design-system)
6. [Technical Architecture](#step-6--technical-architecture)
7. [Monetization Strategy](#step-7--monetization-strategy)
8. [Competitive Advantage](#step-8--competitive-advantage)
9. [Development Roadmap](#step-9--development-roadmap)
10. [Summary](#step-10--summary)

---

# Step 1 — Reverse Engineering Git-City

> Understanding the terrain before we build something entirely different on it.

## 1.1 What Git-City Built

Git-City (`thegitcity.com`) is a 3D **retro pixel-art** city where each GitHub developer = one building. It hit ~1,800 GitHub stars in 12 days, proving massive demand for developer visualization.

### Their Core Mapping
| GitHub Metric | Git-City Visual |
|---|---|
| Contributions | Building height |
| Public repos | Building width |
| Stars | Lit window percentage |
| Primary language | District placement |
| Rank (composite score) | Distance from center ("Downtown") |

### Their Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| 3D Engine | Three.js + React Three Fiber + drei |
| Database | Supabase (raw SQL + RPC calls) |
| Auth | Supabase GitHub OAuth |
| Payments | Stripe + NowPayments (crypto) + AbacatePay (BRL) |
| Styling | Tailwind CSS v4 + Silkscreen pixel font |
| Hosting | Vercel |

### Their Architecture Highlights
1. **Spiral grid layout** — Buildings placed in outward spiral from city center, top 50 devs in "Downtown"
2. **Single SQL RPC** (`get_city_snapshot()`) — Fetches entire city data in one database call
3. **Window texture atlas** — 2048×2048 canvas texture with pre-rendered window light patterns
4. **Instanced mesh rendering** — One GPU draw call for all buildings
5. **Spatial hash grid** (200px cells) for frustum culling
6. **District system** — Language-based zones (frontend, backend, data_ai, mobile, devops, gamedev, etc.)

### Their Gamification
- **Kudos** — 5/day, with streak tracking
- **Raids** — PvP attack/defense based on weekly contributions + streak + kudos. XP titles: Pickpocket → Burglar → Heist Master → Kingpin
- **Achievements** — Multi-tier (Bronze/Silver/Gold/Diamond) across commits, repos, stars, social, kudos, gifts, streak, raid, purchases, dailies
- **Daily Streak Check-ins** — With freeze consumables and milestone rewards
- **Shop** — Cosmetic items (crowns, auras, rooftop effects, custom colors, billboards) at $0.75–$2.99

### Their Revenue
- Cosmetic shop (Stripe)
- Self-serve sky ads ($9–$99/week): planes, blimps, billboards, rooftop signs, LED wraps
- Support donations (Stripe + ETH)
- Planned virtual currency ("Pixels")

## 1.2 Git-City's Weaknesses (Our Opportunities)

### Visual
- **Retro pixel art** — Charming but limiting. Looks like a toy, not a serious tool.
- **Static flat lighting** — No dynamic time-of-day, no volumetric fog, no rain, no atmosphere.
- **Uniform buildings** — All buildings are box + windows. No architectural variety.
- **No environmental storytelling** — The city feels lifeless beyond buildings.

### Product
- **One building per developer** — No repository-level detail.
- **Website-only** — No embeddable widgets, no API, no badges.
- **No organization/team cities** — Missing the B2B opportunity entirely.
- **No timeline** — Can't see how a developer evolved over time.
- **No real-time commit visualization** — Data is static snapshot.
- **Monolithic codebase** — Hard to extend or distribute as packages.

### Technical
- **No LOD system** in production (noted in CONTRIBUTING.md but implementation is basic).
- **All client-rendered** — Heavy load, no SSR for 3D previews.
- **Single database with raw SQL** — No ORM, no type safety, brittle migrations.

---

# Step 2 — DevCity Current State

## 2.1 Repository Structure

```
DevRitesh08/DevCity/
├── STRATEGY.md              # 30KB strategy document
└── devcity/                 # Turborepo monorepo root
    ├── apps/
    │   └── web/             # Next.js 15 App Router
    │       ├── prisma/      # Prisma ORM ✅ (vs Git-City's raw SQL)
    │       ├── src/         # Application source
    │       └── dev.db       # SQLite development DB
    ├── packages/
    │   ├── types/           # @devcity/types — shared interfaces
    │   ├── card/            # @devcity/card — embeddable React component
    │   └── widget/          # @devcity/widget — vanilla JS embed
    ├── supabase/            # Database migrations
    ├── project_overview.md  # 48KB project overview
    ├── project_progress.md  # 20KB progress tracker
    ├── turbo.json           # Turborepo config
    └── pnpm-workspace.yaml  # pnpm workspaces
```

## 2.2 What We Have Right
- **Turborepo monorepo** — Massive advantage over Git-City's monolith
- **Prisma ORM** — Type-safe DB access vs raw SQL strings
- **Package architecture planned** — `@devcity/card`, `@devcity/widget`, `@devcity/types`
- **Extensive strategic planning** — 100KB+ of documentation

## 2.3 What We Need to Build
- 3D rendering engine (Cyberpunk-themed)
- GitHub data pipeline
- Auth system
- City layout algorithm
- Gamification engine
- Payment integration
- Deployment infrastructure

## 2.4 Immediate Fixes
- [ ] Remove `dev.db` and `tsconfig.tsbuildinfo` from git tracking (add to `.gitignore`)
- [ ] Add root-level README.md for the GitHub repo
- [ ] Add GitHub Actions CI/CD workflow
- [ ] Consider PostgreSQL for local dev (match production Supabase)

---

# Step 3 — The Cyberpunk Vision

## 🚫 What We Are NOT

We are **NOT** building a Git-City clone. We are not doing pixel art. We are not doing retro.

**Git-City = Retro pixel-art village. Cute. Toy-like. Nostalgic.**
**DevCity = Cyberpunk neon megacity. Dramatic. Cinematic. Futuristic.**

The difference is not cosmetic — it changes **everything**: the visual language, the emotional hook, the target audience, and the monetization potential.

## ⚡ The Cyberpunk Identity

### Art Direction: Blade Runner meets GitHub

Imagine a rain-soaked neon metropolis at perpetual twilight. Holographic billboards project developer stats into the sky. Data streams flow through glass fiber highways connecting towers. Every building pulses with the heartbeat of code being written right now.

This is DevCity.

### Core Visual Pillars

| Pillar | Description | Implementation |
|--------|-------------|----------------|
| **Neon Glow** | Everything emits colored light. Buildings have neon trim outlines. Signs glow. Streets reflect. | Bloom post-processing, emissive materials, HDR rendering |
| **Wet Surfaces** | Perpetual light rain creates reflective puddles on every surface, doubling all neon reflections | Planar reflections, PBR materials with high metalness + roughness maps |
| **Volumetric Fog** | Purple/blue haze between buildings creates depth and mystery | Volumetric fog shader, layered transparent planes |
| **Holographic UI** | Floating data panels, AR-style stat overlays, glitching text | Custom shader materials, CSS glassmorphism for 2D UI |
| **Verticality** | Multi-level city with elevated highways, floating platforms, stacked infrastructure | Multi-layer ground plane, elevated road meshes |
| **Data Streams** | Visible data flowing through the city like digital rivers | Particle systems following spline paths, animated shader lines |

### Color Palette

```
PRIMARY NEONS:
  Cyan        #00FFFF  — Primary accent, active elements, contribution highlights
  Magenta     #FF00FF  — Secondary accent, social features, kudos
  Electric Blue #0066FF — Background glow, fog tint, water
  Hot Pink    #FF1493  — Alerts, raids, battles
  Neon Green  #39FF14  — Success, achievements, positive signals
  Amber       #FFB000  — Warnings, streaks, fire effects

DARK BASES:
  Void Black  #0A0A0F  — Deep background
  Dark Navy   #0D1117  — Building faces (matches GitHub dark theme)
  Carbon      #161B22  — Elevated surfaces
  Steel Gray  #21262D  — Secondary surfaces

SURFACE ACCENTS:
  Chrome      #C9D1D9  — Text, metallic surfaces
  Holo-White  #F0F6FC  — Bright text, spotlight beams
  Glass Tint  rgba(0, 255, 255, 0.08) — Transparent panels
```

### Typography
- **Primary:** `JetBrains Mono` — Monospaced, technical, modern (free + open source)
- **Display:** `Orbitron` or `Rajdhani` — Sci-fi headers
- **Fallback:** `system-ui, monospace`

**NOT pixel fonts. NOT retro.** Clean, technical, futuristic.

## 3.1 The Cyberpunk City Metaphor

### Reimagined Mapping (vs Git-City)

| GitHub Concept | Git-City (Pixel Art) | DevCity (Cyberpunk) |
|---|---|---|
| **Developer** | Pixel box building | **Neon-lit skyscraper** with unique silhouette |
| **Contributions** | Building height | **Tower height** + glowing floor count |
| **Repos** | Building width | **Number of antenna arrays / satellite dishes** on roof |
| **Stars** | Lit window % | **Neon sign brightness** + holographic star count floating above building |
| **Activity (recent)** | Window pattern | **Rain of data particles** falling around active buildings |
| **Streak** | Generic glow | **Pulsing neon heartbeat** ring at building base |
| **Language** | District zone | **Architectural style** (see below) |
| **Rank** | Center placement | **Tower height in skyline** + spotlight beam from top |
| **Inactive (30+ days)** | (not visualized) | **Building goes dark**, windows flicker out, neon signs die, digital "rust" grows |
| **PRs/Issues** | (not visualized) | **Holographic construction scaffolding** + floating issue counters |
| **CI/CD status** | (not visualized) | **Rooftop signal light**: green beam = passing, red pulse = failing |
| **Forks** | (not visualized) | **Smaller satellite towers** orbiting parent building |
| **Organizations** | (not visualized) | **Corporate mega-structures** — campuses with connecting skyways |

### District Architecture Styles

Each language district has a **distinct cyberpunk architectural style**, not just a color:

| District | Languages | Cyberpunk Architecture | Palette |
|----------|-----------|----------------------|---------|
| **Neon Alley** (Frontend) | TypeScript, JavaScript, CSS, Vue, Svelte | Glass towers with LED façades, animated holographic signs, transparent walls | Cyan + White |
| **The Forge** (Backend) | Java, Go, Rust, C#, C, C++ | Industrial megastructures, smoke stacks with data steam, heavy steel girders, exposed pipes | Orange + Amber |
| **Neural District** (Data/AI) | Python, Jupyter, R, Julia | Domed research labs, floating data orbs, neural network wire sculptures, bioluminescent surfaces | Purple + Violet |
| **Sky Deck** (Mobile) | Swift, Kotlin, Dart, Objective-C | Sleek curved towers, glass walkways, wireless signal wave animations, minimal clean lines | Green + Teal |
| **Grid Zero** (DevOps) | Shell, Dockerfile, HCL, Nix | Server rack buildings, blinking LED arrays, cooling fan vents, cable-heavy exteriors | Blue + Gray |
| **Pixel Heights** (GameDev) | GDScript, Lua, Unity C# | Colorful voxel-influenced structures, floating power-up cubes, portal-like gateways | Multi-color neon |
| **The Vault** (Security) | (Security-focused devs) | Fortress-style bunkers, firewall barriers (literal glowing walls), scanner beams | Red + Dark |
| **Downtown Core** | Top 50 devs (any language) | Ultra-tall chrome spires, holographic crown effects, searchlight beams, flying drone traffic | Gold + White |

## 3.2 Environment Design

### The City Ground Plane

```
┌──────────────────────────────────────────────────────────────┐
│                    DEVCITY — OVERHEAD VIEW                     │
│                                                                │
│  ╔══════════╗          ┌──────────┐          ╔══════════╗     │
│  ║  NEURAL  ║          │DOWNTOWN  │          ║  NEON    ║     │
│  ║ DISTRICT ║          │  CORE    │          ║  ALLEY   ║     │
│  ║ (AI/ML)  ║          │ (TOP 50) │          ║(FRONTEND)║     │
│  ╚══════════╝          │  🏙️⚡🏙️  │          ╚══════════╝     │
│        ╲               └────┬─────┘               ╱          │
│         ╲    ┌──────────────┼──────────────┐    ╱            │
│          ╲   │ ═══ ELEVATED HIGHWAY ═══════│  ╱              │
│           ╲  └──────────────┼──────────────┘╱                │
│  ╔═══════╗ ╲               │              ╱  ╔═══════╗      │
│  ║ GRID  ║  ╲  ~~~~~~~~~~~~│~~~~~~~~~~~~ ╱   ║  THE  ║      │
│  ║ ZERO  ║   ╲ ~~ DIGITAL RIVER (DATA) ~╱    ║ FORGE ║      │
│  ║(DEVOP)║    ╲~~~~~~~~~~~~│~~~~~~~~~~~╱      ║(BACK) ║      │
│  ╚═══════╝     ╲          │          ╱        ╚═══════╝      │
│                  ╲  ╔═════╧═════╗  ╱                         │
│  ╔══════════╗     ╲ ║ SKY DECK  ║╱     ╔══════════╗         │
│  ║  PIXEL   ║      ╲║ (MOBILE)  ║      ║ THE VAULT║         │
│  ║ HEIGHTS  ║       ╚═══════════╝      ║(SECURITY)║         │
│  ║(GAMEDEV) ║                           ╚══════════╝         │
│  ╚══════════╝                                                 │
│                                                                │
│  Legend:                                                       │
│  ═══ = Elevated highways (data streams with traffic)           │
│  ~~~ = Digital river (flowing data particles)                  │
│  ⚡  = Energy nodes at district intersections                  │
└──────────────────────────────────────────────────────────────┘
```

### Sky & Atmosphere

| Element | Design |
|---------|--------|
| **Sky** | Perpetual twilight — deep indigo to purple gradient, never fully dark or bright |
| **Clouds** | Low volumetric fog banks with purple/magenta undertone, slowly drifting |
| **Rain** | Light cyberpunk rain — thin lines catching neon reflections, controllable intensity |
| **Stars** | Barely visible through haze — a few bright points representing actual GitHub stars |
| **Moon** | Oversized, slightly glitched holographic moon with DevCity logo watermark |
| **Skyline** | Distant silhouette towers beyond the playable city for depth |
| **Flying vehicles** | Small drones / hovercars moving along elevated highway paths |
| **Digital aurora** | Subtle animated aurora borealis effect in electric blue/magenta |

### The Digital River

Unlike Git-City's simple river:
- **Flowing data particles** — Cyan/white particles flowing like water but clearly digital
- **Holographic fish** — Easter egg: tiny holographic creatures swimming
- **Bridges** — Neon-lit suspension bridges with glowing cables
- **Under-bridge glow** — Light reflecting upward from the data stream
- **Waterfall nodes** — Where the river drops levels = data processing visualization

### Street Level

| Element | Cyberpunk Design |
|---------|-----------------|
| **Roads** | Dark asphalt with embedded LED lane markings (cyan glow lines) |
| **Sidewalks** | Metallic grating with neon accent strips along edges |
| **Street lamps** | Tall posts with holographic light cones (visible light volume) |
| **Cars** | Hovercars with light trails moving along roads |
| **Trees** | Bioluminescent cyber-trees with glowing leaves (neon green/teal) |
| **Benches** | Chrome + neon accent strips |
| **Fountains** | Holographic water — light particles instead of liquid |
| **Signs** | Floating holographic district name signs at zone entrances |
| **Puddles** | Reflective pools on street surface catching all neon lights |
| **Cables** | Overhead power/data cables between buildings — subtle web-like canopy |

## 3.3 The Emotional Experience

### Git-City Feeling
> "Oh that's cute, look at the little pixel buildings. Neat."

### DevCity Feeling
> "Holy shit. This is the most beautiful thing I've seen built with code. I need to share this RIGHT NOW."

The cyberpunk aesthetic creates:
1. **Awe** — The visual fidelity gap between DevCity and anything else in the developer tool space is massive
2. **Immersion** — Rain, fog, neon reflections create a world you want to explore
3. **Status** — Your building in this city looks premium, not toy-like. Worth sharing on LinkedIn, not just Twitter.
4. **Aspiration** — A dark, dim building in this neon city feels like motivation to code more

---

# Step 4 — Advanced Features

## 4.1 Real-Time Commit Pulse

When a claimed developer pushes code, their building **visually reacts**:
- Windows flash bright white in a ripple pattern
- A **data beam** shoots from the building roof into the sky briefly
- Nearby buildings get a subtle ambient light boost (community activity)
- The activity feed shows: `⚡ @DevRitesh08's tower surged — 3 commits pushed`

Implementation: GitHub Webhooks → Supabase Realtime broadcast → Client shader animation

## 4.2 Building Interiors (Click to Enter)

Click any building → camera zooms through the front door → interior reveals:

```
┌─────────────────────────────────────────┐
│  @DevRitesh08's Tower — Floor 14        │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │ DevCity  │  │ Portfolio│  │ API    │  │
│  │ ⭐ 234  │  │ ⭐ 12   │  │ ⭐ 5   │  │
│  │ █████   │  │ ██      │  │ █      │  │
│  └─────────┘  └─────────┘  └────────┘  │
│                                         │
│  📊 Contribution Heatmap                │
│  ▓▓░▓▓▓░▓▓▓▓▓▓░░▓▓▓▓▓░▓▓░▓▓▓▓▓▓▓     │
│                                         │
│  🏆 Achievements: 12/40 unlocked       │
│  💻 Languages: TS 45% | Python 30%     │
│  🔥 Current streak: 14 days            │
│  📈 Rank: #847 (↑23 this week)        │
└─────────────────────────────────────────┘
```

Interior aesthetic: Holographic data panels floating in a dark room. Each repo = a glowing terminal screen on the wall.

## 4.3 Developer Career Timeline

A **time-lapse cinematic** showing your city growing over years:
- Camera slowly orbits while buildings rise from the ground
- Year markers appear as holographic timestamps: `2019`, `2020`, `2021`...
- Major events annotated: "First 100-star repo" → tower gets a neon crown
- Music builds as the city grows
- Exportable as MP4 video for social sharing

This is the **"Spotify Wrapped for developers"** moment. Nobody else has this.

## 4.4 Organization Mega-Structures

GitHub organizations get their own **cyberpunk campus**:
- Members' towers clustered in a connected campus
- Skyways (elevated walkways) between team buildings
- Central org HQ building with the org logo as a holographic projection
- Team activity visualized as data streams flowing between towers
- Org-level leaderboard and achievements

**This is the B2B play.** Engineering managers pay for this.

## 4.5 Hacker Battles (Reimagined Raids)

Git-City has "raids." We have **Hacker Battles** — cyberpunk-themed PvP:

- **Attack animation**: Your avatar deploys a cyber-drone that flies to the target building
- **Hack sequence**: Visual "hacking" effect — glitch artifacts spread across target building
- **Defense**: Target building deploys a firewall shield (glowing hexagonal barrier)
- **Outcome**: Winner's building gets a temporary neon trophy. Loser gets graffiti tag.
- **Titles**: `Script Kiddie → Netrunner → Ghost → Zero Day → Architect`

## 4.6 Embeddable Components (Our Unique Moat)

### `@devcity/card` — React Component
```tsx
import { DevCityCard } from '@devcity/card';

// Drop into any React portfolio
<DevCityCard
  username="DevRitesh08"
  theme="cyberpunk-dark"
  animated={true}
  showStats={true}
/>
```
Renders a mini 3D building with stats — works in any React app, README, portfolio.

### `@devcity/widget` — Vanilla JS Embed
```html
<!-- Works anywhere HTML works -->
<script src="https://devcity.dev/widget.js"></script>
<devcity-card username="DevRitesh08" theme="neon"></devcity-card>
```

### GitHub README Badge
```markdown
[![DevCity](https://devcity.dev/badge/DevRitesh08.svg)](https://devcity.dev/DevRitesh08)
```
Dynamic SVG showing building silhouette + key stats. Updates daily.

**Every portfolio with a DevCity embed = permanent free advertising.**

## 4.7 AI-Powered Insights

Cyberpunk-themed AI companion (think: "ORACLE" — your city's AI):

- `"ORACLE: Your Neural District is expanding. Python activity up 47% this month."`
- `"ORACLE: Developer @friend has a tower twice your height. They push 3x more frequently on weekends."`
- `"ORACLE: Based on your trajectory, you'll reach Diamond rank in approximately 4 months."`
- `"ORACLE: Recommended quest: Contribute to an open-source Rust project to unlock The Forge district badge."`

Displayed as floating holographic messages in the city — fits the cyberpunk aesthetic perfectly.

## 4.8 Cyberpunk Collectibles (Shop Reimagined)

Instead of Git-City's generic "crowns and auras," our shop items are **cyberpunk-themed**:

| Category | Items | Price Range |
|----------|-------|-------------|
| **Neon Wraps** | Building neon outline colors (cyan, magenta, gold, RGB animated) | $0.99 |
| **Holograms** | Floating holographic logos/symbols above building | $1.49 |
| **Rooftop Tech** | Satellite dishes, antenna arrays, drone pads, server stacks | $0.99 |
| **Weather Control** | Personal rain effect, lightning strikes, data aurora | $1.99 |
| **Vehicles** | Parked hovercar variants outside building | $0.49 |
| **Street Art** | Neon graffiti on building walls (custom text) | $1.99 |
| **Light Show** | Animated light patterns on building façade | $2.49 |
| **Sound FX** | Building emits ambient sound when hovered (synth hum, data crackle) | $0.99 |
| **Shield Skin** | Custom firewall visual for hacker battle defense | $1.49 |
| **Drone Skin** | Custom attack drone visual for hacker battles | $1.49 |

---

# Step 5 — Cyberpunk UI/UX Design System

## 5.1 Design Language: "Neon Terminal"

Every 2D UI element follows the **Neon Terminal** design system:

### Component Style
```
┌─────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────┐│
│ │  ▸ DEVELOPER PROFILE                    [×]  ││
│ │───────────────────────────────────────────────││
│ │                                               ││
│ │  ◉ @DevRitesh08         Rank #847  ↑23       ││
│ │  ─────────────────────────────────            ││
│ │  Contributions  ████████████░░  2,471         ││
│ │  Repositories   ██████░░░░░░░░  34            ││
│ │  Stars          ████░░░░░░░░░░  189           ││
│ │  Streak         ████████████░░  14 days 🔥    ││
│ │                                               ││
│ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        ││
│ │  │ VISIT│ │ KUDOS│ │ HACK │ │ SHARE│        ││
│ │  └──────┘ └──────┘ └──────┘ └──────┘        ││
│ └───────────────────────────────────────────────┘│
│  ░░░░░░░░░░░░░░░░░░░░░░ scanline ░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────┘

Design notes:
- Borders: 1px solid rgba(0, 255, 255, 0.3)
- Background: rgba(10, 10, 15, 0.85) with backdrop-blur
- Text: JetBrains Mono, #C9D1D9
- Accent: #00FFFF (cyan) for primary, #FF00FF (magenta) for secondary
- Progress bars: Gradient from dark to neon
- Scanline overlay: Subtle animated horizontal line (2px, 10% opacity)
- Corner accents: Small "L" shaped neon accents at panel corners
```

### CSS Variables
```css
:root {
  --dc-bg-void: #0A0A0F;
  --dc-bg-surface: #0D1117;
  --dc-bg-elevated: #161B22;
  --dc-bg-panel: rgba(13, 17, 23, 0.85);

  --dc-neon-cyan: #00FFFF;
  --dc-neon-magenta: #FF00FF;
  --dc-neon-green: #39FF14;
  --dc-neon-amber: #FFB000;
  --dc-neon-pink: #FF1493;
  --dc-neon-blue: #0066FF;

  --dc-text-primary: #F0F6FC;
  --dc-text-secondary: #C9D1D9;
  --dc-text-muted: #8B949E;
  --dc-text-dim: #484F58;

  --dc-border: rgba(0, 255, 255, 0.15);
  --dc-border-active: rgba(0, 255, 255, 0.5);
  --dc-glow: 0 0 10px rgba(0, 255, 255, 0.3);

  --dc-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --dc-font-display: 'Orbitron', 'Rajdhani', sans-serif;
}
```

## 5.2 Landing Page

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  [Cinematic camera sweeps over neon city at night] │
│  [Rain particles catch neon reflections]           │
│  [Holographic signs flicker to life]               │
│                                                    │
│           ⚡ D E V C I T Y ⚡                     │
│       Your code powers a city.                     │
│                                                    │
│   ┌──────────────────────────────────────┐        │
│   │  Enter your GitHub username...    🔍  ��        │
│   └──────────────────────────────────────┘        │
│                                                    │
│     [Camera pauses on a massive glowing tower]     │
│     "This tower has 12,000 contributions"          │
│                                                    │
│   ┌────────────┐  ┌────────────┐                  │
│   │ EXPLORE ⚡  │  │ SIGN IN 🔑 │                  │
│   └────────────┘  └────────────┘                  │
│                                                    │
│   9,847 developers  │  142 online now              │
└──────────────────────────────────────────────────┘
```

## 5.3 Onboarding Flow (Cyberpunk-Themed)

```
Step 1: "INITIALIZING SCAN..."
  → GitHub username entered
  → Loading animation: holographic scan lines sweep across screen
  → Text appears letter by letter: "SUBJECT LOCATED..."

Step 2: "BUILDING YOUR TOWER..."
  → Camera zooms to empty lot in the city
  → Building rises from the ground with construction effects
  → Neon signs activate, windows light up one by one
  → Stats appear as floating holographic panels:
    "HEIGHT: 14 FLOORS (2,471 contributions)"
    "WIDTH: MODERATE (34 repositories)"
    "POWER: 189 STARS DETECTED"

Step 3: "DISTRICT ASSIGNMENT..."
  → "PRIMARY LANGUAGE: TypeScript"
  → "DISTRICT: NEON ALLEY (Frontend)"
  → Camera pans to show the district neighborhood
  → "YOUR NEIGHBORS: @kentcdodds, @sindresorhus, @shadcn"

Step 4: "CLAIM YOUR TOWER"
  → "Sign in with GitHub to take ownership"
  → GitHub OAuth flow
  → Building pulses with new color: "TOWER CLAIMED. WELCOME HOME."

Step 5: "MISSION BRIEFING"
  → "ORACLE: I've prepared your first missions."
  → 3 starter quests appear
  → "Explore the city. Make allies. Rise in the ranks."
```

## 5.4 Camera System

| Mode | Controls | Feel |
|------|----------|------|
| **Orbit** (default) | Mouse drag + scroll | Smooth cinematic overview |
| **Fly** | WASD + mouse look | Drone-like exploration |
| **Street** | WASD + first person | Walking through neon streets |
| **Cinematic** | Auto-pilot | Guided tour along spline path |
| **Focus** | Click building | Smooth zoom to target with depth-of-field |

### Cinematic Intro Sequence
1. Camera starts above the clouds
2. Descends through fog layer → city lights appear below
3. Sweeps along the elevated highway
4. Passes through Downtown Core (tall towers, dramatic lighting)
5. Settles at a default orbit position overlooking the whole city
6. Total duration: 8 seconds (skippable)

## 5.5 Post-Processing Pipeline

```
Scene Render
    │
    ├─▸ SSAO (Screen Space Ambient Occlusion)
    │     └─ Depth between buildings, under elevated highways
    │
    ├─▸ Bloom (UnrealBloomPass)
    │     └─ Threshold: 0.6, Strength: 1.5, Radius: 0.4
    │     └─ Makes all neon/emissive materials glow
    │
    ├─▸ Chromatic Aberration (subtle)
    │     └─ Offset: 0.001 — slight color fringing at edges
    │
    ├─▸ Vignette
    │     └─ Darkness: 0.4 — darkened edges for cinematic feel
    │
    ├─▸ Film Grain (very subtle)
    │     └─ Intensity: 0.03 — adds texture to flat surfaces
    │
    ├─▸ Scanlines (optional, togglable)
    │     └─ Every 3rd pixel row at 3% opacity
    │
    └─▸ Color Grading
          └─ Slight teal/orange push for cyberpunk color science
```

---

# Step 6 — Technical Architecture

## 6.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│                                                           │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Next.js   │  │ React Three  │  │    Zustand       │  │
│  │  App Router│  │ Fiber + drei │  │    (3D State)    │  │
│  └─────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│        │                │                    │            │
│  ┌─────┴────────────────┴────────────────────┴─────────┐  │
│  │              Cyberpunk Render Pipeline                │  │
│  │  • Instanced Buildings (InstancedMesh)                │  │
│  │  • Custom Neon Shader (emissive + bloom)              │  │
│  │  • Rain Particle System (GPU particles)               │  │
│  │  • Volumetric Fog (layered planes)                    │  │
│  │  • Reflective Ground (MeshReflectorMaterial)          │  │
│  │  • LOD System (3 levels + billboard imposters)        │  │
│  │  • Post-Processing (Bloom, SSAO, ChromAb, Vignette)  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                    BACKEND (Vercel + Supabase)              │
│                                                             │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Next.js   │  │  Supabase    │  │   GitHub API       │  │
│  │  API Routes│  │  PostgreSQL  │  │   Data Pipeline    │  │
│  │            │  │  + Auth      │  │   + Webhooks       │  │
│  │            │  │  + Realtime  │  │                    │  │
│  └────────────┘  └──────────────┘  └────────────────────┘  │
│                                                             │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Stripe    │  │  Upstash     │  │   Prisma ORM       │  │
│  │  Payments  │  │  Redis Cache │  │   (Type-safe DB)   │  │
│  └────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 6.2 Rendering Strategy: Cyberpunk-Specific

### Building Shader Architecture

Git-City uses a simple canvas texture atlas for windows. We use **custom GLSL shaders**:

```glsl
// Conceptual: Cyberpunk Building Shader
// - Emissive neon trim on building edges
// - Animated window flicker (not just on/off — slow fade + occasional glitch)
// - Rain streak effect on building surface
// - Reflection probe sampling for wet surface look

uniform float uTime;
uniform float uLitPercentage;    // From GitHub stars
uniform vec3  uNeonColor;        // District-specific accent
uniform float uActivityLevel;    // Recent commit frequency
uniform float uRainIntensity;

// Window glow: soft pulse, not binary on/off
float windowGlow = smoothstep(0.3, 0.7, noise(uv * 20.0 + uTime * 0.1));

// Neon edge trim: building silhouette outline
float edgeFactor = 1.0 - smoothstep(0.0, 0.02, abs(localPos.x - 0.5));

// Rain streaks on surface
float rainStreak = stripe(uv.y * 100.0 + uTime * 2.0, 0.02) * uRainIntensity;
```

### Performance Budget

| Element | Count | Technique | Draw Calls |
|---------|-------|-----------|-----------|
| Buildings | 1,000-10,000 | InstancedMesh × 3 LOD levels | 3 |
| Windows | Texture atlas | Custom shader on building material | 0 (same draw call) |
| Rain | 10,000 particles | GPU particle system (BufferGeometry) | 1 |
| Fog | 5-10 layers | Transparent planes | 5-10 |
| Road markings | Instanced | InstancedMesh | 1 |
| Street lamps | Instanced | InstancedMesh + point lights (limited) | 1 |
| Holograms | Billboard sprites | Instanced + sprite material | 1 |
| Data river | Particle flow | GPU particles on spline | 1 |
| **TOTAL** | | | **~15 draw calls** |

### LOD System

| Level | Distance | Detail |
|-------|----------|--------|
| **LOD 0** | < 200 units | Full geometry, all neon effects, window animation, rain interaction |
| **LOD 1** | 200-600 units | Simplified geometry, static neon glow, no window animation |
| **LOD 2** | 600-1200 units | Billboard imposter (2D sprite facing camera), colored rectangle |
| **LOD 3** | > 1200 units | Not rendered (culled) |

## 6.3 Prisma Schema (Cyberpunk-themed field naming)

```prisma
model Developer {
  id              String   @id @default(cuid())
  githubId        Int      @unique
  githubLogin     String   @unique
  name            String?
  avatarUrl       String?
  bio             String?

  // GitHub Stats → City Metrics
  contributions   Int      @default(0)  // → tower height
  publicRepos     Int      @default(0)  // → antenna/dish count
  totalStars      Int      @default(0)  // → neon brightness
  primaryLanguage String?               // → district assignment

  rank            Int?
  claimed         Boolean  @default(false)
  claimedAt       DateTime?
  district        String?
  districtChosen  Boolean  @default(false)

  // Cyberpunk Gamification
  xp              Int      @default(0)
  level           Int      @default(1)
  title           String?  // "Script Kiddie", "Netrunner", etc.
  appStreak       Int      @default(0)
  raidXp          Int      @default(0)
  kudosCount      Int      @default(0)
  kudosStreak     Int      @default(0)

  // Customization
  neonColor       String?  // Custom neon accent
  loadout         Json?    // Equipped items

  // Time tracking
  fetchedAt       DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  buildings       Building[]
  achievements    Achievement[]
  purchases       Purchase[]
  kudosGiven      Kudos[]     @relation("giver")
  kudosReceived   Kudos[]     @relation("receiver")
  raidsAttacked   HackerBattle[] @relation("attacker")
  raidsDefended   HackerBattle[] @relation("defender")
}

model Building {
  id          String   @id @default(cuid())
  developerId String
  developer   Developer @relation(fields: [developerId], references: [id])

  position    Json     // [x, y, z]
  width       Float
  depth       Float
  height      Float
  floors      Int
  district    String
  archStyle   String   @default("standard") // "glass", "industrial", "lab", etc.

  // Cyberpunk visuals
  neonColor   String?  // Override district default
  litPercent  Float    @default(0.5)
  activeLevel Float    @default(0.0) // 0-1, recent activity intensity

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([developerId])
}

model HackerBattle {
  id          String   @id @default(cuid())
  attackerId  String
  defenderId  String
  attacker    Developer @relation("attacker", fields: [attackerId], references: [id])
  defender    Developer @relation("defender", fields: [defenderId], references: [id])

  attackScore Int
  defenseScore Int
  success     Boolean
  xpGained    Int

  vehicleUsed String   @default("drone")
  tagStyle    String?

  createdAt   DateTime @default(now())
}
```

## 6.4 Data Pipeline

```
1. SEED (initial)
   └─ Fetch top 10K GitHub devs via REST API
   └─ Compute composite rank (contributions×0.4 + stars×0.3 + repos×0.2 + activity×0.1)
   └─ Store in Supabase via Prisma

2. REFRESH (cron)
   └─ Claimed users: refresh every 1 hour
   └─ Top 1000 unclaimed: refresh every 6 hours
   └─ Others: refresh every 24 hours
   └─ Rate-limit aware: 5,000 API calls/hour budget

3. REAL-TIME (webhooks)
   └─ Claimed users install GitHub App
   └─ Push events → building window flash + activity feed
   └─ New repo → construction animation

4. SNAPSHOT (RPC — inspired by Git-City's approach)
   └─ Single SQL function returns all city data
   └─ Client caches in sessionStorage (5 min TTL)
   └─ Incremental updates via Supabase Realtime
```

---

# Step 7 — Monetization Strategy

## 7.1 Revenue Streams

### B2C: Cyberpunk Cosmetic Shop
| Item Type | Examples | Price |
|-----------|---------|-------|
| Neon Wraps | Custom building outline color | $0.99 |
| Holograms | Floating symbol above tower | $1.49 |
| Rooftop Tech | Satellite dish, drone pad, antenna | $0.99 |
| Weather Effects | Personal rain, lightning, data aurora | $1.99 |
| Vehicle Skins | Hovercar parked at building | $0.49 |
| Neon Graffiti | Custom text on building wall | $1.99 |
| Light Shows | Animated façade pattern | $2.49 |
| Battle Skins | Custom drone + shield visuals | $1.49 |
| **Target ARPU** | **$1-3 from 5% of users** | |

### B2C: DevCity Pro Subscription ($4.99/month)
- Career timeline video export
- Advanced analytics dashboard
- Remove watermark on shares
- Exclusive seasonal neon wraps
- AI ORACLE insights
- Custom city themes (daytime, sunset, storm)
- Priority building render quality

### B2B: Organization Cities ($49-499/month)
| Tier | Price | Features |
|------|-------|----------|
| Starter | $49/mo | Org campus, 25 members, basic analytics |
| Team | $149/mo | 100 members, team skyways, PR metrics |
| Enterprise | $499/mo | Unlimited, SSO, API, custom branding, white-label |

### Platform: In-City Advertising
- **Holographic billboards** — Floating ad panels in the city sky ($19-99/week)
- **Building wraps** — Sponsored neon on building façades ($49/week)
- **District sponsorship** — "The Vercel Frontend District" ($999/month)
- **Drone banners** — Flying ad drones trailing holographic text ($29/week)

### Platform: API Access
- Free: 100 requests/day
- Developer: $9.99/mo (10K/day)
- Business: $99/mo (100K/day)

## 7.2 Projected Revenue

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Registered developers | 50K | 250K | 1M |
| Paying consumers (3%) | 1,500 | 7,500 | 30K |
| Consumer ARPU | $18/yr | $30/yr | $42/yr |
| B2B organizations | 10 | 100 | 500 |
| B2B ARPU | $2.4K/yr | $3.6K/yr | $4.8K/yr |
| **Total ARR** | **$71K** | **$685K** | **$3.7M** |

---

# Step 8 — Competitive Advantage

## 8.1 DevCity vs Git-City — The Real Differentiation

| Dimension | Git-City | DevCity |
|-----------|---------|---------|
| **Art Style** | Retro pixel art | **Cyberpunk neon megacity** |
| **Emotional Tone** | Cute, nostalgic, toy-like | **Dramatic, cinematic, premium** |
| **Building Detail** | Uniform boxes with windows | **Distinct architectural styles per district** |
| **Environment** | Flat ground + simple river | **Rain, fog, reflections, elevated highways, data streams** |
| **Lighting** | Static | **Dynamic bloom, volumetric, neon glow** |
| **Font/UI** | Pixel font (Silkscreen) | **JetBrains Mono + holographic panels** |
| **Architecture** | Monolithic Next.js | **Turborepo monorepo + packages** |
| **Database** | Raw Supabase SQL | **Prisma ORM (type-safe)** |
| **Distribution** | Website only | **Website + Widget + Card + Badge + API** |
| **Scope** | Developers only | **Developers + Organizations + Teams** |
| **Time** | Snapshot only | **Career timeline + real-time** |
| **AI** | None | **ORACLE AI insights** |
| **Sharing** | Screenshot | **Video + Embed + Badge + Card** |

## 8.2 Moats

1. **Visual moat** — The cyberpunk aesthetic creates a "wow" factor that's hard to replicate casually
2. **Widget distribution** — Every `@devcity/card` embed on a portfolio = permanent organic traffic
3. **B2B lock-in** — Organization cities have high switching costs
4. **Data moat** — Historical timeline data accumulates over time
5. **Community moat** — Developer identity investment (customizations, achievements, social connections)

---

# Step 9 — Development Roadmap

## Phase 1 — Cyberpunk Prototype (Weeks 1-3)

**Goal:** Prove the cyberpunk city 3D rendering works and looks stunning.

- [ ] Set up R3F + drei + postprocessing in `apps/web`
- [ ] Create `CityScene.tsx` with cyberpunk skybox (twilight gradient)
- [ ] Implement basic building instanced mesh with neon edge shader
- [ ] Add rain particle system (GPU particles)
- [ ] Add bloom post-processing + vignette + chromatic aberration
- [ ] Create reflective ground plane (wet streets)
- [ ] Generate buildings from hardcoded test data
- [ ] Implement building height/width from GitHub metrics
- [ ] Basic orbit camera controls
- [ ] Add volumetric fog (layered transparent planes)
- [ ] Create one district architectural style (Neon Alley / Frontend)
- [ ] Add street-level elements: LED road markings, cyber-trees, lamp posts

## Phase 2 — Data + Auth MVP (Weeks 4-7)

**Goal:** Connect real GitHub data and let users claim buildings.

- [ ] GitHub API helper: fetch developer stats
- [ ] Prisma schema + Supabase database setup
- [ ] Seed script: populate top developers
- [ ] Spiral grid city layout algorithm (adapted from Git-City research, not copied)
- [ ] District assignment system (language → district)
- [ ] GitHub OAuth via Supabase Auth
- [ ] Building claiming flow with cyberpunk onboarding animation
- [ ] Developer profile page (`/dev/[username]`)
- [ ] Search functionality
- [ ] Minimap (holographic style)
- [ ] Deploy to Vercel

## Phase 3 — Visual Polish + Districts (Weeks 8-12)

**Goal:** Make every district visually unique and the city feel alive.

- [ ] All 8 district architectural styles
- [ ] Elevated highway with hovercars
- [ ] Digital river with particle flow
- [ ] Street-level ambient life (pedestrians, drones)
- [ ] Building inactive decay (dark windows, visual degradation)
- [ ] LOD system (3 levels + billboard imposters)
- [ ] Cinematic intro camera sequence
- [ ] Day/night cycle (with default cyberpunk twilight)
- [ ] CI/CD rooftop signals (green/red beams)
- [ ] Performance optimization pass

## Phase 4 — Social + Gamification (Weeks 13-18)

**Goal:** Build the retention loop.

- [ ] Kudos system (cyberpunk "signal boost" animation)
- [ ] Hacker Battles (drone attack/firewall defense)
- [ ] Achievement system (Bronze → Silver → Gold → Diamond)
- [ ] Daily streak check-ins
- [ ] XP + Level system (Script Kiddie → Architect)
- [ ] Activity feed (holographic ticker)
- [ ] Leaderboard (city-wide rankings)
- [ ] Real-time commit pulse visualization
- [ ] ORACLE AI companion (basic insights)

## Phase 5 — Sharing + Embeds (Weeks 19-24)

**Goal:** Make DevCity spread virally.

- [ ] `@devcity/card` React component package
- [ ] `@devcity/widget` vanilla JS embed
- [ ] GitHub README badge (dynamic SVG)
- [ ] Screenshot export (high-res PNG)
- [ ] Career timeline video generator
- [ ] City comparison view
- [ ] OG image generation (cyberpunk-styled)
- [ ] Social sharing deeplinks

## Phase 6 — Monetization (Weeks 25-32)

**Goal:** First revenue.

- [ ] Cyberpunk cosmetic shop (Stripe)
- [ ] DevCity Pro subscription
- [ ] Holographic billboard ads system
- [ ] Organization cities (B2B)
- [ ] API access tiers

## Phase 7 — Platform (Weeks 33+)

**Goal:** Become the developer identity layer.

- [ ] Public API + documentation
- [ ] `@devcity/sdk` developer SDK
- [ ] Building interior view
- [ ] Multiplayer presence
- [ ] GitLab/Bitbucket support
- [ ] VS Code extension
- [ ] GitHub Action
- [ ] Plugin marketplace

---

# Step 10 — Summary

## The One-Sentence Pitch

**DevCity is a cyberpunk neon megacity where every developer's GitHub activity powers a living, breathing tower — explorable in 3D, shareable as embeds, and expandable with organization campuses.**

## Why Cyberpunk, Not Pixel Art

| Pixel Art (Git-City) | Cyberpunk (DevCity) |
|---|---|
| Appeals to nostalgia | Appeals to aspiration |
| Looks like a toy | Looks like a AAA game |
| "That's cute" | "That's insane, how do I get one?" |
| Screenshots for Twitter | Videos for LinkedIn + Twitter |
| Indie vibe | Premium/startup vibe |
| Limited visual depth | Infinite visual detail (fog, rain, reflections, glow) |
| One aesthetic | District-specific architectural styles |
| Static mood | Dynamic atmosphere (weather, time, activity) |

## Your Three Advantages Over Git-City

1. **🎨 Visual Identity** — Cyberpunk neon ≠ pixel art. Completely different product feel. No one will confuse us.
2. **📦 Distribution** — `@devcity/card` + `@devcity/widget` + badges = we live inside every developer's portfolio.
3. **🏢 B2B Play** — Organization cities unlock enterprise revenue Git-City can't touch.

## First Three Moves

1. **This week:** Get `CityScene.tsx` rendering neon buildings in rain with bloom. Just the visual. Make it stunning.
2. **Next week:** Connect GitHub API. Real data → real buildings. The "wow" moment.
3. **Week 3:** GitHub OAuth + claim + deploy to Vercel. You have a live product.

---

## File Structure Reference

```
devcity/
├── apps/
│   └── web/                          # Next.js 15 (App Router)
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx                    # Home — cyberpunk city view
│       │   │   ├── dev/[username]/page.tsx      # Developer profile
│       │   │   ├── org/[orgname]/page.tsx       # Organization campus
│       │   │   ├── shop/[username]/page.tsx     # Neon shop
│       │   │   ├── timeline/[username]/page.tsx # Career timeline
│       │   │   └── api/                         # API routes
│       │   ├── components/
│       │   │   ├── city/
│       │   │   │   ├── CityScene.tsx            # Main 3D scene
│       │   │   │   ├── CityCanvas.tsx           # Canvas + post-processing
│       │   │   │   ├── CyberpunkBuilding.tsx    # Building with neon shader
│       │   │   │   ├── InstancedTowers.tsx      # GPU-instanced buildings
│       │   │   │   ├── NeonRain.tsx             # Rain particle system
│       │   │   │   ├── VolumetricFog.tsx        # Layered fog
│       │   │   │   ├── DigitalRiver.tsx         # Data stream river
│       │   │   │   ├── ElevatedHighway.tsx      # Hovercars + highways
│       │   │   │   ├── CyberStreetElements.tsx  # Lamps, trees, signs
│       │   │   │   ├── HolographicUI.tsx        # Floating info panels
│       │   │   │   └── CyberpunkSkybox.tsx      # Twilight sky + aurora
│       │   │   └── ui/
│       │   │       ├── NeonPanel.tsx             # Glassmorphic container
│       │   │       ├── HoloButton.tsx            # Glowing button
│       │   │       ├── ScanlineOverlay.tsx       # Subtle scanline effect
│       │   │       └── OracleMessage.tsx         # AI insight display
│       │   ├── lib/
│       │   │   ├── github.ts                    # City layout + GitHub API
│       │   │   ├── cityLayout.ts                # Spiral grid + district logic
│       │   │   ├── shaders/                     # Custom GLSL shaders
│       │   │   │   ├── neonBuilding.glsl
│       │   │   │   ├── rainParticle.glsl
│       │   │   │   └── holoText.glsl
│       │   │   ├── supabase.ts
│       │   │   ├── achievements.ts
│       │   │   ├── hackerBattle.ts
│       │   │   └── cityCache.ts
│       │   └── styles/
│       │       ├── globals.css                  # Cyberpunk design tokens
│       │       └── neon-terminal.css            # UI component styles
│       └── prisma/
│           └── schema.prisma
├── packages/
│   ├── types/                # @devcity/types
│   ├── card/                 # @devcity/card (React embed)
│   ├── widget/               # @devcity/widget (vanilla JS embed)
│   └── sdk/                  # @devcity/sdk (API SDK)
├── supabase/
│   └── migrations/
├── turbo.json
└── pnpm-workspace.yaml
```

---

*"In the neon glow, every line of code is visible. Build something worth seeing."*
— DevCity