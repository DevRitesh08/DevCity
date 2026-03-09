// src/lib/materials.ts — CANONICAL MATERIAL SYSTEM
// VISUAL_UPGRADE_SPEC v1.0 — 4 Material Types

import { useMemo } from 'react'
import * as THREE from 'three'

// ── MATERIAL 1: TERRAIN ────────────────────────────────────────────────────
// Used by: IslandTerrain, BeachRing, MountainPeak
// Rule: flatShading ALWAYS true
export function useTerrainMaterial(color: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,     // ← THE LOW-POLY MAGIC. NEVER REMOVE.
  }), [color])
}

// ── MATERIAL 2: STRUCTURE ─────────────────────────────────────────────────
// Used by: all repo buildings (cottage, lighthouse, workshop, etc.)
// Rule: flatShading true, NO shadows on non-pinned structures
export function useStructureMaterial(color: string, emissive?: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
    emissive:          emissive ? new THREE.Color(emissive) : undefined,
    emissiveIntensity: emissive ? 1.5 : 0,
  }), [color, emissive])
}

// ── MATERIAL 3: FOLIAGE ───────────────────────────────────────────────────
// Used by: trees, bushes, grass tufts
// Rule: flatShading true, depthWrite false for small props
export function useFoliageMaterial(color: string) {
  return useMemo(() => new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
    side: THREE.DoubleSide,  // trees visible from below
  }), [color])
}

// ── MATERIAL 4: WATER (shader-based, not Lambert) ─────────────────────────
// See OceanSurface.tsx — entirely different system
// NEVER use MeshLambertMaterial or MeshStandardMaterial for water
