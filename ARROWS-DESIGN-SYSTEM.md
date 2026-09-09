# CHEMOVEXA arrow design system

## Stage 1 checkpoint, awaiting visual approval

This is the markers-and-primitives checkpoint only. It is not the completed v5 mission.
The supplied snapshot identifies itself as commit `7464751`. This handoff does not
claim to represent the current remote `main` branch.

The original `DiagramPanel`, `Frame`, `ConnectorGlyph`, layout logic and data DSL
are unchanged. New exports are appended below a clearly marked isolation boundary
in `DiagramPanel.tsx`. The temporary route is:

```
/chemistry/mechanisms/arrow-review
```

No mechanism record uses the new primitives. All five diagram-data files and the
existing lone-pair fields remain untouched. No equation cleanup, page navigation,
SEO, localization dictionaries or production UX changes are included.

## Frozen visual roles

| Role | Value |
| --- | --- |
| Panel | `#faf6ec` |
| Skeletons and inter-state connector strokes | `#0f172a` |
| Two-electron motion | `#ec4899` |
| Single-electron motion | `#f97316` |
| Labels and charges in specimens | `#0891b2` |
| Internal bond-length unit | 72 internal px |

The review SVGs use their native internal scale rather than shrinking to fit a
phone. Their surrounding regions scroll horizontally and are keyboard focusable.
SVG `direction="ltr"` plus LTR HTML wrappers prevents locale direction from changing
reaction direction. The review includes an RTL Persian host around a second copy
of the same specimens. It requests the host's Vazirmatn font; actual font loading
must be checked in the complete app. No font dependency or global CSS was changed.

## Five kinds, seven marker definitions

Seven definitions implement five semantic kinds: fishhooks need mirrored single
barbs for the two bend directions; equilibrium needs normal and lighter heads.
No marker uses the font-dependent Unicode arrow glyph as its actual geometry.

| Kind | Shaft | Head | Stage 1 render-only fields |
| --- | --- | --- | --- |
| `curve` | Magenta 2 px quadratic | Full open chevron, both barbs | `kind`, `start`, `end`, `bend` |
| `fishhook` | Orange 2 px quadratic | Exactly one open barb, on the outside of the bend | `kind`, `start`, `end`, `bend` |
| `reaction` | Dark 2 px, horizontal | Filled single triangle | `kind`, `start`, `end`, optional `above`, `below` |
| `equilibrium` | Two opposite dark half-arrows, 10 px apart | One outward half-head per shaft | `kind`, `start`, `end`, required `favored`, optional `above`, `below` |
| `resonance` | One dark 1.5 px horizontal shaft | Small filled head at each end | `kind`, `start`, `end` |

`start` and `end` are resolved `{ x, y }` points. **They are not the future
mechanism-authoring DSL.** They are deliberately restricted to the isolated test
page until Stage 2 creates and validates `fromRef` / `toRef` data references.

Every marker uses `markerUnits="userSpaceOnUse"`: changing shaft weight cannot
accidentally scale a head. The tip is at `(0,0)` with `refX=refY=0`. A padded marker
viewBox contains the round caps and joins. `auto-start-reverse` points the resonance
start head backwards. React `useId()` gives every rendered primitive unique marker
IDs, including the repeated specimen in the RTL section.

### Electron-pair and fishhook details

A pair head is `M -8 -4 L 0 0 L -8 4`.
A fishhook is `M -8 5 L 0 0` for `bend: -1` or `M -8 -5 L 0 0` for `bend: 1`.
Each fishhook has one segment and no closing segment. It is not an unfilled full
chevron. Choosing the outside barb keeps it separate from the incoming shaft.

The quadratic control point is:

```ts
const dx = end.x - start.x;
const dy = end.y - start.y;
const control = {
  x: (start.x + end.x) / 2 - dy * 0.28 * bend,
  y: (start.y + end.y) / 2 + dx * 0.28 * bend,
};
```

Thus the perpendicular control offset is 0.28 times the chord length, and the
maximum curve displacement from that chord is 0.14 times its length. The current
primitive guard accepts chords from 16 to 288 internal px. These limits are a
reviewed primitive operating range, not a substitute for atom-collision checking.
The old renderer's `bulge` geometry is intentionally unchanged.

### Equilibrium preference

`favored` must explicitly be `forward`, `reverse` or `none`. It is never silently
inferred as equal. Forward always means left to right on the top shaft. Reverse
means right to left on the bottom shaft, independent of locale.

The favored shaft is the full requested length at 2 px. The unfavored shaft is
centered, 64% as long, and 1.4 px thick, including its marker stroke. With `none`,
both shafts are full length and 2 px. The specimen shows all three options.

The caller will eventually place equilibrium between reaction frames and resonance
between contributors of the same species. **Stage 1 does not yet enforce species
identity or reaction-frame membership.** That belongs to the later semantic DSL
and corpus validator, not a shape primitive.

### Connector labels

Above-label baseline is 22 px above the connector center; below-label baseline is
30 px below it. Both use teal, 13 px monospace text. The guard rejects blank,
multiline and over-22-character labels, and labels whose conservative estimated
width (`8 * length + 16`) exceeds the connector span. Connectors must be horizontal,
left-to-right and at least 64 px long.

The test layout reserves separate frame-name and caption lanes. Its labels were
visually inspected in SVG exports. The width guard is NOT a font-measured promise
for arbitrary localized text or future frame layouts. Actual app-font bounds and
frame-caption collisions remain integration checks.

## Usage in the review page only

