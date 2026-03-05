// ─── CityScene ─────────────────────────────────────────────────
// Manages the placement and rendering of all buildings in the city.
// Groups buildings by district for future district-specific styling.

"use client";

import { useMemo } from "react";
import Building from "./Building";
import type { CityBuilding } from "@devcity/types";

interface CitySceneProps {
  buildings: CityBuilding[];
  onBuildingClick?: (login: string) => void;
  healthScores?: Record<string, number>;
}

export default function CityScene({
  buildings,
  onBuildingClick,
  healthScores,
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

  // Group by district for future district-specific effects
  const districts = useMemo(() => {
    const groups: Record<string, typeof positionedBuildings> = {};
    for (const b of positionedBuildings) {
      const district = b.district || "downtown-core";
      if (!groups[district]) groups[district] = [];
      groups[district].push(b);
    }
    return groups;
  }, [positionedBuildings]);

  return (
    <group>
      {/* Render all buildings, grouped by district */}
      {Object.entries(districts).map(([district, districtBuildings]) => (
        <group key={district} name={`district-${district}`}>
          {districtBuildings.map((building) => (
            <Building
              key={building.login}
              building={building}
              position={[building.x, 0, building.z]}
              theme="cyberpunk"
              onClick={() => onBuildingClick?.(building.login)}
              healthScore={healthScores?.[building.login]}
            />
          ))}
        </group>
      ))}
    </group>
  );
}
