import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DEMO_SUBMISSIONS } from "@/lib/demoTesco";

export default async function SupplierPackPage({
  params,
}: {
  params: Promise<{ supplierOrgId: string }>;
}) {
  const { supplierOrgId } = await params;
  const items = DEMO_SUBMISSIONS.filter((s) => s.supplierOrgId === supplierOrgId);

  const supplierName = items[0]?.supplierName ?? `Supplier ${supplierOrgId}`;

  return (
    <AppShell
      title="Proof Pack"
      subtitle={`${supplierName} — evidence-linked pack (demo)`}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Monitor", href: "/monitor" },
        { label: "Proof Pack" },
      ]}
      right={
        <div className="flex items-center gap-4">
          <Link className="text-sm underline text-[rgb(var(--cz-accent))]" href="/monitor">
            Back to Monitor
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        <Card>
          <CardHeader title="Summary" subtitle="What requires verification (demo content)" />
          <CardBody>
            {items.length === 0 ? (
              <p className="text-sm text-zinc-600">No demo submissions found for this supplier.</p>
            ) : (
              <div className="space-y-3">
                {items.map((s) => (
                  <div key={s.id} className="rounded-xl bg-white ring-1 ring-black/5 p-4">
                    <div className="text-sm font-medium text-zinc-900">{s.product}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {s.category} • {s.commodity} • {s.origin} • Updated {s.updatedAt}
                    </div>
                    <div className="mt-3 text-sm text-zinc-700">{s.aiSummary}</div>

                    {s.gaps?.length ? (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-zinc-700">Items requiring verification</div>
                        <ul className="mt-2 space-y-1 text-sm text-zinc-700 list-disc pl-5">
                          {s.gaps.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-zinc-600">No gaps flagged in demo.</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Defensibility note" />
          <CardBody>
            <p className="text-sm text-zinc-600">
              Demo mode: this page shows how a pack would assemble evidence and “requires verification” items.
              Production mode: packs are generated from supplier-uploaded documents + structured checks + vector retrieval.
            </p>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
