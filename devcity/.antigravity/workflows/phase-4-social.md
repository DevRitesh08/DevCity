---
description: "Phase 4 — Social + Gamification. Build the retention loop with kudos, battles, achievements, and real-time feeds. Weeks 13-18."
---

# Phase 4 — Social + Gamification

> **Duration:** Weeks 13-18
> **Goal:** Build the retention loop.
> **Lead:** NETRUNNER
> **Support:** SIGNAL-TOWER, CHROME-SMITH, NEON-ARCHITECT, GHOST-PROTOCOL, CORTEX

## Mission Sequence

### Step 1: Kudos System (NETRUNNER + SIGNAL-TOWER)
1. Build kudos API endpoint (POST /api/interactions/kudos)
2. 5 kudos/day limit per giver with streak tracking
3. Signal-boost animation: neon pulse from giver to receiver building
4. Broadcast `kudos_given` event to activity feed

### Step 2: Hacker Battles (NETRUNNER + NEON-ARCHITECT)
1. Build battle API endpoint (POST /api/interactions/battle)
2. Attack/defense score calculation based on weekly stats
3. Max 3 battles/day, weekly cooldown per target
4. Attack animation: cyber-drone flies to target building
5. Hack sequence: glitch artifacts spread across target
6. Defense: hexagonal firewall shield on target building
7. Winner gets neon trophy, loser gets graffiti tag
8. Rate limiting + anti-abuse (GHOST-PROTOCOL)

### Step 3: Achievement System (NETRUNNER + CHROME-SMITH)
1. Multi-tier achievements (Bronze → Silver → Gold → Diamond)
2. Categories: commits, repos, stars, social, kudos, gifts, streak, battle, purchases, dailies
3. Achievement unlock triggers free cosmetic item
4. Holographic badge display on developer profile
5. Broadcast achievement unlocks to activity feed

### Step 4: Daily Streak Check-ins (NETRUNNER)
1. Auto check-in API (POST /api/checkin)
2. Streak freeze purchasable items (max 2 stored)
3. Milestone rewards at 7, 14, 30, 60, 100 days
4. Visual: pulsing neon ring at building base

### Step 5: XP & Leveling (NETRUNNER)
1. XP earned from all actions (checkin, kudos, battle, achievement)
2. Level 1-100 with title progression (Script Kiddie → Architect)
3. Level determines base building glow intensity
4. Level-up celebration animation

### Step 6: Daily Missions (NETRUNNER + CHROME-SMITH)
1. 3 random missions per day
2. Displayed as holographic mission briefing cards
3. Bonus XP on completion

### Step 7: Activity Feed (SIGNAL-TOWER + CHROME-SMITH)
1. Real-time activity ticker (scrolling holographic bar)
2. Expandable activity panel with full feed
3. All events: claims, kudos, battles, achievements, streaks, commits

### Step 8: Leaderboard (CHROME-SMITH + GRID-OPS)
1. City-wide ranking leaderboard
2. Filterable by district, time period
3. Redis sorted set for fast retrieval (5-min TTL)

### Step 9: ORACLE AI Companion (ORACLE)
1. Basic developer insights (2-3 per week)
2. Cyberpunk-themed messages displayed as holographic panels
3. "ORACLE: Your tower grew 3 floors this month..."

### Step 10: Testing (CORTEX)
1. Unit tests for battle scoring, kudos limits, XP calculation
2. Integration tests for all gamification API routes
3. E2E test for kudos + battle flows

## Success Criteria
- [ ] Kudos system works with signal-boost animation
- [ ] Hacker battles with full attack/defense animations
- [ ] Achievements unlock and display on profile
- [ ] Daily streaks tracking with milestone rewards
- [ ] Live activity feed updates in real-time
- [ ] Leaderboard shows rankings by district and time
- [ ] ORACLE delivers basic insights
