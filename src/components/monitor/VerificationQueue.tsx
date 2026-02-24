import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AlertCard } from "@/components/ui/AlertCard";

type Item = {
  severity: "High" | "Medium" | "Low";
  supplierName: string;
  topic: string;
  text: string;
  href: string;
};

export function VerificationQueue({ items }: { items: Item[] }) {
  return (
    <Card>
      <CardHeader title="Exposure requiring verification" subtitle="Highest priority items across suppliers." />
      <CardBody>
        <div className="space-y-3">
          {items.map((i, idx) => (
            <AlertCard
              key={idx}
              severity={i.severity}
              title={i.text.split("—")[0].trim()}
              text={i.text}
              meta={`${i.supplierName} • ${i.topic}`}
              href={i.href}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
