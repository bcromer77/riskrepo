type Filters = {
  categories: string[];
  topics: string[];
  statuses: string[];
  windows: string[];
};

export function FiltersBar({ filters }: { filters: Filters }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm font-medium">Monitor filters</div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Filter label="Category" options={filters.categories} />
        <Filter label="Topic" options={filters.topics} />
        <Filter label="Status" options={filters.statuses} />
        <Filter label="Time window" options={filters.windows} />
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Demo UI: filters are display-only for now.
      </p>
    </div>
  );
}

function Filter({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 border rounded-lg px-3 py-2 text-sm">
        {options[0]}
      </div>
    </div>
  );
}
