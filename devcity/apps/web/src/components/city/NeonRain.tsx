// ─── NeonRain ──────────────────────────────────────────────────
// GPU particle rain system for the cyberpunk city.
// Thin vertical streaks catching neon reflections.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NeonRainProps {
    /** Number of rain particles */
    count?: number;
    /** Spread area (width/depth) */
    area?: number;
    /** Height range */
    height?: number;
    /** Fall speed multiplier */
    speed?: number;
    /** Rain color */
    color?: string;
    /** Opacity */
    opacity?: number;
}

export default function NeonRain({
    count = 8000,
    area = 2000,
    height = 800,
    speed = 3.0,
    color = "#88ccff",
    opacity = 0.15,
}: NeonRainProps) {
    const ref = useRef<THREE.Points>(null);

    // Initial positions + velocities
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread across the city area
            pos[i * 3] = (Math.random() - 0.5) * area;
            pos[i * 3 + 1] = Math.random() * height;
            pos[i * 3 + 2] = (Math.random() - 0.5) * area;

            // Varying fall speeds for depth illusion
            vel[i] = 1.0 + Math.random() * 2.0;
        }

        return { positions: pos, velocities: vel };
    }, [count, area, height]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    useFrame((_, delta) => {
        if (!ref.current) return;

        const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Fall downward
            arr[i * 3 + 1] -= velocities[i] * speed * delta * 60;

            // Reset when below ground
            if (arr[i * 3 + 1] < -5) {
                arr[i * 3 + 1] = height + Math.random() * 50;
                arr[i * 3] = (Math.random() - 0.5) * area;
                arr[i * 3 + 2] = (Math.random() - 0.5) * area;
            }
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial
                size={1.5}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
