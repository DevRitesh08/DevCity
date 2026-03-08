// ─── Game Loop ─────────────────────────────────────────────────
// Bruno Simon-style ordered tick architecture for ISLEFOLIO.
// Systems register at priority levels and run in order every frame.

type TickFn = (delta: number, elapsed: number) => void;

export class GameLoop {
  private ticks: Map<number, Set<TickFn>> = new Map();
  private _elapsed = 0;

  /**
   * Register a function to run at a given priority level.
   * Lower numbers run first.
   *
   * Typical levels:
   *   0  — Time system
   *   3  — Physics
   *   7  — Camera
   *   8  — Day/night, weather
   *   9  — Wind, ocean
   *  10  — Foliage, structures, particles
   * 998  — Render
   */
  register(priority: number, fn: TickFn): () => void {
    if (!this.ticks.has(priority)) {
      this.ticks.set(priority, new Set());
    }
    this.ticks.get(priority)!.add(fn);

    // Return unregister function
    return () => {
      this.ticks.get(priority)?.delete(fn);
    };
  }

  /** Called once per frame (from useFrame) */
  update(delta: number): void {
    this._elapsed += delta;

    // Iterate by priority order
    const sortedKeys = [...this.ticks.keys()].sort((a, b) => a - b);
    for (const key of sortedKeys) {
      const fns = this.ticks.get(key);
      if (fns) {
        for (const fn of fns) {
          fn(delta, this._elapsed);
        }
      }
    }
  }

  get elapsed(): number {
    return this._elapsed;
  }
}

// Singleton instance
export const gameLoop = new GameLoop();

// ─── Day/Night System ──────────────────────────────────────────
// Computes sun position and lighting based on real local time.

export interface DayNightState {
  /** 0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm */
  timeOfDay: number;
  /** Sun elevation angle (radians) */
  sunAngle: number;
  /** Sun color temperature */
  sunColor: [number, number, number];
  /** Ambient intensity multiplier */
  ambientIntensity: number;
  /** Sky color */
  skyColor: [number, number, number];
  /** Is nighttime */
  isNight: boolean;
}

export function computeDayNightState(): DayNightState {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  const timeOfDay = hours / 24;

  // Sun angle: rises at 6am, peaks at noon, sets at 6pm
  const sunAngle = Math.sin((timeOfDay - 0.25) * Math.PI * 2) * (Math.PI / 2);
  const isNight = sunAngle < 0;

  // Sun color shifts from warm orange (dawn/dusk) to warm white (noon)
  const elevation = Math.max(0, sunAngle / (Math.PI / 2));
  const sunColor: [number, number, number] = [
    0.9 + elevation * 0.1,
    0.7 + elevation * 0.3,
    0.4 + elevation * 0.6,
  ];

  // Ambient intensity
  const ambientIntensity = isNight ? 0.15 : 0.3 + elevation * 0.5;

  // Sky color: deep blue at night → light blue at day
  const skyColor: [number, number, number] = isNight
    ? [0.02, 0.02, 0.08]
    : [
        0.4 + elevation * 0.3,
        0.6 + elevation * 0.2,
        0.85 + elevation * 0.1,
      ];

  return {
    timeOfDay,
    sunAngle,
    sunColor,
    ambientIntensity,
    skyColor,
    isNight,
  };
}
