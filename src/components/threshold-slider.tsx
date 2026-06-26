"use client";

import { Slider } from "@/components/ui/slider";
import { MIN_THRESHOLD, MAX_THRESHOLD } from "@/lib/constants";

interface ThresholdSliderProps {
  label: string;
  defaultLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export function ThresholdSlider({
  label,
  defaultLabel,
  value,
  onChange,
}: ThresholdSliderProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-lg tabular-nums">
          {value}°C
        </span>
      </div>
      <Slider
        min={MIN_THRESHOLD}
        max={MAX_THRESHOLD}
        step={1}
        value={[value]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val;
          onChange(v);
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{MIN_THRESHOLD}°C</span>
        <span className="opacity-60">Default: {defaultLabel}</span>
        <span>{MAX_THRESHOLD}°C</span>
      </div>
    </div>
  );
}
