"use client";

import { useEffect, useRef } from "react";
import type { MolAtom } from "@/lib/chem/molfile";

export type ViewerStyleKey = "ballstick" | "stick" | "spacefill";

const STYLE_PRESETS: Record<ViewerStyleKey, Record<string, unknown>> = {
  ballstick: { stick: { radius: 0.13 }, sphere: { scale: 0.3 } },
  stick: { stick: { radius: 0.16, colorscheme: "default" } },
  spacefill: { sphere: { scale: 1.0 } },
};

type Props = {
  molfile: string;
  format?: string;
  atoms?: MolAtom[] | null;
  styleKey: ViewerStyleKey;
  showLabels: boolean;
  spinning: boolean;
};

export function MoleculeViewer({ molfile, format = "mol", atoms, styleKey, showLabels, spinning }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<{ v: unknown; key: number } | null>(null);
  const spinRef = useRef(false);

  // (re)build scene whenever structure or display options change
  useEffect(() => {
    let disposed = false;
    const container = containerRef.current;
    if (!container) return;

    async function build() {
      try {
        if (typeof window === "undefined") return;
        const mod: unknown = await import("3dmol");
        const lib =
          typeof mod === "function"
            ? mod
            : ((mod as { default?: unknown }).default ?? mod) as Record<string, unknown>;
        if (disposed || !containerRef.current) return;

        let viewer = viewerRef.current?.v as
          | {
              clear: () => void;
              addModel: (d: string, f: string) => void;
              setStyle: (sel: object, style: object) => void;
              render: () => void;
              zoomTo: () => void;
              resize: () => void;
              removeAllLabels: () => void;
              addLabel: (t: string, o: object) => void;
              spin: (a: string) => void;
              stopSpin: () => void;
              setBackgroundColor: (c: string) => void;
            }
          | null;

        if (!viewerRef.current) {
          const el = containerRef.current;
          const created = (
            lib as {
              createViewer?: (
                el: HTMLElement,
                cfg: Record<string, unknown>,
              ) => unknown;
            }
          ).createViewer;
          if (!el || !created) throw new Error("3Dmol createViewer not found");
          viewer = created(el, { backgroundColor: "#070d1a", antialias: true }) as never;
          viewerRef.current = { v: viewer, key: 0 };
        }
        if (!viewer || disposed) return;

        viewer.clear();
        viewer.addModel(molfile, format);
        viewer.setStyle({}, STYLE_PRESETS[styleKey]);

        viewer.removeAllLabels();
        if (showLabels && atoms) {
          for (const a of atoms) {
            viewer.addLabel(a.el, {
              position: { x: a.x, y: a.y, z: a.z },
              fontSize: 11,
              fontColor: "#cffafe",
              showBackground: false,
              alignment: "center",
              inFront: true,
            });
          }
        }

        viewer.zoomTo();
        viewer.render();

        if (spinRef.current !== spinning) {
          try {
            if (spinning) viewer.spin("y");
            else viewer.stopSpin();
          } catch {
            /* spin unsupported */
          }
          spinRef.current = spinning;
        }
      } catch (err) {
        console.error("3Dmol init failed:", err);
      }
    }
    build();

    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [molfile, format, styleKey, showLabels]);

  useEffect(() => {
    const v = viewerRef.current?.v as { spin: (a: string) => void; stopSpin: () => void } | undefined;
    if (!v) return;
    try {
      if (spinning) v.spin("y");
      else v.stopSpin();
      spinRef.current = spinning;
    } catch {
      /* noop */
    }
  }, [spinning]);

  // keep canvas sized to its container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const v = viewerRef.current?.v as { resize: () => void } | undefined;
      try {
        v?.resize();
      } catch {
        /* noop */
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} className="h-[380px] w-full sm:h-[440px]" />;
}
