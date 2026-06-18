"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===========================================================
   HAND MODELS - Procedural hand system for the portfolio
   =========================================================== */

export const R = 1.35;

/* ---- Material Palette ----------------------------------- */
export const HAND_PALETTE = {
  body: "#4a2d7e",
  bodyEmissive: "#2a1060",
  joint: "#c084fc",
  tip: "#e9d5ff",
  cyberPrimary: "#3b2f8a",
  cyberJoint: "#22d3ee",
  cyberTip: "#a5f3fc",
  energyColor: "#a855f7",
  energyEmissive: "#c084fc",
} as const;

/* ---- Types ---------------------------------------------- */
export type HandPose = "cup" | "open" | "claw" | "fist" | "point" | "grab";
export type HandStyle = "organic" | "cybernetic" | "energy" | "skeletal";
export type HandContext = "hero" | "threat" | "defense" | "command" | "support";

export interface PerFingerConfig {
  lengthScale: number;
  thicknessScale: number;
  /** Z-axis bend (forward curl) */
  curl: number;
  /** X-axis bend toward palm center (sphere wrap) */
  curlInward: number;
  phaseOffset: number;
  splay: [number, number, number];
}

export interface HandVariant {
  id: string;
  name: string;
  pose: HandPose;
  style: HandStyle;
  context: HandContext;
  fingers: [PerFingerConfig, PerFingerConfig, PerFingerConfig, PerFingerConfig];
  thumb: PerFingerConfig;
  palmSize: [number, number, number];
  material?: Partial<{
    body: string;
    bodyEmissive: string;
    joint: string;
    tip: string;
    roughness: number;
    metalness: number;
    emissiveIntensity: number;
    wireframe: boolean;
    opacity: number;
    transparent: boolean;
  }>;
  animation: {
    floatAmplitude: number;
    floatSpeed: number;
    fingerWiggle: number;
    idleRotation: number;
    pulseIntensity: number;
    tapFrequency: number;
    reduceMotion: boolean;
  };
  positionOffset?: [number, number, number];
  rotationOverride?: [number, number, number];
}

/* ---- Helpers -------------------------------------------- */
function defaultFinger(o: Partial<PerFingerConfig> = {}): PerFingerConfig {
  return { lengthScale: 1, thicknessScale: 1, curl: 0, curlInward: 0, phaseOffset: 0, splay: [0,0,0], ...o };
}

/* ---- Shared Material Interface -------------------------- */
interface MatOverride {
  body?: string; bodyEmissive?: string; joint?: string; tip?: string;
  roughness?: number; metalness?: number; emissiveIntensity?: number;
  wireframe?: boolean; opacity?: number; transparent?: boolean;
}

/* ===========================================================
   PRIMITIVES
   =========================================================== */

/** A single bone segment (capsule) */
function Bone({ y, rad, len, mat }: { y: number; rad: number; len: number; mat?: MatOverride }) {
  const cl = len - rad * 2;
  if (cl <= 0) return null;
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <capsuleGeometry args={[rad, cl, 4, 8]} />
        <meshStandardMaterial
          color={mat?.body ?? HAND_PALETTE.body}
          emissive={mat?.bodyEmissive ?? HAND_PALETTE.bodyEmissive}
          emissiveIntensity={mat?.emissiveIntensity ?? 1.0}
          roughness={mat?.roughness ?? 0.2}
          metalness={mat?.metalness ?? 0.2}
          wireframe={mat?.wireframe ?? false}
          opacity={mat?.opacity ?? 1}
          transparent={mat?.transparent ?? false}
          depthWrite={!mat?.wireframe}
        />
      </mesh>
    </group>
  );
}

