// ─── ClaimBanner ───────────────────────────────────────────────
// Shows a prominent CTA for users viewing their own unclaimed building.
// - Not logged in → "Sign in with GitHub to claim"
// - Logged in + own profile + unclaimed → "Claim your building"
// - Claimed → ownership badge (no CTA)
// Exploration NEVER requires login — only claiming does.

"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface ClaimBannerProps {
  login: string;
  claimed: boolean;
  onClaimed?: () => void;
}

export default function ClaimBanner({ login, claimed, onClaimed }: ClaimBannerProps) {
  const { user, loading } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  // Already claimed — show ownership badge
  if (claimed || justClaimed) {
    return (
      <div className="mb-4 flex items-center gap-2 border-2 border-accent/40 bg-accent/10 px-3 py-2">
        <span className="text-sm">🏠</span>
        <span className="text-xs font-bold text-accent">CLAIMED BUILDING</span>
      </div>
    );
  }

  // Still loading auth state — don't flash anything
  if (loading) return null;

  // Check if this is the user's own profile
  const isOwnProfile = user?.login === login;

  // Not logged in but viewing any profile — show subtle sign-in hint only on own profile
  // (We can't know it's their "own" if not logged in, so skip)
  if (!user) {
    return (
      <div className="mb-4 border-2 border-dashed border-border bg-bg-card px-3 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🏗️</span>
          <span className="text-xs font-bold text-cream">UNCLAIMED BUILDING</span>
        </div>
        <p className="text-[10px] text-muted mb-2">
          Is this your GitHub profile? Sign in to claim this building and unlock customization.
        </p>
        <a
          href="/api/auth/login"
          className="inline-block border-2 border-accent text-accent px-3 py-1.5 text-xs font-bold hover:bg-accent hover:text-bg transition-colors"
        >
          SIGN IN WITH GITHUB
        </a>
      </div>
    );
  }

  // Logged in but not own profile — no banner
  if (!isOwnProfile) return null;

  // Logged in + own profile + unclaimed → show claim CTA
  async function handleClaim() {
    setClaiming(true);
    try {
      const res = await fetch(`/api/dev/${login}/claim`, { method: "POST" });
      if (res.ok) {
        setJustClaimed(true);
        onClaimed?.();
      }
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="mb-4 border-2 border-accent bg-accent/10 px-3 py-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">🏗️</span>
        <span className="text-xs font-bold text-accent">THIS IS YOUR BUILDING!</span>
      </div>
      <p className="text-[10px] text-muted mb-2">
        Claim it to unlock building customization, cosmetics, and ownership badge.
      </p>
      <button
        onClick={handleClaim}
        disabled={claiming}
        className="border-2 border-accent bg-accent text-bg px-4 py-1.5 text-xs font-bold hover:bg-accent/80 disabled:opacity-50 transition-colors"
      >
        {claiming ? "CLAIMING..." : "🏗️ CLAIM YOUR BUILDING"}
      </button>
    </div>
  );
}
