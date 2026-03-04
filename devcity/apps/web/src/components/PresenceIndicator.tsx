// ─── PresenceIndicator ─────────────────────────────────────────
// Shows live viewer count on a dev profile via polling.

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PresenceIndicatorProps {
  login: string;
}

export default function PresenceIndicator({ login }: PresenceIndicatorProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const viewerIdRef = useRef<string | null>(null);

  const heartbeat = useCallback(async () => {
    try {
      const res = await fetch(`/api/dev/${login}/presence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId: viewerIdRef.current }),
      });
      if (res.ok) {
        const data = await res.json();
        setViewerCount(data.viewers);
        if (!viewerIdRef.current && data.viewerId) {
          viewerIdRef.current = data.viewerId;
        }
      }
    } catch {
      // Silently fail on network errors
    }
  }, [login]);

  useEffect(() => {
    // Initial heartbeat
    heartbeat();

    // Heartbeat every 15 seconds
    const interval = setInterval(heartbeat, 15_000);

    return () => {
      clearInterval(interval);
    };
  }, [heartbeat]);

  if (viewerCount <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span>
        {viewerCount} {viewerCount === 1 ? "viewer" : "viewers"} now
      </span>
    </div>
  );
}