/** Knuckle - intentionally larger than bone for visible joint definition */
function Knuckle({ y, rad, mat }: { y: number; rad: number; mat?: MatOverride }) {
  return (
    <mesh position={[0, y, 0]}>
      <sphereGeometry args={[rad, 12, 12]} />
      <meshStandardMaterial
        color={mat?.joint ?? HAND_PALETTE.joint}
        emissive={mat?.joint ?? HAND_PALETTE.joint}
        emissiveIntensity={mat?.emissiveIntensity ? mat.emissiveIntensity * 5 : 2.5}
        roughness={0.1}
        depthWrite={false}
        wireframe={mat?.wireframe ?? false}
        opacity={mat?.opacity ?? 1}
        transparent={mat?.transparent ?? false}
      />
    </mesh>
  );
}

/**
 * Anatomical Finger - three phalanges with distinct knuckles
 *
 * proximal phalanx (thickest bone) -> MCP knuckle ->
 *   medial phalanx -> PIP knuckle ->
 *     distal phalanx -> fingertip
 *
 * Segments taper naturally: proximal thick, distal thin.
 * curl: Z-axis bend. curlInward: X-axis bend (sphere wrapping).
 */
interface FingerProps {
  bx: number; by: number; bz: number;
  ls: number; ts: number;
  curl: number; curlInward?: number;
  mat?: MatOverride;
  splay?: [number, number, number];
  wiggle?: number;
}

