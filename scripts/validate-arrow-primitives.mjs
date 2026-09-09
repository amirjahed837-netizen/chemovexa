/** Stage 1 ONLY: pure geometry, marker and SSR checks. Not a corpus validator.
 * Uses existing project dependencies; no packages downloaded, no file imports mocked
 * as successful. Missing app imports are blocked and must remain unused in this test.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src/components/tools/mechanisms/DiagramPanel.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  reportDiagnostics: true, fileName: sourcePath,
});
const syntaxErrors = (output.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
assert.equal(syntaxErrors.length, 0, ts.formatDiagnosticsWithColorAndContext(syntaxErrors, {
  getCanonicalFileName: f => f, getCurrentDirectory: () => root, getNewLine: () => '\n',
}));
const exports = {};
const blocked = name => new Proxy({}, { get() { throw new Error(`Stage 1 test touched excluded app dependency: ${name}`); } });
vm.runInNewContext(output.outputText, {
  exports, console,
  require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    if (name === '@/lib/chem/mechanisms/diagrams' || name === '@/lib/utils') return blocked(name);
    throw new Error(`Unexpected import in primitive test: ${name}`);
  },
}, { filename: sourcePath });
const { ARROW_V5: C, ARROW_MARKERS_V5: markers, ArrowPrimitive, validateArrowPrimitiveV5: validate,
  electronPathV5: curve, ArrowTaxonomySpecimenV5: Taxonomy, EquilibriumVariantsSpecimenV5: Equilibria,
  HomolysisSpecimenV5: Homolysis, ArrowPrimitiveReview: Review } = exports;
const h = React.createElement;
const span = { start: { x: 28, y: 82 }, end: { x: 236, y: 82 } };
let passed = 0;
const failures = [];
function check(name, run) {
  try { run(); passed++; console.log(`PASS ${name}`); }
  catch (e) { failures.push({ name, error: e.message }); console.error(`FAIL ${name}: ${e.message}`); }
}
const markup = arrow => renderToStaticMarkup(h('svg', null, h(ArrowPrimitive, { arrow })));
const attrs = (html, attribute) => [...html.matchAll(new RegExp(`${attribute}="([^"]+)"`, 'g'))].map(m => m[1]);
const shaft = (html, name) => html.match(new RegExp(`<path data-shaft="${name}"[^>]*>`))?.[0];
const value = (html, attribute) => html.match(new RegExp(`(?:^|\\s)${attribute}="([^"]+)"`))?.[1];
const segment = html => value(html, 'd').match(/-?\d+(?:\.\d+)?/g).map(Number);
const length = html => { const [x1,y1,x2,y2] = segment(html); return Math.hypot(x2-x1,y2-y1); };
check('Frozen palette and 72 px grid', () => {
  assert.equal(C.panel,'#faf6ec'); assert.equal(C.ink,'#0f172a'); assert.equal(C.pair,'#ec4899');
  assert.equal(C.single,'#f97316'); assert.equal(C.annotation,'#0891b2'); assert.equal(C.bondUnit,72);
});
check('Fishhook has exactly ONE barb and no closed path', () => {
  assert.equal(markers.fishhook.d,'M -8 5 L 0 0'); assert.equal(markers['fishhook-reverse'].d,'M -8 -5 L 0 0'); assert.equal(markers.fishhook.fill,'none'); assert.equal(markers.fishhook.width,2);
});
check('Fishhook barb switches outside the bend', () => {
  const line=shaft(markup({kind:'fishhook',...span,bend:1}),'electron');
  assert.ok(value(line,'marker-end').includes('fishhook-reverse'));
});
check('Pair head has two barbs', () => assert.equal(markers.curve.d,'M -8 -4 L 0 0 L -8 4'));
check('Five arrow kinds have distinct marker geometry', () => assert.equal(new Set(['curve','fishhook','reaction','equilibrium','resonance'].map(k=>markers[k].d)).size,5));
for (const kind of ['curve','fishhook']) {
  const a = { kind, ...span, bend: -1 };
  check(`${kind}: valid geometry`, () => assert.equal(validate(a).length,0));
  check(`${kind}: correct 2 px shaft and color`, () => {
    const line = shaft(markup(a),'electron'); assert.equal(value(line,'stroke-width'),'2');
    assert.equal(value(line,'stroke'),kind==='curve'?C.pair:C.single);
    assert.ok(value(line,'marker-end').endsWith(`-${kind})`));
  });
  check(`${kind}: coincident endpoints rejected`, () => assert.ok(validate({...a,end:a.start}).length));
  check(`${kind}: excessively short chord rejected`, () => assert.ok(validate({...a,end:{x:29,y:82}}).length));
  check(`${kind}: excessively long chord rejected`, () => assert.ok(validate({...a,end:{x:500,y:82}}).length));
  check(`${kind}: invalid bend rejected`, () => assert.ok(validate({...a,bend:0}).length));
}
for (const length of [16,36,72,144,288]) {
  check(`Curvature scales for ${length} px chord, both sides`, () => {
    for(const bend of [-1,1]) {
      const p=curve({x:0,y:0},{x:length,y:0},bend);
      assert.equal(p.control.x,length/2); assert.equal(p.control.y,length*0.28*bend);
    }
  });
}
check('Diagonal quadratic control is perpendicular to chord', () => {
  const p=curve({x:20,y:30},{x:80,y:110},1).control;
  assert.ok(Math.abs((p.x-50)*60+(p.y-70)*80)<1e-8);
});
for (const kind of ['reaction','equilibrium','resonance']) {
  const a={kind,...span,...(kind==='equilibrium'?{favored:'none'}:{})};
  check(`${kind}: valid LTR connector`, () => assert.equal(validate(a).length,0));
  check(`${kind}: reverse coordinate order rejected`, () => assert.ok(validate({...a,start:span.end,end:span.start}).length));
  check(`${kind}: non-horizontal connector rejected`, () => assert.ok(validate({...a,end:{x:236,y:83}}).length));
}
check('Reaction has one full head, not two', () => {
  const m=markup({kind:'reaction',...span}); const line=shaft(m,'connector');
  assert.equal(attrs(m,'data-shaft').length,1); assert.ok(value(line,'marker-end')); assert.equal(value(line,'marker-start'),undefined);
});
check('Resonance has one 1.5 px shaft with two full heads', () => {
  const m=markup({kind:'resonance',...span}); const line=shaft(m,'connector');
  assert.equal(attrs(m,'data-shaft').length,1); assert.equal(value(line,'stroke-width'),'1.5');
  assert.equal(value(line,'marker-start'),value(line,'marker-end'));
});
for (const favored of ['none','forward','reverse']) {
  check(`Equilibrium ${favored}: directions, preference, weight and 10 px separation`, () => {
    const m=markup({kind:'equilibrium',...span,favored});
    assert.equal(attrs(m,'data-shaft').length,2);
    const f=shaft(m,'forward'),r=shaft(m,'reverse');
    const fp=segment(f),rp=segment(r);
    assert.ok(fp[0]<fp[2]);assert.ok(rp[0]>rp[2]);assert.equal(rp[1]-fp[1],10);
    if(favored==='none'){assert.equal(length(f),length(r));assert.equal(value(f,'stroke-width'),'2');assert.equal(value(r,'stroke-width'),'2');}
    else {
      const heavy=favored==='forward'?f:r, light=favored==='forward'?r:f;
      assert.ok(Math.abs(length(light)/length(heavy)-0.64)<1e-8);
      assert.equal(value(heavy,'stroke-width'),'2');assert.equal(value(light,'stroke-width'),'1.4');
      assert.ok(value(light,'marker-end').includes('equilibrium-light'));
    }
  });
}
check('Missing favored rejected rather than assumed equal', () => assert.ok(validate({kind:'equilibrium',...span}).length));
check('Unknown favored rejected', () => assert.ok(validate({kind:'equilibrium',...span,favored:'yes'}).length));
check('Unknown kind rejected', () => assert.ok(validate({kind:'magic',...span}).length));
check('Non-finite geometry rejected', () => assert.ok(validate({kind:'reaction',...span,end:{x:NaN,y:82}}).length));
check('Too-long label rejected', () => assert.ok(validate({kind:'reaction',...span,above:'A'.repeat(23)}).length));
check('Label too wide for its shaft rejected', () => assert.ok(validate({kind:'reaction',start:{x:0,y:0},end:{x:64,y:0},above:'Ni, 200 °C'}).length));
check('Multiline and empty labels rejected', () => {
  for(const above of ['','  ','line\nbreak']) assert.ok(validate({kind:'reaction',...span,above}).length);
});
check('Conditions and rate labels have separate teal lanes', () => {
  const m=markup({kind:'reaction',...span,above:'Ni, 200 °C',below:'slow'});
  assert.match(m,/fill="#0891b2"/);assert.match(m,/data-label="above" x="132" y="60"/);assert.match(m,/data-label="below" x="132" y="112"/);
});
check('Invalid render throws loudly', () => assert.throws(()=>markup({kind:'fishhook',...span,bend:0}),/CHEMOVEXA arrows v5/));
const taxonomy=renderToStaticMarkup(h(Taxonomy));
const homolysis=renderToStaticMarkup(h(Homolysis));
const equilibria=renderToStaticMarkup(h(Equilibria));
const review=renderToStaticMarkup(h(Review));
check('Taxonomy exports all five arrow kinds', () => assert.equal(new Set(attrs(taxonomy,'data-arrow-kind')).size,5));
check('Every marker ID is unique across the entire repeated review page', () => {
  const ids=attrs(review,'id'); assert.equal(ids.length,new Set(ids).size);
});
check('All marker references resolve in the review page', () => {
  const ids=new Set(attrs(review,'id'));
  for(const ref of review.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.has(ref[1]),ref[1]);
});
check('Markers use actual internal pixels and tip-aligned references', () => {
  for (const marker of review.matchAll(/<marker\b[^>]+>/g)) {
    assert.equal(value(marker[0],'markerUnits'),'userSpaceOnUse');assert.equal(value(marker[0],'refX'),'0');assert.equal(value(marker[0],'refY'),'0');
    assert.equal(value(marker[0],'orient'),'auto-start-reverse');
  }
});
check('RTL host is present; every specimen SVG stays explicitly LTR', () => {
  assert.match(review,/dir="rtl" lang="fa"/);
  for(const svg of review.matchAll(/<svg\b[^>]+>/g)) assert.equal(value(svg[0],'direction'),'ltr');
});
check('Homolysis has two orange fishhooks from one bond midpoint', () => {
  assert.equal(attrs(homolysis,'data-arrow-kind').filter(k=>k==='fishhook').length,2);
  const shafts=[...homolysis.matchAll(/<path data-shaft="electron"[^>]+>/g)].map(m=>m[0]);
  for(const s of shafts){assert.ok(value(s,'d').startsWith('M 132 112 Q'));assert.equal(value(s,'stroke'),C.single);}
  assert.match(homolysis,/<text x="96" y="118">H<\/text>/);assert.match(homolysis,/<text x="168" y="118">H<\/text>/);
});
console.log(`\nSTAGE 1 PRIMITIVES ONLY: ${passed} checks passed, ${failures.length} issues.`);
console.log('Not checked: chemistry context, fromRef/toRef, all 29 diagrams, real Next build, browser hydration or fonts.');
console.log(`Runtime: Node ${process.version}, TypeScript ${ts.version}, React ${React.version}`);
if(failures.length) process.exitCode=1;
const exportIndex=process.argv.indexOf('--export-dir');
if(exportIndex!==-1 && !failures.length) {
  assert.ok(process.argv[exportIndex+1],'Provide a directory after --export-dir');
  const dir=path.resolve(process.argv[exportIndex+1]); fs.mkdirSync(dir,{recursive:true});
  // A painted background makes standalone SVG/PDF consumers match CSS in the page.
  const background=svg=>svg.replace(/(<svg\b[^>]*>)/,'$1<rect width="100%" height="100%" fill="#faf6ec"/>');
  const write=(name,text)=>fs.writeFileSync(path.join(dir,name),text);
  write('after-taxonomy.svg',background(taxonomy));write('after-homolysis.svg',background(homolysis));write('after-equilibrium-variants.svg',background(equilibria));
  // Reconstruct just the old primitive on the SAME specimen path. This is not a
  // screenshot of the original app or a claim that a corpus record was migrated.
  const oldMarker=source.match(/<marker id="mech-fish"[\s\S]*?<\/marker>/)?.[0];
  assert.ok(oldMarker,'Original v4 fish marker must remain intact');
  const oldSvgMarker=oldMarker.replaceAll('{PINK}',`"${C.pair}"`).replaceAll('strokeWidth','stroke-width');
  const oldPaths=[...homolysis.matchAll(/<path data-shaft="electron"[^>]+>/g)].map(m=> {
    const d=value(m[0],'d');
    return `<path d="${d}" fill="none" stroke="${C.pair}" stroke-width="1.6" marker-end="url(#mech-fish)"/>`;
  }).join('');
  const before=`<svg xmlns="http://www.w3.org/2000/svg" width="264" height="216" viewBox="0 0 264 216" dir="ltr" role="img" aria-label="v4 primitive reconstruction on the same H-H fixture, not a live app capture"><rect width="264" height="216" fill="${C.panel}"/><defs>${oldSvgMarker}</defs><g fill="${C.annotation}" font-family="Arial,sans-serif" font-size="13"><text x="20" y="28">H-H homolysis</text><text x="132" y="58" text-anchor="middle">hν</text></g><line x1="104" y1="112" x2="160" y2="112" stroke="${C.ink}" stroke-width="1.7"/>${oldPaths}<g fill="${C.ink}" text-anchor="middle" font-family="monospace" font-size="16" font-weight="600"><text x="96" y="118">H</text><text x="168" y="118">H</text></g><g fill="${C.annotation}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13"><text x="132" y="162">Old defect: two magenta barbs.</text><text x="132" y="184">Same 72 px bond and arrow paths.</text></g></svg>`;
  write('before-homolysis-v4-primitives.svg',before);
  const inner=s=>s.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>$/,'');
  const comparison=`<svg xmlns="http://www.w3.org/2000/svg" width="576" height="300" viewBox="0 0 576 300" dir="ltr"><rect width="576" height="300" fill="${C.panel}"/><g font-family="Arial,sans-serif" fill="${C.ink}" font-size="18" font-weight="700"><text x="24" y="30">Before: v4 primitives</text><text x="312" y="30">After: v5 primitives</text></g><g transform="translate(12 42)">${inner(before)}</g><g transform="translate(300 42)">${inner(homolysis)}</g><text x="24" y="282" fill="${C.annotation}" font-family="Arial,sans-serif" font-size="12">Controlled fixture comparison, not a Vercel screenshot or corpus migration.</text></svg>`;
  write('before-after-homolysis.svg',comparison);
  write('review-static.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHEMOVEXA Stage 1, static export</title><style>body{margin:0;background:${C.panel}}svg{max-width:none}*:focus-visible{outline:2px solid ${C.annotation};outline-offset:4px}</style><body>${review}</body></html>`);
  write('primitive-checks.json',JSON.stringify({scope:'Stage 1 primitives only',passed,issues:failures,node:process.version,typescript:ts.version,react:React.version},null,2));
  console.log(`Exported SVG specimens and static HTML to ${dir}`);
}
