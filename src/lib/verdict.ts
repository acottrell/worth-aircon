import type {
  YearData,
  YearSummary,
  Verdict,
  CostEstimate,
  NightData,
} from "./types";

const PORTABLE_PURCHASE = 300;
const PORTABLE_KW = 1;
const PORTABLE_LIFESPAN_YEARS = 3;

const SPLIT_INSTALL = 2500;
const SPLIT_KW = 0.4;
const SPLIT_LIFESPAN_YEARS = 10;

const NIGHT_HOURS = 8;
const UK_ELECTRICITY_RATE = 0.245;

export function summarizeYear(
  yearData: YearData,
  threshold: number
): YearSummary {
  const warmNights = yearData.nights.filter(
    (n) => n.minTemp >= threshold
  );
  const hottestNight = yearData.nights.reduce<NightData | null>(
    (max, n) => (!max || n.minTemp > max.minTemp ? n : max),
    null
  );

  return {
    year: yearData.year,
    warmNights: warmNights.length,
    totalNights: yearData.nights.length,
    hottestNight,
    isPartialYear: yearData.isPartialYear,
  };
}

export function computeVerdict(summaries: YearSummary[]): Verdict {
  const fullYears = summaries.filter((s) => !s.isPartialYear);
  if (fullYears.length === 0) {
    return {
      averageWarmNights: 0,
      trend: "stable",
      trendPercent: 0,
      level: "no",
    };
  }

  const avg =
    fullYears.reduce((sum, y) => sum + y.warmNights, 0) /
    fullYears.length;

  const sorted = [...fullYears].sort((a, b) => a.year - b.year);
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  let trendPercent = 0;

  if (sorted.length >= 4) {
    const firstHalf = sorted.slice(0, 2);
    const secondHalf = sorted.slice(-2);
    const firstAvg =
      firstHalf.reduce((s, y) => s + y.warmNights, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((s, y) => s + y.warmNights, 0) / secondHalf.length;

    if (firstAvg > 0) {
      trendPercent = Math.round(
        ((secondAvg - firstAvg) / firstAvg) * 100
      );
      if (trendPercent > 30) trend = "increasing";
      else if (trendPercent < -30) trend = "decreasing";
    }
  }

  const level = avg < 5 ? "no" : avg > 15 ? "yes" : "borderline";

  return {
    averageWarmNights: Math.round(avg * 10) / 10,
    trend,
    trendPercent,
    level,
  };
}

export function estimateCost(avgWarmNights: number): CostEstimate {
  const nightsPerLifetimePortable = avgWarmNights * PORTABLE_LIFESPAN_YEARS;
  const nightsPerLifetimeSplit = avgWarmNights * SPLIT_LIFESPAN_YEARS;

  const portableElecPerNight = PORTABLE_KW * NIGHT_HOURS * UK_ELECTRICITY_RATE;
  const splitElecPerNight = SPLIT_KW * NIGHT_HOURS * UK_ELECTRICITY_RATE;

  const portablePerNight =
    nightsPerLifetimePortable > 0
      ? PORTABLE_PURCHASE / nightsPerLifetimePortable + portableElecPerNight
      : 0;
  const splitPerNight =
    nightsPerLifetimeSplit > 0
      ? SPLIT_INSTALL / nightsPerLifetimeSplit + splitElecPerNight
      : 0;

  const portablePerSummer = avgWarmNights * portableElecPerNight;

  return {
    portablePerNight: round2(portablePerNight),
    splitPerNight: round2(splitPerNight),
    portableElecPerNight: round2(portableElecPerNight),
    splitElecPerNight: round2(splitElecPerNight),
    portablePerSummer: round2(portablePerSummer),
    portablePurchase: PORTABLE_PURCHASE,
    splitInstall: SPLIT_INSTALL,
    portableLifespan: PORTABLE_LIFESPAN_YEARS,
    splitLifespan: SPLIT_LIFESPAN_YEARS,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
