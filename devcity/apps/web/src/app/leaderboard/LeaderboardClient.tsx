// ─── LeaderboardClient ─────────────────────────────────────────
// Client component for the leaderboard page with sort controls and stats.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import UserNav from "@/components/UserNav";
import type { LeaderboardEntry } from "@/lib/developer-store";
import type { CityStats } from "@/lib/developer-store";

type SortKey = "contributions" | "total_stars" | "dev_score" | "followers";

interface EnrichedEntry extends LeaderboardEntry {
  achievementCount: number;
}

interface LeaderboardClientProps {
  entries: EnrichedEntry[];
  stats: CityStats;
}

export default function LeaderboardClient({ entries, stats }: LeaderboardClientProps) {
  const [sortBy, setSortBy] = useState<SortKey>("dev_score");

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      switch (sortBy) {
        case "contributions": return b.contributions - a.contributions;
        case "total_stars": return b.total_stars - a.total_stars;
        case "followers": return b.followers - a.followers;
        case "dev_score":
        default: return b.dev_score - a.dev_score;
      }
    });
  }, [entries, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-bg font-pixel text-cream">
      {/* Header */}
      <header className="flex items-center justify-between border-b-[3px] border-border bg-bg-raised px-4 py-2">
        <Link
          href="/"
          className="text-lg font-bold tracking-wider text-cream hover:text-accent transition-colors"
        >
          DEV<span className="text-accent">CITY</span>
        </Link>

        <nav className="flex items-center gap-4 text-xs">
          <Link href="/city" className="text-muted hover:text-accent transition-colors">
            EXPLORE
          </Link>
          <span className="text-accent font-bold">LEADERBOARD</span>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* City Stats Banner */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="TOTAL DEVS" value={stats.totalDevelopers.toLocaleString()} accent />
          <StatCard label="TOTAL COMMITS" value={stats.totalContributions.toLocaleString()} />
          <StatCard label="TOTAL STARS" value={stats.totalStars.toLocaleString()} />
          <StatCard label="TOTAL REPOS" value={stats.totalRepos.toLocaleString()} />
        </div>

        {/* Sort Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">SORT BY:</span>
          {(["dev_score", "contributions", "total_stars", "followers"] as const).map((key) => {
            const label = key === "dev_score" ? "SCORE" : key === "total_stars" ? "STARS" : key.toUpperCase();
            return (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1 text-xs font-bold border-2 transition-all ${
                  sortBy === key
                    ? "border-accent text-accent bg-bg-card"
                    : "border-border text-muted hover:border-border-light hover:text-cream"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-2xl font-bold text-muted mb-2">NO CITIZENS YET</div>
            <p className="text-sm text-dim">
              Visit developer profiles to populate the leaderboard.
            </p>
            <Link
              href="/city"
              className="mt-4 inline-block border-2 border-accent text-accent px-4 py-2 text-sm font-bold hover:bg-accent hover:text-bg transition-colors"
            >
              EXPLORE CITY
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-[3rem_3rem_1fr_6rem_5rem_5rem_5rem_4rem] gap-2 px-3 py-1 text-[10px] font-bold text-dim uppercase">
              <span>#</span>
              <span></span>
              <span>Developer</span>
              <span className="text-right">Score</span>
              <span className="text-right">Commits</span>
              <span className="text-right">Stars</span>
              <span className="text-right">Followers</span>
              <span className="text-right">🏆</span>
            </div>

            {sorted.map((entry, idx) => (
              <Link
                key={entry.login}
                href={`/dev/${entry.login}`}
                className="group grid grid-cols-[3rem_3rem_1fr_auto] md:grid-cols-[3rem_3rem_1fr_6rem_5rem_5rem_5rem_4rem] gap-2 items-center border-pixel bg-bg-card px-3 py-2 hover:bg-bg-raised transition-colors"
              >
                {/* Rank */}
                <span className={`text-sm font-bold ${
                  idx === 0 ? "text-[#ffd700]" :
                  idx === 1 ? "text-[#c0c0c0]" :
                  idx === 2 ? "text-[#cd7f32]" :
                  "text-muted"
                }`}>
                  {idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </span>

                {/* Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.avatar_url}
                  alt={entry.login}
                  className="h-8 w-8 border border-border"
                  style={{ imageRendering: "pixelated" }}
                />

                {/* Name */}
                <div className="min-w-0">
                  <div className="font-bold text-cream group-hover:text-accent transition-colors truncate">
                    {entry.name}
                  </div>
                  <div className="text-[10px] text-dim">@{entry.login}</div>
                </div>

                {/* Stats — desktop */}
                <span className="hidden md:block text-right text-sm font-bold text-accent">
                  {entry.dev_score}
                </span>
                <span className="hidden md:block text-right text-xs text-cream">
                  {entry.contributions.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-cream">
                  {entry.total_stars.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-cream">
                  {entry.followers.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-muted">
                  {entry.achievementCount > 0 ? `×${entry.achievementCount}` : "—"}
                </span>

                {/* Mobile compact stats */}
                <div className="md:hidden flex flex-col items-end text-[10px]">
                  <span className="font-bold text-accent">{entry.dev_score} pts</span>
                  <span className="text-dim">{entry.contributions.toLocaleString()} commits</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-border bg-bg-raised px-4 py-3 text-center text-xs text-dim">
        DEVCITY LEADERBOARD — Rank is recalculated on every profile visit
      </footer>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-pixel bg-bg-card px-3 py-2">
      <div className={`text-lg font-bold ${accent ? "text-accent" : "text-cream"}`}>
        {value}
      </div>
      <div className="text-[10px] text-dim">{label}</div>
    </div>
  );
}
