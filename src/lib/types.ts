export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  adminDistrict: string;
  region: string;
}

export interface NightData {
  date: string;
  minTemp: number;
}

export interface YearData {
  year: number;
  isPartialYear: boolean;
  nights: NightData[];
}

export interface CheckResponse {
  postcode: string;
  location: string;
  latitude: number;
  longitude: number;
  nighttimeWindow: { startHour: number; endHour: number };
  years: YearData[];
}

export interface YearSummary {
  year: number;
  warmNights: number;
  totalNights: number;
  hottestNight: NightData | null;
  isPartialYear: boolean;
}

export interface Verdict {
  averageWarmNights: number;
  trend: "increasing" | "decreasing" | "stable";
  trendPercent: number;
  yearOnYearPercent: number | null;
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
