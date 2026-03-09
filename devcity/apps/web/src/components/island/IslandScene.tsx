// ─── Island Scene ──────────────────────────────────────────────
// VISUAL_UPGRADE_SPEC v1.0 — CANONICAL SCENE COMPOSITION
// Renders components in the correct visual layering order.

"use client";

import IslandTerrain from "./IslandTerrain";
import OceanSurface from "./OceanSurface";
import IslandStructures, { type RepoStructure } from "./IslandStructures";
import IslandFoliage from "./IslandFoliage";
import AtmosphereLayer from "./AtmosphereLayer";
import { FireflyParticles, ShoreFoam } from "./AmbientLife";

interface IslandSceneProps {
  username: string;
  repos: RepoStructure[];
  islandRadius: number;
  primaryLanguage: string;
  onStructureClick?: (repo: RepoStructure) => void;
}

export default function IslandScene({
  username,
  repos,
  islandRadius,
  primaryLanguage,
  onStructureClick,
}: IslandSceneProps) {
  return (
    <>
      {/* 1. ATMOSPHERE — must be first, sets sky + fog */}
      <AtmosphereLayer />

      {/* 2. OCEAN — rendered BEFORE island (depth sorting) */}
      <OceanSurface size={400} />

      {/* 3. SHORE FOAM — at waterline, above ocean */}
      <ShoreFoam radius={islandRadius} />

      {/* 4. ISLAND TERRAIN — the main landmass */}
      <IslandTerrain
        username={username}
        radius={islandRadius}
        primaryLanguage={primaryLanguage}
      />

      {/* 5. FOLIAGE — sits on terrain */}
      <IslandFoliage
        username={username}
        radius={islandRadius}
        biome={primaryLanguage === "Swift" ? "coastal" : "tropical"}
      />

      {/* 6. STRUCTURES — repo buildings */}
      <IslandStructures
        repos={repos}
        islandRadius={islandRadius}
        username={username}
        onStructureClick={onStructureClick}
      />

      {/* 7. PARTICLES — above everything */}
      <FireflyParticles radius={islandRadius} />
    </>
  );
}
