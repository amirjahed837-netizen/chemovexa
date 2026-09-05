"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DAtom, DBond, DConnector, DFrame, MechanismDiagram } from "@/lib/chem/mechanisms/diagrams";
import { getDiagram } from "@/lib/chem/mechanisms/diagrams";
import { cn } from "@/lib/utils";

/** ---- geometry pipeline ----------------------------------------------------
 * 1. relax: pull atoms along over-long bonds so nothing exceeds MAX_BOND
 * 2. measure real label boxes via getBBox (exact, incl. charges/subscripts)
 * 3. trim bonds/arrows/lone-pairs to the measured box edges → bonds always
 *    visually touch their atoms; nothing floats or overshoots.
 * ------------------------------------------------------------------------- */

const MAX_BOND = 88;
const FONT = 14;

type Pt = { x: number; y: number };
type Box = { w: number; h: number };

function relax(atoms: DAtom[], bonds: DBond[]) {
  const p = new Map<string, Pt>(atoms.map((a) => [a.id, { x: a.x, y: a.y }]));
  const deg = new Map<string, number>();
  bonds.forEach((b) => {
    deg.set(b.a, (deg.get(b.a) ?? 0) + 1);
    deg.set(b.b, (deg.get(b.b) ?? 0) + 1);
  });
  for (let iter = 0; iter < 4; iter++) {
    for (const b of bonds) {
      const A = p.get(b.a);
      const B = p.get(b.b);
      if (!A || !B) continue;
      const d = Math.hypot(B.x - A.x, B.y - A.y);
      if (d <= MAX_BOND) continue;
      const excess = d - MAX_BOND;
      const wA = 1 / (deg.get(b.a) ?? 1);
      const wB = 1 / (deg.get(b.b) ?? 1);
      const ux = (B.x - A.x) / d;
      const uy = (B.y - A.y) / d;
      A.x += ux * excess * wA;
      A.y += uy * excess * wA;
      B.x -= ux * excess * wB;
      B.y -= uy * excess * wB;
    }
  }
  return p;
}

/** intersection of ray from `from` toward `to` with the atom's label box + pad */
function edgePoint(from: Pt, box: Box | undefined, to: Pt, pad: number, bare = false): Pt {
  const hw = (box ? box.w / 2 : 6) + pad;
  const hh = (box ? box.h / 2 : 8) + pad;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return from;
  const t = Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9));
  return { x: from.x + dx * t, y: from.y + dy * t };
}

function curvePath(x1: number, y1: number, x2: number, y2: number, bulge = 30) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(Math.hypot(dx, dy), 1);
  const cx = mx + (-dy / len) * bulge;
  const cy = my + (dx / len) * bulge;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const INK = "var(--mech-ink)";
const PINK = "var(--mech-pink)";
const TEAL = "var(--mech-teal)";
const SLATE = "var(--mech-slate)";

