import type {
  YearData,
  YearSummary,
  Verdict,
  CostEstimate,
  ViewMode,
} from "./types";

const PORTABLE_PURCHASE = 300;
const PORTABLE_KW = 1;
const PORTABLE_LIFESPAN_YEARS = 3;

const SPLIT_INSTALL = 2500;
const SPLIT_KW = 0.4;
const SPLIT_LIFESPAN_YEARS = 10;

const NIGHT_HOURS = 8;
const UK_ELECTRICITY_RATE = 0.26;

export function summarizeYear(
  yearData: YearData,
  mode: ViewMode,
  overnightThreshold: number,
  daytimeThreshold: number
): YearSummary {
  if (mode === "overnight") {
    const warm = yearData.nights.filter(
      (n) => n.minTemp >= overnightThreshold
    );
    const peak = yearData.nights.reduce<{ date: string; temp: number } | null>(
      (max, n) => (!max || n.minTemp > max.temp ? { date: n.date, temp: n.minTemp } : max),
      null
    );
    return {
      year: yearData.year,
      count: warm.length,
      total: yearData.nights.length,
      peakEntry: peak,
      isPartialYear: yearData.isPartialYear,
    };
  }

  if (mode === "daytime") {
    const hot = yearData.days.filter(
      (d) => d.maxTemp >= daytimeThreshold
    );
    const peak = yearData.days.reduce<{ date: string; temp: number } | null>(
      (max, d) => (!max || d.maxTemp > max.temp ? { date: d.date, temp: d.maxTemp } : max),
      null
    );
    return {
      year: yearData.year,
      count: hot.length,
      total: yearData.days.length,
      peakEntry: peak,
      isPartialYear: yearData.isPartialYear,
    };
  }

  // "both" — unique dates that had a hot day OR a warm night
  const hotDays = new Set(
    yearData.days
      .filter((d) => d.maxTemp >= daytimeThreshold)
      .map((d) => d.date)
  );
  const warmNights = new Set(
    yearData.nights
      .filter((n) => n.minTemp >= overnightThreshold)
      .map((n) => n.date)
  );
  const combined = new Set([...hotDays, ...warmNights]);

  const allDayTemps = yearData.days.reduce<{ date: string; temp: number } | null>(
    (max, d) => (!max || d.maxTemp > max.temp ? { date: d.date, temp: d.maxTemp } : max),
    null
  );

  return {
    year: yearData.year,
    count: combined.size,
    total: Math.max(yearData.days.length, yearData.nights.length),
    peakEntry: allDayTemps,
    isPartialYear: yearData.isPartialYear,
  };
}

export function computeVerdict(summaries: YearSummary[], mode: ViewMode): Verdict {
  const fullYears = summaries.filter((s) => !s.isPartialYear);
  if (fullYears.length === 0) {
    return { averageCount: 0, trend: "stable", trendPercent: 0, level: "no" };
  }

  const avg =
    fullYears.reduce((sum, y) => sum + y.count, 0) / fullYears.length;

  const sorted = [...fullYears].sort((a, b) => a.year - b.year);
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  let trendPercent = 0;

  if (sorted.length >= 4) {
    const n = Math.min(3, Math.floor(sorted.length / 2));
    const firstN = sorted.slice(0, n);
    const lastN = sorted.slice(-n);
    const firstAvg =
      firstN.reduce((s, y) => s + y.count, 0) / firstN.length;
    const lastAvg =
      lastN.reduce((s, y) => s + y.count, 0) / lastN.length;

    if (firstAvg > 0) {
      trendPercent = Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
      if (trendPercent > 20) trend = "increasing";
      else if (trendPercent < -20) trend = "decreasing";
    }
  }

  let level: "no" | "borderline" | "yes";
  if (mode === "daytime") {
    level = avg < 15 ? "no" : avg > 40 ? "yes" : "borderline";
  } else if (mode === "both") {
    level = avg < 20 ? "no" : avg > 50 ? "yes" : "borderline";
  } else {
    level = avg < 5 ? "no" : avg > 15 ? "yes" : "borderline";
  }

  return {
    averageCount: Math.round(avg * 10) / 10,
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
