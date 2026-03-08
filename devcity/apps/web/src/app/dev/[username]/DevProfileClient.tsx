// ─── DevProfileClient ──────────────────────────────────────────
// Client component that renders the 3D island viewer and stats panel.
// ISLEFOLIO — Island Portfolio theme.

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CityBuilding } from "@devcity/types";
import type { EnhancedDevData } from "@/lib/github-enhanced";
import type { UnlockedAchievement } from "@/lib/achievements";
import { TIER_ORDER, TIER_COLORS } from "@/lib/achievements";
import { getBuildingColor } from "@/lib/building";
import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";
import PresenceIndicator from "@/components/PresenceIndicator";
import BuildingCustomizer from "@/components/BuildingCustomizer";
import ClaimBanner from "@/components/ClaimBanner";

// Dynamic import for IslandCanvas — no SSR for Three.js
const IslandCanvas = dynamic(() => import("@/components/island/IslandCanvas"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0e2a3a 0%, #1a6b8a 100%)" }}
    >
      <div className="text-3xl font-display font-bold text-dc-text mb-2">
        Charting Island...
      </div>
      <div className="text-sm text-dc-text-muted font-body">Generating terrain</div>
      <div className="mt-4 w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-dc-cyan rounded-full" style={{ animation: "loadingBar 2s ease-in-out infinite" }} />
      </div>
    </div>
  ),
});

interface DevProfileClientProps {
  building: CityBuilding;
  enhanced: EnhancedDevData;
  topRepos: { name: string; language: string | null; stargazers_count: number; html_url: string }[];
  visits: number;
  kudos: number;
  rank: number | null;
  devScore: number;
  achievements: UnlockedAchievement[];
  claimed: boolean;
}

