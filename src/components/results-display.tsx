"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { CheckResponse, ViewMode } from "@/lib/types";
import { summarizeYear, computeVerdict, estimateCost } from "@/lib/verdict";
import {
  DEFAULT_OVERNIGHT_THRESHOLD,
  DEFAULT_DAYTIME_THRESHOLD,
} from "@/lib/constants";
import { VerdictCard } from "./verdict-card";
import { TrendChart } from "./trend-chart";
import { ThresholdSlider } from "./threshold-slider";
import { CostContext } from "./cost-context";
import { ShareButton } from "./share-button";
import { ViewSwitcher } from "./view-switcher";

interface ResultsDisplayProps {
  results: CheckResponse;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [mode, setMode] = useState<ViewMode>("overnight");
  const [overnightThreshold, setOvernightThreshold] = useState(
    DEFAULT_OVERNIGHT_THRESHOLD
  );
  const [daytimeThreshold, setDaytimeThreshold] = useState(
    DEFAULT_DAYTIME_THRESHOLD
  );
  const topRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!hasScrolled.current && topRef.current) {
      hasScrolled.current = true;
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const summaries = useMemo(
    () =>
      results.years.map((y) =>
        summarizeYear(y, mode, overnightThreshold, daytimeThreshold)
      ),
    [results.years, mode, overnightThreshold, daytimeThreshold]
  );

  const verdict = useMemo(
    () => computeVerdict(summaries, mode),
    [summaries, mode]
  );

  const overnightAvg = useMemo(() => {
    const s = results.years.map((y) =>
      summarizeYear(y, "overnight", overnightThreshold, daytimeThreshold)
    );
    return computeVerdict(s, "overnight").averageCount;
  }, [results.years, overnightThreshold, daytimeThreshold]);

  const daytimeAvg = useMemo(() => {
    const s = results.years.map((y) =>
      summarizeYear(y, "daytime", overnightThreshold, daytimeThreshold)
    );
    return computeVerdict(s, "daytime").averageCount;
  }, [results.years, overnightThreshold, daytimeThreshold]);

  const overnightCost = useMemo(
    () => estimateCost(overnightAvg),
    [overnightAvg]
  );
  const daytimeCost = useMemo(
    () => estimateCost(daytimeAvg),
    [daytimeAvg]
  );

  const countLabel =
    mode === "overnight"
      ? "warm nights"
      : mode === "daytime"
        ? "hot days"
        : "uncomfortable days";

  return (
    <div ref={topRef} className="w-full space-y-6 scroll-mt-20">
      <p className="text-sm text-muted-foreground">
        Results for{" "}
        <span className="font-semibold text-foreground">
          {results.location}
        </span>
      </p>

      <ViewSwitcher mode={mode} onChange={setMode} />

      <VerdictCard
        verdict={verdict}
        cost={overnightCost}
        location={results.location}
        mode={mode}
        countLabel={countLabel}
      />

      <TrendChart summaries={summaries} mode={mode} countLabel={countLabel} />

      {mode === "both" ? (
        <div className="w-full max-w-md mx-auto space-y-4">
          <ThresholdSlider
            label="Overnight threshold"
            defaultLabel="16°C (NHS sleep range)"
            value={overnightThreshold}
            onChange={setOvernightThreshold}
          />
          <ThresholdSlider
            label="Daytime threshold"
            defaultLabel="25°C (Met Office hot day)"
            value={daytimeThreshold}
            onChange={setDaytimeThreshold}
          />
        </div>
      ) : mode === "daytime" ? (
        <ThresholdSlider
          label="Daytime temperature threshold"
          defaultLabel="25°C (Met Office hot day)"
          value={daytimeThreshold}
          onChange={setDaytimeThreshold}
        />
      ) : (
        <ThresholdSlider
          label="Overnight temperature threshold"
          defaultLabel="16°C (NHS ideal sleep range)"
          value={overnightThreshold}
          onChange={setOvernightThreshold}
        />
      )}

      <CostContext
        mode={mode}
        overnightCost={overnightCost}
        daytimeCost={daytimeCost}
        avgWarmNights={overnightAvg}
        avgHotDays={daytimeAvg}
      />

      <div className="flex justify-center">
        <ShareButton
          location={results.location}
          count={verdict.averageCount}
          postcode={results.postcode}
          mode={mode}
        />
      </div>
    </div>
  );
}
