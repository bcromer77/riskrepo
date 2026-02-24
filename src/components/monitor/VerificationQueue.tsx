import Link from "next/link";

type Item = {
  severity: "High" | "Medium" | "Low";
  supplierName: string;
  topic: string;
  text: string;
  href: string;
};

export function VerificationQueue({ items }: { items: Item[] }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm font-medium">Exposure requiring verification</div>
      <p className="text-xs text-muted-foreground mt-1">
        Highest priority items across suppliers.
      </p>

      <div className="mt-4 space-y-2">
        {items.map((i, idx) => (
          <Link
            key={idx}
            href={i.href}
            className="block border rounded-lg p-3 hover:bg-muted/30"
          >
            <div className="text-xs text-muted-foreground">
              {i.severity} · {i.supplierName} · {i.topic}
            </div>
            <div className="text-sm mt-1">{i.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
