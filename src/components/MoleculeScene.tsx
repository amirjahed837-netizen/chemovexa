'use client';

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
} from '@react-three/drei';
import { useReducedMotion, type MotionValue } from 'framer-motion';
import * as THREE from 'three';

const { clamp, damp, lerp } = THREE.MathUtils;

/* -------------------------------------------------------------------------- */
/*  Scroll tuning: every scroll-linked number lives here                      */
/* -------------------------------------------------------------------------- */

const SCROLL = {
  // Damping (higher = snappier). Keeps fast scrolling from causing snaps.
  progressDamping: 5,
  velocityDamping: 7,
  maxVelocity: 2.5, // progress-units per second

  // Molecule
  idleSpin: 0.22, // rad/s with no scrolling
  spinY: 6, // extra rad/s per (progress/s) of scroll velocity
  tiltPerVelocity: 0.3, // pitch (rad) added per (progress/s)
  tiltPerProgress: 0.5, // pitch (rad) at the end of the hero
  pushBack: 4, // world units along -Z at the end
  shrink: 0.15, // fraction of scale lost at the end
  sink: 1.2, // world units downward (reads as slower-than-page parallax)

  // Orbital rings
  ringSpeedBoost: 4, // spin multiplier gained over the full scroll
  ringVelocityBoost: 1.5, // extra spin multiplier per |progress/s|
  ringSpread: 0.6, // radius growth at the end
  ringFade: 0.65, // fraction of opacity lost at the end

  // Sparkles
  sparkleSpread: 1.6,
  sparkleSpin: 0.25,

  // Frame drift as a fraction of canvas size: [at start, at end]
  driftDesktopX: [-0.18, -0.02],
  driftMobileY: [-0.27, -0.08],
} as const;

/** Smoothed scroll values shared by every animated part of the scene. */
interface ScrollState {
  progress: number; // 0 → 1 across the hero, damped
  velocity: number; // damped d(progress)/dt
}
type ScrollRef = MutableRefObject<ScrollState>;

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
interface RingSpec {
  radius: number;
  tilt: Vec3;
  speed: number;
  color: string;
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

const RINGS: RingSpec[] = [
  { radius: 3.7, tilt: [1.2, 0.2, 0], speed: 0.5, color: '#22d3ee' },
  { radius: 4.15, tilt: [0.4, 1.1, 0.3], speed: -0.38, color: '#34d399' },
  { radius: 4.6, tilt: [-0.9, 0.5, 1.0], speed: 0.28, color: '#3b82f6' },
];

const BACKGROUND = new THREE.Color('#070b14');
const UP = new THREE.Vector3(0, 1, 0);

/* -------------------------------------------------------------------------- */
/*  Scroll driver: the single place that reads the MotionValue                */
/* -------------------------------------------------------------------------- */

interface ScrollDriverProps {
  scroll?: MotionValue<number>;
  state: ScrollRef;
}

/**
 * Runs before every other useFrame (priority -1). It damps the raw scroll
 * progress and derives a smooth velocity from the damped value, so a flick of
 * the wheel eases in and out instead of snapping. With reduced motion (or no
 * `scroll` prop) the target is 0, so everything eases back to rest.
 */
function ScrollDriver({ scroll, state }: ScrollDriverProps) {
  const reduce = useReducedMotion();

  // r3f runs this outside React's render cycle, so mutating the shared ref is safe.
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // ignore huge deltas after tab switches
    const s = state.current;
    const target = scroll && !reduce ? clamp(scroll.get(), 0, 1) : 0;

    const previous = s.progress;
    // eslint-disable-next-line react-hooks/immutability -- r3f frame loop, not a render
    s.progress = damp(previous, target, SCROLL.progressDamping, dt);

    const raw = dt > 0 ? (s.progress - previous) / dt : 0;
    s.velocity = damp(
      s.velocity,
      clamp(raw, -SCROLL.maxVelocity, SCROLL.maxVelocity),
      SCROLL.velocityDamping,
      dt,
    );
  }, -1);

  return null;
}

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

function OrbitalRing({ radius, tilt, speed, color, rig }: RingSpec & { rig: ScrollRef }) {
  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const reduce = useReducedMotion();

  useFrame((_, delta) => {
    const { progress: p, velocity: v } = rig.current;

    // Disperse: ring grows outward, tips a little further off-axis, and fades
    if (outer.current) {
      outer.current.scale.setScalar(1 + p * SCROLL.ringSpread);
      outer.current.rotation.set(tilt[0] + p * 0.5 * Math.sign(speed), tilt[1], tilt[2]);
    }
    if (material.current) material.current.opacity = 0.55 * (1 - p * SCROLL.ringFade);

    // Intensify: the electron orbits faster with depth and while scrolling
    if (spinner.current && !reduce) {
      const boost = 1 + p * SCROLL.ringSpeedBoost + Math.abs(v) * SCROLL.ringVelocityBoost;
      spinner.current.rotation.z += Math.min(delta, 0.05) * speed * boost;
    }
  });

  return (
    <group ref={outer}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 16, 180]} />
        <meshBasicMaterial ref={material} color={color} transparent opacity={0.55} toneMapped={false} />
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

/** Quantum dust. Sparkles can't change `speed`/`scale` live without re-randomising,
 *  so the wrapping group is scaled (disperse) and spun (intensify) instead. */
