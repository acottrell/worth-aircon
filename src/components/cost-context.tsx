"use client";

import type { CostEstimate, ViewMode } from "@/lib/types";
import { PoundSterling } from "lucide-react";

interface CostContextProps {
  mode: ViewMode;
  overnightCost: CostEstimate;
  daytimeCost: CostEstimate;
  avgWarmNights: number;
  avgHotDays: number;
}

function CostRow({
  label,
  cost,
  avgCount,
  unitLabel,
}: {
  label: string;
  cost: CostEstimate;
  avgCount: number;
  unitLabel: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm font-heading font-semibold">
        <PoundSterling className="h-4 w-4" />
        {label}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-heading font-bold tabular-nums">
            £{cost.portablePerNight.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Portable unit</p>
          <p className="text-xs text-muted-foreground">
            £{cost.portablePurchase} over {cost.portableLifespan} yrs ({"≈"}
            {Math.round(avgCount * cost.portableLifespan)} {unitLabel}s of use)
            + electricity
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-heading font-bold tabular-nums">
            £{cost.splitPerNight.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Installed split system</p>
          <p className="text-xs text-muted-foreground">
            £{cost.splitInstall.toLocaleString()} over {cost.splitLifespan} yrs
            ({"≈"}
            {Math.round(avgCount * cost.splitLifespan)} {unitLabel}s of use) +
            electricity
          </p>
        </div>
      </div>
    </>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function CostContext({
  mode,
  overnightCost,
  daytimeCost,
  avgWarmNights,
  avgHotDays,
}: CostContextProps) {
  if (mode === "overnight" && avgWarmNights === 0) return null;
  if (mode === "daytime" && avgHotDays === 0) return null;
  if (mode === "both" && avgWarmNights === 0 && avgHotDays === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg border bg-card p-5 space-y-4">
      {mode === "overnight" && (
        <CostRow
          label="Cost per night you use it"
          cost={overnightCost}
          avgCount={avgWarmNights}
          unitLabel="night"
        />
      )}

      {mode === "daytime" && (
        <CostRow
          label="Cost per day you use it"
          cost={daytimeCost}
          avgCount={avgHotDays}
          unitLabel="day"
        />
      )}

      {mode === "both" && (() => {
        const totalUses = avgWarmNights + avgHotDays;
        const portablePerUse = totalUses > 0
          ? overnightCost.portablePurchase / (totalUses * overnightCost.portableLifespan) + overnightCost.portableElecPerNight
          : 0;
        const splitPerUse = totalUses > 0
          ? overnightCost.splitInstall / (totalUses * overnightCost.splitLifespan) + overnightCost.splitElecPerNight
          : 0;
        return (
          <CostRow
            label="Cost each time you use it"
            cost={{ ...overnightCost, portablePerNight: round2(portablePerUse), splitPerNight: round2(splitPerUse) }}
            avgCount={totalUses}
            unitLabel="use"
          />
        );
      })()}

      <p className="text-xs text-muted-foreground border-t pt-3">
        Based on Ofgem price cap (Q3 2026) of £0.26/kWh, 8 hours per use.
        Portable units draw ~1kW, split systems ~0.4kW. Your tariff may differ.
      </p>
    </div>
  );
}
