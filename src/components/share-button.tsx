"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import type { ViewMode } from "@/lib/types";

interface ShareButtonProps {
  location: string;
  count: number;
  postcode: string;
  mode: ViewMode;
}

export function ShareButton({ location, count, postcode, mode }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const label =
    mode === "daytime"
      ? `days per year over 25°C`
      : mode === "both"
        ? `uncomfortable days per year`
        : `nights per year above 16°C overnight`;

  async function handleShare() {
    const url = `https://worthaircon.com/?p=${encodeURIComponent(postcode)}`;
    const text = `${location} averages ${count} ${label}. Check your area:`;

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share your results
        </>
      )}
    </Button>
  );
}
