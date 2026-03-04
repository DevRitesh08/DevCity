-- ═══════════════════════════════════════════════════════════════
-- DevCity — Founding Migration
-- Creates the core tables for Phase 0 (Foundation)
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Developers ────────────────────────────────────────────────
-- Core developer entity — one row per DevCity user.

CREATE TABLE developers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  login         text UNIQUE NOT NULL,          -- GitHub username
  name          text,
  avatar_url    text NOT NULL DEFAULT '',
  bio           text,
  location      text,
  website       text,
  twitter       text,
  company       text,
  -- Aggregated stats (denormalized for fast reads)
  contributions integer NOT NULL DEFAULT 0,
  public_repos  integer NOT NULL DEFAULT 0,
  total_stars   integer NOT NULL DEFAULT 0,
  followers     integer NOT NULL DEFAULT 0,
  following     integer NOT NULL DEFAULT 0,
  -- Computed
  rank          integer,                       -- 1 = tallest
  dev_score     real NOT NULL DEFAULT 0,       -- 0–100 unified score
  -- Social
  kudos_count   integer NOT NULL DEFAULT 0,
  visit_count   integer NOT NULL DEFAULT 0,
  -- District assignment
  district      text NOT NULL DEFAULT 'fullstack',
  -- Timestamps
  github_created_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_developers_rank ON developers (rank) WHERE rank IS NOT NULL;
CREATE INDEX idx_developers_contributions ON developers (contributions DESC);
CREATE INDEX idx_developers_login ON developers (login);
CREATE INDEX idx_developers_district ON developers (district);

-- ─── Developer Platforms ───────────────────────────────────────
-- Multi-platform connections (Phase 2, schema defined now).

CREATE TABLE developer_platforms (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id       uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  platform           text NOT NULL,  -- 'github' | 'gitlab' | 'npm' | etc.
  platform_username  text NOT NULL,
  access_token       text,           -- encrypted at app layer
  last_synced_at     timestamptz,
  stats              jsonb DEFAULT '{}'::jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (developer_id, platform)
);

CREATE INDEX idx_dev_platforms_developer ON developer_platforms (developer_id);

-- ─── Top Repositories ──────────────────────────────────────────
-- Cached repository data for each developer.

CREATE TABLE developer_repos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id      uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  name              text NOT NULL,
  full_name         text NOT NULL,
  description       text,
  language          text,
  stargazers_count  integer NOT NULL DEFAULT 0,
  forks_count       integer NOT NULL DEFAULT 0,
  open_issues_count integer NOT NULL DEFAULT 0,
  topics            text[] DEFAULT '{}',
  html_url          text NOT NULL,
  pushed_at         timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (developer_id, full_name)
);

CREATE INDEX idx_dev_repos_developer ON developer_repos (developer_id);
CREATE INDEX idx_dev_repos_stars ON developer_repos (stargazers_count DESC);

-- ─── Portfolio Projects ────────────────────────────────────────
-- Pinned / highlighted projects shown as clickable building windows.

CREATE TABLE portfolio_projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id    uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  repo_full_name  text NOT NULL,
  display_name    text,
  description     text,
  tech_stack      text[] DEFAULT '{}',
  pinned          boolean NOT NULL DEFAULT false,
  window_position integer CHECK (window_position BETWEEN 1 AND 6),
  created_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (developer_id, repo_full_name)
);

-- ─── Achievements ──────────────────────────────────────────────

CREATE TABLE achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text UNIQUE NOT NULL,
  description text NOT NULL,
  tier        text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),
  icon        text NOT NULL DEFAULT '🏆',
  criteria    jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE developer_achievements (
  developer_id   uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (developer_id, achievement_id)
);

-- ─── Streaks ───────────────────────────────────────────────────

CREATE TABLE streaks (
  developer_id    uuid PRIMARY KEY REFERENCES developers(id) ON DELETE CASCADE,
  current_streak  integer NOT NULL DEFAULT 0,
  longest_streak  integer NOT NULL DEFAULT 0,
  last_checkin    timestamptz
);

-- ─── Building Cosmetics ────────────────────────────────────────

CREATE TABLE cosmetic_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot        text NOT NULL,  -- 'crown' | 'aura' | 'face' | 'roof' | etc.
  name        text NOT NULL,
  description text,
  rarity      text NOT NULL DEFAULT 'common',
  price       integer NOT NULL DEFAULT 0,  -- in cents or PX
  asset_key   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE developer_cosmetics (
  developer_id    uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  cosmetic_id     uuid NOT NULL REFERENCES cosmetic_items(id) ON DELETE CASCADE,
  equipped        boolean NOT NULL DEFAULT false,
  purchased_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (developer_id, cosmetic_id)
);

-- ─── Activity Feed ─────────────────────────────────────────────

CREATE TABLE activity_feed (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id  uuid NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  event_type    text NOT NULL,  -- 'joined' | 'achievement' | 'streak' | 'kudos' | etc.
  payload       jsonb DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_feed_recent ON activity_feed (created_at DESC);
CREATE INDEX idx_activity_feed_developer ON activity_feed (developer_id, created_at DESC);

-- ─── RLS (Row Level Security) ──────────────────────────────────
-- Enable RLS on all tables. Policies added per feature.

ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetic_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Public read access for developers, achievements, and feed
CREATE POLICY "public_read_developers" ON developers FOR SELECT USING (true);
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "public_read_dev_achievements" ON developer_achievements FOR SELECT USING (true);
CREATE POLICY "public_read_activity" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "public_read_repos" ON developer_repos FOR SELECT USING (true);
CREATE POLICY "public_read_cosmetics" ON cosmetic_items FOR SELECT USING (true);
CREATE POLICY "public_read_dev_cosmetics" ON developer_cosmetics FOR SELECT USING (true);
CREATE POLICY "public_read_streaks" ON streaks FOR SELECT USING (true);
CREATE POLICY "public_read_portfolio" ON portfolio_projects FOR SELECT USING (true);

-- ─── Updated_at Trigger ────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_developers_updated_at
  BEFORE UPDATE ON developers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
