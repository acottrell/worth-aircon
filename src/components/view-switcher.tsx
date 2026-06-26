"use client";

import type { ViewMode } from "@/lib/types";
import { Moon, Sun, Layers } from "lucide-react";

interface ViewSwitcherProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: { value: ViewMode; label: string; icon: typeof Moon }[] = [
  { value: "overnight", label: "Overnight", icon: Moon },
  { value: "daytime", label: "Daytime", icon: Sun },
  { value: "both", label: "Both", icon: Layers },
];

export function ViewSwitcher({ mode, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-lg border bg-muted/50 p-1 gap-1">
        {MODES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
