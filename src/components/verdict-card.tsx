"use client";

import type { Verdict, CostEstimate, ViewMode } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VerdictCardProps {
  verdict: Verdict;
  cost: CostEstimate;
  location: string;
  mode: ViewMode;
  countLabel: string;
}

const VERDICT_CONFIG = {
  no: {
    label: "Probably not worth it",
    description:
      "Your area doesn't get enough extreme temperatures to justify the cost.",
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
      "Your area gets enough heat that aircon would make a real difference to your comfort.",
    border: "border-l-orange-500",
    accent: "text-orange-600 dark:text-orange-400",
  },
} as const;

export function VerdictCard({ verdict, mode, countLabel }: VerdictCardProps) {
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
            {verdict.averageCount}
          </p>
          <p className="text-sm text-muted-foreground">
            {countLabel} per year, on average
          </p>
        </div>

        <div className="flex-1 space-y-2">
          <p className="font-heading font-semibold text-sm">
            {config.label}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mode === "daytime"
              ? "Based on how many days per year your area exceeds the temperature threshold during the day."
              : mode === "both"
                ? "Based on the combined count of hot days and warm nights in your area."
                : config.description}
          </p>
          {verdict.trend !== "stable" && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {Math.abs(verdict.trendPercent)}%{" "}
                {verdict.trend === "increasing" ? "more" : "fewer"}{" "}
                {countLabel} than a decade ago
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
