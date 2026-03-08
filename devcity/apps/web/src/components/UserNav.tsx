// ─── UserNav ───────────────────────────────────────────────────
// Shows login button or user avatar + dropdown in the nav bar.
// ISLEFOLIO frosted glassmorphic dropdown.

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function UserNav() {
  const { user, loading, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={login}
        className="isle-btn px-3 py-1.5 text-xs"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1 hover:border-white/20 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="h-6 w-6 rounded-full border border-white/10"
        />
        <span className="hidden text-xs font-semibold text-dc-text sm:inline">
          {user.login}
        </span>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 isle-panel shadow-lg shadow-black/30">
          <div className="border-b border-white/10 px-3 py-2">
            <div className="text-xs font-bold text-dc-text">{user.name ?? user.login}</div>
            <div className="text-[10px] text-dc-text-muted">@{user.login}</div>
          </div>

          <Link
            href={`/dev/${user.login}`}
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-dc-text-secondary hover:text-dc-cyan hover:bg-white/5 transition-colors"
          >
            My Island
          </Link>

          <Link
            href="/settings"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-dc-text-secondary hover:text-dc-cyan hover:bg-white/5 transition-colors"
          >
            Settings
          </Link>

          <Link
            href="/city"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-dc-text-secondary hover:text-dc-cyan hover:bg-white/5 transition-colors"
          >
            Archipelago
          </Link>

          <hr className="border-white/10" />

          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="block w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
