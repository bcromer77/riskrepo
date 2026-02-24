import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Chronozone
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Procurement risk — structured, traceable, defensible
          </p>
        </div>

        {/* Intro */}
        <div className="mt-12 space-y-4">
          <p className="text-base">
            Chronozone surfaces where supplier submissions may expose cost,
            compliance, or audit risk.
          </p>

          <p className="text-base text-muted-foreground">
            It does not rank suppliers or make decisions. It highlights what
            requires verification.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/monitor"
            className="block border rounded-xl p-5 hover:bg-muted/30"
          >
            <div className="text-sm font-medium">Monitor</div>
            <p className="text-sm text-muted-foreground mt-2">
              Group view of supplier exposures across categories, ingredients,
              and submissions.
            </p>
          </Link>

          <Link
            href="/proc/bids"
            className="block border rounded-xl p-5 hover:bg-muted/30"
          >
            <div className="text-sm font-medium">Bids</div>
            <p className="text-sm text-muted-foreground mt-2">
              Procurement events with structured supplier submissions and
              evidence.
            </p>
          </Link>
        </div>

        {/* Context */}
        <div className="mt-16 border rounded-xl p-5">
          <div className="text-sm font-medium">Context</div>
          <p className="text-sm text-muted-foreground mt-2">
            Procurement cost is driven by missed detail, duplicated effort, and
            decisions that cannot be defended.
          </p>

          <p className="text-sm text-muted-foreground mt-3">
            Chronozone structures submissions into comparable, evidence-linked
            outputs — so exposures can be identified before decisions are made.
          </p>
        </div>
      </div>
    </main>
  );
}
