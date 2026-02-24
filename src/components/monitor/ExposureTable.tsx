import Link from "next/link";

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

export function ExposureTable({ rows }: { rows: Row[] }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-sm font-medium">Exposure map</div>
          <p className="text-xs text-muted-foreground mt-1">
            Exposure items requiring verification, grouped by supplier and topic.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2 pr-3 font-medium">Supplier</th>
              <th className="text-left py-2 pr-3 font-medium">Topic</th>
              <th className="text-left py-2 pr-3 font-medium">Status</th>
              <th className="text-left py-2 pr-3 font-medium">Price</th>
              <th className="text-left py-2 pr-3 font-medium">Price delta</th>
              <th className="text-left py-2 pr-3 font-medium">Exposure</th>
              <th className="text-left py-2 pr-3 font-medium">Open Qs</th>
              <th className="text-left py-2 pr-3 font-medium">Updated</th>
              <th className="text-right py-2 font-medium"> </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map((r) => {
              const delta = priceDeltaPct(r.price, r.benchmark);
              const exposureTotal = totalExposure(r.exposureCounts);

              return (
                <tr key={r.supplierOrgId} className="align-top">
                  <td className="py-3 pr-3">
                    <div className="font-medium">{r.supplierName}</div>
                    <div className="text-xs text-muted-foreground">{r.supplierOrgId}</div>
                  </td>

                  <td className="py-3 pr-3">{r.topic}</td>
                  <td className="py-3 pr-3">{r.status}</td>

                  <td className="py-3 pr-3">
                    {r.price == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span>{r.price}</span>
                    )}
                  </td>

                  <td className="py-3 pr-3">
                    {delta == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span>{delta}%</span>
                    )}
                    <div className="text-xs text-muted-foreground">
                      vs benchmark
                    </div>
                  </td>

                  <td className="py-3 pr-3">
                    <div className="font-medium">
                      {exposureTotal} item{exposureTotal === 1 ? "" : "s"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Missing({r.exposureCounts.absence}) · Unsupported({r.exposureCounts.misalignment}) · Inconsistent({r.exposureCounts.contradiction}) · Price({r.exposureCounts.compression})
                    </div>
                  </td>

                  <td className="py-3 pr-3">{r.openQuestions}</td>
                  <td className="py-3 pr-3">{r.lastUpdated}</td>

                  <td className="py-3 text-right">
                    <Link className="underline" href={r.packHref}>
                      View pack
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Terminology: Missing = absence, Unsupported = misalignment, Inconsistent = contradiction, Price = compression.
      </p>
    </div>
  );
}