function Frame({ frame }: { frame: DFrame }) {
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const textRefs = useRef<Map<string, SVGTextElement>>(new Map());

  const layout = useMemo(() => {
    const pos = relax(frame.atoms, frame.bonds);
    const atoms = frame.atoms.map((a) => ({ ...a, ...pos.get(a.id)! }));
    const labels = (frame.labels ?? []).map((l) => ({ ...l, ...pos.has(`@${l.x}`) ? l : l }));
    // annotations: move with the centroid shift of nearest atom (approx: scale about centroid)
    let cx = 0;
    let cy = 0;
    atoms.forEach((a) => {
      cx += a.x;
      cy += a.y;
    });
    cx /= atoms.length;
    cy /= atoms.length;
    let ox = 0;
    let oy = 0;
    frame.atoms.forEach((a) => {
      ox += a.x;
      oy += a.y;
    });
    ox /= frame.atoms.length;
    oy /= frame.atoms.length;
    const sx = cx - ox;
    const sy = cy - oy;
    const labels2 = (frame.labels ?? []).map((l) => ({ ...l, x: l.x + sx, y: l.y + sy }));
    const condition = frame.condition
      ? { ...frame.condition, x: frame.condition.x + sx, y: frame.condition.y + sy }
      : undefined;

    // tight viewBox from atom positions (estimate; refined visually by padding)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const consider = (x: number, y: number, w: number, h: number) => {
      minX = Math.min(minX, x - w);
      maxX = Math.max(maxX, x + w);
      minY = Math.min(minY, y - h);
      maxY = Math.max(maxY, y + h);
    };
    atoms.forEach((a) => consider(a.x, a.y, 34, 16));
    labels2.forEach((l) => consider(l.x, l.y, (l.text.length * (l.size ?? 11) * 0.55) / 2 + 4, 9));
    if (condition) consider(condition.x, condition.y, 26, 10);
    const pad = 14;
    const capH = frame.caption ? 18 : 6;
    const vb = {
      x: Math.floor(minX - pad),
      y: Math.floor(minY - pad),
      w: Math.ceil(maxX - minX + pad * 2),
      h: Math.ceil(maxY - minY + pad * 2 + capH),
    };
    return { atoms, labels: labels2, condition, vb };
  }, [frame]);

  // measure exact text boxes after paint (two passes: immediate + post-font-load)
  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, Box> = {};
      textRefs.current.forEach((el, id) => {
        try {
          const b = el.getBBox();
          if (b.width > 0) next[id] = { w: b.width, h: b.height };
        } catch {
          /* not rendered yet */
        }
      });
      setBoxes((prev) => ({ ...prev, ...next }));
    };
    measure();
    const t = setTimeout(measure, 350); // after webfont swap
    return () => clearTimeout(t);
  }, [layout]);

  const { atoms, labels, condition, vb } = layout;
  const boxOf = (id: string): Box | undefined =>
    atoms.find((a) => a.id === id)?.bare ? { w: 8, h: 12 } : boxes[id];
  const posOf = (id: string): Pt | undefined => atoms.find((a) => a.id === id);

  const bondMid = (key: string): Pt | undefined => {
    const m = key.match(/^bond:(.+):(.+)$/);
    if (!m) return undefined;
    const A = posOf(m[1]);
    const B = posOf(m[2]);
    return A && B ? { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 } : undefined;
  };
  const resolve = (ref: string): Pt | undefined =>
    ref.startsWith("bond:") ? bondMid(ref) : posOf(ref);

  const ready = frame.bonds.every((b) => boxOf(b.a) && boxOf(b.b));

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      className="mech-frame"
      style={{ maxHeight: 240 }}
      role="img"
    >
      <defs>
        <marker id="mech-arrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={PINK} />
        </marker>
        <marker id="mech-fish" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={PINK} strokeWidth="1.7" />
        </marker>
      </defs>

      {/* bonds (only once boxes measured → exact trims) */}
      {ready &&
        frame.bonds.map((b, i) => {
          const A = posOf(b.a);
          const B = posOf(b.b);
          if (!A || !B) return null;
          const a1 = edgePoint(A, boxOf(b.a), B, 5);
          const b1 = edgePoint(B, boxOf(b.b), A, 5);
          const dash = b.dash ? "4 3" : undefined;
          const stroke = b.dash ? SLATE : INK;
          const order = b.order ?? 1;
          if (order > 1) {
            const dx = b1.x - a1.x;
            const dy = b1.y - a1.y;
            const len = Math.max(Math.hypot(dx, dy), 1);
            const px = (-dy / len) * 3.1;
            const py = (dx / len) * 3.1;
            return (
              <g key={`b${i}`}>
                {Array.from({ length: order }).map((_, k) => {
                  const off = (k - (order - 1) / 2) * 2;
                  return (
                    <line
                      key={k}
                      x1={a1.x + px * (off / 3.1)}
                      y1={a1.y + py * (off / 3.1)}
                      x2={b1.x + px * (off / 3.1)}
                      y2={b1.y + py * (off / 3.1)}
                      stroke={stroke}
                      strokeWidth={1.6}
                      strokeDasharray={dash}
                    />
                  );
                })}
              </g>
            );
          }
          return (
            <line
              key={`b${i}`}
              x1={a1.x}
              y1={a1.y}
              x2={b1.x}
              y2={b1.y}
              stroke={stroke}
              strokeWidth={1.7}
              strokeDasharray={dash}
            />
          );
        })}

      {/* curved electron-push arrows */}
      {ready &&
        (frame.curves ?? []).map((c, i) => {
          const from = resolve(c.from);
          const to = resolve(c.to);
          if (!from || !to) return null;
          const start = c.from.startsWith("bond:")
            ? from
            : edgePoint(from, boxOf(c.from), to, 3);
          const end = c.to.startsWith("bond:")
            ? to
            : edgePoint(to, boxOf(c.to), from, 6);
          return (
            <path
              key={`c${i}`}
              d={curvePath(start.x, start.y, end.x, end.y, c.bulge)}
              fill="none"
              stroke={PINK}
              strokeWidth={1.6}
              markerEnd={`url(#${c.fish ? "mech-fish" : "mech-arrow"})`}
            />
          );
        })}

      {/* atoms: lone pairs, radicals, labels */}
      {atoms.map((a, i) => {
        const box = a.bare ? { w: 8, h: 12 } : boxes[a.id];
        const showLabel = !a.bare;
        return (
          <g key={`a${i}`}>
            {a.lp && box &&
              a.lp.angles.map((ang, k) => {
                const rad = ((90 - ang) * Math.PI) / 180;
                const hw = box.w / 2 + 3;
                const hh = box.h / 2 + 3;
                const t = Math.min(hw / Math.abs(Math.cos(rad) || 1e-9), hh / Math.abs(Math.sin(rad) || 1e-9));
                const cx = a.x + Math.cos(rad) * t;
                const cy = a.y - Math.sin(rad) * t;
                const tx = -Math.sin(rad) * 2.5;
                const ty = -Math.cos(rad) * 2.5;
                return (
                  <g key={k} fill={INK}>
                    <circle cx={cx + tx} cy={cy + ty} r={1.5} />
                    <circle cx={cx - tx} cy={cy - ty} r={1.5} />
                  </g>
                );
              })}
            {a.rad && box && (
              <circle cx={a.x + box.w / 2 + 4} cy={a.y - box.h * 0.2} r={2.1} fill={INK} />
            )}
            {showLabel && (
              <text
                ref={(el) => {
                  if (el) textRefs.current.set(a.id, el);
                  else textRefs.current.delete(a.id);
                }}
                x={a.x}
                y={a.y + 5}
                textAnchor="middle"
                fill={INK}
                fontWeight={600}
                fontSize={a.dim ? 11.5 : FONT}
                style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
              >
                {a.el}
                {a.charge && (
                  <tspan fill={PINK} fontSize={10.5} dx={1.5} dy={-4}>
                    {a.charge}
                  </tspan>
                )}
              </text>
            )}
          </g>
        );
      })}

      {/* annotation labels */}
      {labels.map((lb, i) => (
        <text
          key={`l${i}`}
          x={lb.x}
          y={lb.y}
          textAnchor="middle"
          fontSize={lb.size ?? 11}
          fontStyle={lb.italic ? "italic" : undefined}
          fontWeight={lb.bold ? 700 : undefined}
          fill={lb.color === "pink" ? PINK : lb.color === "teal" ? TEAL : lb.color === "dark" ? INK : SLATE}
        >
          {lb.text}
        </text>
      ))}

      {condition && (
        <text x={condition.x} y={condition.y} textAnchor="middle" fontSize={12.5} fontStyle="italic" fill={INK}>
          {condition.text}
        </text>
      )}

      {frame.caption && (
        <text
          x={vb.x + vb.w / 2}
          y={vb.y + vb.h - 5}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={TEAL}
          className="mech-caption"
        >
          {frame.caption.en}
        </text>
      )}
    </svg>
  );
}

