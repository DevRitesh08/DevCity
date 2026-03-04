// ─── CityScene ─────────────────────────────────────────────────
// Manages the placement and rendering of all buildings in the city.
// Handles instanced rendering for performance at scale.

"use client";

import { useMemo } from "react";
import Building from "./Building";
import type { CityBuilding } from "@devcity/types";

interface CitySceneProps {
  buildings: CityBuilding[];
  theme?: string;
  onBuildingClick?: (login: string) => void;
}

export default function CityScene({
  buildings,
  theme = "midnight",
  onBuildingClick,
}: CitySceneProps) {
  // Memoize building positions to avoid recalculation
  const positionedBuildings = useMemo(
    () =>
      buildings.map((b) => ({
        ...b,
        // Each building has a pre-computed [x, z] position
        x: b.position[0],
        z: b.position[1],
      })),
    [buildings]
  );

  return (
    <group>
      {positionedBuildings.map((building) => (
        <Building
          key={building.login}
          building={building}
          position={[building.x, 0, building.z]}
          theme={theme}
          onClick={() => onBuildingClick?.(building.login)}
        />
      ))}
    </group>
  );
}
