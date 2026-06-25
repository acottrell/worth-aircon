import { NIGHTTIME_START_HOUR, NIGHTTIME_END_HOUR } from "./constants";
import type { NightData, YearData } from "./types";

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function calculateNightlyMinTemps(
  hourlyTimes: string[],
  hourlyTemps: (number | null)[],
  years: number[]
): YearData[] {
  const tempMap = new Map<string, number>();
  for (let i = 0; i < hourlyTimes.length; i++) {
    const temp = hourlyTemps[i];
    if (temp !== null) {
      tempMap.set(hourlyTimes[i], temp);
    }
  }

  const currentYear = new Date().getFullYear();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const results: YearData[] = [];

  for (const year of years) {
    const nights: NightData[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate =
      year === currentYear ? yesterday : new Date(year, 11, 31);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d = addDays(d, 1)
    ) {
      const dateStr = formatDateISO(d);
      const nightHourTemps: number[] = [];

      // 23:00 on this date
      const key23 = `${dateStr}T${String(NIGHTTIME_START_HOUR).padStart(2, "0")}:00`;
      const temp23 = tempMap.get(key23);
      if (temp23 !== undefined) nightHourTemps.push(temp23);

      // 00:00–06:00 on the next date
      const nextDateStr = formatDateISO(addDays(d, 1));
      for (let h = 0; h <= NIGHTTIME_END_HOUR; h++) {
        const hourKey = `${nextDateStr}T${String(h).padStart(2, "0")}:00`;
        const temp = tempMap.get(hourKey);
        if (temp !== undefined) nightHourTemps.push(temp);
      }

      if (nightHourTemps.length < 4) continue;

      const minTemp =
        Math.round(Math.min(...nightHourTemps) * 10) / 10;
      nights.push({ date: dateStr, minTemp });
    }

    results.push({
      year,
      isPartialYear: year === currentYear,
      nights,
    });
  }

  return results;
}
