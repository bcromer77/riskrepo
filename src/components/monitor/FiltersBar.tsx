"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

type Filters = {
  categories: string[];
  topics: string[];
  statuses: string[];
  windows: string[];
};

type FilterValues = {
  categories: string[];
  topics: string[];
  statuses: string[];
  windows: string[];
};

type Props = {
  filters: Filters;
  initialValues?: Partial<FilterValues>;
  onChange?: (values: FilterValues) => void;
};

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-3 py-2.5 text-sm ring-1 ring-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cz-accent))]/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FiltersBar({ filters, initialValues, onChange }: Props) {
  const [category, setCategory] = useState<string>(initialValues?.categories?.[0] ?? "All");
  const [topic, setTopic] = useState<string>(initialValues?.topics?.[0] ?? "All");
  const [status, setStatus] = useState<string>(initialValues?.statuses?.[0] ?? "All");
  const [window, setWindow] = useState<string>(initialValues?.windows?.[0] ?? "All");

  const payload = useMemo<FilterValues>(() => {
    return {
      categories: category === "All" ? [] : [category],
      topics: topic === "All" ? [] : [topic],
      statuses: status === "All" ? [] : [status],
      windows: window === "All" ? [] : [window],
    };
  }, [category, topic, status, window]);

  useEffect(() => {
    onChange?.(payload);
  }, [payload, onChange]);

  const categoryOptions = ["All", ...filters.categories];
  const topicOptions = ["All", ...filters.topics];
  const statusOptions = ["All", ...filters.statuses];
  const windowOptions = ["All", ...filters.windows.filter((w) => w !== "All")];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Filter submissions"
        subtitle="Demo controls (wired): each selection filters the exposure map and alerts."
        action={
          (category !== "All" || topic !== "All" || status !== "All" || window !== "All") ? (
            <button
              onClick={() => {
                setCategory("All");
                setTopic("All");
                setStatus("All");
                setWindow("All");
              }}
              className="text-sm font-medium text-[rgb(var(--cz-accent))] hover:underline"
            >
              Reset
            </button>
          ) : null
        }
      />
      <CardBody className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select label="Category" value={category} options={categoryOptions} onChange={setCategory} />
          <Select label="Topic" value={topic} options={topicOptions} onChange={setTopic} />
          <Select label="Status" value={status} options={statusOptions} onChange={setStatus} />
          <Select label="Time window" value={window} options={windowOptions} onChange={setWindow} />
        </div>
      </CardBody>
    </Card>
  );
}
