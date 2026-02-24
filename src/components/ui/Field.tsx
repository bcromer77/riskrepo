export function Field({
  label,
  value,
  leading,
}: {
  label: string;
  value: string;
  leading?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 flex items-center gap-2 rounded-xl bg-zinc-50 ring-1 ring-black/5 px-3 py-2 text-sm">
        {leading ? <span className="text-[rgb(var(--cz-accent))]">{leading}</span> : null}
        <span className="text-zinc-800">{value}</span>
      </div>
    </div>
  );
}
