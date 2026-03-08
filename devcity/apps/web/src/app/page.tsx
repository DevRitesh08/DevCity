import SearchBar from "@/components/SearchBar";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { getCityStats } from "@/lib/developer-store";

export default function Home() {
  const stats = getCityStats();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-dc-void">
      {/* ── Ocean gradient background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0e2a3a 0%, #1a4a5a 40%, #2a6a7a 70%, #1a6b8a 100%)",
        }}
      />

      {/* ── Radial sun glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(224,122,58,0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(26,107,138,0.1) 0%, transparent 40%)",
        }}
      />

      {/* ── Nav bar ── */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md px-4 py-2.5">
        <span className="text-xl font-display font-bold text-dc-text">
          ISLE<span className="text-dc-cyan">FOLIO</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/city"
            className="text-xs font-semibold text-dc-text-muted tracking-wider hover:text-dc-cyan transition-colors"
          >
            ARCHIPELAGO
          </Link>
          <Link
            href="/leaderboard"
            className="text-xs font-semibold text-dc-text-muted tracking-wider hover:text-dc-cyan transition-colors"
          >
            LEADERBOARD
          </Link>
          <UserNav />
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 p-8">
        {/* Title */}
        <div className="text-center animate-fade-in">
          <p className="text-sm text-dc-text-muted tracking-widest mb-4 animate-shimmer">
            ~ welcome ashore ~
          </p>
          <h1 className="text-5xl font-display font-bold sm:text-7xl lg:text-8xl text-dc-text">
            ISLE<span className="text-dc-cyan">FOLIO</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-dc-text-secondary leading-relaxed font-body">
            Your GitHub profile as a{" "}
            <span className="text-dc-cyan font-bold">living island</span>.
            More code, bigger island. Explore the archipelago of developers.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-lg animate-slide-up">
          <SearchBar autoFocus />
          <p className="mt-2 text-center text-xs text-dc-text-dim tracking-wide">
            Enter a GitHub username to discover their island
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 text-center animate-slide-up">
          <div className="isle-panel px-6 py-4 transition-all hover:shadow-lg">
            <div className="text-2xl sm:text-3xl font-display font-bold text-dc-cyan">
              {stats.totalDevelopers || "∞"}
            </div>
            <div className="mt-1 text-xs text-dc-text-muted">
              Islands
            </div>
          </div>
          <div className="isle-panel px-6 py-4 transition-all hover:shadow-lg">
            <div className="text-2xl sm:text-3xl font-display font-bold text-dc-text">
              {stats.totalContributions
                ? stats.totalContributions.toLocaleString()
                : "∞"}
            </div>
            <div className="mt-1 text-xs text-dc-text-muted">
              Contributions
            </div>
          </div>
          <div className="isle-panel px-6 py-4 transition-all hover:shadow-lg">
            <div className="text-2xl sm:text-3xl font-display font-bold text-dc-text">
              {stats.totalStars
                ? stats.totalStars.toLocaleString()
                : "∞"}
            </div>
            <div className="mt-1 text-xs text-dc-text-muted">
              Total Stars
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/city" className="isle-btn isle-btn-primary">
            Explore the Archipelago
          </Link>
          <Link href="/leaderboard" className="isle-btn">
            Leaderboard
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-dc-text-dim tracking-wide">
          Phase 1 · Island Prototype · v0.1
        </p>
      </div>

      {/* ── Bottom wave silhouettes ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="rgba(26,107,138,0.15)"
          />
          <path
            d="M0,80 C360,40 720,110 1080,60 C1260,40 1380,70 1440,80 L1440,120 L0,120 Z"
            fill="rgba(26,107,138,0.1)"
          />
        </svg>
      </div>
    </main>
  );
}
