import Link from "next/link";

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Chronozone</h1>
      <p className="text-sm text-muted-foreground">
        Procurement risk — portfolio view
      </p>

      <div className="mt-6 border p-4 rounded-xl">
        <Link href="/proc/bids/demo" className="underline">
          Open Demo Bid
        </Link>
      </div>
    </main>
  );
}
