// ─── Loading Skeleton for /dev/[username] ───────────────────────
// Shows a pixel-art themed loading state while the server
// fetches GitHub data and computes building dimensions.

export default function DevLoading() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar Skeleton */}
      <header className="flex items-center justify-between border-b-[3px] border-border bg-bg-raised px-4 py-2">
        <div className="text-lg font-bold tracking-wider text-cream">
          DEV<span className="text-accent">CITY</span>
        </div>
        <div className="h-10 w-64 animate-pulse rounded bg-bg-card" />
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 animate-pulse border-2 border-border bg-bg-card" />
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas Placeholder */}
        <div className="flex flex-1 items-center justify-center bg-bg">
          <div className="text-center">
            {/* Animated building construction */}
            <div className="relative mx-auto mb-6 flex items-end justify-center gap-1">
              {[40, 64, 24, 48, 32].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-bg-card border border-border"
                  style={{
                    width: 12,
                    height: h,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <div className="text-2xl font-bold text-accent animate-pulse-glow">
              CONSTRUCTING BUILDING...
            </div>
            <div className="mt-2 text-sm text-muted">
              Fetching GitHub data & computing dimensions
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="w-80 border-l-[3px] border-border bg-bg-raised p-4">
          {/* Avatar + Name */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse border-2 border-border bg-bg-card" />
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-bg-card" />
              <div className="h-3 w-16 animate-pulse rounded bg-bg-card" />
            </div>
          </div>

          {/* District Badge Skeleton */}
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-bg-card" />

          {/* Stats Grid Skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-36 animate-pulse rounded bg-bg-card" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="border-pixel bg-bg-card px-2 py-3"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="h-4 w-12 animate-pulse rounded bg-border" />
                  <div className="mt-1 h-2 w-16 animate-pulse rounded bg-border" />
                </div>
              ))}
            </div>
          </div>

          <hr className="my-4 border-border" />

          {/* More skeleton blocks */}
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-bg-card" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-pixel bg-bg-card px-2 py-3">
                  <div className="h-4 w-10 animate-pulse rounded bg-border" />
                  <div className="mt-1 h-2 w-20 animate-pulse rounded bg-border" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
