import { cn } from "@/lib/utils";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[rgb(var(--cz-card))] shadow-sm ring-1 ring-black/5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-5 pt-5 flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-zinc-900">{title}</div>
        {subtitle ? <p className="mt-1 text-xs text-zinc-600">{subtitle}</p> : null}
      </div>
      {action ? <div className="pt-0.5">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pb-5 pt-4", className)}>{children}</div>;
}
