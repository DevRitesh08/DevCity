// ─── LeaderboardClient ─────────────────────────────────────────
// Client component for the leaderboard page. Cyberpunk Neon Terminal styling.

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
    <div className="flex min-h-screen flex-col bg-dc-void font-mono text-dc-text">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-dc-border bg-dc-panel backdrop-blur-md px-4 py-2.5">
        <Link
          href="/"
          className="text-lg font-display font-bold tracking-[0.15em] text-dc-text hover:text-dc-cyan transition-colors"
        >
          DEV<span className="text-dc-cyan text-glow-cyan">CITY</span>
        </Link>

        <nav className="flex items-center gap-4 text-xs">
          <Link href="/city" className="text-dc-text-muted hover:text-dc-cyan transition-colors tracking-wider">
            EXPLORE
          </Link>
          <span className="text-dc-cyan font-bold tracking-wider">LEADERBOARD</span>
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
          <span className="text-xs text-dc-text-muted tracking-wider">SORT BY:</span>
          {(["dev_score", "contributions", "total_stars", "followers"] as const).map((key) => {
            const label = key === "dev_score" ? "SCORE" : key === "total_stars" ? "STARS" : key.toUpperCase();
            return (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1 text-xs font-bold border transition-all ${sortBy === key
                    ? "border-dc-cyan text-dc-cyan bg-dc-elevated"
                    : "border-dc-border text-dc-text-muted hover:border-dc-border-active hover:text-dc-text"
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
            <div className="text-2xl font-display font-bold text-dc-text-muted mb-2">NO CITIZENS YET</div>
            <p className="text-sm text-dc-text-dim">
              Visit developer profiles to populate the leaderboard.
            </p>
            <Link
              href="/city"
              className="mt-4 inline-block holo-btn px-4 py-2 text-sm"
            >
              EXPLORE CITY
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-[3rem_3rem_1fr_6rem_5rem_5rem_5rem_4rem] gap-2 px-3 py-1 text-[10px] font-bold text-dc-text-dim uppercase tracking-wider">
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
                className="group grid grid-cols-[3rem_3rem_1fr_auto] md:grid-cols-[3rem_3rem_1fr_6rem_5rem_5rem_5rem_4rem] gap-2 items-center neon-panel px-3 py-2 hover:border-dc-border-active transition-colors"
              >
                {/* Rank */}
                <span className={`text-sm font-bold ${idx === 0 ? "text-[#ffd700]" :
                    idx === 1 ? "text-[#c0c0c0]" :
                      idx === 2 ? "text-[#cd7f32]" :
                        "text-dc-text-muted"
                  }`}>
                  {idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </span>

                {/* Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.avatar_url}
                  alt={entry.login}
                  className="h-8 w-8 border border-dc-border rounded-sm"
                />

                {/* Name */}
                <div className="min-w-0">
                  <div className="font-bold text-dc-text group-hover:text-dc-cyan transition-colors truncate">
                    {entry.name}
                  </div>
                  <div className="text-[10px] text-dc-text-dim">@{entry.login}</div>
                </div>

                {/* Stats — desktop */}
                <span className="hidden md:block text-right text-sm font-bold text-dc-cyan">
                  {entry.dev_score}
                </span>
                <span className="hidden md:block text-right text-xs text-dc-text">
                  {entry.contributions.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-dc-text">
                  {entry.total_stars.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-dc-text">
                  {entry.followers.toLocaleString()}
                </span>
                <span className="hidden md:block text-right text-xs text-dc-text-muted">
                  {entry.achievementCount > 0 ? `×${entry.achievementCount}` : "—"}
                </span>

                {/* Mobile compact stats */}
                <div className="md:hidden flex flex-col items-end text-[10px]">
                  <span className="font-bold text-dc-cyan">{entry.dev_score} pts</span>
                  <span className="text-dc-text-dim">{entry.contributions.toLocaleString()} commits</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dc-border bg-dc-panel backdrop-blur-md px-4 py-3 text-center text-xs text-dc-text-dim tracking-wider">
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
    <div className="neon-panel px-3 py-2">
      <div className={`text-lg font-display font-bold ${accent ? "text-dc-cyan" : "text-dc-text"}`}>
        {value}
      </div>
      <div className="text-[10px] text-dc-text-dim tracking-wider">{label}</div>
    </div>
  );
}
