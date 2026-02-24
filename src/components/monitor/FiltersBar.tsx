import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";

type Filters = {
  categories: string[];
  topics: string[];
  statuses: string[];
  windows: string[];
};

function IconDot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--cz-accent))]" />;
}

export function FiltersBar({ filters }: { filters: Filters }) {
  return (
    <Card>
      <CardHeader title="Filter submissions" subtitle="Demo UI: filters are display-only for now." />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Field label="Category" value={filters.categories[0]} leading={<IconDot />} />
          <Field label="Topic" value={filters.topics[0]} leading={<IconDot />} />
          <Field label="Status" value={filters.statuses[0]} />
          <Field label="Time window" value={filters.windows[0]} />
        </div>
      </CardBody>
    </Card>
  );
}
