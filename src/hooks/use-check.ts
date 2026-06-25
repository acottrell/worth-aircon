"use client";

import { useState, useCallback } from "react";
import type { CheckResponse } from "@/lib/types";

interface UseCheckState {
  loading: boolean;
  error: string | null;
  results: CheckResponse | null;
}

export function useCheck() {
  const [state, setState] = useState<UseCheckState>({
    loading: false,
    error: null,
    results: null,
  });

  const check = useCallback(async (postcode: string) => {
    setState({ loading: true, error: null, results: null });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setState({ loading: false, error: null, results: data });
    } catch (e) {
      setState({
        loading: false,
        error: e instanceof Error ? e.message : "Something went wrong",
        results: null,
      });
    }
  }, []);

  return { ...state, check };
}