function SparkleField({ rig }: { rig: ScrollRef }) {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();

  useFrame((_, delta) => {
    if (!group.current) return;
    const { progress: p, velocity: v } = rig.current;
    group.current.scale.setScalar(1 + p * SCROLL.sparkleSpread);
    if (!reduce) {
      const spin = 0.03 + Math.abs(v) * 0.6 + p * SCROLL.sparkleSpin;
      group.current.rotation.y += Math.min(delta, 0.05) * spin;
    }
  });

  return (
    <group ref={group}>
      <Sparkles count={80} scale={[10, 8, 6]} size={2.4} speed={0.35} opacity={0.7} color="#67e8f9" />
      <Sparkles count={40} scale={[8, 6, 5]} size={3} speed={0.25} opacity={0.5} color="#6ee7b7" />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Molecule + camera rig                                                     */
/* -------------------------------------------------------------------------- */

function Molecule({ rig }: { rig: ScrollRef }) {
  const scrollGroup = useRef<THREE.Group>(null); // scroll parallax (position / scale)
  const spinGroup = useRef<THREE.Group>(null); // rotation
  const reduce = useReducedMotion();
  const { viewport, size } = useThree();
  const desktop = size.width >= 1024;

  // Fit the molecule to its half of the screen on any viewport
  const fit = Math.min(
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
    const dt = Math.min(delta, 0.05);
    const { progress: p, velocity: v } = rig.current;

    // Zoom-out parallax: push back, shrink slightly, sink below the page scroll
    if (scrollGroup.current) {
      scrollGroup.current.position.set(0, -p * SCROLL.sink, -p * SCROLL.pushBack);
      scrollGroup.current.scale.setScalar(1 - p * SCROLL.shrink);
    }

    if (spinGroup.current) {
      const spin = spinGroup.current;
      // Yaw: idle drift + velocity proportional to scroll speed (reverses when scrolling up)
      spin.rotation.y += ((reduce ? 0 : SCROLL.idleSpin) + v * SCROLL.spinY) * dt;
      // Pitch: sway + tilt with depth + lean into the scroll direction, damped
      const sway = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
      const targetX = sway + p * SCROLL.tiltPerProgress + v * SCROLL.tiltPerVelocity;
      spin.rotation.x = damp(spin.rotation.x, targetX, 6, dt);
    }
  });

  return (
    <group ref={scrollGroup}>
      <Float
        speed={reduce ? 0 : 1.5}
        rotationIntensity={0.3}
        floatIntensity={0.8}
        floatingRange={[-0.2, 0.2]}
      >
        <group ref={spinGroup} scale={fit}>
          {MOLECULE.bonds.map((bond, i) => (
            <Bond key={`b${i}`} {...bond} />
          ))}
          {MOLECULE.atoms.map((atom, i) => (
            <Atom key={`a${i}`} {...atom} glass={glass} />
          ))}
          {RINGS.map((ring) => (
            <OrbitalRing key={ring.radius} {...ring} rig={rig} />
          ))}
        </group>
      </Float>
    </group>
  );
}

/**
 * Shifts the rendered frame (not the world) so the molecule sits on the right
 * on desktop and in the lower half on mobile, and eases toward the centre as
 * the hero scrolls away. Because the world never moves, OrbitControls keeps
 * rotating the molecule in place.
 */
function SceneRig({ rig }: { rig: ScrollRef }) {
  const { camera, size, gl, events } = useThree();
  const desktop = size.width >= 1024;
  const applied = useRef({ x: Number.NaN, y: Number.NaN });

  useEffect(() => {
    applied.current = { x: Number.NaN, y: Number.NaN }; // force re-apply on next frame
    return () => (camera as THREE.PerspectiveCamera).clearViewOffset();
  }, [camera, size.width, size.height, desktop]);

  useFrame(() => {
    const p = rig.current.progress;
    const fx = desktop ? lerp(SCROLL.driftDesktopX[0], SCROLL.driftDesktopX[1], p) : 0;
    const fy = desktop ? 0 : lerp(SCROLL.driftMobileY[0], SCROLL.driftMobileY[1], p);

    const last = applied.current;
    if (Math.abs(fx - last.x) < 1e-4 && Math.abs(fy - last.y) < 1e-4) return; // NaN → falls through
    (camera as THREE.PerspectiveCamera).setViewOffset(
      size.width,
      size.height,
      fx * size.width,
      fy * size.height,
      size.width,
      size.height,
    );
    applied.current = { x: fx, y: fy };
  });

  // Let vertical swipes scroll the page on touch devices; horizontal drags rotate.
  useEffect(() => {
    const el = (events.connected as HTMLElement | undefined) ?? gl.domElement;
    // eslint-disable-next-line react-hooks/immutability -- canvas element, not a React ref
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
  /** Hero scroll progress (0 → 1). Omit to disable scroll-linked motion. */
  scroll?: MotionValue<number>;
}

export default function MoleculeScene({ active = true, scroll }: MoleculeSceneProps) {
  const rig = useRef<ScrollState>({ progress: 0, velocity: 0 });

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 14], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ScrollDriver scroll={scroll} state={rig} />

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

        <Molecule rig={rig} />
        <SparkleField rig={rig} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.7}
      />
      {/* Must come after OrbitControls so its touch-action wins */}
      <SceneRig rig={rig} />
    </Canvas>
  );
}
