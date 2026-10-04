'use client';

import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Atom, Box, MousePointer2, Network } from 'lucide-react';

const display = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap' });

/* WebGL only exists in the browser, so the scene is never server-rendered. */
const MoleculeScene = dynamic(() => import('./MoleculeScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-end justify-center pb-[22svh] lg:items-center lg:justify-end lg:pb-0 lg:pr-[20%]"
    >
      <div className="h-40 w-40 animate-pulse rounded-full bg-cyan-400/20 blur-2xl" />
    </div>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

/* -------------------------------------------------------------------------- */

interface StatItem {
  label: string;
  /** Animated number (rendered as `${n}${suffix}`) */
  count?: number;
  suffix?: string;
  /** Static text value when there is nothing to count */
  text?: string;
}

const STATS: StatItem[] = [
  { label: 'Molecules', count: 100, suffix: 'K+' },
  { label: 'Orbitals', text: 'Realtime' },
  { label: 'Rendering', text: 'WebGL 2' },
];

function Stat({ label, count, suffix = '', text }: StatItem) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (count === undefined || !inView) return undefined;
    if (reduce) {
      setN(count);
      return undefined;
    }
    const controls = animate(0, count, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [count, inView, reduce]);

  return (
    <div ref={ref}>
      <p className="text-2xl font-semibold tabular-nums text-white sm:text-3xl">
        {count !== undefined ? `${n}${suffix}` : text}
      </p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300';

export interface ChemovexaHeroProps {
  labHref?: string;
  atlasHref?: string;
}

export default function ChemovexaHero({
  labHref = '/lab',
  atlasHref = '/atlas',
}: ChemovexaHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: '100px' });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={`relative isolate w-full overflow-hidden bg-[#070b14] text-white ${display.className}`}
      >
        {/* Backdrop glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-cyan-500/15 blur-[140px]" />
          <div className="absolute -right-32 top-[8%] h-[36rem] w-[36rem] rounded-full bg-blue-600/20 blur-[160px]" />
          <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(34,211,238,0.10),transparent_60%)]" />
        </div>

        {/* 3D layer: spans the whole section so drags work everywhere */}
        <div
          role="img"
          aria-label="Interactive 3D model of a substituted benzene molecule. Drag to rotate."
          className="absolute inset-0 z-0"
        >
          <SceneBoundary>
            <MoleculeScene active={inView} />
          </SceneBoundary>
        </div>

        {/* Text layer: transparent to the pointer except for real controls */}
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-start px-6 pb-[52svh] pt-28 lg:justify-center lg:px-10 lg:pb-16 lg:pt-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-xl lg:max-w-[36rem]"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur">
                <Atom className="h-4 w-4 text-cyan-300" aria-hidden />
                3D Molecular Explorer
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 text-balance bg-gradient-to-br from-white via-cyan-200 to-emerald-300 bg-clip-text pb-1 text-[clamp(2.5rem,6.2vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-transparent"
            >
              Unveil the Hidden World of Chemistry in 3D
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Chemovexa renders molecules, bonds and electron orbitals in real time. Drag to
              rotate a structure, step through a reaction, and see how atoms arrange themselves,
              right in your browser.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={labHref}
                className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 font-semibold text-[#06101c] shadow-[0_0_32px_-6px_rgba(34,211,238,0.6)] transition hover:brightness-110 ${focusRing}`}
              >
                <Box className="h-[18px] w-[18px]" aria-hidden />
                Enter 3D Lab
              </Link>
              <Link
                href={atlasHref}
                className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white backdrop-blur transition hover:border-cyan-300/40 hover:bg-white/10 ${focusRing}`}
              >
                <Network className="h-[18px] w-[18px] text-cyan-300" aria-hidden />
                Reaction Atlas
              </Link>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6"
            >
              {STATS.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        <p className="pointer-events-none absolute bottom-5 right-6 z-10 flex items-center gap-2 text-sm text-slate-400">
          <MousePointer2 className="h-4 w-4" aria-hidden />
          Drag to rotate
        </p>
      </section>
    </MotionConfig>
  );
}
