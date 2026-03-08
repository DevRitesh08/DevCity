// ─── Archipelago Overview Client ───────────────────────────────
// Full archipelago view with multiple developer islands,
// biome labels, and click-to-navigate to individual profiles.

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CityBuilding } from "@devcity/types";
import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";

interface CityOverviewClientProps {
  buildings: CityBuilding[];
}

export default function CityOverviewClient({ buildings }: CityOverviewClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleIslandClick = (login: string) => {
    router.push(`/dev/${login}`);
  };

  // Compute archipelago stats
  const totalContributions = buildings.reduce((s, b) => s + b.contributions, 0);
  const totalStars = buildings.reduce((s, b) => s + b.total_stars, 0);

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md px-4 py-2.5">
        <Link
          href="/"
          className="text-xl font-display font-bold text-dc-text hover:text-dc-cyan transition-colors"
        >
          ISLE<span className="text-dc-cyan">FOLIO</span>
        </Link>

        <SearchBar className="max-w-xs" />

        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Archipelago View — placeholder until Phase 2 multi-island scene */}
        <div className="flex-1 relative flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #0e2a3a 0%, #1a6b8a 70%, #2a8aaa 100%)" }}
        >
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-dc-text mb-3 sm:text-5xl">
              The Archipelago
            </h1>
            <p className="text-sm text-dc-text-muted font-body mb-6">
              {buildings.length} islands discovered. Click an island to explore.
            </p>

            {/* Island grid preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto px-4">
              {buildings
                .sort((a, b) => b.contributions - a.contributions)
                .slice(0, 12)
                .map((b) => (
                  <button
                    key={b.login}
                    onClick={() => handleIslandClick(b.login)}
                    className="isle-panel p-3 text-left hover:border-dc-cyan/30 transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.avatar_url}
                        alt={b.login}
                        className="h-6 w-6 rounded-full border border-white/10"
                      />
                      <span className="text-xs font-bold text-dc-text truncate">{b.login}</span>
                    </div>
                    <div className="text-[10px] text-dc-text-muted">
                      {b.contributions.toLocaleString()} contributions · ★{b.total_stars.toLocaleString()}
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 hidden sm:flex gap-3 pointer-events-none">
            <div className="isle-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-cyan">{buildings.length}</div>
              <div className="text-[10px] text-dc-text-muted">Islands</div>
            </div>
            <div className="isle-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-text">
                {totalContributions.toLocaleString()}
              </div>
              <div className="text-[10px] text-dc-text-muted">Contributions</div>
            </div>
            <div className="isle-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-text">
                {totalStars.toLocaleString()}
              </div>
              <div className="text-[10px] text-dc-text-muted">Total Stars</div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden isle-btn text-xs"
          >
            {sidebarOpen ? "Close" : "List"}
          </button>
        </div>

        {/* Developer List Sidebar */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72
          overflow-y-auto border-l border-white/10 bg-dc-surface/95 backdrop-blur-md p-3
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <h3 className="mb-3 text-xs font-semibold uppercase text-dc-text-muted tracking-wider">
            Island Explorers ({buildings.length})
          </h3>

          <div className="space-y-2">
            {buildings
              .sort((a, b) => b.contributions - a.contributions)
              .map((b, i) => (
                <button
                  key={b.login}
                  onClick={() => handleIslandClick(b.login)}
                  className="flex w-full items-center gap-2 isle-panel p-2 text-left hover:border-dc-cyan/30 transition-colors"
                >
                  <span className="text-xs font-semibold text-dc-text-dim w-5">#{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.avatar_url}
                    alt={b.login}
                    className="h-8 w-8 rounded-full border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-bold text-dc-text">
                      {b.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-dc-text-muted">
                      <span>{b.contributions.toLocaleString()} commits</span>
                      <span className="text-dc-cyan">★{b.total_stars.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
