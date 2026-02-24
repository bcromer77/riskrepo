kimport { AppShell } from "@/components/shell/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AlertCard } from "@/components/ui/AlertCard";

export default function SupplierAlertsPage() {
  const alerts = [
    {
      severity: "High" as const,
      title: "Action required: RSPO certificate",
      text: "Buyer requested RSPO certification and chain-of-custody evidence for palm oil.",
      meta: "Bid: Demo bid • Due: 48h",
    },
    {
      severity: "Medium" as const,
      title: "Clarification requested: ingredient specification",
      text: "Please confirm whether the product is palm-free or uses a vegetable oil blend.",
      meta: "Bid: Demo bid • Due: 5d",
    },
    {
      severity: "Low" as const,
      title: "Reminder: waste evidence",
      text: "Upload waste processor details to support zero-landfill claim.",
      meta: "Bid: Demo bid",
    },
  ];

  return (
    <AppShell
      title="Supplier alerts"
      subtitle="Requests and actions required from buyers."
      crumbs={[{ label: "Home", href: "/" }, { label: "Supplier", href: "/supplier/alerts" }, { label: "Alerts" }]}
    >
      <Card>
        <CardHeader title="Inbox" subtitle="This is the supplier-side mirror of the buyer verification queue." />
        <CardBody>
          <div className="space-y-3">
            {alerts.map((a, idx) => (
              <AlertCard key={idx} severity={a.severity} title={a.title} text={a.text} meta={a.meta} />
            ))}
          </div>
        </CardBody>
      </Card>
    </AppShell>
  );
}
