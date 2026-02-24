import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ bidId: string }>;
}) {
  const { bidId } = await params;

  const suppliers = [
    {
      id: "a",
      name: "Supplier A",
      price: 900,
      signals: {
        absence: 2,
        misalignment: 1,
        contradiction: 0,
        compression: 1,
      },
      questions: 3,
    },
    {
      id: "b",
      name: "Supplier B",
      price: 980,
      signals: {
        absence: 0,
        misalignment: 0,
        contradiction: 1,
        compression: 0,
      },
      questions: 2,
    },
    {
      id: "c",
      name: "Supplier C",
      price: 1100,
      signals: {
        absence: 1,
        misalignment: 1,
        contradiction: 0,
        compression: 0,
      },
      questions: 1,
    },
  ];

  const queue = [
    {
      supplier: "a",
      text: "Missing RSPO certification",
      severity: "high",
    },
    {
      supplier: "b",
      text: "Contradiction: palm-free vs vegetable oil blend",
      severity: "high",
    },
    {
      supplier: "c",
      text: "Zero landfill claim lacks operational detail",
      severity: "medium",
    },
  ];

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold">Bid Portfolio</h1>
      <p className="text-sm text-muted-foreground">
        Helicopter view — risk across suppliers
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        
        {/* LEFT SIDE: SUPPLIERS */}
        <div className="col-span-2 border rounded-xl p-4">
          <div className="text-sm font-medium">Suppliers</div>

          {suppliers.map((s) => (
            <div
              key={s.id}
              className="flex justify-between mt-4 border-b pb-3"
            >
              <div>
                <div className="text-sm font-medium">{s.name}</div>

                <div className="text-xs text-muted-foreground">
                  Price: {s.price}
                </div>

                <div className="text-xs mt-1">
                  Absence({s.signals.absence}) · Misalignment(
                  {s.signals.misalignment}) · Contradiction(
                  {s.signals.contradiction}) · Compression(
                  {s.signals.compression})
                </div>

                <div className="text-xs text-muted-foreground">
                  Open questions: {s.questions}
                </div>
              </div>

              <Link
                href={`/proc/bids/${bidId}/suppliers/${s.id}`}
                className="text-sm underline"
              >
                View pack
              </Link>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: RISK QUEUE */}
        <div className="border rounded-xl p-4">
          <div className="text-sm font-medium">Needs verification</div>

          <p className="text-xs text-muted-foreground mt-1">
            Highest risk signals across suppliers
          </p>

          {queue.map((q, i) => (
            <Link
              key={i}
              href={`/proc/bids/${bidId}/suppliers/${q.supplier}`}
              className="block mt-3 border p-3 rounded-lg text-sm"
            >
              <div className="text-xs text-muted-foreground">
                {q.severity}
              </div>

              <div>{q.text}</div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href={`/proc/bids/${bidId}/submit`}
        className="underline text-sm mt-6 inline-block"
      >
        Supplier submit (demo)
      </Link>
    </main>
  );
}
