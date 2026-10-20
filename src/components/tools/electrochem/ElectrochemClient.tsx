"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { TitrationClient } from "@/components/tools/titration/TitrationClient";
import { PhMeterTab } from "./PhMeterTab";
import { PotentiometryTab } from "./PotentiometryTab";
import { CoulometryTab } from "./CoulometryTab";
import { VoltammetryTab } from "./VoltammetryTab";

const TAB_IDS = ["titration", "ph", "potentiometry", "coulometry", "voltammetry"] as const;
type TabId = (typeof TAB_IDS)[number];

export function ElectrochemClient() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("titration");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.electro.tabs.voltammetry}>
        {TAB_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "rounded-lg border px-3.5 py-2 text-sm transition-colors",
              tab === id
                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
            )}
          >
            {t.electro.tabs[id]}
          </button>
        ))}
      </div>
      {tab === "titration" && <TitrationClient />}
      {tab === "ph" && <PhMeterTab />}
      {tab === "potentiometry" && <PotentiometryTab />}
      {tab === "coulometry" && <CoulometryTab />}
      {tab === "voltammetry" && <VoltammetryTab />}
    </div>
  );
}
