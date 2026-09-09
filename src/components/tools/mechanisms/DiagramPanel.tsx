"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DAtom, DBond, DConnector, DFrame, MechanismDiagram } from "@/lib/chem/mechanisms/diagrams";
import { getDiagram } from "@/lib/chem/mechanisms/diagrams";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** ---- geometry pipeline v3 -------------------------------------------------
 * 1. relax: ALL bonds (incl. dashed/forming) pulled toward BOND_LEN target —
 *    both min and max clamp, so nothing is stretched or cramped.
 * 2. measure exact label boxes via getBBox.
 * 3. bonds/arrows/lone-pairs trimmed to measured edges.
 * 4. charges auto-positioned next to their atom (no floating text).
 * ------------------------------------------------------------------------- */

const BOND_LEN = 72; // target visual length for every bond
const FONT = 14;

type Pt = { x: number; y: number };
type Box = { w: number; h: number };

function relax(atoms: DAtom[], bonds: DBond[]) {
  const p = new Map<string, Pt>(atoms.map((a) => [a.id, { x: a.x, y: a.y }]));
  const anchor = new Set<string>();
  // atoms involved in dashed (forming/breaking) bonds between two fragments
  // keep them put — the DASH GAP is the chemistry (distance being crossed)
  bonds.forEach((b) => {
    if (b.dash) {
      anchor.add(b.a);
      anchor.add(b.b);
    }
  });
  const deg = new Map<string, number>();
  bonds.forEach((b) => {
    deg.set(b.a, (deg.get(b.a) ?? 0) + 1);
    deg.set(b.b, (deg.get(b.b) ?? 0) + 1);
  });
  for (let iter = 0; iter < 6; iter++) {
    for (const b of bonds) {
      if (b.dash) continue; // dashed bonds keep their intended gap
      const A = p.get(b.a);
      const B = p.get(b.b);
      if (!A || !B) continue;
      const d = Math.hypot(B.x - A.x, B.y - A.y) || 1e-9;
      const err = d - BOND_LEN;
      if (Math.abs(err) < 1) continue;
      const wA = anchor.has(b.a) ? 0 : 1 / (deg.get(b.a) ?? 1);
      const wB = anchor.has(b.b) ? 0 : 1 / (deg.get(b.b) ?? 1);
      const tot = wA + wB;
      if (tot === 0) continue;
      const ux = (B.x - A.x) / d;
      const uy = (B.y - A.y) / d;
      A.x += (ux * err * wA) / tot;
      A.y += (uy * err * wA) / tot;
      B.x -= (ux * err * wB) / tot;
      B.y -= (uy * err * wB) / tot;
    }
  }
  return p;
}

