import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { getCityStats } from "@/lib/developer-store";

export default function Home() {
  const stats = getCityStats();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Animated grid background ── */}
      <div
        className="absolute inset-0 opacity-[0.07] animate-grid-scroll"
        style={{
          backgroundImage:
            "linear-gradient(#1a3a6a 1px, transparent 1px), linear-gradient(90deg, #1a3a6a 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── Radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(200,230,74,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── Nav bar ── */}
      <header className="relative z-10 flex items-center justify-between border-b-[3px] border-border bg-bg-raised/80 backdrop-blur-sm px-4 py-2">
        <span className="text-lg font-bold tracking-wider text-cream">
          DEV<span className="text-accent">CITY</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/city"
            className="text-xs font-bold text-muted hover:text-accent transition-colors"
          >
            EXPLORE CITY
          </Link>
          <Link
            href="/leaderboard"
            className="text-xs font-bold text-muted hover:text-accent transition-colors"
          >
            LEADERBOARD
          </Link>
          <UserNav />
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 p-8">
        {/* Title with neon glow */}
        <div className="text-center">
          <h1
            className="text-5xl font-bold tracking-[0.2em] sm:text-7xl lg:text-8xl animate-neon-pulse"
            style={{
              textShadow:
                "0 0 20px rgba(200,230,74,0.4), 0 0 40px rgba(200,230,74,0.2), 0 0 80px rgba(200,230,74,0.1)",
            }}
          >
            DEV<span className="text-accent">CITY</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-muted tracking-wide leading-relaxed">
            Your GitHub profile as a <span className="text-cream font-bold">3D skyscraper</span> in
            a living cyberpunk city. The more you contribute, the taller your building rises.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-lg">
          <SearchBar autoFocus />
          <p className="mt-2 text-center text-[10px] text-dim tracking-wider">
            SEARCH ANY GITHUB USERNAME TO EXPLORE THEIR BUILDING
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="border-pixel bg-bg-card/80 backdrop-blur-sm px-6 py-4 transition-transform hover:scale-105">
            <div
              className="text-2xl sm:text-3xl font-bold text-accent"
              style={{ textShadow: "0 0 10px rgba(200,230,74,0.3)" }}
            >
              {stats.totalDevelopers || "∞"}
            </div>
            <div className="mt-1 text-[10px] text-muted tracking-wider">DEVELOPERS</div>
          </div>
          <div className="border-pixel bg-bg-card/80 backdrop-blur-sm px-6 py-4 transition-transform hover:scale-105">
            <div
              className="text-2xl sm:text-3xl font-bold text-cream"
              style={{ textShadow: "0 0 10px rgba(232,220,200,0.2)" }}
            >
              {stats.totalContributions ? stats.totalContributions.toLocaleString() : "∞"}
            </div>
            <div className="mt-1 text-[10px] text-muted tracking-wider">CONTRIBUTIONS</div>
          </div>
          <div className="border-pixel bg-bg-card/80 backdrop-blur-sm px-6 py-4 transition-transform hover:scale-105">
            <div
              className="text-2xl sm:text-3xl font-bold text-cream"
              style={{ textShadow: "0 0 10px rgba(232,220,200,0.2)" }}
            >
              {stats.totalStars ? stats.totalStars.toLocaleString() : "∞"}
            </div>
            <div className="mt-1 text-[10px] text-muted tracking-wider">TOTAL STARS</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/city"
            className="border-2 border-accent bg-accent text-bg px-6 py-2.5 text-sm font-bold tracking-wider hover:bg-accent-hover transition-colors"
            style={{ boxShadow: "0 0 20px rgba(200,230,74,0.2)" }}
          >
            EXPLORE THE CITY →
          </Link>
          <Link
            href="/leaderboard"
            className="border-2 border-border text-muted px-6 py-2.5 text-sm font-bold tracking-wider hover:border-cream hover:text-cream transition-colors"
          >
            LEADERBOARD
          </Link>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-dim tracking-wider">
          Phase 3 — Search-First · Claim · Customize · Skyscrapers
        </p>
      </div>

      {/* ── Bottom building silhouettes ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-2 pointer-events-none">
        {[30, 55, 90, 40, 75, 25, 65, 50, 85, 35, 60, 45, 80, 32, 70, 48, 95, 38, 72, 52, 88, 42, 68, 55].map(
          (h, i) => (
            <div
              key={i}
              className="border-t border-x border-accent/10"
              style={{
                width: "3%",
                height: `${h}px`,
                background: `linear-gradient(to top, rgba(200,230,74,${0.02 + (h / 95) * 0.04}), transparent)`,
                opacity: 0,
                animation: `buildingRise 0.8s ease-out ${i * 0.06}s forwards`,
              }}
            />
          ),
        )}
      </div>
    </main>
  );
}