function ConnectorGlyph({ c }: { c: DConnector }) {
  const isEq = c.startsWith("⇌");
  const isRes = c === "↔";
  const note = c.includes("slow")
    ? "slow"
    : c === "→hν"
      ? "hν"
      : c === "→Δ"
        ? "Δ"
        : c === "→several"
          ? "several steps"
          : null;
  return (
    <div className="mech-connector" aria-hidden>
      {note && <span className="mech-connector-note">{note}</span>}
      <span className={cn("mech-connector-glyph", (isEq || isRes) && "text-slate-400")}>
        {isEq ? "⇌" : isRes ? "↔" : "→"}
      </span>
    </div>
  );
}

export function DiagramPanel({ mechId, locale }: { mechId: string; locale: string }) {
  const diagram = getDiagram(mechId);
  const [open, setOpen] = useState(true);
  if (!diagram) return null;

  const title = locale === "fa" ? diagram.title.fa : diagram.title.en;
  const footnote = locale === "fa" ? diagram.footnote?.fa : diagram.footnote?.en;

  return (
    <div className="mech-diagram" dir="ltr">
      <button className="mech-diagram-toggle" onClick={() => setOpen(!open)}>
        <span className="mech-diagram-title">
          <span className="mech-bracket">[</span> {title} <span className="mech-bracket">]</span>
        </span>
        <span className="mech-diagram-chev">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="mech-diagram-body">
          <div className="mech-frames">
            {diagram.frames.map((f, i) => (
              <div className="mech-frame-wrap" key={i}>
                <Frame frame={f} />
                {i < diagram.frames.length - 1 && diagram.connectors?.[i] && (
                  <ConnectorGlyph c={diagram.connectors[i]} />
                )}
              </div>
            ))}
          </div>
          {footnote && <p className="mech-footnote">{footnote}</p>}
        </div>
      )}
    </div>
  );
}
