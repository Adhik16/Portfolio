"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===========================================================
   SATELLITE — AI Space Companion orbiting the globe
   =========================================================== */

const R = 1.35; // globe radius (same as network-globe.tsx)

/* ---- Orbital motion independent from globe rotation ------ */
function useOrbit(speed: number, radius: number, tiltX: number, tiltZ: number) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    phase.current += delta * speed;
    const a = phase.current;
    ref.current.position.x = Math.cos(a) * radius;
    ref.current.position.z = Math.sin(a) * radius;
    ref.current.rotation.x = tiltX;
    ref.current.rotation.z = tiltZ;
  });

  return ref;
}

/* ---- Blinking Status Light ------------------------------- */
function StatusLight({ color, position, size = 0.03, blinkSpeed = 2.5 }: {
  color: string; position: [number, number, number]; size?: number; blinkSpeed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(Math.random() * Math.PI);

  useFrame((_, delta) => {
    if (!ref.current) return;
    phase.current += delta * blinkSpeed;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    const val = 0.4 + Math.abs(Math.sin(phase.current)) * 0.6;
    m.opacity = val;
    m.emissiveIntensity = 1.5 + Math.abs(Math.sin(phase.current)) * 3.5;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color} emissive={color}
        emissiveIntensity={3} roughness={0.1}
        transparent opacity={0.9} depthWrite={false}
      />
    </mesh>
  );
}

/* ---- Antenna with glowing tip ---------------------------- */
function Antenna() {
  const tipRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!tipRef.current) return;
    const m = tipRef.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 2.5 + Math.sin(Date.now() * 0.004) * 1.5;
  });

  return (
    <group position={[0, 0.22, 0]}>
      {/* Antenna stalk */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.14, 8]} />
        <meshStandardMaterial color="#8b8ba0" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Glowing antenna tip */}
      <mesh ref={tipRef} position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial
          color="#22d3ee" emissive="#22d3ee"
          emissiveIntensity={3} roughness={0.05}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---- Solar Panel Wing ------------------------------------ */
function SolarPanel({ side }: { side: 1 | -1 }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!glowRef.current) return;
    const m = glowRef.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 0.6 + Math.sin(Date.now() * 0.003 + side) * 0.3;
  });

  return (
    <group position={[side * 0.185, 0.02, 0]}>
      {/* Panel arm */}
      <mesh position={[side * 0.06, 0, 0]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color="#6b6b8a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Main panel body */}
      <mesh position={[side * 0.16, 0, 0]}>
        <boxGeometry args={[0.12, 0.16, 0.015]} />
        <meshStandardMaterial
          color="#1e1e3a"
          metalness={0.5} roughness={0.5}
          emissive="#a855f7"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Panel glow edge */}
      <mesh ref={glowRef} position={[side * 0.16, 0, 0]}>
        <boxGeometry args={[0.13, 0.17, 0.02]} />
        <meshStandardMaterial
          color="#a855f7" emissive="#a855f7"
          emissiveIntensity={0.5} roughness={0.3}
          transparent opacity={0.3} depthWrite={false}
        />
      </mesh>
      {/* Panel grid lines */}
      <mesh position={[side * 0.16, 0.05, 0.012]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.10, 0.12]} />
        <meshStandardMaterial
          color="#2d2d5a"
          emissive="#7c3aed"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ---- Thruster with particle burst ------------------------ */
function Thruster() {
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particleData = useMemo(() => {
    const count = 20;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.04;
      pos[i * 3 + 1] = -0.02 - Math.random() * 0.12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!glowRef.current) return;
    const m = glowRef.current.material as THREE.MeshStandardMaterial;
    const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.3;
    m.emissiveIntensity = 2.0 * pulse;

    if (particlesRef.current) {
      const pm = particlesRef.current.material as THREE.PointsMaterial;
      pm.opacity = 0.4 + Math.sin(Date.now() * 0.006) * 0.3;
    }
  });

  return (
    <group position={[0, -0.18, 0]}>
      {/* Thruster nozzle */}
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 8]} />
        <meshStandardMaterial color="#4a4a6a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Thruster glow */}
      <mesh ref={glowRef} position={[0, -0.07, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#22d3ee" emissive="#22d3ee"
          emissiveIntensity={2} roughness={0.1}
          transparent opacity={0.7} depthWrite={false}
        />
      </mesh>
      {/* Thruster particles */}
      <points ref={particlesRef} position={[0, -0.04, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData, 3]} count={20} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.012} color="#a5f3fc" transparent opacity={0.5} depthWrite={false} />
      </points>
    </group>
  );
}

/* ---- Core Body — rounded capsule shape ------------------- */
function CoreBody() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003; // very slow self-rotation
  });

  return (
    <group>
      {/* Main body - rounded capsule */}
      <mesh ref={ref}>
        <capsuleGeometry args={[0.1, 0.06, 8, 16]} />
        <meshStandardMaterial
          color="#2d1b4e"
          metalness={0.4}
          roughness={0.25}
          emissive="#1a0a35"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Body accent ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.105, 0.012, 8, 24]} />
        <meshStandardMaterial
          color="#c084fc" emissive="#a855f7"
          emissiveIntensity={1.0} roughness={0.15}
        />
      </mesh>

      {/* Front "eye" / lens */}
      <mesh position={[0, 0.03, 0.09]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.055, 16]} />
        <meshStandardMaterial
          color="#e9d5ff" emissive="#c084fc"
          emissiveIntensity={0.8} roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner iris */}
      <mesh position={[0, 0.03, 0.095]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial
          color="#22d3ee" emissive="#22d3ee"
          emissiveIntensity={2.0} roughness={0.05}
          side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>

      {/* Status lights on body */}
      <StatusLight color="#22d3ee" position={[0.06, 0.04, 0.07]} size={0.02} blinkSpeed={2.8} />
      <StatusLight color="#a855f7" position={[-0.05, -0.02, 0.07]} size={0.018} blinkSpeed={3.2} />
      <StatusLight color="#c084fc" position={[0.02, -0.05, 0.07]} size={0.016} blinkSpeed={2.2} />
    </group>
  );
}

/* ---- Trail Ring — faint orbital trail -------------------- */
function OrbitTrail({ orbitRadius }: { orbitRadius: number }) {
  return (
    <mesh rotation={[Math.PI / 2.8, 0, 0]}>
      <torusGeometry args={[orbitRadius, 0.006, 8, 120]} />
      <meshBasicMaterial color="#7c3aed" transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

/* ===========================================================
   SATELLITE COMPONENT
   =========================================================== */

export default function Satellite() {
  const orbitRadius = R * 1.55;
  const orbitRef = useOrbit(0.35, orbitRadius, Math.PI / 2.8, 0.15);

  return (
    <group>
      {/* Faint orbital trail ring */}
      <OrbitTrail orbitRadius={orbitRadius} />

      {/* The satellite itself */}
      <group ref={orbitRef}>
        <CoreBody />
        <SolarPanel side={1} />
        <SolarPanel side={-1} />
        <Antenna />
        <Thruster />
      </group>
    </group>
  );
}