```tsx
import { ArrowPrimitive } from "@/components/tools/mechanisms/DiagramPanel";

<div dir="ltr">
  <svg width={264} height={148} viewBox="0 0 264 148" direction="ltr">
    <ArrowPrimitive arrow={{
      kind: "equilibrium",
      start: { x: 28, y: 82 },
      end: { x: 236, y: 82 },
      favored: "reverse",
      above: "reverse favored",
    }} />
  </svg>
</div>
```

Do not copy these point coordinates into mechanism data. The review's electron
specimens use a displayed lone pair or radical dot and a displayed destination
atom. The H-H fixture uses the displayed 72 px bond's midpoint and one destination
at each atom. These are controlled fixtures with fixed label sizes, not a generic
reference resolver or measured atom-box anchoring engine.

Invalid primitive geometry throws a named error in both development and production
instead of silently drawing a misleading arrow. Dangling-reference behavior is
not implemented yet because this checkpoint has no reference-based authoring DSL.

## Reproducible Stage 1 checks

From the complete project with its dependencies already installed:

```bash
npx tsc --noEmit
npm run build
node scripts/validate-arrow-primitives.mjs
node scripts/validate-arrow-primitives.mjs --export-dir .arrow-review-exports
```

The primitive script uses the project's existing TypeScript and React dependencies.
It transpiles the actual renderer and renders the actual exported specimen
components with React server rendering. Legacy application dependencies are blocked
by a throwing proxy, not silently implemented or reported as tested. Calling one
would fail the test. This isolates the new primitives without requiring a complete
Next application in the input archive.

The script checks marker topology and distinctness, 2 px electron shafts, mirrored
barb selection, quadratic scaling, connector orientation, preference lengths and
weights, label lanes and rejection cases, duplicate marker IDs, marker references,
explicit SVG direction, the RTL host and the 72 px homolysis fixture. It exits
nonzero on any issue. **Its zero-issue report covers Stage 1 primitives only.**

## Verification actually performed for this handoff

| Check | Exit | Meaning |
| --- | --- | --- |
| `npx tsc --noEmit` | 127 | Command unavailable: this sandbox has no npx. No full-project tsc result. |
| `npm run build` | 127 | Command unavailable: this sandbox has no npm or Next installation. No build result. |
| `node scripts/validate-arrow-primitives.mjs --export-dir …` | 0 | 52 primitive checks passed; 0 primitive issues. |
| Isolated strict TypeScript check using the installed compiler directly | 0 | Renderer, review route and imported diagram types/data checked. Missing `@/lib/utils` was declaration-stubbed. Not the full app. |
| SVG exports and PNG rasterization | 0 | Actual React specimen SVGs rendered through libvips/librsvg; inspected at native and 2x sizes. |

Local check runtime: Node 22.23.1, TypeScript 5.6.3, React 18.2.0. The supplied
project requests React 19.2.8 and Next 16.3.3. The dependency/version mismatch is
why the complete project must be checked locally and on the preview, even though
the isolated checks passed.

A browser capture was attempted but no Chromium executable is installed, and the
sandbox has no internet access for installing one. No browser hydration, browser
screenshot, live preview or font-loading result is claimed.

An initial CairoSVG rasterization revealed a renderer limitation: its quadratic
path implementation records zero marker tangents, incorrectly orienting curved
arrowheads. Those PNGs were discarded. Final PNGs use librsvg via libvips on the
unmodified SVG exports. No chemistry geometry was altered to accommodate CairoSVG.

The before image reconstructs v4's exact fishhook marker and 1.6 px magenta shaft
on the same H-H fixture paths as the after image. It is a controlled primitive
comparison, not a screenshot of a migrated real mechanism. The old full chevron
becomes a true orange half-barb without changing bond or endpoint placement.

## Not implemented, intentionally

Stage 2: checked `fromRef` / `toRef`, explicit electron-source IDs, atom/bond/lone-pair
resolution, measured tangent-aware head trimming and dangling-reference errors.

Stage 3: `regularPolygon`, `tetrahedral`, `trigonal` and linear center helpers,
wedge/hash bonds trimmed to measured labels, and the three representative
mechanism layouts. These helpers have no callable API yet; this document will
receive actual usage examples at that checkpoint, not fictional implementations.

Stage 4: reversible scripted conversion of the full corpus and old lone-pair fields.

Stage 5: all-diagram reference, chemistry-context, equilibrium/resonance identity,
bond-length, ring-angle and Bézier/atom-box collision validation.

Until those stages ship, there is no validated workflow for adding v5 arrows to
a new real mechanism. Add only isolated primitive specimens, use real visible
source/destination fixtures, run the primitive suite and request visual review.

## Maintainer visual gate

On the branch preview, open `/chemistry/mechanisms/arrow-review`. Check at 100%
zoom and at narrow phone width in Chromium and Safari/Firefox. The orange half-barb
must remain immediately distinguishable from the magenta full chevron, in both
left- and right-pointing homolysis arrows. Check all three equilibrium preferences
and compare them with the single double-headed resonance shaft. Check label lanes,
marker tips, missing/clipped heads, horizontal scrolling and keyboard focus.

Confirm the Persian host loads Vazirmatn without reversing or reordering any
specimen, and that repeated components have no marker-ID/hydration warnings. Visit
the normal mechanism library and confirm its pre-existing diagrams are unchanged.
Do not interpret the small Stage 1 suite as proof that existing anchoring defects
have been fixed.

No branch was created or pushed, no commit was made, and no preview was deployed
from this sandbox. The accompanying handoff instructions describe the maintainer's
single Stage 1 commit on `design/arrows-v5`. Do not merge to `main`, or begin
Stage 2, before explicit maintainer approval of the branch preview.
