"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import EmberParticles from "./EmberParticles";

/* ─── Furnace Body ─── */
function FurnaceCore() {
  const groupRef = useRef<THREE.Group>(null);
  const moltenRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Pulsing glow
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(t * 2) * 0.8;
    }

    // Molten metal animation -- subtle undulation
    if (moltenRef.current) {
      const positions = moltenRef.current.geometry.attributes.position;
      const arr = positions.array as Float32Array;
      for (let i = 0; i < positions.count; i++) {
        const x = arr[i * 3];
        const z = arr[i * 3 + 2];
        arr[i * 3 + 1] =
          Math.sin(x * 3 + t * 2) * 0.04 +
          Math.cos(z * 3 + t * 1.5) * 0.03 -
          0.65;
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow light */}
      <pointLight
        ref={glowRef}
        position={[0, 0.2, 0]}
        color="#F97316"
        intensity={3}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[0, -0.3, 0]}
        color="#F59E0B"
        intensity={2}
        distance={5}
        decay={2}
      />

      {/* Furnace outer shell -- dark iron */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.4, 2.2, 8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.85}
          metalness={0.6}
        />
      </mesh>

      {/* Furnace inner rim -- emissive */}
      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[1.15, 0.08, 8, 8]} />
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Molten surface inside */}
      <mesh ref={moltenRef} position={[0, 0, 0]}>
        <planeGeometry args={[2, 2, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F97316"
          emissiveIntensity={3}
          roughness={0.2}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Furnace legs/supports */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.3,
              -0.9,
              Math.sin(angle) * 1.3,
            ]}
          >
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.9}
              metalness={0.5}
            />
          </mesh>
        );
      })}

      {/* Decorative rivets on furnace */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`rivet-${i}`}
            position={[
              Math.cos(angle) * 1.35,
              0.6,
              Math.sin(angle) * 1.35,
            ]}
          >
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial
              color="#555"
              roughness={0.5}
              metalness={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Mold (Georpujip) beneath furnace ─── */
function CastingMold() {
  const moldRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Mold glows periodically as if receiving molten metal
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 1.2) * 0.5;
    }
  });

  return (
    <group position={[0, -1.8, 0]}>
      {/* Mold base */}
      <mesh ref={moldRef} castShadow>
        <boxGeometry args={[1.8, 0.3, 1.0]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.9}
          metalness={0.4}
        />
      </mesh>

      {/* Mold cavity -- glowing channel */}
      <mesh ref={glowRef} position={[0, 0.16, 0]}>
        <boxGeometry args={[1.4, 0.05, 0.6]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F97316"
          emissiveIntensity={1}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Mold channel lines */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.17, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.5]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F59E0B"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Molten Stream from furnace to mold ─── */
function MoltenStream() {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(timeRef.current * 4) * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.95, 0]}>
      <cylinderGeometry args={[0.06, 0.04, 1.2, 8]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F97316"
        emissiveIntensity={2.5}
        roughness={0.1}
        metalness={0.95}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ─── Anvil to the side ─── */
function Anvil() {
  return (
    <group position={[2.5, -1.6, -0.5]} rotation={[0, -0.4, 0]}>
      {/* Anvil base */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial
          color="#1f1f1f"
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>
      {/* Anvil top */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.0, 0.2, 0.4]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.6}
          metalness={0.9}
        />
      </mesh>
      {/* Anvil horn */}
      <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.12, 0.4, 6]} />
        <meshStandardMaterial
          color="#333"
          roughness={0.5}
          metalness={0.9}
          rotation-z={Math.PI / 2}
        />
      </mesh>
    </group>
  );
}

/* ─── Camera rig with scroll + mouse tracking ─── */
function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0, z: 0 });

  // Mouse tracking
  useMemo(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame(() => {
    const scroll = scrollRef.current;
    const mouse = mouseRef.current;

    // Base orbit from scroll
    const angle = scroll * Math.PI * 0.5; // quarter orbit over full scroll
    const radius = 5.5;
    const baseX = Math.sin(angle) * radius;
    const baseZ = Math.cos(angle) * radius;
    const baseY = 1.5 - scroll * 1.5;

    // Mouse offset (subtle parallax)
    const mouseOffX = mouse.x * 0.3;
    const mouseOffY = -mouse.y * 0.2;

    // Lerp camera
    targetRef.current.x = baseX + mouseOffX;
    targetRef.current.y = baseY + mouseOffY;
    targetRef.current.z = baseZ;

    camera.position.x += (targetRef.current.x - camera.position.x) * 0.03;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.03;
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.03;

    camera.lookAt(0, -0.3, 0);
  });

  return null;
}

/* ─── Ambient environment ─── */
function Environment() {
  return (
    <>
      {/* Dim ambient for dark forge feel */}
      <ambientLight intensity={0.08} color="#1a1020" />

      {/* Warm rim light from above-behind */}
      <directionalLight
        position={[3, 5, -2]}
        intensity={0.3}
        color="#F59E0B"
      />

      {/* Cool fill from the side */}
      <directionalLight
        position={[-4, 2, 3]}
        intensity={0.1}
        color="#4a6080"
      />

      {/* Ground fog plane */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0C0E12"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </>
  );
}

/* ─── Post Processing ─── */
function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette darkness={0.7} offset={0.3} />
      <ChromaticAberration
        radialModulation={false}
        modulationOffset={0}
        offset={new THREE.Vector2(0.0008, 0.0008)}
      />
    </EffectComposer>
  );
}

/* ─── Main Scene ─── */
function SceneContent() {
  return (
    <>
      <Environment />
      <CameraRig />

      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
        <FurnaceCore />
      </Float>
      <MoltenStream />
      <CastingMold />
      <Anvil />
      <EmberParticles />

      <PostEffects />
    </>
  );
}

export default function ForgeScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5.5], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
