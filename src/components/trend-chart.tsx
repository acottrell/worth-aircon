"use client";

import { useState } from "react";
import type { YearSummary, ViewMode } from "@/lib/types";

interface TrendChartProps {
  summaries: YearSummary[];
  mode: ViewMode;
  countLabel: string;
}

function barHue(count: number, mode: ViewMode): string {
  if (mode === "daytime") {
    if (count < 15) return "hsl(150 50% 45%)";
    if (count <= 25) return "hsl(45 90% 50%)";
    if (count <= 40) return "hsl(30 90% 50%)";
    return "hsl(15 85% 48%)";
  }
  if (count < 5) return "hsl(150 50% 45%)";
  if (count <= 10) return "hsl(45 90% 50%)";
  if (count <= 15) return "hsl(30 90% 50%)";
  return "hsl(15 85% 48%)";
}

export function TrendChart({ summaries, mode, countLabel }: TrendChartProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const maxCount = Math.max(...summaries.map((s) => s.count), 1);
  const chartHeight = 220;

  const peakLabel =
    mode === "daytime" ? "peak" : mode === "both" ? "peak" : "overnight low";

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up" style={{ animationDelay: "150ms" }}>
      <div
        className="flex items-end justify-center gap-2.5 sm:gap-4 px-2"
        style={{ height: chartHeight }}
      >
        {summaries.map((s, i) => {
          const height =
            maxCount > 0
              ? Math.max(
                  (s.count / maxCount) * (chartHeight - 40),
                  s.count > 0 ? 8 : 3
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
                {s.count}
              </span>

              <div
                className={`w-full rounded-sm transition-all duration-300 animate-bar ${
                  s.isPartialYear ? "bg-stripes" : ""
                } ${isHovered ? "brightness-110 shadow-md" : ""} ${
                  !isIdle && !isHovered ? "opacity-40" : ""
                }`}
                style={{
                  height,
                  backgroundColor: barHue(s.count, mode),
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
                  {s.count} {s.count === 1 ? countLabel.replace(/s$/, "") : countLabel}
                  {s.peakEntry && (
                    <>
                      {`, ${peakLabel} ${s.peakEntry.temp}°C on `}
                      {new Date(
                        s.peakEntry.date
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
