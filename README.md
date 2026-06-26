# Worth Aircon?

**Find out how many nights are too warm to sleep where you live.**

[Live site](https://worthaircon.com) — Enter a UK postcode, get 10 years of overnight temperature data and a straight answer.

![Worth Aircon desktop](docs/worth-aircon-desktop.png)

---

## What it does

Worth Aircon looks up your UK postcode and analyses 10 years of overnight temperatures (11pm–6am) to count how many nights the outside air stayed above a comfortable sleeping threshold. If the air outside doesn't drop below 16°C, opening your windows won't cool your bedroom into the NHS-recommended range.

You get a verdict (probably not / borderline / worth considering), a year-by-year trend chart, a cost-per-night breakdown, and curated links to portable and split system options.

## Why it exists

British people love talking about the weather. During a stretch of hot weather, all I kept hearing was people debating whether they should get air conditioning. The same articles appear every summer, but none of them give you a location-specific, data-backed answer. I wanted to provide some utility there and help people make a decision.

## Key features

- **Location-specific data** — Postcode lookup via postcodes.io, mapped to the nearest weather station's historical data.
- **10 years of history** — Fetched from the Open-Meteo Archive API in parallel batches. Enough data to show real trends, not just one hot summer.
- **Client-side threshold** — The API returns all nightly minimum temperatures. Changing the threshold slider recalculates instantly with no extra API call.
- **Trend analysis** — Year-on-year bar chart with decade-level trend direction (increasing / decreasing / stable).
- **Cost context** — Running cost estimates for portable and split systems at current UK electricity rates.
- **Shareable results** — Share link pre-fills the postcode and auto-triggers the lookup.
- **No tracking, no data retention** — Postcodes are processed in-memory, never stored. No cookies, no analytics beyond Vercel's anonymous page views.

## Tech stack

- **Framework**: Next.js 16 with React 19 (App Router, TypeScript)
- **APIs**: Open-Meteo (weather archive + forecast), postcodes.io (UK postcode geocoding) — both free, no keys required
- **Caching**: Upstash Redis shared cache with in-memory fallback. Coordinates rounded to ~1km so nearby postcodes share cached results.
- **Rate limiting**: Upstash Redis sliding window (10 req/min/IP), fails open if Redis is unavailable
- **Styling**: Tailwind CSS 4, shadcn/ui, Bricolage Grotesque + DM Sans font pairing
- **Hosting**: Vercel

## How the analysis works

1. Your postcode is geocoded to latitude/longitude via postcodes.io
2. 11 years of hourly temperature data is fetched from Open-Meteo (4 parallel batches of ~3 years each, plus recent forecast data to fill the archive lag)
3. For each night, the minimum temperature between 11pm and 6am is extracted
4. The client filters nights by the threshold (default 16°C) and computes the verdict
5. Trend is calculated by comparing the first 3 full years against the last 3, with a 20% change threshold

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Redis is optional for local development — the app falls back to in-memory caching. See `.env.example` for Upstash configuration.

## Architecture

```
src/
  app/
    api/check/route.ts  - Single API endpoint: postcode → weather analysis
    opengraph-image.tsx  - Dynamic OG image with thermometer SVG
  components/
    hero-section.tsx     - Postcode input with share link support (?p=)
    verdict-card.tsx     - Colour-coded verdict with trend summary
    trend-chart.tsx      - CSS-only animated bar chart, one bar per year
    threshold-slider.tsx - Client-side threshold adjustment
    cost-context.tsx     - Running cost estimates
    aircon-options.tsx   - Portable vs split system comparison
    faq-section.tsx      - FAQ with JSON-LD structured data
  lib/
    weather.ts           - Open-Meteo client with Redis/memory cache
    calculator.ts        - Nightly min-temp extraction from hourly data
    verdict.ts           - Threshold filtering and verdict logic
    cache.ts             - Shared cache layer (Redis with memory fallback)
    rate-limit.ts        - Per-IP rate limiting
```

## Status

Live and deployed. Built during the June 2026 UK heatwave.

---

Built by [Aaron Cottrell](https://acottrell.com)
