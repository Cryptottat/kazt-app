"use client";

import { useRef, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

/* ── Low-Poly Anvil with squash & stretch ── */
function LowPolyAnvil({ onHit }: { onHit?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));
  const isHit = useRef(false);
  const hitTime = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth mouse follow rotation
    const pointer = state.pointer;
    mouseRef.current.x += (pointer.x * 0.3 - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (pointer.y * 0.2 - mouseRef.current.y) * 0.05;
    groupRef.current.rotation.y = mouseRef.current.x;
    groupRef.current.rotation.x = -mouseRef.current.y * 0.3;

    // Squash & stretch spring
    if (isHit.current) {
      hitTime.current += delta;
      if (hitTime.current < 0.08) {
        targetScale.current.set(1.15, 0.7, 1.15);
      } else if (hitTime.current < 0.2) {
        targetScale.current.set(0.9, 1.2, 0.9);
      } else if (hitTime.current < 0.4) {
        targetScale.current.set(1.03, 0.97, 1.03);
      } else {
        targetScale.current.set(1, 1, 1);
        isHit.current = false;
      }
    }

    scaleRef.current.lerp(targetScale.current, 0.15);
    groupRef.current.scale.copy(scaleRef.current);
  });

  const handleClick = useCallback(() => {
    isHit.current = true;
    hitTime.current = 0;
    onHit?.();
  }, [onHit]);

  return (
    <group ref={groupRef} onClick={handleClick} position={[0, 0, 0]}>
      {/* ── Wood stump base ── */}
      <mesh position={[0, -1.0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.8, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} metalness={0.05} flatShading />
      </mesh>
      {/* Stump top ring */}
      <mesh position={[0, -0.58, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.55, 0.05, 8]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} metalness={0.1} flatShading />
      </mesh>

      {/* ── Anvil base block ── */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[1.0, 0.35, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.75} flatShading />
      </mesh>

      {/* ── Anvil waist (narrower middle) ── */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.15, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.8} flatShading />
      </mesh>

      {/* ── Anvil body — main working block ── */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.5, 0.35, 0.55]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.55} metalness={0.9} flatShading />
      </mesh>

      {/* ── Anvil face — polished top surface ── */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.35, 0.08, 0.5]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.95} flatShading />
      </mesh>

      {/* ── Anvil horn — pointy end ── */}
      <mesh position={[0.95, 0.15, 0]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.14, 0.65, 5]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.9} flatShading />
      </mesh>

      {/* ── Anvil heel — flat back end ── */}
      <mesh position={[-0.8, 0.15, 0]} castShadow>
        <boxGeometry args={[0.15, 0.25, 0.35]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.85} flatShading />
      </mesh>

      {/* ── Hardy hole (square hole on top) ── */}
      <mesh position={[0.3, 0.37, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>

      {/* ── Pritchel hole (round hole) ── */}
      <mesh position={[0.5, 0.37, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>

      {/* ── Glowing hot metal piece on anvil ── */}
      <mesh position={[-0.15, 0.42, 0]}>
        <boxGeometry args={[0.35, 0.06, 0.14]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F97316"
          emissiveIntensity={5}
          roughness={0.2}
          metalness={0.8}
          flatShading
        />
      </mesh>

      {/* Hot spot glow on anvil surface */}
      <mesh position={[-0.15, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={2}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Hammer leaning against stump ── */}
      <group position={[0.75, -0.55, 0.35]} rotation={[0.15, -0.4, 0.7]}>
        {/* Handle */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.035, 0.6, 6]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.9} metalness={0.1} flatShading />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.22, 0.13, 0.12]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.9} flatShading />
        </mesh>
      </group>

      {/* ── Tongs on the ground ── */}
      <group position={[-0.7, -1.25, 0.3]} rotation={[0, 0.6, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 4]} />
          <meshStandardMaterial color="#555" roughness={0.6} metalness={0.8} flatShading />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 4]} />
          <meshStandardMaterial color="#555" roughness={0.6} metalness={0.8} flatShading />
        </mesh>
      </group>

      {/* ── Point light from hot metal ── */}
      <pointLight position={[-0.15, 0.7, 0.3]} color="#F97316" intensity={3} distance={4} decay={2} />
      <pointLight position={[-0.15, 0.5, -0.3]} color="#F59E0B" intensity={1.5} distance={3} decay={2} />
    </group>
  );
}

/* ── Floating ember particles ── */
function Embers() {
  const count = 25;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const data = useRef(
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 3,
      y: -0.5 + Math.random() * 2,
      z: (Math.random() - 0.5) * 2,
      speed: 0.2 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
    }))
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    data.current.forEach((d, i) => {
      d.y += d.speed * delta;
      d.wobble += delta * 2;
      if (d.y > 2.5) {
        d.y = -0.5;
        d.x = (Math.random() - 0.5) * 3;
        d.z = (Math.random() - 0.5) * 2;
      }
      dummy.current.position.set(
        d.x + Math.sin(d.wobble) * 0.08,
        d.y,
        d.z + Math.cos(d.wobble) * 0.08
      );
      dummy.current.scale.setScalar(0.015 + Math.random() * 0.015);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#F97316" emissive="#F59E0B" emissiveIntensity={3} />
    </instancedMesh>
  );
}

/* ── Scene content ── */
function SceneContent({ onAnvilHit }: { onAnvilHit?: () => void }) {
  return (
    <>
      {/* Key light — warm, from top-front-right, strong enough to reveal detail */}
      <directionalLight position={[2, 5, 3]} intensity={1.2} color="#F59E0B" castShadow />

      {/* Fill — cooler, from left side */}
      <directionalLight position={[-3, 3, 1]} intensity={0.3} color="#6a8aaa" />

      {/* Rim light — subtle back edge highlight */}
      <directionalLight position={[0, 3, -3]} intensity={0.4} color="#F97316" />

      {/* Soft ambient so nothing is pure black */}
      <ambientLight intensity={0.15} color="#1a1020" />

      <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.1}>
        <LowPolyAnvil onHit={onAnvilHit} />
      </Float>

      <Embers />

      {/* Ground plane — wide enough so edges never show */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0C0E12" roughness={1} metalness={0} />
      </mesh>

      {/* Fog plane — gradient fade at distance to hide far ground edge */}
      <fog attach="fog" args={["#0C0E12", 5, 18]} />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
    </>
  );
}

/* ── Exported component ── */
export default function AnvilScene({ onAnvilHit }: { onAnvilHit?: () => void }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{
          position: [0.3, 1.2, 4.0],  // slightly right, lower eye level, looking down at anvil
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 1.5]}
        shadows
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent onAnvilHit={onAnvilHit} />
        </Suspense>
      </Canvas>
    </div>
  );
}
