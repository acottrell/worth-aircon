"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { CheckResponse } from "@/lib/types";
import { summarizeYear, computeVerdict, estimateCost } from "@/lib/verdict";
import { DEFAULT_THRESHOLD_CELSIUS } from "@/lib/constants";
import { VerdictCard } from "./verdict-card";
import { TrendChart } from "./trend-chart";
import { ThresholdSlider } from "./threshold-slider";
import { CostContext } from "./cost-context";
import { ShareButton } from "./share-button";

interface ResultsDisplayProps {
  results: CheckResponse;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD_CELSIUS);
  const topRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!hasScrolled.current && topRef.current) {
      hasScrolled.current = true;
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const summaries = useMemo(
    () => results.years.map((y) => summarizeYear(y, threshold)),
    [results.years, threshold]
  );

  const verdict = useMemo(() => computeVerdict(summaries), [summaries]);
  const cost = useMemo(
    () => estimateCost(verdict.averageWarmNights),
    [verdict.averageWarmNights]
  );

  return (
    <div ref={topRef} className="w-full space-y-6 scroll-mt-20">
      <p className="text-sm text-muted-foreground">
        Results for{" "}
        <span className="font-semibold text-foreground">
          {results.location}
        </span>
      </p>

      <VerdictCard
        verdict={verdict}
        cost={cost}
        location={results.location}
      />

      <TrendChart summaries={summaries} />

      <ThresholdSlider value={threshold} onChange={setThreshold} />

      <CostContext cost={cost} avgWarmNights={verdict.averageWarmNights} />

      <div className="flex justify-center">
        <ShareButton
          location={results.location}
          warmNights={verdict.averageWarmNights}
          postcode={results.postcode}
        />
      </div>
    </div>
  );
}
