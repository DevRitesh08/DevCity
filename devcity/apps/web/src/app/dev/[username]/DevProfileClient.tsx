// ─── DevProfileClient ──────────────────────────────────────────
// Client component that renders the 3D building viewer and stats panel.
// Receives pre-fetched data from the server component.

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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#050810]">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#1a3a6a 1px, transparent 1px), linear-gradient(90deg, #1a3a6a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(200,230,74,0.06) 0%, transparent 50%)",
        }}
      />
      <div className="text-2xl font-bold text-accent mb-2" style={{
        textShadow: "0 0 20px rgba(200,230,74,0.4), 0 0 40px rgba(200,230,74,0.2)",
      }}>
        LOADING CITY...
      </div>
      <div className="text-xs text-muted tracking-wider">Constructing building</div>
      <div className="mt-4 w-48 h-2 border-2 border-accent/40 overflow-hidden">
        <div className="h-full bg-accent" style={{ animation: "loadingBar 2s ease-in-out infinite" }} />
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
  const [theme, setTheme] = useState("midnight");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(initialClaimed);

  const accentColor = useMemo(() => getBuildingColor(building.login, building.district), [building.login, building.district]);

  const layout = useMemo(
    () => generateSingleBuildingLayout(building),
    [building]
  );

  const { dimensions } = building;
  const { gists, orgs, packages } = enhanced;

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b-[3px] border-border bg-bg-raised px-4 py-2">
        <Link
          href="/"
          className="text-lg font-bold tracking-wider text-cream hover:text-accent transition-colors"
        >
          DEV<span className="text-accent">CITY</span>
        </Link>

        <SearchBar className="max-w-xs" />

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="hidden sm:flex gap-1">
            {(["midnight", "sunset", "dawn", "neon"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`h-6 w-6 border-2 transition-all ${theme === t
                    ? "border-accent scale-110"
                    : "border-border hover:border-border-light"
                  }`}
                style={{
                  backgroundColor:
                    t === "midnight" ? "#0a0e1a" :
                      t === "sunset" ? "#1a0a1e" :
                        t === "dawn" ? "#0d1b2a" :
                          "#0a000a",
                }}
                title={t.charAt(0).toUpperCase() + t.slice(1)}
              />
            ))}
          </div>
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 3D Canvas */}
        <div className="flex-1">
          <CityCanvas
            buildings={layout.buildings}
            districts={layout.districts}
            theme={theme}
          />

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden border-pixel bg-bg-raised px-3 py-2 text-xs font-bold text-cream hover:bg-accent hover:text-bg transition-colors"
          >
            {sidebarOpen ? "CLOSE" : "STATS"}
          </button>
        </div>

        {/* Stats Sidebar — slides in on mobile */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72 md:w-80
          overflow-y-auto border-l-[3px] border-border bg-bg-raised p-4
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
              className="h-12 w-12 border-2 border-border"
              style={{ imageRendering: "pixelated" }}
            />
            <div>
              <h2 className="font-bold text-cream">{building.name}</h2>
              <p className="text-sm text-muted">@{building.login}</p>
            </div>
          </div>

          {/* Claim Banner — shows CTA for unclaimed buildings */}
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
              className="inline-block border-2 px-2 py-1 text-xs font-bold uppercase"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              {building.district} district
            </span>
            {rank && (
              <span className="inline-block border-2 border-accent px-2 py-1 text-xs font-bold text-accent">
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
            <h3 className="text-xs font-bold uppercase text-muted">Building Dimensions</h3>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock label="HEIGHT" value={`${dimensions.height}u`} />
              <StatBlock label="WIDTH" value={`${dimensions.width}u`} />
              <StatBlock label="DEPTH" value={`${dimensions.depth}u`} />
              <StatBlock label="FLOORS" value={`${dimensions.floors}`} />
              <StatBlock label="WINDOWS/FL" value={`${dimensions.windowsPerFloor}`} />
              <StatBlock label="LIT %" value={`${Math.round(dimensions.litPercentage * 100)}%`} />
            </div>
          </div>

          <hr className="my-4 border-border" />

          {/* GitHub Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted">GitHub Stats</h3>
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
              <hr className="my-4 border-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted">Top Repos</h3>
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border-pixel bg-bg-card px-2 py-1.5 text-xs hover:bg-bg transition-colors"
                  >
                    <span className="truncate text-cream">{repo.name}</span>
                    <span className="flex items-center gap-1 text-dim">
                      {repo.language && (
                        <span className="text-muted">{repo.language}</span>
                      )}
                      <span className="text-accent">★{repo.stargazers_count}</span>
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}



          {/* Organizations */}
          {orgs.length > 0 && (
            <>
              <hr className="my-4 border-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted">
                  Organizations ({orgs.length})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {orgs.map((org) => (
                    <div
                      key={org.login}
                      className="flex items-center gap-1 border-pixel bg-bg-card px-2 py-1 text-xs"
                      title={org.description}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={org.avatar_url}
                        alt={org.login}
                        className="h-4 w-4"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <span className="text-cream">{org.login}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Packages */}
          {packages.length > 0 && (
            <>
              <hr className="my-4 border-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted">
                  Published Packages ({packages.length})
                </h3>
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="border-pixel bg-bg-card px-2 py-1 text-xs"
                  >
                    <span className="text-accent">{pkg.packageType}</span>
                    <span className="text-dim">/</span>
                    <span className="text-cream">{pkg.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gists */}
          {gists.length > 0 && (
            <>
              <hr className="my-4 border-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted">
                  Gists ({gists.length})
                </h3>
                {gists.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="border-pixel bg-bg-card px-2 py-1 text-xs"
                  >
                    <div className="truncate text-cream">{g.description}</div>
                    <div className="text-dim">{g.files.length} files</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr className="my-4 border-border" />

          {/* Color swatch */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <div
              className="h-4 w-4 border border-border"
              style={{ backgroundColor: accentColor }}
            />
            Building accent: {accentColor}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <>
              <hr className="my-4 border-border" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted">
                  Achievements ({achievements.length})
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {[...achievements]
                    .sort((a, b) => (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3))
                    .map((ach) => (
                      <div
                        key={ach.id}
                        className="flex items-center gap-2 border-pixel bg-bg-card px-2 py-1.5 text-xs"
                        title={ach.description}
                      >
                        <span className="text-base">{ach.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-cream truncate">{ach.name}</div>
                          <div className="text-[10px] text-dim truncate">{ach.description}</div>
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
              <hr className="my-4 border-border" />
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
    <div className="border-pixel bg-bg-card px-2 py-1.5">
      <div className={`text-sm font-bold ${highlight ? "text-accent" : "text-cream"}`}>
        {value}
      </div>
      <div className="text-[10px] text-dim">{label}</div>
    </div>
  );
}
