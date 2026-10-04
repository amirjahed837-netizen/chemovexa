'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
} from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Molecule data (pure math, no randomness)                                  */
/* -------------------------------------------------------------------------- */

type Vec3 = [number, number, number];
type ElementSymbol = 'C' | 'N' | 'O' | 'H';

interface AtomSpec {
  radius: number;
  color: string;
  glow: string;
}
interface AtomData {
  element: ElementSymbol;
  position: Vec3;
}
interface BondData {
  from: Vec3;
  to: Vec3;
  color: string;
  double: boolean;
}
interface GlassQuality {
  samples: number;
  resolution: number;
  temporalDistortion: number;
}

const ATOMS: Record<ElementSymbol, AtomSpec> = {
  C: { radius: 0.52, color: '#8be9ff', glow: '#22d3ee' }, // cyan
  N: { radius: 0.5, color: '#8fb4ff', glow: '#3b82f6' }, // vibrant blue
  O: { radius: 0.46, color: '#86f7cf', glow: '#34d399' }, // emerald
  H: { radius: 0.26, color: '#e0f2fe', glow: '#7dd3fc' },
};

/** Functional group attached to each ring carbon, clockwise. */
const SUBSTITUENTS: ElementSymbol[] = ['O', 'H', 'N', 'H', 'O', 'H'];

function buildMolecule(): { atoms: AtomData[]; bonds: BondData[] } {
  const atoms: AtomData[] = [];
  const bonds: BondData[] = [];

  const polar = (r: number, i: number, z = 0): Vec3 => {
    const t = (i * Math.PI) / 3 + Math.PI / 6;
    return [Math.cos(t) * r, Math.sin(t) * r, z];
  };
  const add = (element: ElementSymbol, position: Vec3) =>
    atoms.push({ element, position }) - 1;
  const link = (a: number, b: number, double = false) => {
    const hetero = [atoms[a].element, atoms[b].element].find((e) => e === 'N' || e === 'O');
    bonds.push({
      from: atoms[a].position,
      to: atoms[b].position,
      color: ATOMS[hetero ?? 'C'].glow,
      double,
    });
  };

  // Benzene-like core with alternating double bonds
  const ring = Array.from({ length: 6 }, (_, i) => add('C', polar(1.3, i)));
  ring.forEach((c, i) => link(c, ring[(i + 1) % 6], i % 2 === 0));

  // Substituents, with hydrogens pushed out of plane for real 3D depth
  SUBSTITUENTS.forEach((element, i) => {
    if (element === 'H') {
      link(ring[i], add('H', polar(2.4, i, i % 4 === 1 ? 0.7 : -0.7)));
      return;
    }
    const hetero = add(element, polar(2.55, i));
    link(ring[i], hetero);
    [0.8, -0.8]
      .slice(0, element === 'N' ? 2 : 1)
      .forEach((z) => link(hetero, add('H', polar(3.2, i, z))));
  });

  return { atoms, bonds };
}

const MOLECULE = buildMolecule();

const RINGS: { radius: number; tilt: Vec3; speed: number; color: string }[] = [
  { radius: 3.7, tilt: [1.2, 0.2, 0], speed: 0.5, color: '#22d3ee' },
  { radius: 4.15, tilt: [0.4, 1.1, 0.3], speed: -0.38, color: '#34d399' },
  { radius: 4.6, tilt: [-0.9, 0.5, 1.0], speed: 0.28, color: '#3b82f6' },
];

