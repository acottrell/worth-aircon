"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  location: string;
  warmNights: number;
  postcode: string;
}

export function ShareButton({ location, warmNights, postcode }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://worthaircon.com/?p=${encodeURIComponent(postcode)}`;
    const text = `${location} averages ${warmNights} nights per year above 16°C overnight. Check your area:`;

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
