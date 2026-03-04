// ─── Error Boundary for /dev/[username] ─────────────────────────
// Catches errors during server-side data fetching and displays
// a user-friendly error page with retry option.

"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DevError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("DevProfile error:", error);
  }, [error]);

  // Determine error type for user-friendly messaging
  const isRateLimit = error.message?.includes("rate limit");
  const isNotFound = error.message?.includes("not found");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-6xl">
        {isRateLimit ? "⏳" : isNotFound ? "🏚️" : "⚠️"}
      </div>

      <h1 className="text-shadow-pixel text-3xl font-bold text-danger">
        {isRateLimit
          ? "RATE LIMITED"
          : isNotFound
          ? "BUILDING NOT FOUND"
          : "CONSTRUCTION ERROR"}
      </h1>

      <p className="max-w-md text-muted">
        {isRateLimit
          ? "GitHub API rate limit hit. The city needs a moment to cool down. Try again in a few minutes."
          : isNotFound
          ? "No developer found with that username. Check the spelling and try again."
          : "Something went wrong while constructing this building. The city architects are on it."}
      </p>

      {error.digest && (
        <p className="text-xs text-dim">Error ID: {error.digest}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="btn-press border-[3px] border-accent bg-transparent px-6 py-3 text-sm font-bold text-accent hover:bg-accent hover:text-bg"
        >
          TRY AGAIN
        </button>
        <Link
          href="/"
          className="btn-press border-[3px] border-border bg-bg-raised px-6 py-3 text-sm font-bold text-cream hover:bg-bg-card"
        >
          BACK TO CITY
        </Link>
      </div>
    </main>
  );
}
