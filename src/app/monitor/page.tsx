import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { FiltersBar } from "@/components/monitor/FiltersBar";
import { ExposureTable } from "@/components/monitor/ExposureTable";
import { VerificationQueue } from "@/components/monitor/VerificationQueue";
import { WhatChanged } from "@/components/monitor/WhatChanged";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function MonitorPage() {
  const context = {
    title: "Monitor",
    subtitle: "Group view of exposures across suppliers and submissions.",
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
      exposureCounts: { absence: 2, misalignment: 1, contradiction: 0, compression: 1 },
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
      exposureCounts: { absence: 0, misalignment: 0, contradiction: 1, compression: 0 },
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
      exposureCounts: { absence: 1, misalignment: 1, contradiction: 0, compression: 0 },
      openQuestions: 1,
      lastUpdated: "Yesterday",
      packHref: "/proc/bids/demo/suppliers/c",
    },
  ];

  const queue = [
    { severity: "High" as const, supplierName: "Supplier A", topic: "Palm oil", text: "Missing RSPO certificate — compliance exposure", href: "/proc/bids/demo/suppliers/a" },
    { severity: "High" as const, supplierName: "Supplier B", topic: "Substitutions", text: "Inconsistent ingredient claims — requires verification", href: "/proc/bids/demo/suppliers/b" },
    { severity: "Medium" as const, supplierName: "Supplier C", topic: "CBAM / Waste", text: "Waste evidence lacks processor details — requires clarification", href: "/proc/bids/demo/suppliers/c" },
  ];

  const changes = [
    { when: "Today", text: "Supplier A uploaded new document: Ingredient specification", href: "/proc/bids/demo/suppliers/a" },
    { when: "Today", text: "Supplier B updated statement on cocoa provenance", href: "/proc/bids/demo/suppliers/b" },
    { when: "Yesterday", text: "Supplier C responded to waste handling question", href: "/proc/bids/demo/suppliers/c" },
  ];

  return (
    <AppShell
      title={context.title}
      subtitle={`${context.subtitle} • ${context.lastUpdated}`}
      crumbs={[{ label: "Home", href: "/" }, { label: "Monitor" }]}
      right={
        <div className="flex items-center gap-3">
          <Link href="/proc/bids" className="text-sm underline text-[rgb(var(--cz-accent))]">
            Bids
          </Link>
          <Link href="/proc/bids/demo" className="text-sm underline text-[rgb(var(--cz-accent))]">
            Demo bid
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        <FiltersBar filters={filters} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ExposureTable rows={rows} />
            <WhatChanged changes={changes} />
          </div>

          <div className="space-y-4">
            <VerificationQueue items={queue} />

            <Card>
              <CardHeader title="Note" />
              <CardBody>
                <p className="text-sm text-zinc-600">
                  Chronozone surfaces items requiring verification. It does not rank suppliers or make decisions.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
