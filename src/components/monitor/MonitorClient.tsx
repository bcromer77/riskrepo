"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { SearchBar } from "@/components/monitor/SearchBar";
import { FiltersBar } from "@/components/monitor/FiltersBar";
import { ExposureTable } from "@/components/monitor/ExposureTable";
import { VerificationQueue } from "@/components/monitor/VerificationQueue";
import { WhatChanged } from "@/components/monitor/WhatChanged";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { X } from "lucide-react";
import { DEMO_SUBMISSIONS, Submission } from "@/lib/demoTesco";
import { parseNLQ } from "@/lib/nlq";
import { cn } from "@/lib/utils";

type FilterValues = {
  categories: string[];
  topics: string[];
  statuses: string[];
  windows: string[];
};

function dateGte(d: string, since?: string): boolean {
  if (!since) return true;
  return d >= since;
}

function readinessToStatus(r: Submission["readiness"]): string {
  if (r === "Red") return "Clarification";
  if (r === "Orange") return "In review";
  return "Submitted";
}

function windowSince(win: string | undefined): string | undefined {
  if (!win || win === "All") return undefined;
  if (win === "Last 30d") return "2026-01-25"; // assuming today ~2026-02-24
  if (win === "Last 90d") return "2025-11-26";
  if (win === "Since Jan 2026") return "2026-01-01";
  return undefined;
}

