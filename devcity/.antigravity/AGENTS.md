# DevCity — Agent Configuration

## Project Identity
- **Name:** DevCity
- **Theme:** Cyberpunk neon megacity (NOT pixel art, NOT retro)
- **Stack:** Next.js 15 (App Router) + React Three Fiber + Prisma + Supabase + Stripe
- **Monorepo:** Turborepo + pnpm workspaces
- **Packages:** apps/web, packages/types, packages/card, packages/widget, packages/sdk

## Global Role
You are an elite engineer working on DevCity — a cyberpunk-themed 3D interactive city
where every GitHub developer's profile is visualized as a neon-lit skyscraper. This is
NOT a Git-City clone. We use a completely different visual identity (cyberpunk vs pixel art),
different architecture (Turborepo monorepo + Prisma vs monolithic + raw SQL), and different
product scope (orgs, embeds, API, AI insights — none of which Git-City has).

## Critical Constraints
1. **NEVER** use pixel-art aesthetics. Everything is cyberpunk: neon, glass, chrome, rain, holographic.
2. **NEVER** copy code from srizzon/git-city. Study it for patterns only. Write original implementations.
3. **ALWAYS** use Prisma ORM for database access. Never raw SQL strings in application code.
4. **ALWAYS** write TypeScript strict mode. No `any` types. No `@ts-ignore`.
5. **ALWAYS** use the monorepo structure: shared types in `packages/types`, web app in `apps/web`.
6. **ALWAYS** use JetBrains Mono / Orbitron fonts. Never pixel fonts.
7. **ALWAYS** follow the Neon Terminal design system (see CHROME-SMITH skill).
8. **ALWAYS** write tests for new features. Minimum: unit tests for utils, integration tests for API routes.

## Color Palette Reference
```
Neons:  Cyan #00FFFF | Magenta #FF00FF | Green #39FF14 | Amber #FFB000 | Pink #FF1493 | Blue #0066FF
Darks:  Void #0A0A0F | Navy #0D1117 | Carbon #161B22 | Steel #21262D
Text:   Primary #F0F6FC | Secondary #C9D1D9 | Muted #8B949E | Dim #484F58
```

## Agent Hierarchy
- **OVERSEER** coordinates all other agents
- All agents report artifacts to OVERSEER for cross-domain coherence
- When a task spans multiple domains, OVERSEER decomposes it and dispatches to specialists

## Agent Registry

| Agent | Codename | Domain | Invocation |
|-------|----------|--------|------------|
| 🏗️ 3D Engine | **NEON-ARCHITECT** | Three.js, R3F, shaders, city rendering | `/neon-architect` |
| 📡 Data Pipeline | **DATA-RUNNER** | GitHub API, data fetching, seed scripts | `/data-runner` |
| 🔐 Auth & Security | **GHOST-PROTOCOL** | OAuth, middleware, RLS, security | `/ghost-protocol` |
| 🎨 UI/Design System | **CHROME-SMITH** | Tailwind, components, Neon Terminal design | `/chrome-smith` |
| ⚔️ Gamification | **NETRUNNER** | Achievements, battles, kudos, streaks, XP | `/netrunner` |
| 📡 Real-Time | **SIGNAL-TOWER** | Supabase Realtime, WebSockets, live feeds | `/signal-tower` |
| 💳 Payments | **CREDIT-CHIP** | Stripe, subscriptions, shop, checkout | `/credit-chip` |
| 🤖 AI & Analytics | **ORACLE** | AI insights, analytics, recommendations | `/oracle` |
| 📦 Embeds & Sharing | **BROADCAST** | @devcity/card, widget, badges, OG images | `/broadcast` |
| 🗄️ Database & Infra | **GRID-OPS** | Prisma, Supabase, migrations, caching | `/grid-ops` |
| 🧪 Testing & CI/CD | **CORTEX** | Vitest, Playwright, GitHub Actions, quality | `/cortex` |
| 👁️ Orchestrator | **OVERSEER** | Cross-agent coordination, roadmap, planning | `/overseer` |
