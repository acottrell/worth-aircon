"use client";

import type { Verdict, CostEstimate } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VerdictCardProps {
  verdict: Verdict;
  cost: CostEstimate;
  location: string;
}

const VERDICT_CONFIG = {
  no: {
    label: "Probably not worth it",
    description:
      "Your area doesn't get enough warm nights to justify the cost.",
    border: "border-l-emerald-500",
    accent: "text-emerald-700 dark:text-emerald-400",
  },
  borderline: {
    label: "Borderline",
    description:
      "It depends on your heat tolerance and budget. A portable unit could be worth trying.",
    border: "border-l-amber-500",
    accent: "text-amber-700 dark:text-amber-400",
  },
  yes: {
    label: "Worth considering",
    description:
      "Your area gets enough warm nights that aircon would meaningfully improve your sleep.",
    border: "border-l-orange-500",
    accent: "text-orange-600 dark:text-orange-400",
  },
} as const;

export function VerdictCard({ verdict }: VerdictCardProps) {
  const config = VERDICT_CONFIG[verdict.level];
  const TrendIcon =
    verdict.trend === "increasing"
      ? TrendingUp
      : verdict.trend === "decreasing"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={`rounded-lg border border-l-4 ${config.border} bg-card p-5 sm:p-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
        <div className="space-y-0.5">
          <p
            className={`text-4xl sm:text-5xl font-heading font-bold tabular-nums ${config.accent}`}
          >
            {verdict.averageWarmNights}
          </p>
          <p className="text-sm text-muted-foreground">
            warm nights per year, on average
          </p>
        </div>

        <div className="flex-1 space-y-2">
          <p className="font-heading font-semibold text-sm">
            {config.label}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.description}
          </p>
          {verdict.trend !== "stable" && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {Math.abs(verdict.trendPercent)}%{" "}
                {verdict.trend === "increasing" ? "more" : "fewer"} vs 5
                years ago
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
