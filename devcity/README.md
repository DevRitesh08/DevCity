# DevCity

> The developer's living city. Your code builds the world.

## Monorepo Structure

```
devcity/
├── apps/
│   └── web/          # Next.js 15 App Router — main web application
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── card/         # @devcity/card — embeddable React component (future)
│   └── widget/       # @devcity/widget — vanilla JS embed (future)
├── supabase/         # Database migrations
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **3D Engine:** Three.js + React Three Fiber + drei
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Styling:** Tailwind CSS v4
- **Payments:** Stripe
- **Hosting:** Vercel
