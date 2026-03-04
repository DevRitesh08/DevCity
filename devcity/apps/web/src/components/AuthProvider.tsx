// ─── Auth Context ──────────────────────────────────────────────
// Client-side auth state provider.
// Fetches session from /api/auth/session on mount.

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ─────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

interface AuthContextValue {
  /** Current user or null if not authenticated */
  user: AuthUser | null;
  /** Whether the initial session check is in progress */
  loading: boolean;
  /** Trigger login flow */
  login: () => void;
  /** Trigger logout flow */
  logout: () => Promise<void>;
  /** Force re-fetch of session */
  refresh: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refresh: async () => {},
});

// ─── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = useCallback(() => {
    // Redirect to the login API route which handles the GitHub OAuth redirect
    window.location.href = "/api/auth/login";
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
