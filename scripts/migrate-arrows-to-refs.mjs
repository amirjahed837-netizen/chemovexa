/**
 * Stage 4: reversible scripted conversion of the v4 arrow corpus to explicit
 * Stage 2 references (fromRef/toRef). Geometry-preserving:
 *   - bare atom id        -> "atom:<id>"     (trimmed via measured label box, as before)
 *   - "bond:<a>:<b>"      -> unchanged       (bond midpoint, order-independent)
 * Lone-pair upgrades are deliberately NOT inferred; they change geometry and
 * belong to a later visual pass. Run with --check first, then --write.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'src/lib/chem/mechanisms/diagrams-foundations.ts',
  'src/lib/chem/mechanisms/diagrams-alkenes.ts',
  'src/lib/chem/mechanisms/diagrams-aromatics.ts',
  'src/lib/chem/mechanisms/diagrams-carbonyl.ts',
  'src/lib/chem/mechanisms/diagrams-acyl.ts',
];
const write = process.argv.includes('--write');

const refify = v =>
  v.startsWith('bond:') || v.startsWith('atom:') || v.startsWith('lonePair:') ? v : `atom:${v}`;

function loadCorpus(rel) {
  const abs = path.join(root, rel);
  const source = fs.readFileSync(abs, 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    reportDiagnostics: true, fileName: abs,
  });
  const errs = (out.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errs.length, 0, `${rel}: ${ts.formatDiagnosticsWithColorAndContext(errs, { getCanonicalFileName: f => f, getCurrentDirectory: () => root, getNewLine: () => '\n' })}`);
  const exports = {};
  vm.runInNewContext(out.outputText, {
    exports,
    require(name) { throw new Error(`${rel}: unexpected runtime require: ${name}`); },
  }, { filename: abs });
  const diagrams = Object.values(exports)[0];
  assert.ok(diagrams && typeof diagrams === 'object', `${rel}: no diagram export found`);
  return { rel, abs, source, diagrams };
}

function validateRef(ref, frame, where) {
  const atomIds = new Set(frame.atoms.map(a => a.id));
  const bondKeys = new Set(frame.bonds.map(b => [b.a, b.b].sort().join(':')));
  let kind = 'atom';
  if (ref.startsWith('bond:')) kind = 'bond';
  else if (ref.startsWith('lonePair:')) kind = 'lonePair';
  else if (!ref.startsWith('atom:')) return `${where}: malformed ref "${ref}"`;
  if (kind === 'atom') {
    const id = ref.slice(5);
    if (!atomIds.has(id)) return `${where}: atom:${id} does not exist`;
  } else if (kind === 'bond') {
    const [a, b] = ref.slice(5).split(':');
    if (!atomIds.has(a) || !atomIds.has(b)) return `${where}: bond ref "${ref}" names unknown atoms`;
    if (!bondKeys.has([a, b].sort().join(':'))) return `${where}: bond:${a}:${b} does not exist`;
  } else {
    const [id, idxRaw] = [ref.slice(9, ref.lastIndexOf(':')), ref.slice(ref.lastIndexOf(':') + 1)];
    const atom = frame.atoms.find(a => a.id === id);
    const idx = Number(idxRaw);
    if (!atom) return `${where}: lonePair:${id}:${idxRaw} names unknown atom`;
    if (!atom.lp || !Number.isInteger(idx) || idx < 0 || idx >= atom.lp.angles.length)
      return `${where}: lonePair:${id}:${idxRaw} has no displayed pair at that index`;
  }
  return null;
}

let problems = 0;
const summary = [];
for (const rel of files) {
  const { abs, source, diagrams } = loadCorpus(rel);

  // 1) walk data: count + validate post-conversion refs against each frame
  let legacy = 0, refs = 0, mixed = 0;
  for (const [id, d] of Object.entries(diagrams)) {
    d.frames.forEach((frame, fi) => {
      (frame.curves ?? []).forEach((c, ci) => {
        const where = `${rel} ${id} frame ${fi} curve ${ci}`;
        if (c.fromRef !== undefined || c.toRef !== undefined) {
          refs++;
          if (c.from !== undefined || c.to !== undefined) mixed++;
          for (const r of [c.fromRef, c.toRef]) {
            const issue = r === undefined ? `${where}: half-migrated (one ref missing)` : validateRef(r, frame, where);
            if (issue) { console.error(`FAIL ${issue}`); problems++; }
          }
        } else {
          legacy++;
          if (c.from === undefined || c.to === undefined) { console.error(`FAIL ${where}: legacy curve missing from or to`); problems++; return; }
          for (const r of [c.from, c.to]) {
            const issue = validateRef(refify(r), frame, where);
            if (issue) { console.error(`FAIL ${issue}`); problems++; }
          }
        }
      });
    });
  }

  // 2) text transform: rewrite only curve-style keys; counts must match the walk
  const next = source
    .replace(/"from":\s*"([^"]+)"/g, (m, v) => `"fromRef": "${refify(v)}"`)
    .replace(/"to":\s*"([^"]+)"/g, (m, v) => `"toRef": "${refify(v)}"`);
  const replaced = (source.match(/"from":\s*"/g) ?? []).length + (source.match(/"to":\s*"/g) ?? []).length;
  assert.equal(replaced, legacy * 2, `${rel}: text replace count ${replaced} != data curves*2 ${legacy * 2}`);
  assert.equal((next.match(/"fromRef":\s*"/g) ?? []).length, legacy + refs, `${rel}: fromRef count mismatch after rewrite`);
  assert.ok(!/"from":\s*"|(?<![\w"])("to":)\s*"/.test(next) || !/"from":\s*"/.test(next), `${rel}: legacy "from" survived rewrite`);

  summary.push(`${rel}: ${legacy} legacy converted, ${refs} already ref-based, ${mixed} mixed`);
  if (write && next !== source) fs.writeFileSync(abs, next, 'utf8');
}

console.log(summary.join('\n'));
if (problems > 0) { console.error(`${problems} problem(s); nothing written.`); process.exit(1); }
console.log(write ? 'Stage 4 migration WRITTEN.' : 'CHECK ONLY: pass --write to apply.');
