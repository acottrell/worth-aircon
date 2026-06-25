"use client";

import type { CostEstimate } from "@/lib/types";
import { PoundSterling } from "lucide-react";

interface CostContextProps {
  cost: CostEstimate;
  avgWarmNights: number;
}

export function CostContext({ cost, avgWarmNights }: CostContextProps) {
  if (avgWarmNights === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm font-heading font-semibold">
        <PoundSterling className="h-4 w-4" />
        Cost per night you actually use it
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-heading font-bold tabular-nums">
            £{cost.portablePerNight.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Portable unit
          </p>
          <p className="text-xs text-muted-foreground">
            £{cost.portablePurchase} over {cost.portableLifespan} yrs ({"≈"}{Math.round(avgWarmNights * cost.portableLifespan)} nights of use) + electricity
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-heading font-bold tabular-nums">
            £{cost.splitPerNight.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Installed split system
          </p>
          <p className="text-xs text-muted-foreground">
            £{cost.splitInstall.toLocaleString()} over {cost.splitLifespan} yrs ({"≈"}{Math.round(avgWarmNights * cost.splitLifespan)} nights of use) + electricity
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground border-t pt-3">
        Based on ~{avgWarmNights} warm nights per year. Assumes
        £0.245/kWh, 8 hours per night. Portable units use ~1kW, split
        systems ~0.4kW. Purchase and installation costs vary.
      </p>
    </div>
  );
}
