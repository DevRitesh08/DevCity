// ─── VolumetricFog ─────────────────────────────────────────────
// Layered transparent fog planes for cyberpunk atmosphere.
// Purple/blue haze that drifts slowly between buildings.

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VolumetricFogProps {
    /** Number of fog layers */
    layers?: number;
    /** Color of the fog */
    color?: string;
    /** Opacity per layer */
    opacity?: number;
    /** Vertical spread of the fog layers */
    height?: number;
    /** Width/depth of each fog plane */
    size?: number;
}

export default function VolumetricFog({
    layers = 8,
    color = "#1a0a2e",
    opacity = 0.08,
    height = 120,
    size = 3000,
}: VolumetricFogProps) {
    const groupRef = useRef<THREE.Group>(null);

    const layerData = useMemo(() => {
        return Array.from({ length: layers }, (_, i) => ({
            y: (i / layers) * height + 5,
            speed: 0.02 + Math.random() * 0.03,
            offset: Math.random() * Math.PI * 2,
            scale: 0.8 + Math.random() * 0.4,
        }));
    }, [layers, height]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            const data = layerData[i];
            if (!data) return;
            // Gentle drift
            child.position.x = Math.sin(t * data.speed + data.offset) * 30;
            child.position.z = Math.cos(t * data.speed * 0.7 + data.offset) * 20;
        });
    });

    return (
        <group ref={groupRef}>
            {layerData.map((data, i) => (
                <mesh
                    key={i}
                    position={[0, data.y, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[data.scale, data.scale, 1]}
                >
                    <planeGeometry args={[size, size]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={opacity * (1 - i / layers * 0.5)}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                        blending={THREE.NormalBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}
