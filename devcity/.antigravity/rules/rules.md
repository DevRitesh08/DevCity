# DevCity — Global Agent Rules

## Code Style
- **Language:** TypeScript 5.x strict mode
- **Framework:** Next.js 15 (App Router with `app/` directory)
- **3D Engine:** React Three Fiber + drei + @react-three/postprocessing
- **ORM:** Prisma (PostgreSQL via Supabase)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (for 3D scene state)
- **Package Manager:** pnpm (never npm or yarn)
- **Monorepo Tool:** Turborepo

## File Conventions
- Components: PascalCase (`CyberpunkBuilding.tsx`)
- Utilities/libs: camelCase (`cityLayout.ts`)
- API routes: `route.ts` inside `app/api/` directories
- Prisma schema: `apps/web/prisma/schema.prisma`
- Shared types: `packages/types/src/`
- Shaders: `apps/web/src/lib/shaders/` with `.glsl` extension
- Tests: colocated `__tests__/` folders or `.test.ts` suffix

## Forbidden Actions
- ❌ No changes to `turbo.json` or `pnpm-workspace.yaml` without OVERSEER approval
- ❌ No raw SQL in application code (use Prisma)
- ❌ No `any` type assertions
- ❌ No pixel-art fonts, sprites, or retro aesthetics
- ❌ No copying code from srizzon/git-city repository
- ❌ No `npm install` or `yarn add` (use `pnpm add`)
- ❌ No inline styles except for dynamic values (use Tailwind + CSS variables)
- ❌ No client-side secrets or API keys in source code

## Architecture Rules
- Server Components by default. `"use client"` only when needed (hooks, interactivity, 3D).
- API routes validate all input with Zod schemas.
- Database queries only through Prisma client (server-side only).
- Environment variables: `.env.local` for dev, Vercel env for prod.
- All 3D components lazy-loaded with `next/dynamic` and `ssr: false`.

## Git Conventions
- Branch naming: `feat/`, `fix/`, `refactor/`, `chore/`
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`)
- PRs require passing CI before merge

## Performance Budget
- City scene: < 20 draw calls total
- Initial JS bundle: < 300KB (excluding Three.js which is lazy-loaded)
- Time to interactive: < 3 seconds on 4G connection
- 60fps target on mid-range laptop (GTX 1060 equivalent)
