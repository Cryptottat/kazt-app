"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 400;

interface ParticleData {
  positions: Float32Array;
  velocities: Float32Array;
  lifetimes: Float32Array;
  maxLifetimes: Float32Array;
  sizes: Float32Array;
}

function initParticleData(): ParticleData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const lifetimes = new Float32Array(PARTICLE_COUNT);
  const maxLifetimes = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Spawn near the furnace center
    positions[i3] = (Math.random() - 0.5) * 1.5;
    positions[i3 + 1] = Math.random() * 0.5 - 0.5;
    positions[i3 + 2] = (Math.random() - 0.5) * 1.5;

    // Upward velocity with slight drift
    velocities[i3] = (Math.random() - 0.5) * 0.3;
    velocities[i3 + 1] = 0.5 + Math.random() * 1.5;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;

    maxLifetimes[i] = 1.5 + Math.random() * 2.5;
    lifetimes[i] = Math.random() * maxLifetimes[i];
    sizes[i] = 0.02 + Math.random() * 0.04;
  }

  return { positions, velocities, lifetimes, maxLifetimes, sizes };
}

export default function EmberParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleData = useMemo(() => initParticleData(), []);
  const colorArray = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Orange-gold spectrum
      const t = Math.random();
      colors[i3] = 0.95 + t * 0.05; // R
      colors[i3 + 1] = 0.35 + t * 0.3; // G
      colors[i3 + 2] = 0.05 + t * 0.1; // B
    }
    return colors;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const { positions, velocities, lifetimes, maxLifetimes, sizes } =
      particleData;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      lifetimes[i] += dt;

      if (lifetimes[i] >= maxLifetimes[i]) {
        // Respawn
        positions[i3] = (Math.random() - 0.5) * 1.5;
        positions[i3 + 1] = Math.random() * 0.5 - 0.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 1.5;
        velocities[i3] = (Math.random() - 0.5) * 0.3;
        velocities[i3 + 1] = 0.5 + Math.random() * 1.5;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
        maxLifetimes[i] = 1.5 + Math.random() * 2.5;
        lifetimes[i] = 0;
      }

      // Update positions
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;

      // Add slight wind/turbulence
      positions[i3] += Math.sin(lifetimes[i] * 3 + i) * 0.002;

      // Fade out based on lifetime
      const lifeRatio = lifetimes[i] / maxLifetimes[i];
      const fadeScale = lifeRatio < 0.1 ? lifeRatio * 10 : 1 - lifeRatio;
      const scale = sizes[i] * Math.max(0, fadeScale);

      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#F97316"
        transparent
        opacity={0.9}
        toneMapped={false}
      />
      <instancedBufferAttribute
        attach="instanceColor"
        args={[colorArray, 3]}
      />
    </instancedMesh>
  );
}