const BACKGROUND = new THREE.Color('#070b14');
const UP = new THREE.Vector3(0, 1, 0);

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function Atom({ element, position, glass }: AtomData & { glass: GlassQuality }) {
  const spec = ATOMS[element];

  // Hydrogens: small frosted beads (cheap), heavy atoms: refractive glass.
  if (element === 'H') {
    return (
      <mesh position={position}>
        <sphereGeometry args={[spec.radius, 32, 32]} />
        <meshPhysicalMaterial
          color={spec.color}
          emissive={spec.glow}
          emissiveIntensity={0.55}
          roughness={0.2}
          clearcoat={1}
        />
      </mesh>
    );
  }

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[spec.radius, 64, 64]} />
        <MeshTransmissionMaterial
          {...glass}
          background={BACKGROUND}
          backside={false}
          color={spec.color}
          attenuationColor={spec.glow}
          attenuationDistance={0.9}
          transmission={1}
          thickness={0.85}
          roughness={0.08}
          ior={1.4}
          chromaticAberration={0.08}
          anisotropicBlur={0.15}
          distortion={0.1}
          distortionScale={0.4}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
        />
      </mesh>
      {/* Sibling (not child) so it is visible *through* the glass */}
      <mesh scale={0.4}>
        <sphereGeometry args={[spec.radius, 24, 24]} />
        <meshBasicMaterial color={spec.glow} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Bond({ from, to, color, double }: BondData) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);

  const offsets = double ? [-0.08, 0.08] : [0];
  const radius = double ? 0.03 : 0.05;

  return (
    <group position={position} quaternion={quaternion}>
      {offsets.map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <cylinderGeometry args={[radius, radius, length, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.4}
            roughness={0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitalRing({ radius, tilt, speed, color }: (typeof RINGS)[number]) {
  const spinner = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();

  useFrame((_, delta) => {
    if (spinner.current && !reduce) spinner.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 16, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <group ref={spinner}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Molecule + camera rig                                                     */
/* -------------------------------------------------------------------------- */

function Molecule() {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();
  const { viewport, size } = useThree();
  const desktop = size.width >= 1024;

  // Fit the molecule to its half of the screen on any viewport
  const scale = Math.min(
    1,
    desktop ? viewport.width / 14.5 : viewport.width / 9.2,
    viewport.height / 9.6,
  );

  const glass: GlassQuality = {
    samples: desktop ? 6 : 3,
    resolution: desktop ? 384 : 256,
    temporalDistortion: reduce ? 0 : 0.08,
  };

  useFrame((state, delta) => {
    if (!group.current || reduce) return;
    group.current.rotation.y += delta * 0.22;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
  });

  return (
    <Float
      speed={reduce ? 0 : 1.5}
      rotationIntensity={0.3}
      floatIntensity={0.8}
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={group} scale={scale}>
        {MOLECULE.bonds.map((bond, i) => (
          <Bond key={`b${i}`} {...bond} />
        ))}
        {MOLECULE.atoms.map((atom, i) => (
          <Atom key={`a${i}`} {...atom} glass={glass} />
        ))}
        {RINGS.map((ring) => (
          <OrbitalRing key={ring.radius} {...ring} />
        ))}
      </group>
    </Float>
  );
}

/**
 * Shifts the rendered frame (not the world) so the molecule sits on the right
 * on desktop and in the lower half on mobile, while still rotating in place
 * around the OrbitControls target.
 */
function SceneRig() {
  const { camera, size, gl, events } = useThree();
  const desktop = size.width >= 1024;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(
      size.width,
      size.height,
      desktop ? -size.width * 0.18 : 0,
      desktop ? 0 : -size.height * 0.27,
      size.width,
      size.height,
    );
    return () => cam.clearViewOffset();
  }, [camera, size.width, size.height, desktop]);

  // Let vertical swipes scroll the page on touch devices; horizontal drags rotate.
  useEffect(() => {
    const el = (events.connected as HTMLElement | undefined) ?? gl.domElement;
    el.style.touchAction = 'pan-y';
  }, [events.connected, gl]);

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Public component                                                          */
/* -------------------------------------------------------------------------- */

export interface MoleculeSceneProps {
  /** Pause rendering when the hero is off-screen. */
  active?: boolean;
}

export default function MoleculeScene({ active = true }: MoleculeSceneProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 14], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[-6, 4, 6]} intensity={120} color="#34d399" />
      <pointLight position={[6, -3, 5]} intensity={160} color="#3b82f6" />

      <Suspense fallback={null}>
        {/* Self-contained studio lighting: no HDR download, no network dependency */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="ring" color="#22d3ee" intensity={6} position={[0, 5, -5]} scale={8} />
          <Lightformer form="rect" color="#34d399" intensity={4} position={[-6, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]} />
          <Lightformer form="rect" color="#3b82f6" intensity={5} position={[6, -1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
          <Lightformer form="circle" color="#ffffff" intensity={2} position={[0, 0, 8]} scale={4} />
        </Environment>

        <Molecule />

        <Sparkles count={80} scale={[10, 8, 6]} size={2.4} speed={0.35} opacity={0.7} color="#67e8f9" />
        <Sparkles count={40} scale={[8, 6, 5]} size={3} speed={0.25} opacity={0.5} color="#6ee7b7" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.7}
      />
      {/* Must come after OrbitControls so its touch-action wins */}
      <SceneRig />
    </Canvas>
  );
}
