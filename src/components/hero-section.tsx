"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCheck } from "@/hooks/use-check";
import { PostcodeForm } from "./postcode-form";
import { ResultsDisplay } from "./results-display";

interface HeroSectionProps {
  onPostcode?: (postcode: string) => void;
}

export function HeroSection({ onPostcode }: HeroSectionProps) {
  const searchParams = useSearchParams();
  const { loading, error, results, check } = useCheck();
  const autoTriggered = useRef(false);

  const paramPostcode = searchParams.get("p")?.toUpperCase() ?? "";

  useEffect(() => {
    if (paramPostcode && !autoTriggered.current) {
      autoTriggered.current = true;
      check(paramPostcode);
    }
  }, [paramPostcode, check]);

  useEffect(() => {
    if (results?.postcode) {
      onPostcode?.(results.postcode);
      const url = new URL(window.location.href);
      url.searchParams.set("p", results.postcode);
      window.history.replaceState(null, "", url.toString());
    }
  }, [results, onPostcode]);

  return (
    <div className="space-y-8">
      <PostcodeForm onSubmit={check} loading={loading} defaultValue={paramPostcode} />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Looking up your area...
        </p>
      )}

      {results && <ResultsDisplay results={results} />}
    </div>
  );
}
