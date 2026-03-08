// ─── SearchBar ─────────────────────────────────────────────────
// Client-side search input that navigates to /dev/[username].
// ISLEFOLIO island theme styling.

"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, type FormEvent } from "react";

interface SearchBarProps {
  /** Autofocus the input on mount */
  autoFocus?: boolean;
  /** Extra CSS classes for the container */
  className?: string;
}

export default function SearchBar({ autoFocus = false, className = "" }: SearchBarProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = username.trim().replace(/^@/, "");
      if (!trimmed) return;

      setLoading(true);
      router.push(`/dev/${trimmed}`);
    },
    [username, router]
  );

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <div className="flex items-center rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden">
        <span className="px-3 text-sm text-dc-cyan font-body">@</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="flex-1 bg-transparent px-2 py-3 text-dc-text font-body text-sm outline-none placeholder:text-dc-text-dim focus:placeholder:text-dc-text-muted"
          autoFocus={autoFocus}
          disabled={loading}
          maxLength={39}
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="isle-btn isle-btn-primary px-4 py-3 text-xs rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>
    </form>
  );
}
