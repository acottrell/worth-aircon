"use client";

import { useState } from "react";
import type { YearSummary } from "@/lib/types";

interface TrendChartProps {
  summaries: YearSummary[];
}

function barHue(warmNights: number): string {
  if (warmNights < 5) return "hsl(150 50% 45%)";
  if (warmNights <= 10) return "hsl(45 90% 50%)";
  if (warmNights <= 15) return "hsl(30 90% 50%)";
  return "hsl(15 85% 48%)";
}

export function TrendChart({ summaries }: TrendChartProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const maxNights = Math.max(...summaries.map((s) => s.warmNights), 1);
  const chartHeight = 220;

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up" style={{ animationDelay: "150ms" }}>
      <div
        className="flex items-end justify-center gap-2.5 sm:gap-4 px-2"
        style={{ height: chartHeight }}
      >
        {summaries.map((s, i) => {
          const height =
            maxNights > 0
              ? Math.max(
                  (s.warmNights / maxNights) * (chartHeight - 40),
                  s.warmNights > 0 ? 8 : 3
                )
              : 3;
          const isHovered = hoveredYear === s.year;
          const isIdle = hoveredYear === null;

          return (
            <div
              key={s.year}
              className="flex flex-col items-center gap-1.5 flex-1 max-w-14 cursor-default"
              onMouseEnter={() => setHoveredYear(s.year)}
              onMouseLeave={() => setHoveredYear(null)}
              onTouchStart={() =>
                setHoveredYear(hoveredYear === s.year ? null : s.year)
              }
            >
              <span
                className={`text-xs font-mono font-semibold tabular-nums transition-all duration-200 ${
                  isHovered
                    ? "opacity-100 scale-110"
                    : isIdle
                      ? "opacity-80"
                      : "opacity-30"
                }`}
              >
                {s.warmNights}
              </span>

              <div
                className={`w-full rounded-sm transition-all duration-300 animate-bar ${
                  s.isPartialYear ? "bg-stripes" : ""
                } ${isHovered ? "brightness-110 shadow-md" : ""} ${
                  !isIdle && !isHovered ? "opacity-40" : ""
                }`}
                style={{
                  height,
                  backgroundColor: barHue(s.warmNights),
                  animationDelay: `${i * 80}ms`,
                }}
              />

              <span
                className={`text-[11px] font-mono tabular-nums transition-opacity duration-200 ${
                  isHovered
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                &apos;{String(s.year).slice(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 min-h-[2.5rem] text-center">
        {hoveredYear !== null ? (
          <p className="text-sm text-muted-foreground animate-in fade-in-0 duration-100">
            {(() => {
              const s = summaries.find((s) => s.year === hoveredYear);
              if (!s) return null;
              return (
                <>
                  <span className="font-medium text-foreground">
                    {s.year}
                    {s.isPartialYear ? " (so far)" : ""}
                  </span>
                  {": "}
                  {s.warmNights} warm night
                  {s.warmNights !== 1 ? "s" : ""}
                  {s.hottestNight && (
                    <>
                      {`, overnight low ${s.hottestNight.minTemp}°C on `}
                      {new Date(
                        s.hottestNight.date
                      ).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                </>
              );
            })()}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/60">
            Tap a bar for details
          </p>
        )}
      </div>
    </div>
  );
}
