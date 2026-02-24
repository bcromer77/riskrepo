import { cn } from "@/lib/utils";

export function SeverityPill({ severity }: { severity: "High" | "Medium" | "Low" }) {
  const cls =
    severity === "High"
      ? "bg-red-50 text-red-700 ring-red-200"
      : severity === "Medium"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-emerald-50 text-emerald-800 ring-emerald-200";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1", cls)}>
      {severity}
    </span>
  );
}

export function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[rgb(var(--cz-accent-soft))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--cz-accent))] ring-1 ring-emerald-100">
      {label}
    </span>
  );
}
