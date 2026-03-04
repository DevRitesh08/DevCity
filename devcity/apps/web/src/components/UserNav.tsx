// ─── UserNav ───────────────────────────────────────────────────
// Shows login button or user avatar + dropdown in the nav bar.
// Consumes AuthProvider context.

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
      <div className="h-8 w-8 animate-pulse border-2 border-border bg-bg-card" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={login}
        className="btn-press border-2 border-accent bg-transparent px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-bg transition-colors"
      >
        SIGN IN
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 border-2 border-border px-2 py-1 hover:border-accent transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="h-6 w-6 border border-border"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="hidden text-xs font-bold text-cream sm:inline">
          {user.login}
        </span>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 border-[3px] border-border bg-bg-raised shadow-lg">
          <div className="border-b border-border px-3 py-2">
            <div className="text-xs font-bold text-cream">{user.name ?? user.login}</div>
            <div className="text-[10px] text-muted">@{user.login}</div>
          </div>

          <Link
            href={`/dev/${user.login}`}
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-cream hover:bg-bg transition-colors"
          >
            MY BUILDING
          </Link>

          <Link
            href="/settings"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-cream hover:bg-bg transition-colors"
          >
            SETTINGS
          </Link>

          <Link
            href="/city"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-cream hover:bg-bg transition-colors"
          >
            EXPLORE CITY
          </Link>

          <hr className="border-border" />

          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="block w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-bg transition-colors"
          >
            SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}
