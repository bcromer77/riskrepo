kkimport Link from "next/link";
import { Card } from "./Card";

type Severity = "High" | "Medium" | "Low";

function barClass(sev: Severity) {
  if (sev === "High") return "bg-rose-500";
  if (sev === "Medium") return "bg-amber-500";
  return "bg-zinc-400";
}

function pillClass(sev: Severity) {
  if (sev === "High") return "bg-rose-50 text-rose-800 ring-rose-100";
  if (sev === "Medium") return "bg-amber-50 text-amber-800 ring-amber-100";
  return "bg-zinc-100 text-zinc-700 ring-black/5";
}

export function AlertCard({
  severity,
  title,
  text,
  meta,
  href,
}: {
  severity: Severity;
  title: string;
  text: string;
  meta?: string;
  href?: string;
}) {
  const inner = (
    <Card className="overflow-hidden">
      <div className={`h-1.5 ${barClass(severity)}`} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${pillClass(severity)}`}>
            {severity}
          </span>
          {meta ? <span className="text-xs text-zinc-500">{meta}</span> : null}
        </div>

        <div className="mt-2 text-sm font-medium text-zinc-900">{title}</div>
        <div className="mt-1 text-sm text-zinc-600">{text}</div>
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block hover:opacity-[0.98] transition">
      {inner}
    </Link>
  ) : (
    inner
  );
}
