import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { getCityStats } from "@/lib/developer-store";

export default function Home() {
  const stats = getCityStats();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-dc-void">
      {/* ── Animated grid background ── */}
      <div
        className="absolute inset-0 opacity-[0.04] animate-grid-scroll"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial glow — cyan/magenta blend ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,255,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,0,255,0.03) 0%, transparent 50%)",
        }}
      />

      {/* ── Nav bar ── */}
      <header className="relative z-10 flex items-center justify-between border-b border-dc-border bg-dc-panel backdrop-blur-md px-4 py-2.5">
        <span className="text-lg font-display font-bold tracking-[0.15em] text-dc-text">
          DEV<span className="text-dc-cyan text-glow-cyan">CITY</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/city"
            className="text-xs font-bold text-dc-text-muted tracking-wider hover:text-dc-cyan transition-colors"
          >
            EXPLORE CITY
          </Link>
          <Link
            href="/leaderboard"
            className="text-xs font-bold text-dc-text-muted tracking-wider hover:text-dc-cyan transition-colors"
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
          <p className="text-xs font-mono text-dc-text-dim tracking-[0.3em] mb-4 animate-neon-flicker">
            ⚡ INITIALIZING CITY SYSTEMS ⚡
          </p>
          <h1
            className="text-5xl font-display font-bold tracking-[0.2em] sm:text-7xl lg:text-8xl animate-neon-pulse text-dc-cyan"
          >
            DEV<span className="text-dc-magenta">CITY</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm sm:text-base text-dc-text-secondary tracking-wide leading-relaxed font-mono">
            Your GitHub profile as a{" "}
            <span className="text-dc-cyan font-bold">neon-lit skyscraper</span>{" "}
            in a living cyberpunk city. The more you contribute, the taller
            your tower rises.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-lg">
          <SearchBar autoFocus />
          <p className="mt-2 text-center text-[10px] text-dc-text-dim tracking-[0.2em]">
            ENTER GITHUB USERNAME TO LOCATE BUILDING
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="neon-panel px-6 py-4 transition-all hover:border-dc-border-active hover:box-glow-cyan">
            <div
              className="text-2xl sm:text-3xl font-display font-bold text-dc-cyan"
              style={{ textShadow: "0 0 15px rgba(0,255,255,0.4)" }}
            >
              {stats.totalDevelopers || "∞"}
            </div>
            <div className="mt-1 text-[10px] text-dc-text-muted tracking-[0.2em]">
              DEVELOPERS
            </div>
          </div>
          <div className="neon-panel px-6 py-4 transition-all hover:border-dc-border-active hover:box-glow-cyan">
            <div
              className="text-2xl sm:text-3xl font-display font-bold text-dc-text"
              style={{ textShadow: "0 0 10px rgba(240,246,252,0.2)" }}
            >
              {stats.totalContributions
                ? stats.totalContributions.toLocaleString()
                : "∞"}
            </div>
            <div className="mt-1 text-[10px] text-dc-text-muted tracking-[0.2em]">
              CONTRIBUTIONS
            </div>
          </div>
          <div className="neon-panel px-6 py-4 transition-all hover:border-dc-border-active hover:box-glow-cyan">
            <div
              className="text-2xl sm:text-3xl font-display font-bold text-dc-text"
              style={{ textShadow: "0 0 10px rgba(240,246,252,0.2)" }}
            >
              {stats.totalStars
                ? stats.totalStars.toLocaleString()
                : "∞"}
            </div>
            <div className="mt-1 text-[10px] text-dc-text-muted tracking-[0.2em]">
              TOTAL STARS
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/city" className="holo-btn holo-btn-primary">
            EXPLORE THE CITY ⚡
          </Link>
          <Link href="/leaderboard" className="holo-btn">
            LEADERBOARD
          </Link>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-dc-text-dim tracking-[0.2em]">
          PHASE 1 · CYBERPUNK PROTOTYPE · NEON TERMINAL v0.1
        </p>
      </div>

      {/* ── Bottom building silhouettes ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-2 pointer-events-none">
        {[30, 55, 90, 40, 75, 25, 65, 50, 85, 35, 60, 45, 80, 32, 70, 48, 95, 38, 72, 52, 88, 42, 68, 55].map(
          (h, i) => (
            <div
              key={i}
              style={{
                width: "3%",
                height: `${h}px`,
                background: `linear-gradient(to top, rgba(0,255,255,${0.02 + (h / 95) * 0.06}), transparent)`,
                borderTop: "1px solid rgba(0,255,255,0.1)",
                borderLeft: "1px solid rgba(0,255,255,0.05)",
                borderRight: "1px solid rgba(0,255,255,0.05)",
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
