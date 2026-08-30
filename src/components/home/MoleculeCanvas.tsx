"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label: string | null;
  color: string; // "r,g,b"
};

const LABELS = ["H", "C", "N", "O", "S"] as const;
const COLORS = ["34,211,238", "96,165,250", "129,140,248", "103,232,249"] as const;

/**
 * Animated molecular network rendered on <canvas>.
 * Nodes drift slowly, nearby nodes form "bonds", some atoms carry element labels.
 * Respects prefers-reduced-motion (renders a single static frame).
 */
export function MoleculeCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const seed = () => {
      const count = Math.max(34, Math.min(80, Math.round((W * H) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() < 0.18 ? 2.4 + Math.random() * 1.6 : 1.1 + Math.random() * 1.1,
        label: Math.random() < 0.3 ? LABELS[(Math.random() * LABELS.length) | 0] : null,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const bondDist = () => Math.min(150, Math.max(105, Math.min(W, H) * 0.17));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Bonds
      const maxD = bondDist();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD * maxD) continue;
          const t = 1 - Math.sqrt(d2) / maxD;
          ctx.strokeStyle = `rgba(${a.color}, ${(t * 0.38).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Atoms
      for (const p of particles) {
        ctx.shadowBlur = p.r > 2 ? 12 : 6;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fillStyle = `rgba(${p.color}, ${p.label ? 0.95 : 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.label) {
          ctx.strokeStyle = `rgba(${p.color}, 0.35)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 3.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = "600 10px var(--font-jetbrains-mono), monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "rgba(207, 250, 254, 0.85)";
          ctx.fillText(p.label, p.x, p.y + 0.5);
        }
      }
    };

    const step = () => {
      const maxSpeed = 0.32;
      for (const p of particles) {
        // gentle attraction toward pointer
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 170 && dm > 24) {
          p.vx += (dxm / dm) * 0.006;
          p.vy += (dym / dm) * 0.006;
        }
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > maxSpeed) {
          p.vx = (p.vx / sp) * maxSpeed;
          p.vy = (p.vy / sp) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        // wrap around edges
        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);
    resize();

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
