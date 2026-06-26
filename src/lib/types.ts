export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  adminDistrict: string;
  region: string;
}

export type ViewMode = "overnight" | "daytime" | "both";

export interface NightData {
  date: string;
  minTemp: number;
}

export interface DayData {
  date: string;
  maxTemp: number;
}

export interface YearData {
  year: number;
  isPartialYear: boolean;
  nights: NightData[];
  days: DayData[];
}

export interface CheckResponse {
  postcode: string;
  location: string;
  latitude: number;
  longitude: number;
  overnightWindow: { startHour: number; endHour: number };
  daytimeWindow: { startHour: number; endHour: number };
  years: YearData[];
}

export interface YearSummary {
  year: number;
  count: number;
  total: number;
  peakEntry: { date: string; temp: number } | null;
  isPartialYear: boolean;
}

export interface Verdict {
  averageCount: number;
  trend: "increasing" | "decreasing" | "stable";
  trendPercent: number;
  level: "no" | "borderline" | "yes";
}

export interface CostEstimate {
  portablePerNight: number;
  splitPerNight: number;
  portableElecPerNight: number;
  splitElecPerNight: number;
  portablePerSummer: number;
  portablePurchase: number;
  splitInstall: number;
  portableLifespan: number;
  splitLifespan: number;
}
