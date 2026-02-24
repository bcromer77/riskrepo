import Link from "next/link";

type Change = {
  when: string;
  text: string;
  href: string;
};

export function WhatChanged({ changes }: { changes: Change[] }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm font-medium">What changed</div>
      <p className="text-xs text-muted-foreground mt-1">
        Recent updates that may affect decision risk.
      </p>

      <div className="mt-4 space-y-2">
        {changes.map((c, idx) => (
          <Link key={idx} href={c.href} className="block rounded-lg border p-3 hover:bg-muted/30">
            <div className="text-xs text-muted-foreground">{c.when}</div>
            <div className="text-sm mt-1">{c.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