export default function MonitorClient() {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    categories: [],
    topics: [],
    statuses: [],
    windows: [],
  });

  const parsed = useMemo(() => parseNLQ(query), [query]);

  const filtered = useMemo(() => {
    return DEMO_SUBMISSIONS.filter((s) => {
      // NLQ constraints
      if (parsed.categories.length && !parsed.categories.includes(s.category)) return false;
      if (parsed.commodities.length && !parsed.commodities.includes(s.commodity)) return false;
      if (parsed.riskThemes.length && !parsed.riskThemes.some((t) => s.riskThemes.includes(t))) return false;

      if (parsed.origins.length) {
        const isEU = ["Ireland", "Germany", "France", "Netherlands", "Spain", "Italy"].includes(s.origin);
        const wantsEU = parsed.origins.includes("EU");
        const wantsNonEU = parsed.origins.includes("Non-EU");
        if (wantsEU && !isEU) return false;
        if (wantsNonEU && isEU) return false;
        const explicitCountries = parsed.origins.filter((o) => o !== "EU" && o !== "Non-EU");
        if (explicitCountries.length && !explicitCountries.includes(s.origin)) return false;
      }

      if (parsed.readiness.length && !parsed.readiness.includes(s.readiness)) return false;
      if (!dateGte(s.updatedAt, parsed.since)) return false;

      // UI filter bar constraints
      if (filterValues.categories.length && !filterValues.categories.includes(s.category)) return false;

      if (filterValues.topics.length) {
        const matchesCommodity = filterValues.topics.includes(s.commodity);
        const matchesTheme = filterValues.topics.some((t) => s.riskThemes.includes(t as any));
        const matchesText =
          filterValues.topics.some((t) => s.aiSummary.toLowerCase().includes(t.toLowerCase())) ||
          filterValues.topics.some((t) => s.gaps.some((g) => g.toLowerCase().includes(t.toLowerCase())));

        if (!matchesCommodity && !matchesTheme && !matchesText) return false;
      }

      if (filterValues.statuses.length) {
        const st = readinessToStatus(s.readiness);
        if (!filterValues.statuses.includes(st)) return false;
      }

      if (filterValues.windows.length) {
        const anyMatches = filterValues.windows.some((w) => dateGte(s.updatedAt, windowSince(w)));
        if (!anyMatches) return false;
      }

      return true;
    });
  }, [parsed, filterValues]);

  const rows = useMemo(() => {
    const bySupplier = new Map<string, Submission[]>();
    filtered.forEach((s) => {
      const arr = bySupplier.get(s.supplierOrgId) ?? [];
      arr.push(s);
      bySupplier.set(s.supplierOrgId, arr);
    });

    const benchmark = 1000;

    return Array.from(bySupplier.entries()).map(([supplierOrgId, subs]) => {
      const worst = subs.reduce((a, b) => (a.riskScore > b.riskScore ? a : b), subs[0]);
      const status = readinessToStatus(worst.readiness);

      const absence = subs.reduce((n, x) => n + (x.gaps.length ? 1 : 0), 0);
      const contradiction = subs.reduce(
        (n, x) => n + (x.aiSummary.toLowerCase().includes("mismatch") ? 1 : 0),
        0
      );
      const misalignment = subs.reduce(
        (n, x) => n + (x.readiness === "Orange" || x.readiness === "Red" ? 1 : 0),
        0
      );

      return {
        supplierOrgId,
        supplierName: worst.supplierName,
        topic: Array.from(new Set(subs.map((x) => x.commodity))).join(", ") || "—",
        status,
        price: Math.round(benchmark * (1 - Math.min(0.2, worst.riskScore / 500))),
        benchmark,
        exposureCounts: { absence, misalignment, contradiction, compression: 0 },
        openQuestions: subs.reduce((n, x) => n + x.gaps.length, 0),
        lastUpdated: subs.map((x) => x.updatedAt).sort().pop() ?? "—",
        packHref: `/proc/bids/demo/suppliers/${supplierOrgId}`,
      };
    });
  }, [filtered]);

  const queue = useMemo(() => {
    const rank: Record<"High" | "Medium" | "Low", number> = { High: 0, Medium: 1, Low: 2 };

    return filtered
      .flatMap((s) =>
        s.gaps.map((g) => ({
          severity: s.riskScore >= 85 ? ("High" as const) : s.riskScore >= 65 ? ("Medium" as const) : ("Low" as const),
          supplierName: s.supplierName,
          topic: `${s.commodity} • ${s.origin}`,
          text: g,
          href: `/proc/bids/demo/suppliers/${s.supplierOrgId}`,
        }))
      )
      .sort((a, b) => rank[a.severity] - rank[b.severity])
      .slice(0, 8);
  }, [filtered]);

  const changes = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
      .slice(0, 6)
      .map((s) => ({
        when: s.updatedAt,
        text: `${s.supplierName} updated: ${s.product}`,
        href: `/proc/bids/demo/suppliers/${s.supplierOrgId}`,
      }));
  }, [filtered]);

  const stats = useMemo(() => {
    const highRisk = filtered.filter((s) => s.riskScore >= 85).length;
    return {
      total: filtered.length,
      highRisk,
      suppliers: new Set(filtered.map((s) => s.supplierOrgId)).size,
    };
  }, [filtered]);

  const filtersConfig = {
    categories: ["Ingredients", "Electronics", "Packaging", "Own Brand", "Non-Food"],
    topics: [
      "Palm", "Cocoa", "Soy", "Coffee", "Beef", "Wood/Paper", "Lithium", "Cobalt", "Nickel",
      "EUDR", "Deforestation", "Scope 3", "CBAM", "Battery Passport", "Recycled Content",
      "Carbon Footprint", "CSRD", "NIS2",
    ],
    statuses: ["Submitted", "In review", "Clarification"],
    windows: ["All", "Last 30d", "Last 90d", "Since Jan 2026"],
  };

  const suggestedQueries = [
    "Show high-risk cocoa suppliers in Ghana with missing EUDR polygons since Jan 2026",
    "Which Tesco Mobile suppliers are lagging on battery passport preparation or recycled cobalt declarations?",
    "Show deforestation signals for soy in Brazil (last 30 days)",
    "Opportunities to increase certified own-brand cocoa volume",
  ];

  const clearAll = () => {
    setFilterValues({
      categories: [],
      topics: [],
      statuses: [],
      windows: [],
    });
    setQuery("");
  };

  const hasActive = query.trim() || Object.values(filterValues).some((arr) => arr.length > 0);

  return (
    <AppShell
      title="Monitor"
      subtitle="Real-time helicopter view of supplier & product risk — EUDR, Scope 3, battery passport, packaging circularity."
      crumbs={[{ label: "Home", href: "/" }, { label: "Monitor" }]}
      right={
        <div className="flex items-center gap-4">
          <Link href="/proc/bids" className="text-sm text-[rgb(var(--cz-accent))] hover:underline">
            Bids
          </Link>
          <Link href="/supplier/alerts" className="text-sm text-[rgb(var(--cz-accent))] hover:underline">
            Supplier alerts
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <SearchBar
          onSearch={(q) => setQuery(q)}
          suggestions={suggestedQueries}
          value={query}
          onChangeValue={setQuery}
        />

        <FiltersBar filters={filtersConfig} onChange={setFilterValues} />

        {hasActive && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
            >
              <X className="h-3.5 w-3.5" />
              Reset all filters & search
            </button>
          </div>
        )}

        {/* New live monitor stats header */}
        <div className="rounded-2xl bg-[rgb(var(--cz-card))] ring-1 ring-black/5 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="text-sm font-medium">
              Live monitor
              <span className="ml-2 text-xs text-[rgb(var(--cz-muted))]">
                Showing {stats.total} items across {stats.suppliers} suppliers
              </span>
            </div>

            <div className="flex items-center gap-2">
              {stats.highRisk > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 ring-1 ring-red-200 px-2.5 py-1 text-xs font-medium">
                  {stats.highRisk} high-risk
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-[rgb(var(--cz-accent-soft))] text-[rgb(var(--cz-accent))] ring-1 ring-[rgb(var(--cz-accent))]/20 px-2.5 py-1 text-xs font-medium">
                Assistive only
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExposureTable rows={rows} />
            <WhatChanged changes={changes} />
          </div>

          <div className="space-y-6">
            <VerificationQueue items={queue} />
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader
                title="What Tesco is tracking (2026)"
                subtitle="Core regulatory & sustainability signals in focus"
              />
              <CardBody className="text-sm text-zinc-600 space-y-2.5">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>EUDR readiness: polygons, traceability, deforestation signals</li>
                  <li>Scope 3 mismatches: unsupported emissions inputs</li>
                  <li>Battery regulation prep: passport readiness + recycled content (Feb 2027)</li>
                  <li>Packaging circularity: recyclability + recycled content evidence</li>
                  <li>CBAM exposure: embedded emissions chain gaps</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
