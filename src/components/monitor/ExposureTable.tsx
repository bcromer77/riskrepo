import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type ExposureCounts = {
  absence: number;
  misalignment: number;
  contradiction: number;
  compression: number;
};

type Row = {
  supplierOrgId: string;
  supplierName: string;
  topic: string;
  status: string;
  price: number | null;
  benchmark: number | null;
  exposureCounts: ExposureCounts;
  openQuestions: number;
  lastUpdated: string;
  packHref: string;
};

function priceDeltaPct(price: number | null, benchmark: number | null) {
  if (price == null || benchmark == null || benchmark === 0) return null;
  return Math.round(((price - benchmark) / benchmark) * 100);
}

function totalExposure(c: ExposureCounts) {
  return c.absence + c.misalignment + c.contradiction + c.compression;
}

function severityFromExposure(total: number): "High" | "Medium" | "Low" {
  if (total >= 6) return "High";
  if (total >= 3) return "Medium";
  return "Low";
}

function SeverityDot({ severity }: { severity: "High" | "Medium" | "Low" }) {
  const cls =
    severity === "High"
      ? "bg-red-500"
      : severity === "Medium"
      ? "bg-amber-500"
      : "bg-emerald-500";

  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", cls)} />;
}

function CountPill({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "red" | "amber" | "emerald" | "ink";
}) {
  if (count <= 0) return null;

  const cls =
    tone === "red"
      ? "bg-red-50 text-red-700 ring-red-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-white text-[rgb(var(--cz-ink))] ring-black/10";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1", cls)}>
      <span className="opacity-80">{label}</span>
      <span className="tabular-nums">{count}</span>
    </span>
  );
}

export function ExposureTable({ rows }: { rows: Row[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Exposure map"
        subtitle="Items requiring verification — grouped by supplier and topic."
        action={
          <span className="text-xs text-[rgb(var(--cz-muted))]">
            {rows.length} supplier{rows.length === 1 ? "" : "s"}
          </span>
        }
      />

      <CardBody className="pt-3">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-[rgb(var(--cz-muted))]">
              <tr className="border-b border-black/10">
                <th className="text-left py-2.5 px-2 font-medium">Supplier</th>
                <th className="text-left py-2.5 px-2 font-medium">Topic</th>
                <th className="text-left py-2.5 px-2 font-medium">Status</th>
                <th className="text-left py-2.5 px-2 font-medium">Price</th>
                <th className="text-left py-2.5 px-2 font-medium">Delta</th>
                <th className="text-left py-2.5 px-2 font-medium">Signals</th>
                <th className="text-left py-2.5 px-2 font-medium">Open</th>
                <th className="text-left py-2.5 px-2 font-medium">Updated</th>
                <th className="text-right py-2.5 px-2 font-medium" />
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {rows.map((r) => {
                const delta = priceDeltaPct(r.price, r.benchmark);
                const exposureTotal = totalExposure(r.exposureCounts);
                const severity = severityFromExposure(exposureTotal);

                const deltaTone =
                  delta == null
                    ? "text-[rgb(var(--cz-muted))]"
                    : delta <= -10
                    ? "text-amber-700"
                    : delta <= -5
                    ? "text-amber-700"
                    : delta >= 10
                    ? "text-emerald-700"
                    : "text-[rgb(var(--cz-ink))]";

                return (
                  <tr
                    key={r.supplierOrgId}
                    className="align-top hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-2">
                      <div className="flex items-start gap-2">
                        <div className="mt-1">
                          <SeverityDot severity={severity} />
                        </div>
                        <div>
                          <div className="font-medium text-[rgb(var(--cz-ink))]">
                            {r.supplierName}
                          </div>
                          <div className="text-xs text-[rgb(var(--cz-muted))]">
                            {r.supplierOrgId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-[rgb(var(--cz-ink))]">
                      {r.topic}
                    </td>

                    <td className="py-3.5 px-2">
                      <span className="inline-flex items-center rounded-full bg-black/[0.03] px-2 py-1 text-xs text-[rgb(var(--cz-ink))] ring-1 ring-black/10">
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-2">
                      {r.price == null ? (
                        <span className="text-[rgb(var(--cz-muted))]">—</span>
                      ) : (
                        <span className="tabular-nums">{r.price}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-2">
                      {delta == null ? (
                        <span className="text-[rgb(var(--cz-muted))]">—</span>
                      ) : (
                        <span className={cn("tabular-nums font-medium", deltaTone)}>
                          {delta > 0 ? "+" : ""}
                          {delta}%
                        </span>
                      )}
                      <div className="text-xs text-[rgb(var(--cz-muted))]">vs benchmark</div>
                    </td>

                    <td className="py-3.5 px-2">
                      <div className="flex flex-wrap gap-1.5">
                        <CountPill
                          label="Missing"
                          count={r.exposureCounts.absence}
                          tone="amber"
                        />
                        <CountPill
                          label="Unsupported"
                          count={r.exposureCounts.misalignment}
                          tone="red"
                        />
                        <CountPill
                          label="Inconsistent"
                          count={r.exposureCounts.contradiction}
                          tone="red"
                        />
                        <CountPill
                          label="Price"
                          count={r.exposureCounts.compression}
                          tone="ink"
                        />
                        {exposureTotal === 0 && (
                          <span className="text-xs text-[rgb(var(--cz-muted))]">—</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-2 tabular-nums">
                      {r.openQuestions}
                    </td>

                    <td className="py-3.5 px-2 text-[rgb(var(--cz-muted))]">
                      {r.lastUpdated}
                    </td>

                    <td className="py-3.5 px-2 text-right">
                      <Link
                        className="inline-flex items-center gap-1 text-sm text-[rgb(var(--cz-accent))] hover:underline"
                        href={r.packHref}
                      >
                        View pack <span aria-hidden>→</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-[rgb(var(--cz-muted))]">
          Signals: Missing = absence, Unsupported = misalignment, Inconsistent = contradiction, Price = compression.
        </p>
      </CardBody>
    </Card>
  );
}
