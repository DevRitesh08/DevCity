// ─── CyberpunkSkybox ──────────────────────────────────────────
// Twilight gradient sky with digital aurora borealis effect.
// Permanently set to that "perpetual twilight" cyberpunk mood.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CyberpunkSkybox() {
    const auroraRef = useRef<THREE.Points>(null);

    // Aurora particles — high altitude glowing streaks
    const auroraGeometry = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const cyan = new THREE.Color("#00FFFF");
        const magenta = new THREE.Color("#FF00FF");
        const blue = new THREE.Color("#4400FF");

        for (let i = 0; i < count; i++) {
            // Spread in a band across the sky
            positions[i * 3] = (Math.random() - 0.5) * 4000;
            positions[i * 3 + 1] = 1500 + Math.random() * 500;
            positions[i * 3 + 2] = -1500 + (Math.random() - 0.5) * 1000;

            // Random color from cyan/magenta/blue palette
            const t = Math.random();
            const color = t < 0.33 ? cyan : t < 0.66 ? magenta : blue;
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return geo;
    }, []);

    useFrame(({ clock }) => {
        if (!auroraRef.current) return;
        // Slow wave motion
        const positions = auroraRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = positions.array as Float32Array;
        const t = clock.elapsedTime * 0.1;

        for (let i = 0; i < arr.length / 3; i++) {
            arr[i * 3 + 1] =
                1500 +
                Math.sin(t + arr[i * 3] * 0.002) * 80 +
                Math.cos(t * 0.7 + arr[i * 3 + 2] * 0.003) * 40;
        }
        positions.needsUpdate = true;
    });

    return (
        <group>
            {/* Skybox sphere with twilight gradient */}
            <mesh>
                <sphereGeometry args={[4500, 32, 16]} />
                <meshBasicMaterial side={THREE.BackSide}>
                    <canvasTexture
                        attach="map"
                        image={createSkyGradient()}
                    />
                </meshBasicMaterial>
            </mesh>

            {/* Aurora borealis particles */}
            <points ref={auroraRef} geometry={auroraGeometry}>
                <pointsMaterial
                    size={8}
                    vertexColors
                    transparent
                    opacity={0.3}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

// Generate a twilight sky gradient on a canvas
function createSkyGradient(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Top of sky → horizon → bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#020010");     // Deep space
    gradient.addColorStop(0.2, "#080428");   // Deep indigo
    gradient.addColorStop(0.4, "#150a3e");   // Purple
    gradient.addColorStop(0.6, "#1a0a35");   // Dark purple
    gradient.addColorStop(0.8, "#0d0820");   // Deep navy
    gradient.addColorStop(1.0, "#060010");   // Near-black

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 512);

    return canvas;
}
