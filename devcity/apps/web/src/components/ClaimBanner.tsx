// ─── ClaimBanner ───────────────────────────────────────────────
// Shows a prominent CTA for users viewing their own unclaimed building.
// Cyberpunk neon-panel styling with holo-btn actions.

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
      <div className="mb-4 flex items-center gap-2 border border-dc-cyan/30 bg-dc-cyan/5 px-3 py-2">
        <span className="text-sm">⚡</span>
        <span className="text-xs font-bold text-dc-cyan tracking-wider">CLAIMED BUILDING</span>
      </div>
    );
  }

  // Still loading auth state — don't flash anything
  if (loading) return null;

  // Check if this is the user's own profile
  const isOwnProfile = user?.login === login;

  // Not logged in — show sign-in hint
  if (!user) {
    return (
      <div className="mb-4 neon-panel px-3 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🏗️</span>
          <span className="text-xs font-bold text-dc-text tracking-wider">UNCLAIMED BUILDING</span>
        </div>
        <p className="text-[10px] text-dc-text-muted mb-2">
          Is this your GitHub profile? Sign in to claim this building and unlock customization.
        </p>
        <a
          href="/api/auth/login"
          className="holo-btn inline-block px-3 py-1.5 text-xs"
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
    <div className="mb-4 neon-panel border-dc-cyan/50 px-3 py-3" style={{ borderColor: "rgba(0,255,255,0.4)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">⚡</span>
        <span className="text-xs font-bold text-dc-cyan tracking-wider">THIS IS YOUR BUILDING!</span>
      </div>
      <p className="text-[10px] text-dc-text-muted mb-2">
        Claim it to unlock building customization, cosmetics, and ownership badge.
      </p>
      <button
        onClick={handleClaim}
        disabled={claiming}
        className="holo-btn holo-btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
      >
        {claiming ? "CLAIMING..." : "⚡ CLAIM YOUR BUILDING"}
      </button>
    </div>
  );
}
