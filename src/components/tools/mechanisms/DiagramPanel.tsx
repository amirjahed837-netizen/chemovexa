"use client";

import { useState } from "react";
import type { DAtom, DBond, DConnector, DFrame, MechanismDiagram } from "@/lib/chem/mechanisms/diagrams";
import { getDiagram } from "@/lib/chem/mechanisms/diagrams";
import { cn } from "@/lib/utils";

const W = 520;
const H = 200;

const COLORS = {
  dark: "var(--mech-ink)",
  pink: "var(--mech-pink)",
  teal: "var(--mech-teal)",
  slate: "var(--mech-slate)",
};

/** estimate label width for text anchoring */
const labelW = (s: string, size: number) => s.length * size * 0.62;

function CurvePath({ x1, y1, x2, y2, bulge = 30 }: { x1: number; y1: number; x2: number; y2: number; bulge?: number }) {
  // perpendicular control point
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(Math.hypot(dx, dy), 1);
  // unit perpendicular (rotate 90°)
  const px = -dy / len;
  const py = dx / len;
  const cx = mx + px * bulge;
  const cy = my + py * bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function atomPos(atoms: DAtom[], id: string): { x: number; y: number } | null {
  const a = atoms.find((x) => x.id === id);
  return a ? { x: a.x, y: a.y } : null;
}

function bondMid(atoms: DAtom[], bonds: DBond[], key: string): { x: number; y: number } | null {
  // key = "bond:<a>:<b>" (sorted)
  const m = key.match(/^bond:(.+):(.+)$/);
  if (!m) return null;
  const [, a, b] = m;
  const pa = atomPos(atoms, a);
  const pb = atomPos(atoms, b);
  if (!pa || !pb) return null;
  return { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
}

/** anchor point on the edge of an atom's label box, toward a target */
function edgeToward(a: { x: number; y: number }, label: string, target: { x: number; y: number }, pad = 14) {
  const w = labelW(label, 15) / 2 + pad;
  const h = 11 + pad;
  const dx = target.x - a.x;
  const dy = target.y - a.y;
  if (dx === 0 && dy === 0) return a;
  const sx = w / Math.abs(dx || 1e-9);
  const sy = h / Math.abs(dy || 1e-9);
  const s = Math.min(sx, sy);
  return { x: a.x + dx * s, y: a.y + dy * s };
}

function resolvePoint(
  atoms: DAtom[],
  bonds: DBond[],
  ref: string
): { x: number; y: number } | null {
  if (ref.startsWith("bond:")) return bondMid(atoms, bonds, ref);
  return atomPos(atoms, ref);
}

function Frame({ frame }: { frame: DFrame }) {
  const atoms = frame.atoms;
  const bonds = frame.bonds;
  const curves = frame.curves ?? [];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mech-frame" role="img">
      <defs>
        {/* full-head arrow for electron PAIRS */}
        <marker
          id="mech-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--mech-pink)" />
        </marker>
        {/* fishhook (half-head) for single ELECTRONS (radicals) */}
        <marker
          id="mech-fish"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7.5"
          markerHeight="7.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="var(--mech-pink)" strokeWidth="1.6" />
        </marker>
      </defs>

      {/* bonds */}
      {bonds.map((b, i) => {
        const pa = atomPos(atoms, b.a);
        const pb = atomPos(atoms, b.b);
        if (!pa || !pb) return null;
        const A = atoms.find((x) => x.id === b.a)!;
        const B = atoms.find((x) => x.id === b.b)!;
        // trim to label edges so lines don't cross text
        const ta = edgeToward(pa, A.bare ? "" : A.el, pb, A.bare ? 8 : 13);
        const tb = edgeToward(pb, B.bare ? "" : B.el, pa, B.bare ? 8 : 13);
        const stroke = b.dash ? "var(--mech-slate)" : COLORS.dark;
        const dash = b.dash ? "4 3" : undefined;

        if (b.order === 2 || b.order === 3) {
          // offset parallel lines
          const dx = tb.x - ta.x;
          const dy = tb.y - ta.y;
          const len = Math.max(Math.hypot(dx, dy), 1);
          const px = (-dy / len) * 3.2;
          const py = (dx / len) * 3.2;
          const lines = [];
          for (let k = 0; k < (b.order ?? 1); k++) {
            const off = (k - (b.order! - 1) / 2) * 2;
            lines.push(
              <line
                key={k}
                x1={ta.x + px * (off / 3.2)}
                y1={ta.y + py * (off / 3.2)}
                x2={tb.x + px * (off / 3.2)}
                y2={tb.y + py * (off / 3.2)}
                stroke={stroke}
                strokeWidth={1.6}
                strokeDasharray={dash}
              />
            );
          }
          return <g key={`b${i}`}>{lines}</g>;
        }
        return (
          <line
            key={`b${i}`}
            x1={ta.x}
            y1={ta.y}
            x2={tb.x}
            y2={tb.y}
            stroke={stroke}
            strokeWidth={1.7}
            strokeDasharray={dash}
          />
        );
      })}

      {/* curved arrows (on top of bonds) */}
      {curves.map((c, i) => {
        const from = resolvePoint(atoms, bonds, c.from);
        const to = resolvePoint(atoms, bonds, c.to);
        if (!from || !to) return null;
        // start/end on label edges
        const startRef = c.from.startsWith("bond:")
          ? from
          : (() => {
              const A = atoms.find((x) => x.id === c.from)!;
              return edgeToward(from, A.bare ? "" : A.el, to, 6);
            })();
        const endRef = c.to.startsWith("bond:")
          ? to
          : (() => {
              const B = atoms.find((x) => x.id === c.to)!;
              return edgeToward(to, B.bare ? "" : B.el, from, 8);
            })();
        const d = CurvePath({ x1: startRef.x, y1: startRef.y, x2: endRef.x, y2: endRef.y, bulge: c.bulge });
        const marker = c.fish ? "mech-fish" : "mech-arrow";
        return (
          <path
            key={`c${i}`}
            d={d}
            fill="none"
            stroke={COLORS.pink}
            strokeWidth={1.6}
            markerEnd={`url(#${marker})`}
          />
        );
      })}

      {/* lone pairs + radicals + atoms */}
      {atoms.map((a, i) => {
        const label = a.bare ? "" : a.el;
        return (
          <g key={`a${i}`}>
            {/* lone pairs */}
            {a.lp?.angles.map((ang, k) => {
              const rad = ((90 - ang) * Math.PI) / 180; // 0°=right, CCW, y inverted
              const r = 15;
              const cx = a.x + Math.cos(rad) * r;
              const cy = a.y - Math.sin(rad) * r;
              // two dots perpendicular to radial direction
              const tx = -Math.sin(rad) * 2.6;
              const ty = -Math.cos(rad) * 2.6;
              return (
                <g key={k} fill={COLORS.dark}>
                  <circle cx={cx + tx} cy={cy + ty} r={1.5} />
                  <circle cx={cx - tx} cy={cy - ty} r={1.5} />
                </g>
              );
            })}
            {a.rad && <circle cx={a.x + labelW(label, 15) / 2 + 4} cy={a.y - 8} r={2.2} fill={COLORS.dark} />}
            {label && (
              <text
                x={a.x}
                y={a.y + 5}
                textAnchor="middle"
                className="mech-atom"
                fill={COLORS.dark}
                fontWeight={600}
              >
                {label}
                {a.charge && (
                  <tspan className="mech-charge" fill={COLORS.pink} fontSize={11} dx={2} dy={-4}>
                    {a.charge}
                  </tspan>
                )}
              </text>
            )}
          </g>
        );
      })}

      {/* labels */}
      {frame.labels?.map((lb, i) => (
        <text
          key={`l${i}`}
          x={lb.x}
          y={lb.y}
          textAnchor="middle"
          fontSize={lb.size ?? 11}
          fontStyle={lb.italic ? "italic" : undefined}
          fontWeight={lb.bold ? 700 : undefined}
          fill={COLORS[lb.color ?? "slate"]}
        >
          {lb.text}
        </text>
      ))}

      {/* condition over arrow */}
      {frame.condition && (
        <text
          x={frame.condition.x}
          y={frame.condition.y}
          textAnchor="middle"
          fontSize={13}
          fontStyle="italic"
          fill={COLORS.dark}
        >
          {frame.condition.text}
        </text>
      )}

      {/* caption under the frame */}
      {frame.caption && (
        <text
          x={W / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize={11}
          fill={COLORS.teal}
          fontWeight={600}
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
