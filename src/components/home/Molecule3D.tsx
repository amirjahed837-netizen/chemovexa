"use client";

import { useEffect, useRef } from "react";

/**
 * 3D molecular hero — a wireframe molecule rotating in pseudo-3D on <canvas>.
 *
 * No Three.js / R3F dependency: the molecule is a small set of atoms placed on
 * a 3D lattice with bonds between neighbours, projected to the screen each
 * frame with a perspective camera and rotated by the pointer. Depth sorting
 * gives real occlusion; a radial gradient simulates focus blur at the edges.
 *
 * Respects prefers-reduced-motion (one static frame).
 */

type Atom = {
  x: number;
  y: number;
  z: number;
  r: number;
  el: string;
  /** base color, as hex */
  c: string;
};

const PALETTE = {
  C: "#67e8f9",
  H: "#e2e8f0",
  O: "#60a5fa",
  N: "#a5b4fc",
  S: "#fbbf24",
};

/** build a cage-like molecule: a truncated octahedron of C with H on the faces */
function buildMolecule(): { atoms: Atom[]; bonds: [number, number][] } {
  const atoms: Atom[] = [];
  const R = 1.15;

  // 6 vertices of an octahedron
  const oct: [number, number, number][] = [
    [R, 0, 0],
    [-R, 0, 0],
    [0, R, 0],
    [0, -R, 0],
    [0, 0, R],
    [0, 0, -R],
  ];

  // carbon atoms at edge midpoints of the octahedron => a cuboctahedron (12 C)
  const mids = new Map<string, [number, number, number]>();
  for (let i = 0; i < oct.length; i++) {
    for (let j = i + 1; j < oct.length; j++) {
      const a = oct[i];
      const b = oct[j];
      const key = [i, j].sort().join("-");
      mids.set(key, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
    }
  }
  const cIdx: number[] = [];
  for (const [, p] of mids) {
    cIdx.push(atoms.length);
    atoms.push({ x: p[0], y: p[1], z: p[2], r: 0.13, el: "C", c: PALETTE.C });
  }

  // hydrogens pushed outward from each carbon, along its radial direction
  const hIdx: number[] = [];
  for (const i of cIdx) {
    const a = atoms[i];
    const len = Math.hypot(a.x, a.y, a.z);
    const s = 1.9 / len;
    hIdx.push(atoms.length);
    atoms.push({
      x: a.x * s,
      y: a.y * s,
      z: a.z * s,
      r: 0.07,
      el: "H",
      c: PALETTE.H,
    });
  }

  // bonds: connect carbons that are nearest neighbours
  const bonds: [number, number][] = [];
  const threshold = 0.75;
  for (let i = 0; i < cIdx.length; i++) {
    for (let j = i + 1; j < cIdx.length; j++) {
      const a = atoms[cIdx[i]];
      const b = atoms[cIdx[j]];
      const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      if (d < threshold) bonds.push([cIdx[i], cIdx[j]]);
    }
  }
  // C–H bonds
  for (let k = 0; k < hIdx.length; k++) bonds.push([cIdx[k], hIdx[k]]);

  return { atoms, bonds };
}

export function Molecule3D({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { atoms, bonds } = buildMolecule();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;

    // camera
    const camZ = 3.4;
    const fov = 1.15; // radians-ish; larger = wider

    // pointer-driven rotation with easing
    const target = { rx: -0.5, ry: 0.6 };
    const cur = { rx: -0.5, ry: 0.6 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (p: { x: number; y: number; z: number }) => {
      // rotate around Y then X
      const cosY = Math.cos(cur.ry);
      const sinY = Math.sin(cur.ry);
      const cosX = Math.cos(cur.rx);
      const sinX = Math.sin(cur.rx);

      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const zc = z2 + camZ;
      const f = (H / fov) / zc; // perspective scale
      return {
        sx: W / 2 + x1 * f,
        sy: H / 2 + y1 * f,
        depth: zc,
        scale: f,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const projected = atoms.map(project);

      // bonds first (behind atoms), sorted by midpoint depth so far ones draw first
      const bondList = bonds
        .map(([a, b]) => {
          const pa = projected[a];
          const pb = projected[b];
          return { a: pa, b: pb, depth: (pa.depth + pb.depth) / 2 };
        })
        .sort((u, v) => v.depth - u.depth);

      for (const b of bondList) {
        // fade by depth — closer bonds are brighter
        const t = (b.depth - camZ + 2) / 4; // ~0 far, ~1 near
        const alpha = Math.max(0.05, Math.min(0.5, 0.12 + t * 0.38));
        const w = Math.max(0.5, (0.9 + t * 1.6) * (H / 900));
        ctx.strokeStyle = `rgba(103, 232, 249, ${alpha.toFixed(3)})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(b.a.sx, b.a.sy);
        ctx.lineTo(b.b.sx, b.b.sy);
        ctx.stroke();
      }

      // atoms, far first
      const atomList = projected
        .map((p, i) => ({ p, a: atoms[i] }))
        .sort((u, v) => v.p.depth - u.p.depth);

      for (const { p, a } of atomList) {
        const t = (p.depth - camZ + 2) / 4;
        const r = Math.max(0.6, a.r * p.scale);
        const alpha = Math.max(0.25, Math.min(1, 0.4 + t * 0.6));

        // glow
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 3.4);
        glow.addColorStop(0, hexA(a.c, 0.55 * alpha));
        glow.addColorStop(1, hexA(a.c, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 3.4, 0, Math.PI * 2);
        ctx.fill();

        // body with a small specular highlight
        const body = ctx.createRadialGradient(
          p.sx - r * 0.35,
          p.sy - r * 0.35,
          r * 0.15,
          p.sx,
          p.sy,
          r,
        );
        body.addColorStop(0, "#ffffff");
        body.addColorStop(0.35, hexA(a.c, alpha));
        body.addColorStop(1, hexA(shade(a.c), alpha));
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();

        // element label on larger atoms
        if (a.el !== "H" && r > 5) {
          ctx.font = `600 ${Math.max(8, r * 0.95)}px var(--font-jetbrains-mono), monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
          ctx.fillText(a.el, p.sx, p.sy + 0.6);
        }
      }
    };

    const step = () => {
      // ease toward the pointer target, plus a slow drift so it never fully stops
      cur.ry += (target.ry - cur.ry) * 0.06 + 0.0016;
      cur.rx += (target.rx - cur.rx) * 0.06;
      draw();
      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      target.ry = 0.6 + nx * 1.6;
      target.rx = -0.5 - ny * 1.0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);
    resize();

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

/* -------------------------------- helpers -------------------------------- */

function hexA(hex: string, a: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

function shade(hex: string): string {
  const n = hex.replace("#", "");
  const r = Math.round(parseInt(n.slice(0, 2), 16) * 0.45);
  const g = Math.round(parseInt(n.slice(2, 4), 16) * 0.45);
  const b = Math.round(parseInt(n.slice(4, 6), 16) * 0.45);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
