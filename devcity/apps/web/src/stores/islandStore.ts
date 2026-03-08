// ─── Island Store ──────────────────────────────────────────────
// Global state for the island world using Zustand.

import { create } from "zustand";

export interface IslandState {
  /** Currently viewed username */
  currentUsername: string | null;
  /** Island radius (computed from contributions) */
  islandRadius: number;
  /** Time of day (0-1) */
  timeOfDay: number;
  /** Whether camera is in orbit or first-person walk mode */
  cameraMode: "orbit" | "walk";
  /** Whether to show performance stats */
  showStats: boolean;
  /** Quality level for adaptive rendering */
  quality: "low" | "medium" | "high";

  // Actions
  setCurrentUsername: (username: string | null) => void;
  setIslandRadius: (radius: number) => void;
  setTimeOfDay: (time: number) => void;
  setCameraMode: (mode: "orbit" | "walk") => void;
  toggleStats: () => void;
  setQuality: (quality: "low" | "medium" | "high") => void;
}

export const useIslandStore = create<IslandState>((set) => ({
  currentUsername: null,
  islandRadius: 20,
  timeOfDay: 0.5,
  cameraMode: "orbit",
  showStats: false,
  quality: "high",

  setCurrentUsername: (username) => set({ currentUsername: username }),
  setIslandRadius: (radius) => set({ islandRadius: radius }),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleStats: () => set((s) => ({ showStats: !s.showStats })),
  setQuality: (quality) => set({ quality }),
}));
