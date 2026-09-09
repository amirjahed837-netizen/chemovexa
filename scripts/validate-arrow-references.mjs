/** Stage 2 only: strict frame-local arrow reference tests. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url), ts=require('typescript'), React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=path.join(root,'src/components/tools/mechanisms/DiagramPanel.tsx');
const source=fs.readFileSync(sourcePath,'utf8');
const out=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020},reportDiagnostics:true,fileName:sourcePath});
assert.equal((out.diagnostics??[]).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,'TS transpile diagnostics');
const exports={};const blocked=name=>new Proxy({}, {get(){throw new Error(`Excluded app dependency touched: ${name}`)}});
vm.runInNewContext(out.outputText,{exports,console,require(name){if(name==='react'||name==='react/jsx-runtime')return require(name);if(name==='@/lib/chem/mechanisms/diagrams'||name==='@/lib/utils')return blocked(name);throw new Error(`Unexpected import: ${name}`)}},{filename:sourcePath});
const {resolveArrowReferenceV5:resolve,ReferenceAnchoringSpecimenV5:Specimen}=exports;
const frame={atoms:[{id:'nu',el:'O',x:72,y:118,lp:{n:2,angles:[90,0]}},{id:'c',el:'C',x:216,y:118},{id:'br',el:'Br',x:360,y:118}],bonds:[{a:'c',b:'br'}]};
const positions=new Map(frame.atoms.map(a=>[a.id,{x:a.x,y:a.y}]));let passed=0;
function check(name,fn){fn();passed++;console.log(`PASS ${name}`)}
check('atom ref resolves with provenance',()=>{const r=resolve(frame,'atom:c',positions);assert.deepEqual(r.kind,'atom');assert.equal(r.id,'c');assert.equal(r.point.x,216);assert.equal(r.point.y,118)});
check('bond ref resolves order-independently to midpoint',()=>{const r=resolve(frame,'bond:br:c',positions);assert.equal(r.kind,'bond');assert.equal(r.point.x,288);assert.equal(r.point.y,118)});
check('lone-pair ref resolves to a real displayed pair',()=>{const r=resolve(frame,'lonePair:nu:1',positions);assert.equal(r.kind,'lonePair');assert.equal(r.id,'nu:1');assert.ok(r.point.y<118)});
for(const ref of ['atom:missing','bond:c:missing','bond:c:nu','lonePair:nu:4','lonePair:missing:0','lonePair:nu:x','missing:c'])check(`dangling/invalid ref ${ref} throws`,()=>assert.throws(()=>resolve(frame,ref,positions),/CHEMOVEXA arrows v5/));
check('bond endpoints must exist before midpoint resolution',()=>{assert.throws(()=>resolve({...frame,bonds:[]},'bond:c:br',positions),/Dangling bond reference/)});
check('valid specimen carries both ref provenance attributes',()=>{const html=renderToStaticMarkup(React.createElement(Specimen));assert.equal((html.match(/data-anchor-from=/g)||[]).length,2);assert.match(html,/data-anchor-from="lonePair:nu:1"/);assert.match(html,/data-anchor-to="atom:br"/)});
console.log(`STAGE 2 REFERENCES ONLY: ${passed} checks passed, 0 issues.`);
const exportIndex=process.argv.indexOf('--export-dir');
if (exportIndex !== -1) {
  const dir=path.resolve(process.argv[exportIndex+1]); fs.mkdirSync(dir,{recursive:true});
  const svg=renderToStaticMarkup(React.createElement(Specimen));
  fs.writeFileSync(path.join(dir,'stage2-reference-anchors.svg'),svg.replace(/(<svg\b[^>]*>)/,'$1<rect width="100%" height="100%" fill="#faf6ec"/>'));
  fs.writeFileSync(path.join(dir,'stage2-reference-checks.json'),JSON.stringify({scope:'Stage 2 references only',passed,issues:0},null,2));
}
