import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const STACK_CHIPS = ["Next.js", "TypeScript", "Tailwind", "3Dmol.js", "RDKit", "Python", "FastAPI", "PostgreSQL"];

function CodeWindow() {
  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-amber-300/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-slate-400">aspirin.py — rdkit</span>
      </div>

      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
        <code>
          <span className="text-slate-500">&gt;&gt;&gt; </span>
          <span className="text-violet-300">from</span>{" "}
          <span className="text-slate-200">rdkit</span>{" "}
          <span className="text-violet-300">import</span>{" "}
          <span className="text-slate-200">Chem</span>
          {"\n"}
          <span className="text-slate-500">&gt;&gt;&gt; </span>
          <span className="text-slate-200">mol = Chem.MolFromSmiles(</span>
          <span className="text-emerald-300">&quot;CC(=O)Oc1ccccc1C(=O)OH&quot;</span>
          <span className="text-slate-200">)</span>
          {"\n"}
          <span className="text-slate-500">&gt;&gt;&gt; </span>
          <span className="text-slate-200">mol.GetNumAtoms()</span>{" "}
          <span className="text-slate-600"># acetylsalicylic acid — aspirin</span>
          {"\n"}
          <span className="text-cyan-300">13</span>
          {"\n"}
          <span className="text-slate-500">&gt;&gt;&gt; </span>
          <span className="text-slate-200">Chem.MolToMolBlock(mol)</span>
          {"\n"}
          <span className="text-cyan-300">     RDKit          3D</span>
          {"\n\n"}
          <span className="animate-blink text-cyan-400" aria-hidden="true">▌</span>
        </code>
      </pre>
    </div>
  );
}

export function ScienceMeetsCode() {
  return (
    <section className="relative py-16 pb-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                The idea
              </span>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A chemist who writes{" "}
                <span className="text-gradient">production-grade software.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
                Most chemistry websites are static PDFs. This one is different: every tool is
                engineered like real software — typed, tested and deployed — while staying true to
                the science behind it.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  "Structures parsed from real chemical formats (SMILES, MOL, PDB)",
                  "Calculations validated against textbook methods",
                  "Open source — every equation auditable in the repo",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {STACK_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="glass rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/about" variant="secondary">
                  More about me
                </ButtonLink>
                <ButtonLink href="/research/literature" variant="ghost">
                  Reference library →
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div aria-hidden className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-transparent to-blue-600/15 blur-2xl" />
              <div className="relative animate-float-slow">
                <CodeWindow />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
