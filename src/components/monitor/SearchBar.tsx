"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

type ParsedConstraints = {
  categories?: string[];
  commodities?: string[];
  riskThemes?: string[];
  origins?: string[];
  readiness?: string[];
  since?: string;
};

export function SearchBar({
  placeholder = "Ask anything… (e.g. high-risk cocoa suppliers in Ghana missing EUDR polygons since Jan 2026)",
  onSearch,
  suggestions = [],
  value = "",
  onChangeValue,
  parseNLQ,
}: {
  placeholder?: string;
  onSearch?: (q: string) => void;
  suggestions?: string[];
  value?: string;
  onChangeValue?: (q: string) => void;
  parseNLQ: (q: string) => ParsedConstraints;
}) {
  const q = value;
  const debouncedQ = useDebounce(q, 350);

  const [isFocused, setIsFocused] = useState(false);

  // We avoid setState in effect body by using a ref + a "tick" state
  const interpretingUntilRef = useRef<number>(0);
  const [tick, setTick] = useState(0); // used only to re-render when timer ends

  // ✅ pure derivation
  const parsed = useMemo<ParsedConstraints>(() => {
    if (!debouncedQ.trim()) return {};
    return parseNLQ(debouncedQ);
  }, [debouncedQ, parseNLQ]);

  // ✅ only setState inside the timeout callback (lint-safe)
  useEffect(() => {
    if (!debouncedQ.trim()) {
      interpretingUntilRef.current = 0;
      return;
    }

    interpretingUntilRef.current = Date.now() + 350;

    const t = setTimeout(() => {
      // trigger a re-render so derived isInterpreting flips to false
      setTick((x) => x + 1);
    }, 350);

    return () => clearTimeout(t);
  }, [debouncedQ]);

  // derived; tick forces reevaluation after timer
  const isInterpreting = useMemo(() => {
    void tick; // keep dependency explicit
    return interpretingUntilRef.current > Date.now();
  }, [tick]);

  const interpretationText = useMemo(() => {
    const parts: string[] = [];

    if (parsed.categories?.length) parts.push(`Category: ${parsed.categories.join(", ")}`);
    if (parsed.commodities?.length) parts.push(`Commodity: ${parsed.commodities.join(", ")}`);
    if (parsed.riskThemes?.length) parts.push(`Theme: ${parsed.riskThemes.join(", ")}`);
    if (parsed.origins?.length) parts.push(`Origin: ${parsed.origins.join(", ")}`);
    if (parsed.readiness?.length) parts.push(`Readiness: ${parsed.readiness.join(", ")}`);
    if (parsed.since) parts.push(`Since: ${parsed.since}`);

    if (parts.length === 0) return "No specific constraints detected — showing all recent items";
    return parts.join(" • ");
  }, [parsed]);

  const showSuggestions = isFocused && suggestions.length > 0 && q.length < 8;

  const handleClear = () => {
    onChangeValue?.("");
    onSearch?.("");
    interpretingUntilRef.current = 0;
    // re-render via callback (not effect body)
    setTick((x) => x + 1);
  };

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-4 sm:p-5">
        <div className="space-y-4">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => onChangeValue?.(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-xl bg-white px-4 py-3.5 text-base text-[rgb(var(--cz-ink))]",
                "ring-1 ring-black/10 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cz-accent))]/40",
                "transition-all duration-200 pr-10"
              )}
            />

            {q && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="min-h-[1.25rem] text-xs text-[rgb(var(--cz-muted))] flex items-center gap-2">
            {isInterpreting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[rgb(var(--cz-accent))]" />
                <span>Interpreting your question…</span>
              </>
            ) : (
              <span className="italic opacity-90">{interpretationText}</span>
            )}
          </div>

          {showSuggestions && (
            <div className="pt-2 border-t border-black/5">
              <div className="text-xs text-[rgb(var(--cz-muted))] mb-2">Quick suggestions</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onChangeValue?.(s);
                      onSearch?.(s);
                    }}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      "bg-black/[0.03] text-[rgb(var(--cz-ink))] ring-1 ring-black/5",
                      "hover:bg-black/[0.06] hover:ring-black/10 transition-colors"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-[rgb(var(--cz-muted))] italic pt-1 border-t border-black/5">
            Demo mode: instant client-side filtering. Production: hybrid retrieval (structured + semantic/vector).
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
