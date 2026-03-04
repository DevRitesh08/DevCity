// ─── SearchBar ─────────────────────────────────────────────────
// Client-side search input that navigates to /dev/[username].
// Used on the landing page and in the top nav.

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
      <div className="flex items-center border-[3px] border-border bg-bg-raised">
        <span className="px-3 text-sm text-muted">@</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="flex-1 bg-transparent px-2 py-3 text-cream outline-none placeholder:text-dim"
          autoFocus={autoFocus}
          disabled={loading}
          maxLength={39}
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="btn-press bg-accent px-4 py-3 text-sm font-bold text-bg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "SEARCH"}
        </button>
      </div>
    </form>
  );
}