/** intersection of ray from atom toward target with the atom's label box + pad */
function edgePoint(from: Pt, box: Box | undefined, to: Pt, pad: number): Pt {
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

function Frame({ frame, locale }: { frame: DFrame; locale: string }) {
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const textRefs = useRef<Map<string, SVGTextElement>>(new Map());

  const layout = useMemo(() => {
    const pos = relax(frame.atoms, frame.bonds);
    const atoms = frame.atoms.map((a) => ({ ...a, ...pos.get(a.id)! }));

    // shift annotations with the centroid
    let cx = 0;
    let cy = 0;
    let ox = 0;
    let oy = 0;
    atoms.forEach((a) => {
      cx += a.x;
      cy += a.y;
    });
    frame.atoms.forEach((a) => {
      ox += a.x;
      oy += a.y;
    });
    cx /= atoms.length;
    cy /= atoms.length;
    ox /= frame.atoms.length;
    oy /= frame.atoms.length;
    const sx = cx - ox;
    const sy = cy - oy;
    const labels = (frame.labels ?? []).map((l) => ({ ...l, x: l.x + sx, y: l.y + sy }));
    const condition = frame.condition
      ? { ...frame.condition, x: frame.condition.x + sx, y: frame.condition.y + sy }
      : undefined;

    // charges become their own positioned labels (attached to atom corner)
    const chargeLabels: { x: number; y: number; text: string; atomId: string }[] = [];
    atoms.forEach((a) => {
      if (!a.charge || a.bare) return;
      // place at upper-right unless bond occupies that quadrant, then upper-left
      const neighbors = frame.bonds
        .filter((b) => b.a === a.id || b.b === a.id)
        .map((b) => pos.get(b.a === a.id ? b.b : b.a))
        .filter(Boolean) as Pt[];
      const hasBondToward = (dx: number, dy: number) =>
        neighbors.some((n) => {
          const ndx = n.x - a.x;
          const ndy = n.y - a.y;
          const dot = ndx * dx + ndy * dy;
          const nl = Math.hypot(ndx, ndy) || 1;
          return dot > 0 && Math.abs(ndx / nl - dx) < 0.5 && Math.abs(ndy / nl - dy) < 0.5;
        });
      let qx = 1;
      let qy = -1;
      if (hasBondToward(1, -0.4)) {
        qx = -1;
        if (hasBondToward(-1, -0.4)) qy = 1;
      }
      const off = 13;
      chargeLabels.push({
        x: a.x + qx * off,
        y: a.y + qy * off,
        text: a.charge,
        atomId: a.id,
      });
    });

    // tight viewBox
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
    atoms.forEach((a) => consider(a.x, a.y, 36, 16));
    chargeLabels.forEach((c) => consider(c.x, c.y, 10, 8));
    labels.forEach((l) => consider(l.x, l.y, (l.text.length * (l.size ?? 11) * 0.55) / 2 + 4, 9));
    if (condition) consider(condition.x, condition.y, 26, 10);
    const pad = 12;
    const capH = frame.caption ? 17 : 5;
    const vb = {
      x: Math.floor(minX - pad),
      y: Math.floor(minY - pad),
      w: Math.ceil(maxX - minX + pad * 2),
      h: Math.ceil(maxY - minY + pad * 2 + capH),
    };
    return { atoms, labels, condition, chargeLabels, vb };
  }, [frame]);

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
    const t = setTimeout(measure, 350);
    return () => clearTimeout(t);
  }, [layout]);

  const { atoms, labels, condition, chargeLabels, vb } = layout;
  const boxOf = (id: string): Box | undefined => {
    const a = atoms.find((x) => x.id === id);
    if (!a) return undefined;
    if (a.bare) return { w: 8, h: 12 };
    return boxes[id];
  };
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

  const captionText = frame.caption ? (locale === "fa" ? frame.caption.fa : frame.caption.en) : null;

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      className="mech-frame"
      style={{ maxHeight: 250 }}
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

      {/* bonds */}
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

      {/* curved arrows */}
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

      {/* atoms */}
      {atoms.map((a, i) => {
        const box = a.bare ? { w: 8, h: 12 } : boxes[a.id];
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
            {!a.bare && (
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
              </text>
            )}
          </g>
        );
      })}

      {/* charges — drawn attached to their atom corner */}
      {chargeLabels.map((c, i) => (
        <text
          key={`q${i}`}
          x={c.x}
          y={c.y}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={PINK}
        >
          {c.text}
        </text>
      ))}

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

      {captionText && (
        <text
          x={vb.x + vb.w / 2}
          y={vb.y + vb.h - 5}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={TEAL}
          className="mech-caption"
        >
          {captionText}
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
  const { t } = useI18n();
  const m = t.pages.mechanisms;
  const diagram = getDiagram(mechId);
  const [open, setOpen] = useState(true);
  if (!diagram) return null;

  const title = locale === "fa" ? diagram.title.fa : diagram.title.en;
  const footnote = locale === "fa" ? diagram.footnote?.fa : diagram.footnote?.en;
  const bodyId = `mech-diagram-${mechId}`;
  const toggleText = open ? m.diagramCollapse : m.diagramExpand;

  return (
    <div className="mech-diagram" dir="ltr">
      <button
        className="mech-diagram-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={bodyId}
        aria-label={`${toggleText}: ${title}`}
      >
        <span className="mech-diagram-title">
          <span className="mech-bracket">[</span> {title} <span className="mech-bracket">]</span>
        </span>
        <span className="mech-diagram-chev" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div className="mech-diagram-body" id={bodyId}>
          <div className="mech-frames">
            {diagram.frames.map((f, i) => (
              <div className="mech-frame-wrap" key={i}>
                <Frame frame={f} locale={locale} />
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

// STAGE 1 ISOLATION BOUNDARY
// The legacy renderer above never calls these primitives. Corpus wiring waits
// for visual approval and Stage 2 reference resolution.
import { useId } from "react";

export const ARROW_V5 = {
  panel: "#faf6ec", ink: "#0f172a", pair: "#ec4899", single: "#f97316",
  annotation: "#0891b2", bondUnit: 72,
} as const;
export type ArrowPointV5 = Readonly<{ x: number; y: number }>;
type ArrowSpanV5 = { start: ArrowPointV5; end: ArrowPointV5 };
/** Render-only geometry, NOT the Stage 2 mechanism DSL. Forward is always LTR. */
export type ArrowPrimitiveV5 = ArrowSpanV5 & (
  | { kind: "curve" | "fishhook"; bend: 1 | -1 }
  | { kind: "reaction"; above?: string; below?: string }
  | { kind: "equilibrium"; favored: "forward" | "reverse" | "none"; above?: string; below?: string }
  | { kind: "resonance" }
);

/** Primitive guard only. This is NOT the Stage 5 chemistry/corpus validator. */
export function validateArrowPrimitiveV5(arrow: ArrowPrimitiveV5): string[] {
  const issues: string[] = [];
  if (!["curve", "fishhook", "reaction", "equilibrium", "resonance"].includes(arrow.kind)) return ["Unknown arrow kind."];
  if (![arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y].every(Number.isFinite)) return ["Arrow coordinates must be finite."];
  const dx = arrow.end.x - arrow.start.x;
  const dy = arrow.end.y - arrow.start.y;
  const length = Math.hypot(dx, dy);
  if (arrow.kind === "curve" || arrow.kind === "fishhook") {
    if (length < 16 || length > 288) issues.push("Electron-arrow chord must be 16..288 internal px.");
    if (arrow.bend !== 1 && arrow.bend !== -1) issues.push("Bend must be +1 or -1.");
  } else {
    if (dy !== 0 || dx < 64) issues.push("Connector must be horizontal, LTR, and at least 64 internal px long.");
    if (arrow.kind === "reaction" || arrow.kind === "equilibrium") {
      for (const label of [arrow.above, arrow.below]) {
        if (label !== undefined && (label.trim().length === 0 || label.length > 22 || /[\r\n]/.test(label) || label.length * 8 + 16 > dx)) {
          issues.push("Connector label must be one short line that fits its reserved lane.");
        }
      }
      if (arrow.kind === "equilibrium" && !["forward", "reverse", "none"].includes(arrow.favored)) issues.push("Equilibrium requires an explicit forward, reverse, or none preference.");
    }
  }
  return issues;
}

/** Quadratic control offset = 0.28 times chord length, perpendicular to chord. */
export function electronPathV5(start: ArrowPointV5, end: ArrowPointV5, bend: 1 | -1) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const control = { x: (start.x + end.x) / 2 - dy * 0.28 * bend, y: (start.y + end.y) / 2 + dx * 0.28 * bend };
  return { control, d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}` };
}

export const ARROW_MARKERS_V5 = {
  curve: { d: "M -8 -4 L 0 0 L -8 4", fill: "none", stroke: ARROW_V5.pair, width: 2 },
  // Exactly ONE segment. No closing segment and no second chevron barb.
  fishhook: { d: "M -8 5 L 0 0", fill: "none", stroke: ARROW_V5.single, width: 2 },
  "fishhook-reverse": { d: "M -8 -5 L 0 0", fill: "none", stroke: ARROW_V5.single, width: 2 },
  reaction: { d: "M -9 -4 L 0 0 L -9 4 Z", fill: ARROW_V5.ink, stroke: "none", width: 0 },
  equilibrium: { d: "M -8 -5 L 0 0", fill: "none", stroke: ARROW_V5.ink, width: 2 },
  "equilibrium-light": { d: "M -8 -5 L 0 0", fill: "none", stroke: ARROW_V5.ink, width: 1.4 },
  resonance: { d: "M -7 -3 L 0 0 L -7 3 Z", fill: ARROW_V5.ink, stroke: "none", width: 0 },
} as const;

function ArrowMarkersV5({ prefix }: { prefix: string }) {
  return <defs>{Object.entries(ARROW_MARKERS_V5).map(([name, marker]) => (
    <marker key={name} id={`${prefix}-${name}`} data-marker-kind={name}
      viewBox="-11 -8 14 16" refX={0} refY={0} markerWidth={14} markerHeight={16}
      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
      <path d={marker.d} fill={marker.fill} stroke={marker.stroke} strokeWidth={marker.width} strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  ))}</defs>;
}

/** Render inside an LTR SVG. useId prevents duplicate marker IDs on a page. */
export function ArrowPrimitive({ arrow }: { arrow: ArrowPrimitiveV5 }) {
  const id = useId();
  const prefix = `chem-v5-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const issues = validateArrowPrimitiveV5(arrow);
  // Fail closed in all environments, not silently wrong in production.
  if (issues.length) throw new Error(`[CHEMOVEXA arrows v5] ${issues.join(" ")}`);
  const marker = (name: keyof typeof ARROW_MARKERS_V5) => `url(#${prefix}-${name})`;
  const { start, end } = arrow;
  const midX = (start.x + end.x) / 2;
  const span = end.x - start.x;
  return <g data-arrow-kind={arrow.kind} direction="ltr" style={{ unicodeBidi: "isolate" }}>
    <ArrowMarkersV5 prefix={prefix} />
    {(arrow.kind === "curve" || arrow.kind === "fishhook") && (
      <path data-shaft="electron" d={electronPathV5(start, end, arrow.bend).d} fill="none"
        stroke={arrow.kind === "curve" ? ARROW_V5.pair : ARROW_V5.single} strokeWidth={2}
        strokeLinecap="round" markerEnd={marker(arrow.kind === "fishhook" && arrow.bend === 1 ? "fishhook-reverse" : arrow.kind)} />
    )}
    {(arrow.kind === "reaction" || arrow.kind === "resonance") && (
      <path data-shaft="connector" d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        fill="none" stroke={ARROW_V5.ink} strokeWidth={arrow.kind === "reaction" ? 2 : 1.5}
        markerStart={arrow.kind === "resonance" ? marker("resonance") : undefined} markerEnd={marker(arrow.kind)} />
    )}
    {arrow.kind === "equilibrium" && (["forward", "reverse"] as const).map((direction) => {
      const light = arrow.favored !== "none" && arrow.favored !== direction;
      const length = span * (light ? 0.64 : 1);
      const left = midX - length / 2;
      const right = midX + length / 2;
      const y = start.y + (direction === "forward" ? -5 : 5);
      return <path key={direction} data-shaft={direction} data-favored={arrow.favored === direction ? "true" : "false"}
        d={direction === "forward" ? `M ${left} ${y} L ${right} ${y}` : `M ${right} ${y} L ${left} ${y}`}
        fill="none" stroke={ARROW_V5.ink} strokeWidth={light ? 1.4 : 2}
        markerEnd={marker(light ? "equilibrium-light" : "equilibrium")} />;
    })}
    {(arrow.kind === "reaction" || arrow.kind === "equilibrium") && (
      <g fill={ARROW_V5.annotation} fontSize={13} fontFamily="ui-monospace, monospace" textAnchor="middle">
        {arrow.above && <text data-label="above" x={midX} y={start.y - 22}>{arrow.above}</text>}
        {arrow.below && <text data-label="below" x={midX} y={start.y + 30}>{arrow.below}</text>}
      </g>
    )}
  </g>;
}

/** Fixed 72 px H-H homolysis fixture. No mechanism data is migrated here. */
export function HomolysisSpecimenV5() {
  const left = { x: 96, y: 112 };
  const right = { x: left.x + ARROW_V5.bondUnit, y: left.y };
  const source = { x: (left.x + right.x) / 2, y: left.y };
  return <svg xmlns="http://www.w3.org/2000/svg" width={264} height={216} viewBox="0 0 264 216" direction="ltr" role="img"
    aria-label="H-H homolysis: two orange half-barbs leave the same sigma bond, one to each hydrogen." style={{ background: ARROW_V5.panel }}>
    <g fill={ARROW_V5.annotation} fontFamily="Arial, sans-serif" fontSize={13}>
      <text x={20} y={28}>H-H homolysis</text><text x={132} y={58} textAnchor="middle">hν</text>
    </g>
    <line x1={left.x + 8} y1={left.y} x2={right.x - 8} y2={right.y} stroke={ARROW_V5.ink} strokeWidth={1.7} />
    <ArrowPrimitive arrow={{ kind: "fishhook", start: source, end: { x: left.x + 1, y: left.y - 10 }, bend: 1 }} />
    <ArrowPrimitive arrow={{ kind: "fishhook", start: source, end: { x: right.x - 1, y: right.y - 10 }, bend: -1 }} />
    <g fill={ARROW_V5.ink} textAnchor="middle" fontFamily="monospace" fontSize={16} fontWeight={600}>
      <text x={left.x} y={left.y + 6}>H</text><text x={right.x} y={right.y + 6}>H</text>
    </g>
    <g fill={ARROW_V5.annotation} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={13}>
      <text x={132} y={162}>One bond pair, two destinations.</text><text x={132} y={184}>72 px between atom centers.</text>
    </g>
  </svg>;
}

const REVIEW_LABELS_V5 = [
  ["curve", "01  Electron pair", "Two electrons. Both barbs."],
  ["fishhook", "02  Fishhook", "One electron. One barb."],
  ["reaction", "03  Reaction", "One shaft. One direction."],
  ["equilibrium", "04  Equilibrium", "Two shafts. Opposite half-heads."],
  ["resonance", "05  Resonance", "One shaft. Two full heads."],
] as const;

/** SVG exports use this exact review-page component, not a second renderer. */
export function ArrowTaxonomySpecimenV5() {
  return <svg xmlns="http://www.w3.org/2000/svg" width={1320} height={276} viewBox="0 0 1320 276" direction="ltr" role="img"
    aria-label="Five arrow primitives side by side. Fixed specimen anchors, not the future reference engine." style={{ background: ARROW_V5.panel, flexShrink: 0 }}>
    {REVIEW_LABELS_V5.map(([kind, title, caption], i) => <g key={kind} transform={`translate(${i * 264} 0)`}>
      <g fill={ARROW_V5.annotation} fontFamily="Arial, sans-serif" fontSize={14}>
        <text x={20} y={30} fontWeight={700}>{title}</text><text x={20} y={244} fontSize={12}>{caption}</text>
      </g>
      {(kind === "curve" || kind === "fishhook") ? <>
        <g fill={ARROW_V5.ink} fontFamily="monospace" fontSize={17} fontWeight={600} textAnchor="middle">
          <text x={54} y={168}>{kind === "curve" ? "O" : "Br"}</text><text x={204} y={168}>C</text>
        </g>
        <g fill={ARROW_V5.annotation} fontSize={13} fontFamily="monospace">
          {kind === "curve" && <text x={64} y={154}>−</text>}<text x={212} y={154}>+</text>
        </g>
        {/* Specimen sources: lone-pair midpoint or radical dot. */}
        <g fill={ARROW_V5.ink}>
          <circle cx={kind === "curve" ? 51.5 : 54} cy={142} r={1.8} />
          {kind === "curve" && <circle cx={56.5} cy={142} r={1.8} />}
        </g>
        <ArrowPrimitive arrow={{ kind, start: { x: 54, y: 142 }, end: { x: 204, y: 150 }, bend: -1 }} />
        <text x={20} y={212} fill={ARROW_V5.annotation} fontFamily="Arial, sans-serif" fontSize={12}>Isolated source / destination fixture</text>
      </> : <>
        <g fill={ARROW_V5.annotation} fontFamily="Arial, sans-serif" fontSize={12}>
          <text x={28} y={76}>{kind === "resonance" ? "Same species: form A" : "State A"}</text>
          <text x={236} y={212} textAnchor="end">{kind === "resonance" ? "Same species: form B" : "State B"}</text>
        </g>
        <ArrowPrimitive arrow={kind === "reaction"
          ? { kind, start: { x: 28, y: 146 }, end: { x: 236, y: 146 }, above: "Ni, 200 °C", below: "slow" }
          : kind === "equilibrium"
            ? { kind, start: { x: 28, y: 146 }, end: { x: 236, y: 146 }, favored: "forward", above: "forward favored" }
            : { kind, start: { x: 28, y: 146 }, end: { x: 236, y: 146 } }} />
      </>}
    </g>)}
  </svg>;
}

export function EquilibriumVariantsSpecimenV5() {
  return <svg xmlns="http://www.w3.org/2000/svg" width={792} height={148} viewBox="0 0 792 148" direction="ltr" role="img"
    aria-label="Equilibrium: equal, forward favored, reverse favored. Top is always forward." style={{ background: ARROW_V5.panel }}>
    {(["none", "forward", "reverse"] as const).map((favored, i) => <g key={favored} transform={`translate(${i * 264} 0)`}>
      <ArrowPrimitive arrow={{ kind: "equilibrium", start: { x: 28, y: 82 }, end: { x: 236, y: 82 }, favored, above: favored === "none" ? "no preference" : `${favored} favored` }} />
      <text x={132} y={132} textAnchor="middle" fontSize={12} fontFamily="Arial, sans-serif" fill={ARROW_V5.annotation}>Top: A to B. Bottom: B to A.</text>
    </g>)}
  </svg>;
}

/** Throwaway route. Native-size SVGs scroll; shrinking would change the 72 px unit. */
export function ArrowPrimitiveReview() {
  return <main dir="ltr" style={{ background: ARROW_V5.panel, color: ARROW_V5.ink, padding: "32px 24px 64px", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
    <header style={{ maxWidth: "70ch", marginBottom: 32 }}>
      <p style={{ color: ARROW_V5.annotation, fontSize: 13, letterSpacing: "0.08em", fontWeight: 700 }}>CHEMOVEXA / STAGE 1 REVIEW</p>
      <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: "16px 0", lineHeight: 1.12 }}>One electron must never look like two.</h1>
      <p style={{ fontSize: 16, lineHeight: 1.5 }}>Primitive specimens only. The 29 mechanisms still use the original renderer. Ref anchoring, wedge/hash bonds and corpus validation are not included in this checkpoint.</p>
    </header>
    <section aria-label="Five arrow kinds">
      <div tabIndex={0} role="region" aria-label="Arrow comparison, scroll horizontally on narrow screens" style={{ overflowX: "auto" }}><ArrowTaxonomySpecimenV5 /></div>
    </section>
    <section style={{ marginTop: 40 }} aria-labelledby="eq-v5-review">
      <h2 id="eq-v5-review" style={{ fontSize: 24, marginBottom: 12 }}>Preference is data, not decoration.</h2>
      <div tabIndex={0} role="region" aria-label="Equilibrium variants, scroll horizontally on narrow screens" style={{ overflowX: "auto" }}><EquilibriumVariantsSpecimenV5 /></div>
    </section>
    <section style={{ marginTop: 40 }} aria-labelledby="homolysis-v5-review">
      <h2 id="homolysis-v5-review" style={{ fontSize: 24, marginBottom: 12 }}>A bond gives one electron to each atom.</h2>
      <HomolysisSpecimenV5 />
    </section>
    <section dir="rtl" lang="fa" style={{ marginTop: 40, fontFamily: "var(--font-vazirmatn, Vazirmatn, sans-serif)" }} aria-labelledby="rtl-v5-review">
      <h2 id="rtl-v5-review" style={{ fontSize: 24, marginBottom: 12 }}>آزمون جهت نمایش</h2>
      <p style={{ fontSize: 16 }}>جهت پیکان‌ها با تغییر زبان صفحه عوض نمی‌شود.</p>
      <div dir="ltr" tabIndex={0} role="region" aria-label="Same specimens inside a Persian RTL section" style={{ overflowX: "auto", textAlign: "left" }}><ArrowTaxonomySpecimenV5 /></div>
    </section>
    <p style={{ marginTop: 32, maxWidth: "70ch", fontSize: 16, lineHeight: 1.5 }}>Review at 100% browser zoom and phone width. Check the orange half-barb, the two equilibrium shafts, and the single double-headed resonance shaft. Do not merge or begin Stage 2 before approval.</p>
  </main>;
}
