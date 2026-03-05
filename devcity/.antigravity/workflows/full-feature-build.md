---
description: "Full Feature Build — Generic workflow for building any new feature end-to-end. OVERSEER decomposes and dispatches to specialist agents."
---

# Workflow: Full Feature Build

> Generic workflow for building any new feature end-to-end.
> OVERSEER decomposes the feature and dispatches to specialist agents.

## Procedure

### 1. Requirements Analysis (OVERSEER)
- Define the feature scope and acceptance criteria
- Identify which agents are needed
- Determine dependency order
- Create task breakdown

### 2. Schema & Data (GRID-OPS → DATA-RUNNER)
- Add necessary database tables/columns via Prisma migration
- Create seed data if needed
- Set up caching keys

### 3. Backend Logic (Domain-specific agent)
- Create API routes with Zod input validation
- Implement business logic in `lib/` modules
- Add rate limiting and auth checks (GHOST-PROTOCOL review)

### 4. Frontend UI (CHROME-SMITH)
- Build UI components following Neon Terminal design system
- Wire up API calls with loading/error states
- Add toast notifications for success/error

### 5. 3D Integration (NEON-ARCHITECT, if applicable)
- Add visual effects to city scene
- Connect to real-time data feed
- Ensure performance budget is maintained

### 6. Real-Time Events (SIGNAL-TOWER, if applicable)
- Add event type to activity feed
- Broadcast via Supabase Realtime
- Update UI listeners

### 7. Testing (CORTEX)
- Unit tests for business logic
- Integration tests for API routes
- E2E test for critical user flow
- Performance regression check

### 8. Review & Merge (OVERSEER)
- Cross-agent artifact review
- Ensure consistent styling and architecture
- Merge to main branch
- Update CHANGELOG.md
