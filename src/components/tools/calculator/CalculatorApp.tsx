"use client";

import { useState } from "react";
import { MolarMass } from "./MolarMass";
import { Stoichiometry } from "./Stoichiometry";
import { Solutions } from "./Solutions";
import { AcidsBases } from "./AcidsBases";
import { UnitConverter } from "./UnitConverter";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "molar", label: "Molar Mass" },
  { id: "stoich", label: "Stoichiometry" },
  { id: "solutions", label: "Solutions" },
  { id: "ph", label: "Acids & Bases" },
  { id: "units", label: "Units" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CalculatorApp() {
  const [tab, setTab] = useState<TabId>("molar");

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Calculator tools"
        className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              tab === t.id
                ? "bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <GlassCard key={tab} className="animate-fade-in p-6 sm:p-8">
        {tab === "molar" && <MolarMass />}
        {tab === "stoich" && <Stoichiometry />}
        {tab === "solutions" && <Solutions />}
        {tab === "ph" && <AcidsBases />}
        {tab === "units" && <UnitConverter />}
      </GlassCard>
    </div>
  );
}
