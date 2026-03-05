// ─── DevProfileClient ──────────────────────────────────────────
// Client component that renders the 3D building viewer and stats panel.
// Cyberpunk Neon Terminal styling.

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CityBuilding } from "@devcity/types";
import type { EnhancedDevData } from "@/lib/github-enhanced";
import type { UnlockedAchievement } from "@/lib/achievements";
import { TIER_ORDER, TIER_COLORS } from "@/lib/achievements";
import { getBuildingColor } from "@/lib/building";
import { generateSingleBuildingLayout } from "@/lib/city-layout";
import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";
import PresenceIndicator from "@/components/PresenceIndicator";
import BuildingCustomizer from "@/components/BuildingCustomizer";
import ClaimBanner from "@/components/ClaimBanner";

// Dynamic import for CityCanvas — no SSR for Three.js
const CityCanvas = dynamic(() => import("@/components/city/CityCanvas"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-dc-void">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(0,255,255,0.06) 0%, transparent 50%)",
        }}
      />
      <div className="text-2xl font-display font-bold text-dc-cyan mb-2" style={{
        textShadow: "0 0 20px rgba(0,255,255,0.4), 0 0 40px rgba(0,255,255,0.2)",
      }}>
        LOADING BUILDING...
      </div>
      <div className="text-xs text-dc-text-muted tracking-wider font-mono">Constructing geometry</div>
      <div className="mt-4 w-48 h-1.5 border border-dc-border overflow-hidden">
        <div className="h-full bg-dc-cyan" style={{ animation: "loadingBar 2s ease-in-out infinite", boxShadow: "0 0 10px rgba(0,255,255,0.5)" }} />
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

  const layout = useMemo(
    () => generateSingleBuildingLayout(building),
    [building]
  );

  const { dimensions } = building;
  const { gists, orgs, packages } = enhanced;

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-dc-border bg-dc-panel backdrop-blur-md px-4 py-2.5">
        <Link
          href="/"
          className="text-lg font-display font-bold tracking-[0.15em] text-dc-text hover:text-dc-cyan transition-colors"
        >
          DEV<span className="text-dc-cyan text-glow-cyan">CITY</span>
        </Link>

        <SearchBar className="max-w-xs" />

        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 3D Canvas */}
        <div className="flex-1">
          <CityCanvas
            buildings={layout.buildings}
          />

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden holo-btn px-3 py-2 text-xs"
          >
            {sidebarOpen ? "CLOSE" : "STATS"}
          </button>
        </div>

        {/* Stats Sidebar — slides in on mobile */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72 md:w-80
          overflow-y-auto border-l border-dc-border bg-dc-surface p-4
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
              className="h-12 w-12 border border-dc-border rounded-sm"
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

          {/* District + Rank Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className="inline-block border px-2 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              {building.district}
            </span>
            {rank && (
              <span className="inline-block border border-dc-cyan px-2 py-1 text-xs font-bold text-dc-cyan tracking-wider">
                RANK #{rank}
              </span>
            )}
          </div>

          {/* DevScore + Social */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <StatBlock label="DEV SCORE" value={`${devScore}`} highlight />
            <StatBlock label="VISITS" value={visits.toLocaleString()} />
            <StatBlock label="KUDOS" value={kudos.toLocaleString()} />
          </div>

          {/* Building Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">Building Dimensions</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock label="HEIGHT" value={`${dimensions.height}u`} />
              <StatBlock label="WIDTH" value={`${dimensions.width}u`} />
              <StatBlock label="DEPTH" value={`${dimensions.depth}u`} />
              <StatBlock label="FLOORS" value={`${dimensions.floors}`} />
              <StatBlock label="WINDOWS/FL" value={`${dimensions.windowsPerFloor}`} />
              <StatBlock label="LIT %" value={`${Math.round(dimensions.litPercentage * 100)}%`} />
            </div>
          </div>

          <hr className="my-4 border-dc-border" />

          {/* GitHub Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">GitHub Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock
                label="CONTRIBUTIONS"
                value={building.contributions.toLocaleString()}
                highlight
              />
              <StatBlock label="REPOS" value={building.public_repos.toLocaleString()} />
              <StatBlock label="STARS" value={building.total_stars.toLocaleString()} />
              <StatBlock label="FOLLOWERS" value={building.followers.toLocaleString()} />
            </div>
          </div>

          {/* Top Repos */}
          {topRepos.length > 0 && (
            <>
              <hr className="my-4 border-dc-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">Top Repos</h3>
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between neon-panel px-2 py-1.5 text-xs hover:border-dc-border-active transition-colors"
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
              <hr className="my-4 border-dc-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">
                  Organizations ({orgs.length})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {orgs.map((org) => (
                    <div
                      key={org.login}
                      className="flex items-center gap-1 neon-panel px-2 py-1 text-xs"
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
              <hr className="my-4 border-dc-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">
                  Published Packages ({packages.length})
                </h3>
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="neon-panel px-2 py-1 text-xs"
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
              <hr className="my-4 border-dc-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">
                  Gists ({gists.length})
                </h3>
                {gists.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="neon-panel px-2 py-1 text-xs"
                  >
                    <div className="truncate text-dc-text">{g.description}</div>
                    <div className="text-dc-text-dim">{g.files.length} files</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr className="my-4 border-dc-border" />

          {/* Color swatch */}
          <div className="flex items-center gap-2 text-xs text-dc-text-muted">
            <div
              className="h-4 w-4 border border-dc-border"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}40` }}
            />
            Building accent: {accentColor}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <>
              <hr className="my-4 border-dc-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-dc-text-muted tracking-wider">
                  Achievements ({achievements.length})
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {[...achievements]
                    .sort((a, b) => (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3))
                    .map((ach) => (
                      <div
                        key={ach.id}
                        className="flex items-center gap-2 neon-panel px-2 py-1.5 text-xs"
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

          {/* Building Customizer — only for claimed buildings */}
          {isClaimed && (
            <>
              <hr className="my-4 border-dc-border" />
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
    <div className="neon-panel px-2 py-1.5">
      <div className={`text-sm font-bold ${highlight ? "text-dc-cyan" : "text-dc-text"}`}>
        {value}
      </div>
      <div className="text-[10px] text-dc-text-dim tracking-wider">{label}</div>
    </div>
  );
}
