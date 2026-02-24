// src/components/shell/AppShell.tsx
import Link from "next/link";

type Crumb = { label: string; href?: string };

export function AppShell({
  title,
  subtitle,
  crumbs,
  right,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`min-h-screen bg-[rgb(var(--cz-bg))] text-[rgb(var(--cz-ink))] ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div>
              <nav className="text-xs sm:text-sm text-[rgb(var(--cz-muted))] font-medium tracking-tight">
                {crumbs.map((c, idx) => (
                  <span key={idx}>
                    {idx > 0 && (
                      <span className="mx-2 text-black/20">/</span>
                    )}
                    {c.href ? (
                      <Link
                        href={c.href}
                        className="hover:text-[rgb(var(--cz-accent))] transition-colors"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-[rgb(var(--cz-ink))]">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="mt-2.5 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[rgb(var(--cz-accent))] shadow-sm" />
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
              </div>

              {subtitle && (
                <p className="mt-1.5 text-base text-[rgb(var(--cz-muted))] max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>

            {right && (
              <div className="pt-1 sm:pt-2 flex-shrink-0">
                {right}
              </div>
            )}
          </div>

          <div className="mt-5 h-px bg-black/10" />
        </header>

        {children}
      </div>
    </main>
  );
}
