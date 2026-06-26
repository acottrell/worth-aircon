import { NextRequest, NextResponse } from "next/server";
import { checkRequestSchema } from "@/lib/validation";
import { lookupPostcode } from "@/lib/postcode";
import { fetchHistoricalWeather, RateLimitedError } from "@/lib/weather";
import { calculateNightlyMinTemps } from "@/lib/calculator";
import { enforceRateLimit } from "@/lib/rate-limit";
import { YEARS_TO_ANALYZE, NIGHTTIME_START_HOUR, NIGHTTIME_END_HOUR } from "@/lib/constants";
import type { CheckResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, {
    name: "check",
    limit: 10,
    window: "1 m",
  });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = checkRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const geo = await lookupPostcode(parsed.data.postcode);
  if (!geo) {
    return NextResponse.json(
      { error: "Postcode not found. Check the postcode and try again." },
      { status: 404 }
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: YEARS_TO_ANALYZE },
    (_, i) => currentYear - YEARS_TO_ANALYZE + 1 + i
  );

  let hourlyData;
  try {
    hourlyData = await fetchHistoricalWeather(
      geo.latitude,
      geo.longitude,
      years
    );
  } catch (err) {
    if (err instanceof RateLimitedError) {
      return NextResponse.json(
        {
          error:
            "We're experiencing high demand right now. Please try again in a few minutes.",
        },
        { status: 503, headers: { "Retry-After": "120" } }
      );
    }
    return NextResponse.json(
      { error: "Weather data unavailable. Try again shortly." },
      { status: 502 }
    );
  }

  const yearData = calculateNightlyMinTemps(
    hourlyData.time,
    hourlyData.temperature_2m,
    years
  );

  const location = [geo.adminDistrict, geo.region]
    .filter(Boolean)
    .join(", ");

  const response: CheckResponse = {
    postcode: geo.postcode,
    location: location || geo.postcode,
    latitude: geo.latitude,
    longitude: geo.longitude,
    nighttimeWindow: {
      startHour: NIGHTTIME_START_HOUR,
      endHour: NIGHTTIME_END_HOUR,
    },
    years: yearData,
  };

  return NextResponse.json(response);
}
