"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Field, NumInput, Select, ResultRow, MethodNote } from "@/components/tools/calculator/shared";
import { faradayMass } from "@/lib/chem/electrochem";

type Substance = { id: string; label: string; n: number; M: number };

// Faraday electrolysis targets (textbook molar masses, IUPAC 2021)
const SUBSTANCES: Substance[] = [
  { id: "cu", label: "Cu²⁺ → Cu", n: 2, M: 63.546 },
  { id: "ag", label: "Ag⁺ → Ag", n: 1, M: 107.8682 },
  { id: "zn", label: "Zn²⁺ → Zn", n: 2, M: 65.38 },
  { id: "ni", label: "Ni²⁺ → Ni", n: 2, M: 58.6934 },
  { id: "h2", label: "H₂O → H₂(g)", n: 2, M: 2.016 },
  { id: "al", label: "Al³⁺ → Al", n: 3, M: 26.9815 },
];

const CUSTOM_ID = "custom";

function findSubstance(id: string): Substance {
  return SUBSTANCES.find((s) => s.id === id) ?? SUBSTANCES[0];
}

export function CoulometryTab() {
  const { t } = useI18n();
  const e = t.electro;

  const [subId, setSubId] = useState("cu");
  const [nE, setNE] = useState("2");
  const [molar, setMolar] = useState("63.546");
  const [iMa, setIMa] = useState("100");
  const [tSec, setTSec] = useState("965");

  const sub = findSubstance(subId);
  const custom = subId === CUSTOM_ID;
  const nNum = custom ? parseFloat(nE.replace(",", ".")) : sub.n;
  const mNum = custom ? parseFloat(molar.replace(",", ".")) : sub.M;
  const iA = parseFloat(iMa.replace(",", ".")) / 1000;
  const tNum = parseFloat(tSec.replace(",", "."));
  const valid =
    Number.isFinite(nNum) && nNum > 0 &&
    Number.isFinite(mNum) && mNum > 0 &&
    Number.isFinite(iA) && iA > 0 &&
    Number.isFinite(tNum) && tNum > 0;

  const res = valid ? faradayMass(iA, tNum, nNum, mNum) : null;
  const massMg = res ? res.grams * 1000 : NaN;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Field label={e.coul.substance}>
          <Select
            value={subId}
            onChange={(v) => setSubId(v)}
            options={[
              ...SUBSTANCES.map((s) => ({ value: s.id, label: s.label })),
              { value: CUSTOM_ID, label: e.coul.custom },
            ]}
          />
        </Field>
        {custom && (
          <>
            <Field label={e.coul.electrons}>
              <NumInput value={nE} onChange={setNE} />
            </Field>
            <Field label={e.coul.molar}>
              <NumInput value={molar} onChange={setMolar} />
            </Field>
          </>
        )}
        <Field label={e.coul.current} hint="mA">
          <NumInput value={iMa} onChange={setIMa} />
        </Field>
        <Field label={e.coul.time} hint="s">
          <NumInput value={tSec} onChange={setTSec} />
        </Field>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3">
          <p className="font-mono text-[11px] text-slate-400" dir="ltr">
            {e.coul.timeFor}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <ResultRow label={e.coul.charge} value={res ? res.chargeC.toFixed(1) : "—"} unit="C" />
        <ResultRow label={e.coul.molE} value={res ? (res.molElectrons * 1000).toFixed(3) : "—"} unit="mmol e⁻" />
        <ResultRow label={e.coul.molS} value={res ? (res.molSubstance * 1000).toFixed(3) : "—"} unit="mmol" />
        <ResultRow
          label={e.coul.mass}
          value={valid ? massMg.toFixed(3) : "—"}
          unit="mg"
          highlight
        />
        <MethodNote>{e.coul.note}</MethodNote>
      </div>
    </div>
  );
}
