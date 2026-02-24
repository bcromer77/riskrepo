import Link from "next/link";

type Crumb = { label: string; href?: string };

export function AppShell({
  title,
  subtitle,
  crumbs,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[rgb(var(--cz-bg))]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <nav className="text-sm text-zinc-600">
                {crumbs.map((c, idx) => (
                  <span key={idx}>
                    {idx > 0 && <span className="mx-2 text-zinc-300">/</span>}
                    {c.href ? (
                      <Link
                        href={c.href}
                        className="font-medium text-zinc-800 hover:text-[rgb(var(--cz-accent))]"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-zinc-800">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[rgb(var(--cz-accent))]" />
                <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
              </div>

              {subtitle ? (
                <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
              ) : null}
            </div>

            {right ? <div className="pt-1">{right}</div> : null}
          </div>

          <div className="mt-3 h-px bg-black/5" />
        </header>

        {children}
      </div>
    </main>
  );
}
