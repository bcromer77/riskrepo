import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SeverityPill } from "@/components/ui/Pills";
import { cn } from "@/lib/utils";

type Severity = "High" | "Medium" | "Low";

type Item = {
  severity: Severity;
  supplierName: string;
  topic: string;
  text: string;
  href: string;
};

function leftBorder(severity: Severity) {
  if (severity === "High") return "border-red-200";
  if (severity === "Medium") return "border-amber-200";
  return "border-emerald-200";
}

export function VerificationQueue({ items }: { items: Item[] }) {
  return (
    <Card>
      <CardHeader
        title="Verification queue"
        subtitle="High-signal items that require review or clarification."
        action={
          <span className="text-xs text-[rgb(var(--cz-muted))]">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        }
      />

      <CardBody className="pt-3">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-black/[0.02] ring-1 ring-black/5 p-4">
              <div className="text-sm font-medium text-[rgb(var(--cz-ink))]">
                No items
              </div>
              <p className="mt-1 text-sm text-[rgb(var(--cz-muted))]">
                When suppliers submit updates, items needing verification will appear here.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.href}-${idx}`}
                className={cn(
                  "rounded-2xl bg-[rgb(var(--cz-card))] ring-1 ring-black/5 shadow-sm border-l-4 p-4",
                  leftBorder(item.severity)
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <SeverityPill severity={item.severity} />
                  <Link
                    className="text-xs text-[rgb(var(--cz-accent))] hover:underline"
                    href={item.href}
                  >
                    Open →
                  </Link>
                </div>

                <div className="mt-2 text-sm font-medium text-[rgb(var(--cz-ink))]">
                  {item.supplierName}
                </div>
                <div className="mt-1 text-xs text-[rgb(var(--cz-muted))]">
                  {item.topic}
                </div>
                <div className="mt-2 text-sm text-zinc-700">{item.text}</div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
}
