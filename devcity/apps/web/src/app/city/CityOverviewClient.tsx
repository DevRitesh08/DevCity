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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#050810]">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(#1a3a6a 1px, transparent 1px), linear-gradient(90deg, #1a3a6a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(200,230,74,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Title */}
      <h1
        className="text-5xl font-bold tracking-[0.3em] text-accent mb-3 sm:text-6xl"
        style={{
          textShadow:
            "0 0 20px rgba(200,230,74,0.5), 0 0 40px rgba(200,230,74,0.25), 0 0 80px rgba(200,230,74,0.1)",
        }}
      >
        DEV CITY
      </h1>

      {/* Subtitle */}
      <p className="text-sm font-bold tracking-[0.25em] text-muted mb-8 uppercase">
        Building the skyline...
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2.5 border-2 border-accent/40 bg-transparent overflow-hidden">
        <div
          className="h-full bg-accent"
          style={{
            animation: "loadingBar 2.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Hint */}
      <p className="mt-8 text-[10px] text-dim tracking-[0.2em] uppercase">
        Click any building to explore that dev&apos;s profile
      </p>

      {/* Building silhouettes rising from bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-4">
        {[45, 70, 120, 50, 95, 35, 80, 60, 110, 55, 75, 40, 100, 48, 85, 65, 90, 42, 78, 58].map(
          (h, i) => (
            <div
              key={i}
              className="border-t border-x border-accent/20"
              style={{
                width: "3.5%",
                height: `${h}px`,
                background:
                  "linear-gradient(to top, rgba(200,230,74,0.04), rgba(200,230,74,0.01))",
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
  const [theme, setTheme] = useState("midnight");
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
        {/* 3D City Canvas */}
        <div className="flex-1 relative">
          <CityCanvas
            buildings={layout.buildings}
            districts={layout.districts}
            theme={theme}
            onBuildingClick={handleBuildingClick}
          />

          {/* City Stats Overlay */}
          <div className="absolute bottom-4 left-4 hidden sm:flex gap-3 pointer-events-none">
            <div className="border-pixel bg-bg/80 backdrop-blur-sm px-3 py-2 pointer-events-auto">
              <div className="text-lg font-bold text-accent">{buildings.length}</div>
              <div className="text-[10px] text-muted">BUILDINGS</div>
            </div>
            <div className="border-pixel bg-bg/80 backdrop-blur-sm px-3 py-2 pointer-events-auto">
              <div className="text-lg font-bold text-cream">
                {totalContributions.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted">CONTRIBUTIONS</div>
            </div>
            <div className="border-pixel bg-bg/80 backdrop-blur-sm px-3 py-2 pointer-events-auto">
              <div className="text-lg font-bold text-cream">
                {totalStars.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted">TOTAL STARS</div>
            </div>
            <div className="border-pixel bg-bg/80 backdrop-blur-sm px-3 py-2 pointer-events-auto">
              <div className="text-lg font-bold text-cream">
                {layout.districts.length}
              </div>
              <div className="text-[10px] text-muted">DISTRICTS</div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 z-20 md:hidden border-pixel bg-bg-raised px-3 py-2 text-xs font-bold text-cream hover:bg-accent hover:text-bg transition-colors"
          >
            {sidebarOpen ? "CLOSE" : "LIST"}
          </button>
        </div>

        {/* Building List Sidebar — slides in on mobile */}
        <aside className={`
          absolute right-0 top-0 z-10 h-full w-72
          overflow-y-auto border-l-[3px] border-border bg-bg-raised p-3
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <h3 className="mb-3 text-xs font-bold uppercase text-muted">
            Featured Developers ({buildings.length})
          </h3>

          <div className="space-y-2">
            {buildings
              .sort((a, b) => b.contributions - a.contributions)
              .map((b, i) => (
                <button
                  key={b.login}
                  onClick={() => handleBuildingClick(b.login)}
                  className="flex w-full items-center gap-2 border-pixel bg-bg-card p-2 text-left hover:bg-bg transition-colors"
                >
                  <span className="text-xs font-bold text-dim w-5">#{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.avatar_url}
                    alt={b.login}
                    className="h-8 w-8 border border-border"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-bold text-cream">
                      {b.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>{b.contributions.toLocaleString()} commits</span>
                      <span className="text-accent">★{b.total_stars.toLocaleString()}</span>
                    </div>
                  </div>
                  <div
                    className="h-10 w-3 border border-border"
                    style={{
                      backgroundColor: "#0a0a1a",
                      backgroundImage: `linear-gradient(to top, #0a0a1a ${100 - (b.dimensions.height / 800) * 100}%, #c8e64a ${100 - (b.dimensions.height / 800) * 100}%)`,
                    }}
                    title={`Height: ${Math.round(b.dimensions.height)}u`}
                  />
                </button>
              ))}
          </div>

          {/* District Legend */}
          <hr className="my-4 border-border" />
          <h3 className="mb-2 text-xs font-bold uppercase text-muted">Districts</h3>
          <div className="space-y-1">
            {layout.districts.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div
                  className="h-3 w-3 border border-border"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-cream">{d.displayName}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