export default function DevProfileClient({ building, enhanced, topRepos, visits, kudos, rank, devScore, achievements, claimed: initialClaimed }: DevProfileClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(initialClaimed);

  const accentColor = useMemo(() => getBuildingColor(building.login), [building.login]);

  const { dimensions } = building;
  const { gists, orgs, packages } = enhanced;

  // Map topRepos to the structure IslandCanvas expects
  const islandRepos = useMemo(() =>
    topRepos.map(r => ({
      name: r.name,
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
    })),
    [topRepos]
  );

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
        {/* 3D Island Canvas */}
        <div className="flex-1">
          <IslandCanvas
            username={building.login}
            repos={islandRepos}
            islandRadius={Math.max(8, Math.min(20, 8 + building.public_repos * 0.3))}
            primaryLanguage={topRepos[0]?.language ?? undefined}
          />

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden isle-btn px-3 py-2 text-xs"
          >
            {sidebarOpen ? "Close" : "Stats"}
          </button>
        </div>

        {/* Stats Sidebar */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72 md:w-80
          overflow-y-auto border-l border-white/10 bg-dc-surface/95 backdrop-blur-md p-4
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Avatar + Name */}
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={building.avatar_url}
              alt={building.login}
              className="h-12 w-12 rounded-lg border border-white/10"
            />
            <div>
              <h2 className="font-bold text-dc-text">{building.name}</h2>
              <p className="text-sm text-dc-text-muted">@{building.login}</p>
            </div>
          </div>

          {/* Claim Banner */}
          <ClaimBanner
            login={building.login}
            claimed={isClaimed}
            onClaimed={() => setIsClaimed(true)}
          />

          {/* Live Presence */}
          <PresenceIndicator login={building.login} />

          {/* Biome + Rank Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}
            >
              {building.district}
            </span>
            {rank && (
              <span className="inline-block rounded-full border border-dc-cyan/40 bg-dc-cyan/10 px-3 py-1 text-xs font-semibold text-dc-cyan">
                Rank #{rank}
              </span>
            )}
          </div>

          {/* DevScore + Social */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <StatBlock label="Dev Score" value={`${devScore}`} highlight />
            <StatBlock label="Visits" value={visits.toLocaleString()} />
            <StatBlock label="Kudos" value={kudos.toLocaleString()} />
          </div>

          {/* Island Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">Island Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock label="Radius" value={`${Math.round(dimensions.height / 40)}u`} />
              <StatBlock label="Elevation" value={`${Math.round(dimensions.height / 10)}m`} />
              <StatBlock label="Structures" value={`${Math.min(topRepos.length, 12)}`} />
              <StatBlock label="Biomes" value={`${dimensions.floors}`} />
            </div>
          </div>

          <hr className="my-4 border-white/10" />

          {/* GitHub Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">GitHub Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock
                label="Contributions"
                value={building.contributions.toLocaleString()}
                highlight
              />
              <StatBlock label="Repos" value={building.public_repos.toLocaleString()} />
              <StatBlock label="Stars" value={building.total_stars.toLocaleString()} />
              <StatBlock label="Followers" value={building.followers.toLocaleString()} />
            </div>
          </div>

          {/* Top Repos */}
          {topRepos.length > 0 && (
            <>
              <hr className="my-4 border-white/10" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">Top Repos</h3>
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between isle-panel px-2 py-1.5 text-xs hover:border-dc-cyan/30 transition-colors"
                  >
                    <span className="truncate text-dc-text">{repo.name}</span>
                    <span className="flex items-center gap-1 text-dc-text-dim">
                      {repo.language && (
                        <span className="text-dc-text-muted">{repo.language}</span>
                      )}
                      <span className="text-dc-cyan">★{repo.stargazers_count}</span>
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Organizations */}
          {orgs.length > 0 && (
            <>
              <hr className="my-4 border-white/10" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">
                  Organizations ({orgs.length})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {orgs.map((org) => (
                    <div
                      key={org.login}
                      className="flex items-center gap-1 isle-panel px-2 py-1 text-xs"
                      title={org.description}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={org.avatar_url}
                        alt={org.login}
                        className="h-4 w-4 rounded-sm"
                      />
                      <span className="text-dc-text">{org.login}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Packages */}
          {packages.length > 0 && (
            <>
              <hr className="my-4 border-white/10" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">
                  Published Packages ({packages.length})
                </h3>
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="isle-panel px-2 py-1 text-xs"
                  >
                    <span className="text-dc-cyan">{pkg.packageType}</span>
                    <span className="text-dc-text-dim">/</span>
                    <span className="text-dc-text">{pkg.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gists */}
          {gists.length > 0 && (
            <>
              <hr className="my-4 border-white/10" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">
                  Gists ({gists.length})
                </h3>
                {gists.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="isle-panel px-2 py-1 text-xs"
                  >
                    <div className="truncate text-dc-text">{g.description}</div>
                    <div className="text-dc-text-dim">{g.files.length} files</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr className="my-4 border-white/10" />

          {/* Accent color swatch */}
          <div className="flex items-center gap-2 text-xs text-dc-text-muted">
            <div
              className="h-4 w-4 rounded-full border border-white/10"
              style={{ backgroundColor: accentColor }}
            />
            Island accent: {accentColor}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <>
              <hr className="my-4 border-white/10" />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-dc-text-muted tracking-wider">
                  Achievements ({achievements.length})
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {[...achievements]
                    .sort((a, b) => (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3))
                    .map((ach) => (
                      <div
                        key={ach.id}
                        className="flex items-center gap-2 isle-panel px-2 py-1.5 text-xs"
                        title={ach.description}
                      >
                        <span className="text-base">{ach.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-dc-text truncate">{ach.name}</div>
                          <div className="text-[10px] text-dc-text-dim truncate">{ach.description}</div>
                        </div>
                        <span
                          className="text-[10px] font-bold uppercase"
                          style={{ color: TIER_COLORS[ach.tier] }}
                        >
                          {ach.tier}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Building Customizer — only for claimed islands */}
          {isClaimed && (
            <>
              <hr className="my-4 border-white/10" />
              <BuildingCustomizer login={building.login} kudos={kudos} achievements={achievements} />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// ─── Stat Block ────────────────────────────────────────────────

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="isle-panel px-2 py-1.5">
      <div className={`text-sm font-bold ${highlight ? "text-dc-cyan" : "text-dc-text"}`}>
        {value}
      </div>
      <div className="text-[10px] text-dc-text-dim tracking-wider">{label}</div>
    </div>
  );
}
