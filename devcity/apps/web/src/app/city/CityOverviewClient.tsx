// ─── City Overview Client ──────────────────────────────────────
// Full city view with multiple buildings, district labels, and
// click-to-navigate to individual developer profiles.

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CityBuilding } from "@devcity/types";
import { generateCityLayout } from "@/lib/city-layout";
import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";

const CityCanvas = dynamic(() => import("@/components/city/CityCanvas"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-dc-void">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Title */}
      <h1
        className="text-5xl font-display font-bold tracking-[0.3em] text-dc-cyan mb-3 sm:text-6xl"
        style={{
          textShadow:
            "0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.25), 0 0 80px rgba(0,255,255,0.1)",
        }}
      >
        DEV CITY
      </h1>

      {/* Subtitle */}
      <p className="text-sm font-mono tracking-[0.25em] text-dc-text-muted mb-8 uppercase">
        Initializing city systems...
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 border border-dc-border bg-transparent overflow-hidden">
        <div
          className="h-full bg-dc-cyan"
          style={{
            animation: "loadingBar 2.5s ease-in-out infinite",
            boxShadow: "0 0 10px rgba(0,255,255,0.5)",
          }}
        />
      </div>

      {/* Hint */}
      <p className="mt-8 text-[10px] text-dc-text-dim tracking-[0.2em] uppercase">
        Click any building to explore that dev&apos;s profile
      </p>

      {/* Building silhouettes rising from bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-4">
        {[45, 70, 120, 50, 95, 35, 80, 60, 110, 55, 75, 40, 100, 48, 85, 65, 90, 42, 78, 58].map(
          (h, i) => (
            <div
              key={i}
              style={{
                width: "3.5%",
                height: `${h}px`,
                borderTop: "1px solid rgba(0,255,255,0.15)",
                borderLeft: "1px solid rgba(0,255,255,0.08)",
                borderRight: "1px solid rgba(0,255,255,0.08)",
                background:
                  "linear-gradient(to top, rgba(0,255,255,0.04), rgba(0,255,255,0.01))",
                opacity: 0,
                animation: `buildingRise 0.6s ease-out ${i * 0.08}s forwards`,
              }}
            />
          ),
        )}
      </div>
    </div>
  ),
});

interface CityOverviewClientProps {
  buildings: CityBuilding[];
}

export default function CityOverviewClient({ buildings }: CityOverviewClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const layout = useMemo(() => generateCityLayout(buildings), [buildings]);

  const handleBuildingClick = (login: string) => {
    router.push(`/dev/${login}`);
  };

  // Compute city stats
  const totalContributions = buildings.reduce((s, b) => s + b.contributions, 0);
  const totalStars = buildings.reduce((s, b) => s + b.total_stars, 0);

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
        {/* 3D City Canvas */}
        <div className="flex-1 relative">
          <CityCanvas
            buildings={layout.buildings}
            onBuildingClick={handleBuildingClick}
          />

          {/* City Stats Overlay */}
          <div className="absolute bottom-4 left-4 hidden sm:flex gap-3 pointer-events-none">
            <div className="neon-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-cyan">{buildings.length}</div>
              <div className="text-[10px] text-dc-text-muted tracking-wider">BUILDINGS</div>
            </div>
            <div className="neon-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-text">
                {totalContributions.toLocaleString()}
              </div>
              <div className="text-[10px] text-dc-text-muted tracking-wider">CONTRIBUTIONS</div>
            </div>
            <div className="neon-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-text">
                {totalStars.toLocaleString()}
              </div>
              <div className="text-[10px] text-dc-text-muted tracking-wider">TOTAL STARS</div>
            </div>
            <div className="neon-panel px-3 py-2 pointer-events-auto">
              <div className="text-lg font-display font-bold text-dc-text">
                {layout.districts.length}
              </div>
              <div className="text-[10px] text-dc-text-muted tracking-wider">DISTRICTS</div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden holo-btn text-xs"
          >
            {sidebarOpen ? "CLOSE" : "LIST"}
          </button>
        </div>

        {/* Building List Sidebar — slides in on mobile */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72
          overflow-y-auto border-l border-dc-border bg-dc-surface p-3
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <h3 className="mb-3 text-xs font-bold uppercase text-dc-text-muted tracking-wider">
            Featured Developers ({buildings.length})
          </h3>

          <div className="space-y-2">
            {buildings
              .sort((a, b) => b.contributions - a.contributions)
              .map((b, i) => (
                <button
                  key={b.login}
                  onClick={() => handleBuildingClick(b.login)}
                  className="flex w-full items-center gap-2 neon-panel p-2 text-left hover:border-dc-border-active transition-colors"
                >
                  <span className="text-xs font-bold text-dc-text-dim w-5">#{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.avatar_url}
                    alt={b.login}
                    className="h-8 w-8 border border-dc-border"
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
                  <div
                    className="h-10 w-3 border border-dc-border"
                    style={{
                      backgroundColor: "#0a0a14",
                      backgroundImage: `linear-gradient(to top, #0a0a14 ${100 - (b.dimensions.height / 800) * 100}%, #00FFFF ${100 - (b.dimensions.height / 800) * 100}%)`,
                      boxShadow: `0 0 4px rgba(0,255,255,${(b.dimensions.height / 800) * 0.3})`,
                    }}
                    title={`Height: ${Math.round(b.dimensions.height)}u`}
                  />
                </button>
              ))}
          </div>

          {/* District Legend */}
          <hr className="my-4 border-dc-border" />
          <h3 className="mb-2 text-xs font-bold uppercase text-dc-text-muted tracking-wider">Districts</h3>
          <div className="space-y-1">
            {layout.districts.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div
                  className="h-3 w-3 border border-dc-border"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-dc-text">{d.displayName}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
