// ─── Presence Engine ───────────────────────────────────────────
// Tracks which users are currently viewing which developer profiles.
// Uses in-memory store with TTL-based cleanup.

export interface PresenceEntry {
  /** Viewer identifier — session login or anonymous fingerprint */
  viewerId: string;
  /** Which dev profile they're viewing */
  viewingLogin: string;
  /** When they last pinged */
  lastSeen: number;
}

// Presence entries keyed by viewerId
const presenceMap = new Map<string, PresenceEntry>();

// How long before a viewer is considered gone (30 seconds)
const PRESENCE_TTL = 30_000;

/**
 * Heartbeat — mark a viewer as present on a profile.
 */
export function setPresence(viewerId: string, viewingLogin: string): void {
  presenceMap.set(viewerId, {
    viewerId,
    viewingLogin,
    lastSeen: Date.now(),
  });
}

/**
 * Remove a viewer from presence tracking.
 */
export function removePresence(viewerId: string): void {
  presenceMap.delete(viewerId);
}

/**
 * Get the current viewers for a specific developer profile.
 * Automatically cleans up stale entries.
 */
export function getViewers(login: string): string[] {
  cleanup();
  const viewers: string[] = [];
  for (const entry of presenceMap.values()) {
    if (entry.viewingLogin === login) {
      viewers.push(entry.viewerId);
    }
  }
  return viewers;
}

/**
 * Get viewer count for a specific developer profile.
 */
export function getViewerCount(login: string): number {
  cleanup();
  let count = 0;
  for (const entry of presenceMap.values()) {
    if (entry.viewingLogin === login) count++;
  }
  return count;
}

/**
 * Get total active viewers across all profiles.
 */
export function getTotalActiveViewers(): number {
  cleanup();
  return presenceMap.size;
}

// ─── Cleanup ───────────────────────────────────────────────────

function cleanup(): void {
  const now = Date.now();
  for (const [key, entry] of presenceMap) {
    if (now - entry.lastSeen > PRESENCE_TTL) {
      presenceMap.delete(key);
    }
  }
}
