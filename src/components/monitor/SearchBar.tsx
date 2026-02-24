"use client";

import { Card, CardBody } from "@/components/ui/Card";

export function SearchBar({
  placeholder = "Search or ask in natural language (e.g. “high-risk cocoa suppliers in Ghana missing EUDR polygons since Jan 2026”)",
  onSearch,
  suggestions = [],
  value,
  onChangeValue,
}: {
  placeholder?: string;
  onSearch?: (q: string) => void;
  suggestions?: string[];
  value?: string;
  onChangeValue?: (q: string) => void;
}) {
  const q = value ?? "";

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-zinc-500">Search</div>
              <input
                value={q}
                onChange={(e) => onChangeValue?.(e.target.value)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-xl bg-white ring-1 ring-black/5 px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cz-accent))]/30"
              />
            </div>

            <button
              onClick={() => onSearch?.(q)}
              className="h-11 rounded-xl bg-[rgb(var(--cz-accent))] px-4 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Search
            </button>
          </div>

          {suggestions.length ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onChangeValue?.(s);
                    onSearch?.(s);
                  }}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 ring-1 ring-black/5 hover:bg-zinc-50"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <div className="text-xs text-zinc-500">
            Demo mode: instant filtering. Production: hybrid retrieval (structured match + semantic/vector).
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
