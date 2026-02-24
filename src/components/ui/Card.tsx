export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-[rgb(var(--cz-card))] shadow-sm ring-1 ring-black/5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-5 pt-5">
      <div className="text-sm font-medium text-zinc-900">{title}</div>
      {subtitle ? (
        <p className="mt-1 text-xs text-zinc-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pb-5 pt-4">{children}</div>;
}
