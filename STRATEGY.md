# DevCity 100x — Strategy Document
> A full orchestration analysis: market discovery → validation → product design → execution roadmap.  
> Based on a deep study of [Git City](https://github.com/srizzon/git-city) (thegitcity.com).  
> Date: March 4, 2026

---

## Table of Contents
1. [What Git City Is Today](#1-what-git-city-is-today)
2. [Ranked Market Opportunities](#2-ranked-market-opportunities)
3. [Stress Test & Strategic Critique](#3-stress-test--strategic-critique)
4. [Validated Product Concept — DevCity](#4-validated-product-concept--devcity)
5. [Execution Roadmap](#5-execution-roadmap)
6. [Tech Architecture](#6-tech-architecture)
7. [Business Model](#7-business-model)
8. [Risks & Verdict](#8-risks--verdict)

---

## 1. What Git City Is Today

### The Concept
Git City turns every GitHub username into a 3D pixel art building. Your contributions =
building height. Your repos = building width. Your stars = lit windows. The result is an
interactive city you can fly through and explore.

### Current Feature Set (as of March 2026)
| Category | Feature | Status |
|---|---|---|
| 3D Engine | Instanced GPU rendering, LOD system, bloom post-processing | ✅ Done |
| Navigation | Free-fly camera, cinematic intro flyover | ✅ Done |
| Identity | Dedicated `/dev/:username` profile pages | ✅ Done |
| Social | Kudos, gifts, referrals, live activity ticker | ✅ Done |
| Districts | 10 neighborhoods (Frontend, Backend, DevOps, etc.) | ✅ Done |
| Achievements | 20+ achievements across Bronze/Silver/Gold/Diamond | ✅ Done |
| Streaks | Daily check-in system with streak multipliers | ✅ Done |
| Shop | Building customization (crowns, auras, faces, roof effects) | ✅ Done |
| Compare | Side-by-side developer stat comparison | ✅ Done |
| Share Cards | Landscape + Stories format image export | ✅ Done |
| Ads | Self-service billboard ads (sky + building), Stripe checkout | ✅ Done |
| Battle/Raid | PvP building attack system | ✅ Done |
| Street Mode | Third-person WASD city walking | 🔨 Building |
| Dailies | Quick daily activities (Push, Deploy, Bug Hunt) | 📋 Planned |
| XP & Levels | Intern → Founder progression system | 📋 Planned |
| Pixels (PX) | Virtual currency earned through gameplay | 📋 Planned |
| Git Passport | Collect stamps by visiting buildings | 📋 Planned |

### Traction Snapshot
- **1,243 GitHub stars** in ~2 weeks (road to 2,500)
- **6,000+ developers** have joined the city
- **185 live users** at any given moment
- **83 Discord members**
- **74 forks**, built by a solo dev (Samuel Rizzon, 29)
- Revenue: self-service ads + cosmetic shop + GitHub Sponsors

### Core Strengths
1. **Proven viral flywheel** — share cards naturally spread on Twitter/X
2. **Developer district identity** — people feel affinity to their neighborhood
3. **Daily retention hooks** — streaks + check-ins + activity feed
4. **First-mover in 3D dev identity** — GitHub Skyline (competitor) is just a bar chart

### Core Weaknesses
1. **Zero utility** — nothing you do helps your actual career
2. **GitHub-only** — excludes GitLab, npm, SO, LeetCode users (~30% of devs)
3. **Mobile hostile** — WebGL without fallback kills mobile conversion
4. **No developer networking** — can't DM, connect, or endorse anyone
5. **Fragile monetization** — ads + shop is volatile; no recurring SaaS revenue
6. **No API/embeds** — zero distribution beyond the city itself
7. **No B2B / team layer** — no enterprise path

---

## 2. Ranked Market Opportunities

### Niche Scoring Matrix
| # | Opportunity | TAM | Differentiation | Moat | Viral Potential | Score |
|---|---|---|---|---|---|---|
| 1 | Developer Identity OS | $5B+ | Very High | High | Very High | **9.2/10** |
| 2 | Multi-Platform Dev Intelligence | $3B+ | High | Very High | Medium | **8.5/10** |
| 3 | Team / Org Visualization (B2B) | $8B+ | High | Medium | Medium | **8.0/10** |
| 4 | Developer Portfolio Replacement | $2B+ | High | Medium | High | **7.8/10** |
| 5 | Developer Career Engine (hiring) | $30B+ | Medium | Medium-High | Medium | **7.5/10** |
| 6 | Open Source Community Hub | $1B+ | Medium | Medium | High | **7.0/10** |
| 7 | AR Developer World | $10B+ | Very High | Low (early) | Very High | **6.5/10** |

### Top 3 Opportunity Deep-Dives

#### #1 — Developer Identity OS (Score: 9.2)
> "Your GitHub profile is flat. LinkedIn isn't for devs. There's no home for developer identity."

- **Problem:** GitHub is a code host, not an identity platform. LinkedIn doesn't speak dev. No
  existing product makes a developer's work visually compelling and shareable.
- **Why now:** 100M+ GitHub users, developer community spending on creator tools is at ATH.
- **The hook:** Git City already IS a developer identity product — it just doesn't know it yet.
- **10x multiplier:** Add portfolio utility → devs live here, not just visit.

#### #2 — Multi-Platform Dev Intelligence (Score: 8.5)
> "My GitHub is 40% of my story. What about npm? Stack Overflow? LeetCode?"

- **Problem:** Developers work across 6-8 platforms. No single view of the total footprint.
- **Why now:** API access to npm, SO, GitLab, DEV.to, LeetCode all exist and are underused.
- **The hook:** "One building that represents your entire career" is a stronger viral narrative.
- **10x multiplier:** First product to normalize cross-platform dev data wins a permanent moat.

#### #3 — Team / Org Visualization B2B (Score: 8.0)
> "Engineering managers have no visual way to see their team's output and health."

- **Problem:** JIRA charts are ugly. GitHub Insights is shallow. No tool makes team
  contribution data visceral and discussable.
- **Why now:** Remote-first orgs need async visibility into team health. Engineering metrics
  are a hot category (LinearB, Jellyfish, Waydev raising $100M+).
- **The hook:** "Your entire eng team as a city district" — one screenshot tells the story.
- **10x multiplier:** Even 50 company subscriptions pays more than 5,000 individual cosmetics.

---

## 3. Stress Test & Strategic Critique

### Kill-Shot Tests (per idea)

#### Developer Identity OS
| Kill Shot | Response | Verdict |
|---|---|---|
| "GitHub already has profiles" | Flat, no community, no reason to return | ❌ Does not kill |
| "LinkedIn has network effects" | Devs actively HATE LinkedIn — it's an opportunity | ❌ Does not kill |
| "WebGL blocks mobile users" | Real issue — needs 2D fallback + PWA | ⚠️ Serious, solvable |
| "Novelty wears off" | Only if no utility added. Portfolio fixes this | ⚠️ Solvable |
| "GitHub could clone this" | Social/career layer GitHub won't touch | ❌ Does not kill |

#### Multi-Platform Intelligence
| Kill Shot | Response | Verdict |
|---|---|---|
| "API rate limits everywhere" | Solvable with Redis caching + user OAuth tokens | ⚠️ Engineering challenge |
| "Data normalization is hell" | Yes, but creates a permanent moat | ⚠️ Hard moat |
| "Users won't link 6 accounts" | Optional platforms, additive not required | ❌ Does not kill |

#### Team / B2B
| Kill Shot | Response | Verdict |
|---|---|---|
| "Enterprises won't use a public city" | Private city mode, company-only districts | ❌ Solved by design |
| "Compliance / data concerns" | All data is public GitHub API — not sensitive | ❌ Does not kill |
| "Sales cycle too long for solo founder" | Start with product-led (self-serve team sign-up) | ⚠️ Manageable |

### Strategic Critique Summary
**What the 100x version must fix vs. the original:**
1. **From toy → tool** — Portfolio + career features create daily-use habits, not just viral moments
2. **From GitHub-only → omni-platform** — Remove the "I don't use GitHub" objection entirely
3. **From mobile-unfriendly → mobile-first** — Majority of dev browsing is mobile
4. **From invisible → embeddable** — An SDK/API turns every dev's README into a distribution channel
5. **From cosmetics revenue → SaaS revenue** — Monthly subscriptions are 10x more valuable than one-time purchases
6. **From community → network** — Kudos is fun; professional endorsements are useful

---

## 4. Validated Product Concept — DevCity

### One-Line Pitch
> **DevCity is the developer's living city — a 3D portfolio, professional network, and career platform where your code builds the world.**

### Vision
The LinkedIn of developers, rendered as an immersive 3D city that you fly through. Your building IS your resume. Your district is your tribe. Your career grows visibly, in real time.

### The 8 Product Pillars

---

#### PILLAR 1 — Omni-Platform Identity
Connect all your developer footprints into one building that represents your total career.

| Platform | Data Signal | Building Effect |
|---|---|---|
| GitHub | Commits, repos, stars, PRs | Building height + width + windows |
| GitLab | Merge requests, pipelines | Side tower |
| npm | Weekly downloads, package count | Ground floor type |
| Stack Overflow | Reputation, answers | Building color accent |
| DEV.to | Article views, followers | Rooftop antenna glow |
| LeetCode | Problems solved, contest rating | Window density pattern |
| PyPI / Crates.io | Download counts | Floor texture variant |

**Key feature:** "Connect 3+ platforms to unlock your Full Skyline" — progression incentive.

---

#### PILLAR 2 — Living Portfolio
Your building IS your portfolio. No more static portfolio sites.

- **Clickable windows** → each window is a project (repo card: name, description, tech stack, stars)
- **Pin top 6 projects** as lit landmark windows
- **Tech stack tags** displayed on building exterior walls
- **Custom bio + links** (Twitter, website, email) on the building entrance
- **Auto-generated** from your repos — no manual setup
- **Export:** Static HTML snapshot, shareable URL, embeddable iframe
- **Custom domain:** `ritesh.gitcity.dev` — replaces your portfolio site

**Why this works:** Every developer needs a portfolio. DevCity makes it beautiful and zero-effort.

---

#### PILLAR 3 — Professional Network
Connect with developers in context — not in a feed, but in a city.

- **Follow** another developer → their building stays visible in your custom district
- **Skill endorsements** → you can endorse specific skills (React, Rust, etc.) on someone's building
- **"I was here" stamps** → leave a professional mark when visiting a building  
- **Connection requests** → "Send a message" from anyone's building entrance
- **Introduce yourself** → 140-char note pinned on your building door
- **Discover:** "Building like yours also connects with..." recommendations

---

#### PILLAR 4 — Team Districts (B2B)
Companies claim a city block. All their engineers live in one district.

- **Company Block:** Claim your org's district (e.g., "Stripe Tower District")
- **Team Dashboard:** Engineering manager sees the whole org as a private map
  - Contribution trends → building height changes over sprint
  - Onboarding new hires → watch their building grow from week 1
  - Team health → dark windows = low activity (burnout signal)
- **Private City Mode:** Company-only city (not visible to public) — enterprise tier
- **Job postings:** "Now Hiring" signs light up on company buildings
- **Hackathon mode:** Company-internal building competition events

---

#### PILLAR 5 — Open Source Landmarks
Famous OSS projects become city landmarks. Their contributors orbit them.

- **Top 1,000 OSS repos** → converted into city landmarks/monuments (unique 3D models)
- **Real-time PR activity** → construction animations on the monument during active PRs
- **Maintainers** wear a badge (crown) visible from a distance
- **Sponsor visualization:** funding thermometers on the monument (via GitHub Sponsors API)
- **Contributor clustering:** your building auto-places near the landmark you contribute to most

---

#### PILLAR 6 — SDK & Embed API
One component that puts DevCity everywhere.

```bash
npm install @devcity/card
```

```jsx
// In any React app
import { DevCityCard } from '@devcity/card'
<DevCityCard username="ritesh" theme="dark" />
```

- **React component** → embeddable in any site or portfolio
- **GitHub README badge** → animated GIF showing your building (like shields.io)
- **Discord bot** → `/building @user` shows their building card
- **API v1:** `GET /api/v1/dev/:username` → returns full building JSON
- **Hosted iframe** → `<iframe src="devcity.com/embed/ritesh" />`
- **CI/CD badge** → building changes when you push code (webhook integration)

**Distribution math:** 100k devs embedding their card × avg 2k page views = 200M impressions/month.

---

#### PILLAR 7 — Career Engine
The city becomes your job search platform.

- **"Now Hiring" buildings** → companies mark their district buildings as hiring
- **AI matching:** "Your building matches 47 open roles at companies in your district"
- **Skill extraction:** AI reads your repos and auto-generates a skills list
- **"Fly-to" credits:** Recruiters buy credits to message developers inside the city
  - Respectful: devs can enable/disable recruiter contact
  - Natural: "We flew to your building because we love your work"
- **Interview rooms:** Shared 3D spaces for live pair coding sessions
- **Hired in DevCity:** @mentions when someone gets hired → viral loop

---

#### PILLAR 8 — Mobile & Progressive Web
No more losing 60% of visitors to WebGL compatibility issues.

- **2D Fallback Mode:** Full-featured 2D pixel art city for mobile and low-end devices
- **PWA:** Install to home screen, offline building viewing, push notifications
- **React Native App:** Simplified 2.5D view with notifications and social features
- **Push notifications:**
  - "3 people visited your building today"
  - "You got endorsed for React"
  - "Your building height increased!"
  - "Streaks reminder"  
- **AR Mode:** Point camera at sky → floating developer buildings overlay (viral gimmick for launches)

---

### Feature Comparison: Git City → DevCity

| Feature | Git City (Today) | DevCity (100x) |
|---|---|---|
| Data sources | GitHub only | GitHub + GitLab + npm + SO + LeetCode + DEV.to |
| Profile utility | Visual only | Portfolio + career tool |
| Mobile support | None (WebGL only) | 2D fallback + PWA + native app |
| Networking | Kudos only | Connections, endorsements, DMs |
| B2B / Teams | None | Company districts, team dashboards |
| API / Embeds | None | SDK, npm package, iframe, REST API |
| Job market | None | Recruiter fly-to, job postings, AI matching |
| OSS landmarks | None | Top 1,000 OSS repos as city monuments |
| Monetization | Ads + shop | Ads + shop + Pro + Team + Enterprise + Recruiter credits |
| Revenue model | One-time transactions | Primarily recurring SaaS + marketplace |

---

## 5. Execution Roadmap

### Phase 0 — Foundation (Months 1–2): "Fix the leaks"
**Goal:** Remove the biggest friction points before adding new features.

- [ ] **Mobile 2D Fallback** — Detect WebGL support; render 2D pixel city for mobile/low-end
- [ ] **PWA Support** — `manifest.json`, service worker, "Add to Home Screen" prompt
- [ ] **Performance Audit** — Target <3s initial load (compress assets, lazy-load canvas)
- [ ] **Analytics** — PostHog event tracking on all key interactions
- [ ] **Email Capture** — Resend integration; weekly "City Report" newsletter
- [ ] **Public API v0** — `GET /api/dev/:username` returns JSON building data
- [ ] **Embed SDK v0** — `<GitCityCard />` React component + npm publish

**Success metric:** Mobile conversion ≥25%, API has 500+ integrations.

---

### Phase 1 — Portfolio Engine (Months 2–4): "Make it useful"
**Goal:** Every developer uses DevCity as their actual portfolio.

- [ ] **Clickable windows = projects** — Top 6 repos shown as interactive windows
- [ ] **Tech stack wall tags** — Auto-extracted from repos, displayed on building exterior
- [ ] **Custom bio + links** — Name, tagline, website, Twitter, email on building entrance
- [ ] **Pin projects** — User selects which repos to highlight as lit windows
- [ ] **Portfolio export** — Static HTML snapshot, shareable `/dev/:username` page
- [ ] **Custom domains** — `username.gitcity.dev` subdomain (Pro tier unlock)
- [ ] **"Open to Work" status** — Toggle that lights up a hiring sign on your building

**Success metric:** 20% of registered devs fill out their portfolio. 1,000 "Open to Work" flags.

---

### Phase 2 — Multi-Platform (Months 3–5): "10x the signal"
**Goal:** One building for your entire developer career.

- [ ] **GitLab OAuth + import** — Merge requests, pipeline runs → building contribution layer
- [ ] **npm integration** — Weekly package downloads, package count → floor type
- [ ] **Stack Overflow** — Reputation, accepted answers → building accent color
- [ ] **DEV.to** — Article views + followers → rooftop antenna glow
- [ ] **LeetCode** — Problems solved, contest rank → window density
- [ ] **Unified "Dev Score"** — Weighted formula across all platforms (transparent, gameable)
- [ ] **Async sync pipeline** — Inngest/Trigger.dev jobs; refresh each platform on schedule

**Success metric:** 30% of users connect 2+ platforms. "Full Skyline" badge widely shared.

---

### Phase 3 — Pro & Team Tiers (Months 4–6): "Make real money"
**Goal:** Launch paid tiers. Hit $10k MRR.

- [ ] **Pro tier ($9/mo)** — Multi-platform, portfolio features, custom subdomain, remove ads
- [ ] **Team onboarding flow** — "Create your company district" self-serve
- [ ] **Company district UI** — Private map view, org-level contribution dashboard  
- [ ] **Team plan ($49/mo per 10 devs)** — Company block, private city, job postings
- [ ] **"Now Hiring" signs** — Companies post job roles visible on their buildings
- [ ] **Stripe subscription billing** — Upgrade/downgrade flow, billing portal

**Success metric:** $10k MRR by end of Phase 3. 20 company districts created.

---

### Phase 4 — Career Engine (Months 6–9): "Become the dev LinkedIn"
**Goal:** Developers find jobs through DevCity. Recruiters pay to reach them.

- [ ] **AI skill extraction** — LLM reads top repos → auto-generates skills list
- [ ] **Skill endorsements** — Devs endorse each other's specific skills
- [ ] **Developer connections** — Follow/connect, not just kudos
- [ ] **Recruiter Fly-to credits** — Recruiters buy credits ($5/contact) to message devs
- [ ] **Job matching** — "Your profile matches roles at these companies"
- [ ] **Interview rooms** — Shared 3D space for pair coding sessions
- [ ] **"Hired in DevCity" campaign** — Viral announcement mechanic

**Success metric:** 100 recruiter accounts active. 50 "Hired in DevCity" announcements.

---

### Phase 5 — Scale & Mobile (Months 9–12): "Reach every developer"
**Goal:** 100,000 registered users. Product in every dev's pocket.

- [ ] **React Native / Expo App** — Simplified 2.5D city, notifications, social
- [ ] **Push notifications** — Building visits, endorsements, streak reminders
- [ ] **AR Camera Mode** — Viral launch feature, floating buildings in real world
- [ ] **Open Source Landmarks** — Top 1,000 OSS projects as city monuments
- [ ] **DevCity Wrapped** — Year-end animated recap, viral share cards (Dec launch)
- [ ] **Open API v1** — Public developer platform, SDK for third-party integrations
- [ ] **GitHub Marketplace listing** — Distribution through GitHub's own channel

**Success metric:** 100k registered devs. $50k MRR. Top 10 on Product Hunt of the year.

---

## 6. Tech Architecture

### Keep (from Git City)
| Component | Technology | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | Already proven, edge-ready |
| 3D Engine | Three.js + R3F + drei | Best in class, already integrated |
| Database | Supabase (PostgreSQL) | Row-level security, Realtime, Auth |
| Payments | Stripe | Already integrated, subscriptions supported |
| Hosting | Vercel | Edge network, great DX |
| Styling | Tailwind CSS v4 | Fast iteration |

### Add
| Component | Technology | Why |
|---|---|---|
| Async jobs | Inngest or Trigger.dev | Multi-platform sync workers, scheduled jobs |
| Caching | Upstash Redis | GitHub/npm/SO API rate limit management |
| Search | Typesense (self-hosted) | Fast developer search at 100k+ profiles |
| AI | OpenAI + Vercel AI SDK | Skill extraction, career matching, building gen |
| CDN/Assets | Cloudflare R2 | 3D model assets, build snapshots |
| Email | Resend | Transactional + newsletter |
| Analytics | PostHog | Product funnel, feature flags |
| SDK/Package | npm (@devcity/card) | Distribution via embed |
| Mobile | Expo (React Native) | iOS + Android native |
| Auth expand | GitLab OAuth, email/pass | Multi-platform onboarding |

### Data Architecture

```
External Sources
  GitHub API ─────┐
  GitLab API ──────┤
  npm Registry ────┤──► Inngest Job Queue ──► Supabase PostgreSQL
  Stack Overflow ──┤         │                    │
  DEV.to API ──────┘         │                    ├── buildings
  LeetCode (scrape)          ▼                    ├── developer_platforms
                        Redis Cache               ├── achievements
                       (rate limit mgmt)          ├── connections
                                                  ├── endorsements
                                                  ├── jobs
                                                  └── recruiter_credits

API Layer (Next.js Route Handlers)
  /api/v1/dev/:username   ← public
  /api/v1/team/:org       ← team tier
  /api/v1/embed/:username ← SDK serve

3D Render Layer (R3F)
  CityCanvas.tsx → CityScene.tsx → Building.tsx
  
SDK Layer (npm)
  @devcity/card → React component
  @devcity/widget → Vanilla JS embed
```

---

## 7. Business Model

### Tier Structure

| Tier | Price | Features | Target |
|---|---|---|---|
| **Free** | $0 | Basic building (GitHub only), city exploration, achievements, 1 share card/mo | Everyone |
| **Pro** | $9/mo | Multi-platform (all sources), portfolio windows, custom subdomain, no ads, unlimited share cards | Serious devs |
| **Builder** | $29/mo | Everything Pro + SDK/embed, custom domain, analytics dashboard, priority profile refresh | Developers who want a portfolio |
| **Team** | $49/mo per 10 devs | Company district, team dashboard, private city view, job postings, 5 recruiter fly-to credits/mo | Engineering teams |
| **Enterprise** | Custom | Private deployment, SSO/SAML, compliance, analytics API, SLA, dedicated support | Large orgs |

### Additional Revenue Streams
| Stream | Model | Potential |
|---|---|---|
| In-city Billboard Ads | $9–$99/week (existing) | $2–5k/mo |
| Cosmetic Shop | One-time purchases (existing) | $1–3k/mo |
| Recruiter Fly-to Credits | $5 per developer contact | $10–50k/mo at scale |
| Featured Building Placement | $49/mo (top of leaderboard spotlight) | $2–5k/mo |
| OSS Sponsor visibility | $99/mo (sponsor logo on landmark monument) | $5–20k/mo |

### Revenue Projections

| Stage | Devs | Pro (5% cvr) | Team (0.5% cvr) | Recruiter | Total MRR |
|---|---|---|---|---|---|
| Month 6 | 20,000 | $9,000 | $5,000 | $1,000 | **~$18k** |
| Month 12 | 50,000 | $22,500 | $15,000 | $10,000 | **~$55k** |
| Month 18 | 100,000 | $45,000 | $35,000 | $30,000 | **~$120k** |
| Year 3 | 500,000 | $225,000 | $150,000 | $100,000 | **~$600k** |

**ARR potential at 500k devs: $7M+** (before enterprise contracts)

---

## 8. Risks & Verdict

### Risk Register

| Risk | Severity | Probability | Mitigation |
|---|---|---|---|
| GitHub API rate limits at scale | High | High | Redis caching, user-authorized tokens, graceful degradation |
| WebGL kills mobile adoption | High | High (already happening) | 2D fallback mode (Phase 0 priority #1) |
| Novelty wears off, users don't return | High | Medium | Portfolio + career utility creates daily-use habit |
| GitHub builds competing feature natively | Medium | Low | Move fast into social/career layer GitHub won't touch |
| LinkedIn network effects in hiring | Medium | High | Target devs who HATE LinkedIn — differentiate on culture |
| AGPL license limits B2B / enterprise | Medium | Medium | Dual-license model: AGPL (OSS) + Commercial (enterprise fork) |
| API abuse / scraping | Low-Medium | High | Rate limiting, anti-fraud (partially done), auth gates |
| Retention of casual users after viral spike | Medium | High | Email capture + streak push notifications (Phase 0) |
| Multi-platform data normalization complexity | Medium | High | Phased rollout, start with GitLab (easiest), strict data schema |
| Talent/solo-founder scaling | High | Medium | Open-source community contributions + early hire with equity |

### Critical Path (most important things in order)
1. **Mobile 2D fallback** — fix the silent exit of 60% of visitors
2. **Email capture + newsletter** — own your audience before virality fades
3. **Portfolio windows (clickable repos)** — first utility hook
4. **Public API + embed SDK** — distribution flywheel
5. **Pro tier launch** — validate willingness to pay before building more

### Competitive Moat Analysis

```
Git City Today:   [Viral] [3D Rendering]
DevCity 100x:     [Viral] [3D Rendering] + [Omni-Platform Data] + [Portfolio Utility]
                  + [Professional Network] + [Career Engine] + [SDK Distribution]
                  + [B2B Team Layer] + [OSS Landmarks]

Moat Score:
- GitHub Skyline:    1/8 (just a bar chart, no community)
- CodersRank:        3/8 (has data, no 3D, no social)  
- DevCity 100x:      7/8 (only gap: LinkedIn's existing recruiter network)
```

### Strategic Verdict: BUILD IT ✅

**Why this wins:**
- The core viral mechanic is already proven (1.2k stars in 2 weeks, 6k devs)
- Developer identity is a $5B+ market with no strong visual-native player
- The portfolio/career angle turns a toy into a tool — that's the retention fix
- Multi-platform data aggregation creates a permanent moat (first to unify wins)
- The 100x multiplier comes from two compounding 10x leaps:
  - **10x #1:** Add portfolio utility → 10x retention (devs stay because it's useful)
  - **10x #2:** Multi-platform + SDK → 10x distribution (every dev's README = a channel)
  - Combined: **100x** the defensibility and revenue potential

**The builder's edge:** Git City was built in 1 day and iterated daily for 2 weeks. That velocity,
combined with an existing community (6k devs, 83 Discord), is a better start than most VC-backed
dev tools get after 6 months of work. The foundation is real. Now build the city around it.

---

## Appendix A — File Structure for 100x Version

```
devcity/
├── apps/
│   ├── web/                    # Next.js app (fork of git-city)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (city)/     # Main 3D city routes
│   │   │   │   ├── (portfolio)/# /dev/:username portfolio pages
│   │   │   │   ├── (team)/     # Team district routes
│   │   │   │   ├── (career)/   # Job board + recruiter portal
│   │   │   │   └── api/
│   │   │   │       └── v1/     # Public REST API
│   │   │   ├── components/
│   │   │   │   ├── city/       # 3D city components (from git-city)
│   │   │   │   ├── portfolio/  # New portfolio components
│   │   │   │   ├── network/    # Social/connection components
│   │   │   │   └── career/     # Job/recruiter components
│   │   │   └── lib/
│   │   │       ├── platforms/  # Per-platform data fetchers
│   │   │       │   ├── github.ts
│   │   │       │   ├── gitlab.ts
│   │   │       │   ├── npm.ts
│   │   │       │   └── stackoverflow.ts
│   │   │       ├── ai/         # AI skill extraction, matching
│   │   │       └── sync/       # Inngest job definitions
│   └── mobile/                 # Expo React Native app
│       └── src/
│           ├── screens/
│           └── components/
├── packages/
│   ├── card/                   # @devcity/card npm package
│   │   ├── src/
│   │   │   └── DevCityCard.tsx
│   │   └── package.json
│   ├── widget/                 # @devcity/widget (vanilla JS)
│   └── types/                  # Shared TypeScript types
├── supabase/
│   └── migrations/             # DB schema evolution
└── STRATEGY.md                 # This document
```

## Appendix B — Key Database Tables to Add

```sql
-- Multi-platform connections
CREATE TABLE developer_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id),
  platform text NOT NULL, -- 'gitlab' | 'npm' | 'stackoverflow' | etc.
  platform_username text NOT NULL,
  access_token text, -- encrypted
  last_synced_at timestamptz,
  stats jsonb -- raw platform-specific stats
);

-- Portfolio projects (pinned windows)
CREATE TABLE portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id),
  repo_name text,
  description text,
  tech_stack text[],
  pinned boolean DEFAULT false,
  window_position int -- 1-6
);

-- Developer connections (network)
CREATE TABLE developer_connections (
  follower_id uuid REFERENCES developers(id),
  following_id uuid REFERENCES developers(id),
  connected_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Skill endorsements
CREATE TABLE skill_endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endorsed_id uuid REFERENCES developers(id),
  endorser_id uuid REFERENCES developers(id),
  skill text NOT NULL,
  endorsed_at timestamptz DEFAULT now()
);

-- Company districts (B2B)
CREATE TABLE company_districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text UNIQUE NOT NULL,
  display_name text,
  is_private boolean DEFAULT false,
  plan_tier text DEFAULT 'team', -- 'team' | 'enterprise'
  stripe_subscription_id text
);

-- Job postings
CREATE TABLE job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_district_id uuid REFERENCES company_districts(id),
  title text,
  description text,
  skills_required text[],
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Recruiter credits
CREATE TABLE recruiter_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES developers(id),
  credits_remaining int DEFAULT 0,
  total_purchased int DEFAULT 0
);
```

---

*Built with the AI_Cofounder_Orchestrator | March 4, 2026*  
*Next step: clone git-city repo and start Phase 0 implementation*
