import {
  OVERNIGHT_START_HOUR,
  OVERNIGHT_END_HOUR,
  DAYTIME_START_HOUR,
  DAYTIME_END_HOUR,
} from "./constants";
import type { NightData, DayData, YearData } from "./types";

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

function hourKey(dateStr: string, hour: number): string {
  return `${dateStr}T${String(hour).padStart(2, "0")}:00`;
}

export function calculateTemperatureData(
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
    const days: DayData[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate =
      year === currentYear ? yesterday : new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
      const dateStr = formatDateISO(d);

      // Daytime: 6am-5pm on this date (hours 6-17)
      const dayTemps: number[] = [];
      for (let h = DAYTIME_START_HOUR; h < DAYTIME_END_HOUR; h++) {
        const temp = tempMap.get(hourKey(dateStr, h));
        if (temp !== undefined) dayTemps.push(temp);
      }
      if (dayTemps.length >= 6) {
        const maxTemp = Math.round(Math.max(...dayTemps) * 10) / 10;
        days.push({ date: dateStr, maxTemp });
      }

      // Overnight: 6pm-11pm on this date + midnight-5am next day
      const nightTemps: number[] = [];
      for (let h = OVERNIGHT_START_HOUR; h < 24; h++) {
        const temp = tempMap.get(hourKey(dateStr, h));
        if (temp !== undefined) nightTemps.push(temp);
      }
      const nextDateStr = formatDateISO(addDays(d, 1));
      for (let h = 0; h < OVERNIGHT_END_HOUR; h++) {
        const temp = tempMap.get(hourKey(nextDateStr, h));
        if (temp !== undefined) nightTemps.push(temp);
      }
      if (nightTemps.length >= 6) {
        const minTemp = Math.round(Math.min(...nightTemps) * 10) / 10;
        nights.push({ date: dateStr, minTemp });
      }
    }

    results.push({
      year,
      isPartialYear: year === currentYear,
      nights,
      days,
    });
  }

  return results;
}
