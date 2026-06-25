"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

interface PostcodeFormProps {
  onSubmit: (postcode: string) => void;
  loading: boolean;
  defaultValue?: string;
}

export function PostcodeForm({ onSubmit, loading, defaultValue = "" }: PostcodeFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter your postcode");
      return;
    }
    if (!UK_POSTCODE_REGEX.test(trimmed)) {
      setError("Enter a valid UK postcode (e.g. SW1A 1AA)");
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Your postcode"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          className="h-12 text-base font-mono tracking-widest text-center bg-background border-2 border-border focus:border-primary placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-sans"
          autoComplete="postal-code"
          disabled={loading}
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive text-center">{error}</p>
      )}
      <p className="mt-3 text-xs text-muted-foreground/60 text-center">
        Your postcode is used for weather data lookup only.
      </p>
    </form>
  );
}
