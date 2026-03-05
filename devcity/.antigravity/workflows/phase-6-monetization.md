---
description: "Phase 6 — Monetization. First revenue with cosmetic shop, Pro subscription, org cities, and ads. Weeks 25-32."
---

# Phase 6 — Monetization

> **Duration:** Weeks 25-32
> **Goal:** First revenue.
> **Lead:** CREDIT-CHIP
> **Support:** CHROME-SMITH, GRID-OPS, NEON-ARCHITECT, CORTEX

## Mission Sequence

### Step 1: Stripe Integration (CREDIT-CHIP)
1. Set up Stripe account and API keys
2. Build Stripe client helper (`lib/stripe.ts`)
3. Implement webhook handler with signature verification
4. Idempotent processing for duplicate webhooks

### Step 2: Cosmetic Shop Database (GRID-OPS)
1. Create `Item` and `Purchase` models in Prisma
2. Seed initial shop items across all categories
3. Create purchase tracking queries

### Step 3: Shop UI (CHROME-SMITH)
1. Build shop page (`/shop/[username]`) with cyberpunk grid
2. Item cards with category tabs
3. Buy confirmation modal (HoloModal)
4. Gift flow: buy items for other developers
5. Purchase success toast notifications

### Step 4: Checkout Flow (CREDIT-CHIP)
1. Stripe Checkout Sessions for one-time purchases
2. Webhook fulfillment: grant item on `checkout.session.completed`
3. 3D preview of item on building (NEON-ARCHITECT)

### Step 5: DevCity Pro Subscription (CREDIT-CHIP)
1. Stripe subscription setup ($4.99/month)
2. Customer Portal for subscription management
3. Feature flags based on subscription status
4. Pro features: timeline video, analytics, ORACLE, themes, watermark removal

### Step 6: Organization Cities (CREDIT-CHIP + NEON-ARCHITECT)
1. B2B subscription tiers (Starter $49, Team $149, Enterprise $499)
2. Org campus layout with member buildings
3. Skyways between team member towers
4. Central org HQ with holographic logo
5. Team activity data streams

### Step 7: Holographic Ad System (CREDIT-CHIP + NEON-ARCHITECT)
1. Self-serve ad creation UI
2. Ad types: sky holograms, building wraps, drone banners
3. Stripe payment for ad placement
4. Impression + click tracking analytics

### Step 8: API Access Tiers (CREDIT-CHIP + GRID-OPS)
1. Free tier: 100 requests/day
2. Developer tier: $9.99/mo (10K/day)
3. Business tier: $99/mo (100K/day)
4. API key management + rate limiting

### Step 9: Testing (CORTEX)
1. Test checkout flow end-to-end
2. Test webhook processing
3. Test subscription lifecycle
4. Test API rate limiting

## Success Criteria
- [ ] Cosmetic shop functional with Stripe checkout
- [ ] DevCity Pro subscription active with all Pro features gated
- [ ] Organization cities rendering for B2B customers
- [ ] Holographic ads displaying in city with tracking
- [ ] First dollar of revenue earned 💰
