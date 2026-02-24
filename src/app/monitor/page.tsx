import Link from "next/link";
import { FiltersBar } from "@/components/monitor/FiltersBar";
import { ExposureTable } from "@/components/monitor/ExposureTable";
import { VerificationQueue } from "@/components/monitor/VerificationQueue";
import { WhatChanged } from "@/components/monitor/WhatChanged";

export default function MonitorPage() {
  // Demo-only data (replace with backend calls later)
  const context = {
    title: "Group Monitor",
    subtitle:
      "Shows where supplier submissions may expose cost, compliance, or audit risk.",
    lastUpdated: "Updated a moment ago",
  };

  const filters = {
    categories: ["Ingredients", "Packaging", "Waste", "Logistics", "Energy"],
    topics: ["Palm oil", "Cocoa", "Substitutions", "CBAM", "Waste"],
    statuses: ["Submitted", "In review", "Clarification"],
    windows: ["7 days", "30 days", "90 days"],
  };

  const benchmark = 1000;

  const rows = [
    {
      supplierOrgId: "a",
      supplierName: "Supplier A",
      topic: "Palm oil",
      status: "Submitted",
      price: 900,
      benchmark,
      exposureCounts: {
        absence: 2,
        misalignment: 1,
        contradiction: 0,
        compression: 1,
      },
      openQuestions: 3,
      lastUpdated: "Today",
      packHref: "/proc/bids/demo/suppliers/a",
    },
    {
      supplierOrgId: "b",
      supplierName: "Supplier B",
      topic: "Substitutions",
      status: "In review",
      price: 980,
      benchmark,
      exposureCounts: {
        absence: 0,
        misalignment: 0,
        contradiction: 1,
        compression: 0,
      },
      openQuestions: 2,
      lastUpdated: "Today",
      packHref: "/proc/bids/demo/suppliers/b",
    },
    {
      supplierOrgId: "c",
      supplierName: "Supplier C",
      topic: "CBAM / Waste",
      status: "Clarification",
      price: 1100,
      benchmark,
      exposureCounts: {
        absence: 1,
        misalignment: 1,
        contradiction: 0,
        compression: 0,
      },
      openQuestions: 1,
      lastUpdated: "Yesterday",
      packHref: "/proc/bids/demo/suppliers/c",
    },
  ];

  const queue = [
    {
      severity: "High" as const,
      supplierName: "Supplier A",
      topic: "Palm oil",
      text: "Missing RSPO certificate — compliance exposure",
      href: "/proc/bids/demo/suppliers/a",
    },
    {
      severity: "High" as const,
      supplierName: "Supplier B",
      topic: "Substitutions",
      text: "Inconsistent ingredient claims — requires verification",
      href: "/proc/bids/demo/suppliers/b",
    },
    {
      severity: "Medium" as const,
      supplierName: "Supplier C",
      topic: "CBAM / Waste",
      text: "Waste evidence lacks processor details — requires clarification",
      href: "/proc/bids/demo/suppliers/c",
    },
  ];

  const changes = [
    {
      when: "Today",
      text: "Supplier A uploaded new document: Ingredient specification",
      href: "/proc/bids/demo/suppliers/a",
    },
    {
      when: "Today",
      text: "Supplier B updated statement on cocoa provenance",
      href: "/proc/bids/demo/suppliers/b",
    },
    {
      when: "Yesterday",
      text: "Supplier C responded to waste handling question",
      href: "/proc/bids/demo/suppliers/c",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{context.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {context.subtitle}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {context.lastUpdated}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/proc/bids" className="text-sm underline">
              Bids
            </Link>
            <Link href="/proc/bids/demo" className="text-sm underline">
              Demo bid
            </Link>
          </div>
        </div>

        <div className="mt-5">
          <FiltersBar filters={filters} />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ExposureTable rows={rows} />
            <WhatChanged changes={changes} />
          </div>

          <div className="space-y-4">
            <VerificationQueue items={queue} />

            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
              <div className="text-sm font-medium">Note</div>
              <p className="text-sm text-muted-foreground mt-2">
                Chronozone surfaces items requiring verification. It does not
                rank suppliers or make decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