function Finger({ bx, by, bz, ls, ts, curl, curlInward = 0, mat, splay = [0,0,0], wiggle = 0 }: FingerProps) {
  // Radii: 3-4x thicker than original for clear visibility
  const pR = 0.08 * ts;   // proximal radius
  const pL = 0.22 * ls;
  const mR = 0.065 * ts;  // medial radius (tapered)
  const mL = 0.15 * ls;
  const dR = 0.05 * ts;   // distal radius (thinnest)
  const dL = 0.10 * ls;

  // Curl distributed across joints
  const c1 = curl * 0.52;
  const c2 = curl * 0.32;
  const i1 = curlInward * 0.52;
  const i2 = curlInward * 0.32;

  return (
    <group position={[bx, by, bz]} rotation={[splay[0]+wiggle*0.3, splay[1]+wiggle*0.2, splay[2]]}>
      {/* Proximal phalanx + MCP knuckle */}
      <Bone y={pL * 0.42} rad={pR} len={pL} mat={mat} />
      <Knuckle y={pL} rad={pR * 1.25} mat={mat} />
      <group position={[0, pL, 0]} rotation={[i1, 0, c1]}>
        {/* Medial phalanx + PIP knuckle */}
        <Bone y={mL * 0.38} rad={mR} len={mL} mat={mat} />
        <Knuckle y={mL} rad={mR * 1.3} mat={mat} />
        <group position={[0, mL, 0]} rotation={[i2, 0, c2]}>
          {/* Distal phalanx + fingertip */}
          <Bone y={dL * 0.35} rad={dR} len={dL} mat={mat} />
          <mesh position={[0, dL, 0]}>
            <sphereGeometry args={[dR * 1.15, 10, 10]} />
            <meshStandardMaterial
              color={mat?.tip ?? HAND_PALETTE.tip}
              emissive={mat?.joint ?? HAND_PALETTE.joint}
              emissiveIntensity={mat?.emissiveIntensity ? mat.emissiveIntensity * 6 : 3.5}
              roughness={0.08}
              depthWrite={false}
              wireframe={mat?.wireframe ?? false}
              opacity={mat?.opacity ?? 1}
              transparent={mat?.transparent ?? false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Anatomical Thumb - two phalanges, positioned outward from palm side
 */
interface ThumbProps {
  bx: number; by: number; bz: number;
  curl: number; curlInward?: number;
  mat?: MatOverride;
  splay?: [number, number, number];
  wiggle?: number;
}

function Thumb({ bx, by, bz, curl, curlInward = 0, mat, splay = [0,0,0], wiggle = 0 }: ThumbProps) {
  const pR = 0.085;
  const pL = 0.16;
  const dR = 0.065;
  const dL = 0.10;
  const c1 = curl * 0.5;
  const c2 = curl * 0.28;
  const i1 = curlInward * 0.5;
  const i2 = curlInward * 0.28;

  return (
    <group position={[bx, by, bz]} rotation={[0.08+splay[0]+wiggle*0.25, splay[1], splay[2]+wiggle*0.2]}>
      <group rotation={[i1 + c1*0.5, 0, -curl*0.35]}>
        <Bone y={pL * 0.42} rad={pR} len={pL} mat={mat} />
        <Knuckle y={pL} rad={pR * 1.2} mat={mat} />
        <group position={[0, pL, 0]} rotation={[i2, 0, c2]}>
          <Bone y={dL * 0.36} rad={dR} len={dL} mat={mat} />
          <mesh position={[0, dL, 0]}>
            <sphereGeometry args={[dR * 1.1, 10, 10]} />
            <meshStandardMaterial
              color={mat?.tip ?? HAND_PALETTE.tip}
              emissive={mat?.joint ?? HAND_PALETTE.joint}
              emissiveIntensity={mat?.emissiveIntensity ? mat.emissiveIntensity * 6 : 3.5}
              roughness={0.08}
              depthWrite={false}
              wireframe={mat?.wireframe ?? false}
              opacity={mat?.opacity ?? 1}
              transparent={mat?.transparent ?? false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ---- Wrist ---------------------------------------------- */
function Wrist({ mat, side }: { mat?: MatOverride; side: 1 | -1 }) {
  return (
    <mesh position={[0, -0.30, 0.02]} rotation={[0.15 * side, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.14, 0.20, 16]} />
      <meshStandardMaterial
        color={mat?.body ?? HAND_PALETTE.body}
        emissive={mat?.bodyEmissive ?? HAND_PALETTE.bodyEmissive}
        emissiveIntensity={mat?.emissiveIntensity ?? 1.0}
        roughness={mat?.roughness ?? 0.2}
        metalness={mat?.metalness ?? 0.2}
        wireframe={mat?.wireframe ?? false}
        opacity={mat?.opacity ?? 1}
        transparent={mat?.transparent ?? false}
        depthWrite={!mat?.wireframe}
      />
    </mesh>
  );
}

/* ---- Palm ----------------------------------------------- */
function Palm({ size, mat }: { size: [number, number, number]; mat?: MatOverride }) {
  return (
    <mesh>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={mat?.body ?? HAND_PALETTE.body}
        emissive={mat?.bodyEmissive ?? HAND_PALETTE.bodyEmissive}
        emissiveIntensity={mat?.emissiveIntensity ?? 1.0}
        roughness={mat?.roughness ?? 0.2}
        metalness={mat?.metalness ?? 0.2}
        wireframe={mat?.wireframe ?? false}
        opacity={mat?.opacity ?? 1}
        transparent={mat?.transparent ?? false}
        depthWrite={!mat?.wireframe}
      />
    </mesh>
  );
}

/* ---- Palm Glow ------------------------------------------ */
function PalmGlow({ intensity = 0.5 }: { intensity?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const smat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, color: { value: new THREE.Color("#a855f7") }, intensity: { value: intensity } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying vec2 vUv;uniform float time;uniform vec3 color;uniform float intensity;
      void main(){float d=length(vUv-0.5)*2.0;float g=exp(-d*3.5)*0.6;
      float r=smoothstep(0.35,0.45,d)*smoothstep(0.55,0.45,d)*0.4;
      float p=1.0+sin(time*1.5)*0.2;gl_FragColor=vec4(color,(g+r)*intensity*p);}`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  }), [intensity]);

  useFrame(() => { if (ref.current) (ref.current.material as THREE.ShaderMaterial).uniforms.time.value = Date.now() * 0.001; });

  return (
    <mesh ref={ref} position={[0,0,0.08]} material={smat}>
      <planeGeometry args={[0.28, 0.28]} />
    </mesh>
  );
}

/* ===========================================================
   PRESETS
   =========================================================== */

const WM = { body:"#7c3aed", bodyEmissive:"#a855f7", joint:"#c084fc", tip:"#e9d5ff", roughness:0.3, metalness:0.1, emissiveIntensity:1.5, wireframe:true, opacity:0.65, transparent:true } as const;
const WA = { floatAmplitude:0.05, floatSpeed:0.35, fingerWiggle:0.015, idleRotation:0.02, pulseIntensity:0.7, tapFrequency:0, reduceMotion:true } as const;

export const HAND_PRESETS: Record<string, HandVariant> = {

  /* ---- 1: Grip From Below (Center) -------------------- */
  "hold-bottom-center": {
    id: "hold-bottom-center", name: "Grip Below Center", pose: "cup", style: "energy", context: "hero",
    fingers: [
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.2, curl: 1.15, curlInward: 0.55, phaseOffset: 0,    splay: [0.22, 0, 0] }),
      defaultFinger({ lengthScale: 1.20, thicknessScale: 1.3, curl: 1.20, curlInward: 0.45, phaseOffset: 0.12, splay: [0.08, 0, 0] }),
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.15,curl: 1.10, curlInward: 0.38, phaseOffset: 0.24, splay: [-0.08, 0, 0] }),
      defaultFinger({ lengthScale: 0.82, thicknessScale: 1.0, curl: 0.95, curlInward: 0.30, phaseOffset: 0.36, splay: [-0.22, 0, 0] }),
    ],
    thumb: defaultFinger({ lengthScale: 0.65, thicknessScale: 1.0, curl: 0.85, curlInward: 0.50, phaseOffset: 0.2, splay: [0.15, 0, 0.6] }),
    palmSize: [0.50, 0.45, 0.14],
    material: WM,
    animation: WA,
    positionOffset: [-R * 0.6, -R * 0.45, R * 0.2],
    rotationOverride: [-1.5, 0, 0],
  },

  /* ---- 2: Grip From Below (Front) --------------------- */
  "hold-bottom-front": {
    id: "hold-bottom-front", name: "Grip Below Front", pose: "cup", style: "energy", context: "hero",
    fingers: [
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.2, curl: 1.10, curlInward: 0.50, phaseOffset: 0,    splay: [0.22, 0, 0] }),
      defaultFinger({ lengthScale: 1.20, thicknessScale: 1.3, curl: 1.15, curlInward: 0.40, phaseOffset: 0.12, splay: [0.08, 0, 0] }),
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.15,curl: 1.05, curlInward: 0.33, phaseOffset: 0.24, splay: [-0.08, 0, 0] }),
      defaultFinger({ lengthScale: 0.82, thicknessScale: 1.0, curl: 0.90, curlInward: 0.25, phaseOffset: 0.36, splay: [-0.22, 0, 0] }),
    ],
    thumb: defaultFinger({ lengthScale: 0.65, thicknessScale: 1.0, curl: 0.80, curlInward: 0.45, phaseOffset: 0.2, splay: [0.15, 0, 0.6] }),
    palmSize: [0.50, 0.45, 0.14],
    material: WM, animation: WA,
    positionOffset: [-R * 0.6, -R * 0.40, R * 0.35],
    rotationOverride: [-1.45, 0, 0],
  },

  /* ---- 3: Grip Below Right ---------------------------- */
  "hold-bottom-right": {
    id: "hold-bottom-right", name: "Grip Below Right", pose: "cup", style: "energy", context: "hero",
    fingers: [
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.2, curl: 1.10, curlInward: 0.50, phaseOffset: 0,    splay: [0.20, 0, 0] }),
      defaultFinger({ lengthScale: 1.20, thicknessScale: 1.3, curl: 1.15, curlInward: 0.40, phaseOffset: 0.12, splay: [0.07, 0, 0] }),
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.15,curl: 1.05, curlInward: 0.33, phaseOffset: 0.24, splay: [-0.07, 0, 0] }),
      defaultFinger({ lengthScale: 0.82, thicknessScale: 1.0, curl: 0.90, curlInward: 0.25, phaseOffset: 0.36, splay: [-0.20, 0, 0] }),
    ],
    thumb: defaultFinger({ lengthScale: 0.65, thicknessScale: 1.0, curl: 0.80, curlInward: 0.45, phaseOffset: 0.2, splay: [0.12, 0, 0.55] }),
    palmSize: [0.50, 0.45, 0.14],
    material: WM, animation: WA,
    positionOffset: [-R * 0.35, -R * 0.40, R * 0.2],
    rotationOverride: [-1.45, 0.25, 0.35],
  },

  /* ---- 4: Grip Below Left ----------------------------- */
  "hold-bottom-left": {
    id: "hold-bottom-left", name: "Grip Below Left", pose: "cup", style: "energy", context: "hero",
    fingers: [
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.2, curl: 1.10, curlInward: 0.50, phaseOffset: 0,    splay: [0.20, 0, 0] }),
      defaultFinger({ lengthScale: 1.20, thicknessScale: 1.3, curl: 1.15, curlInward: 0.40, phaseOffset: 0.12, splay: [0.07, 0, 0] }),
      defaultFinger({ lengthScale: 1.05, thicknessScale: 1.15,curl: 1.05, curlInward: 0.33, phaseOffset: 0.24, splay: [-0.07, 0, 0] }),
      defaultFinger({ lengthScale: 0.82, thicknessScale: 1.0, curl: 0.90, curlInward: 0.25, phaseOffset: 0.36, splay: [-0.20, 0, 0] }),
    ],
    thumb: defaultFinger({ lengthScale: 0.65, thicknessScale: 1.0, curl: 0.80, curlInward: 0.45, phaseOffset: 0.2, splay: [0.12, 0, 0.55] }),
    palmSize: [0.50, 0.45, 0.14],
    material: WM, animation: WA,
    positionOffset: [-R * 0.85, -R * 0.40, R * 0.2],
    rotationOverride: [-1.45, -0.25, -0.35],
  },

  /* ---- 5: Side Grip ----------------------------------- */
  "hold-side-wrap": {
    id: "hold-side-wrap", name: "Grip Side Wrap", pose: "cup", style: "energy", context: "hero",
    fingers: [
      defaultFinger({ lengthScale: 1.10, thicknessScale: 1.2, curl: 1.15, curlInward: 0.60, phaseOffset: 0,    splay: [0.24, 0, 0] }),
      defaultFinger({ lengthScale: 1.25, thicknessScale: 1.3, curl: 1.20, curlInward: 0.50, phaseOffset: 0.12, splay: [0.10, 0, 0] }),
      defaultFinger({ lengthScale: 1.10, thicknessScale: 1.15,curl: 1.10, curlInward: 0.42, phaseOffset: 0.24, splay: [-0.10, 0, 0] }),
      defaultFinger({ lengthScale: 0.88, thicknessScale: 1.0, curl: 0.95, curlInward: 0.35, phaseOffset: 0.36, splay: [-0.24, 0, 0] }),
    ],
    thumb: defaultFinger({ lengthScale: 0.65, thicknessScale: 1.0, curl: 0.85, curlInward: 0.50, phaseOffset: 0.2, splay: [0.15, 0, 0.65] }),
    palmSize: [0.50, 0.45, 0.14],
    material: WM, animation: WA,
    positionOffset: [-R * 0.1, -R * 0.3, R * 0.15],
    rotationOverride: [-0.85, 0, 0.55],
  },
};

/* ===========================================================
   HAND COMPONENT
   =========================================================== */

interface HandProps {
  side: "left" | "right";
  variant?: string;
  lit?: boolean;
}

function Hand({ side, variant: variantId, lit = false }: HandProps) {
  const d = side === "left" ? -1 : 1;
  const g = useRef<THREE.Group>(null);
  const wref = useRef<number[]>([0,0,0,0,0]);

  const variant = variantId ? HAND_PRESETS[variantId] : HAND_PRESETS["hold-bottom-center"];
  const mat = variant?.material as MatOverride | undefined;

  // Finger attachment points on palm (wider spread for grip)
  const fbX = [0.12, 0.03, -0.03, -0.12] as const;
  const fbY = [0.24, 0.28, 0.27, 0.22] as const;
  const fbZ = [0.04, 0.05, 0.04, 0.03] as const;

  useFrame(() => {
    if (!g.current) return;
    const t = Date.now() * 0.001;
    const a = variant?.animation;

    // Per-finger micro-wiggle
    const wa = a?.fingerWiggle ?? 0.01;
    for (let i = 0; i < 5; i++) wref.current[i] = Math.sin(t * 2.5 + i * 1.3) * wa;

    // Base position - palm at globe bottom
    const baseX = d * (R * 0.6);
    const baseY = -R * 0.82;
    const baseZ = R * 0.55 + 0.65;

    const po = variant?.positionOffset;
    const ox = po ? po[0] * d : 0;
    const oy = po ? po[1] : 0;
    const oz = po ? po[2] : 0;

    const famp = a?.floatAmplitude ?? 0.04;
    const fspd = a?.floatSpeed ?? 0.35;
    const fp = Math.sin(t * fspd) * famp;

    g.current.position.x = baseX + ox + fp * 0.8;
    g.current.position.y = baseY + oy + fp * 1.0;
    g.current.position.z = baseZ + oz + Math.cos(t * fspd * 0.8) * famp * 1.6;

    const ro = variant?.rotationOverride;
    if (ro) {
      g.current.rotation.set(ro[0], ro[1] * d, ro[2] * d);
    } else {
      const ir = a?.idleRotation ?? 0.02;
      g.current.rotation.z = d * 0.35 + Math.sin(t * 0.7) * ir;
      g.current.rotation.x = -0.55 + Math.cos(t * 0.6) * ir;
      g.current.rotation.y = d * 0.2 + Math.sin(t * 0.5) * ir * 0.5;
    }
  });

  const fingers = variant?.fingers;
  const thumb = variant?.thumb;
  const psz = variant?.palmSize ?? [0.50, 0.45, 0.14];
  const ro = variant?.rotationOverride;

  return (
    <group ref={g} rotation={ro ? [ro[0], ro[1]*d, ro[2]*d] as [number,number,number] : [-0.55, d*0.2, d*0.35]} scale={1.0}>
      <Wrist mat={mat} side={d} />
      <Palm size={psz} mat={mat} />

      {variant?.pose === "open" && variant?.animation?.pulseIntensity > 0.4 && (
        <PalmGlow intensity={variant.animation.pulseIntensity} />
      )}

      {fingers?.map((f, i) => (
        <Finger
          key={i}
          bx={fbX[i]} by={fbY[i]} bz={fbZ[i]}
          ls={f.lengthScale} ts={f.thicknessScale}
          curl={f.curl * d} curlInward={f.curlInward * d}
          mat={mat}
          splay={f.splay.map((v,j) => (j===2 ? v*d : v)) as [number,number,number]}
          wiggle={wref.current[i]}
        />
      ))}

      {thumb && (
        <Thumb
          bx={d * 0.18} by={0.06} bz={0.04}
          curl={thumb.curl * d} curlInward={thumb.curlInward * d}
          mat={mat}
          splay={thumb.splay.map((v,j) => (j===2 ? v*d : v)) as [number,number,number]}
          wiggle={wref.current[4]}
        />
      )}
    </group>
  );
}

export { Hand };
