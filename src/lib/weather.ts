import { OPEN_METEO_ARCHIVE_API } from "./constants";
import { cacheGet, cacheSet } from "./cache";

const OPEN_METEO_FORECAST_API = "https://api.open-meteo.com/v1/forecast";

interface HourlyData {
  time: string[];
  temperature_2m: (number | null)[];
}

interface WeatherResponse {
  hourly: HourlyData;
}

export class RateLimitedError extends Error {
  constructor() {
    super(
      "Weather service is experiencing high demand. Please try again in a few minutes."
    );
    this.name = "RateLimitedError";
  }
}

function weatherCacheKey(
  prefix: string,
  lat: number,
  lon: number,
  extra: string
) {
  return `weather:${prefix}:${lat.toFixed(2)}:${lon.toFixed(2)}:${extra}`;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const HISTORICAL_TTL_S = 24 * 60 * 60;
const CURRENT_YEAR_TTL_S = 6 * 60 * 60;
const RECENT_TTL_S = 60 * 60;

async function fetchArchiveBatch(
  lat: number,
  lon: number,
  startYear: number,
  endYear: number
): Promise<WeatherResponse> {
  const currentYear = new Date().getFullYear();
  const ttl =
    endYear >= currentYear ? CURRENT_YEAR_TTL_S : HISTORICAL_TTL_S;
  const key = weatherCacheKey("archive", lat, lon, `${startYear}:${endYear}`);

  const cached = await cacheGet<WeatherResponse>(key);
  if (cached) return cached;

  const startDate = `${startYear}-01-01`;
  let endDate: string;
  if (endYear >= currentYear) {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    endDate = formatDate(d);
  } else {
    endDate = `${endYear}-12-31`;
  }

  const url = new URL(OPEN_METEO_ARCHIVE_API);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", "Europe/London");

  const res = await fetch(url.toString());
  if (res.status === 429) throw new RateLimitedError();
  if (!res.ok) {
    throw new Error(`Weather data unavailable (${res.status})`);
  }
  const data: WeatherResponse = await res.json();
  await cacheSet(key, data, ttl);
  return data;
}

async function fetchRecentDays(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  const key = weatherCacheKey("recent", lat, lon, "7d");

  const cached = await cacheGet<WeatherResponse>(key);
  if (cached) return cached;

  const url = new URL(OPEN_METEO_FORECAST_API);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", "Europe/London");
  url.searchParams.set("past_days", "10");
  url.searchParams.set("forecast_days", "0");

  const res = await fetch(url.toString());
  if (res.status === 429) throw new RateLimitedError();
  if (!res.ok) {
    throw new Error(`Recent weather data unavailable (${res.status})`);
  }
  const data: WeatherResponse = await res.json();
  await cacheSet(key, data, RECENT_TTL_S);
  return data;
}

function chunkYears(years: number[], maxPerBatch: number): number[][] {
  const sorted = [...years].sort((a, b) => a - b);
  const chunks: number[][] = [];
  for (let i = 0; i < sorted.length; i += maxPerBatch) {
    chunks.push(sorted.slice(i, i + maxPerBatch));
  }
  return chunks;
}

export async function fetchHistoricalWeather(
  lat: number,
  lon: number,
  years: number[]
): Promise<HourlyData> {
  const chunks = chunkYears(years, 3);

  const batchPromises = chunks.map((chunk) =>
    fetchArchiveBatch(lat, lon, chunk[0], chunk[chunk.length - 1])
  );
  const recentPromise = fetchRecentDays(lat, lon).catch(() => null);

  const [recentResp, ...batchResps] = await Promise.all([
    recentPromise,
    ...batchPromises,
  ]);

  const allTimes: string[] = [];
  const allTemps: (number | null)[] = [];

  for (const resp of batchResps) {
    allTimes.push(...resp.hourly.time);
    allTemps.push(...resp.hourly.temperature_2m);
  }

  if (recentResp) {
    const archiveEnd = allTimes[allTimes.length - 1] ?? "";
    for (let i = 0; i < recentResp.hourly.time.length; i++) {
      if (recentResp.hourly.time[i] > archiveEnd) {
        allTimes.push(recentResp.hourly.time[i]);
        allTemps.push(recentResp.hourly.temperature_2m[i]);
      }
    }
  }

  return { time: allTimes, temperature_2m: allTemps };
}
