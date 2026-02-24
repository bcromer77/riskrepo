import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { PROC_BIDS, PROC_BID_SUPPLIERS, PROC_SIGNALS, PROC_QUESTIONS } from "@/lib/proc/collections";

export async function GET(req: NextRequest, ctx: { params: Promise<{ bidId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { bidId } = await ctx.params;
  if (!ObjectId.isValid(bidId)) return NextResponse.json({ error: "invalid_bid_id" }, { status: 400 });

  const db = await getMongoDb();

  const bid = await db.collection(PROC_BIDS).findOne({ _id: new ObjectId(bidId), buyerOrgId: auth.orgId });
  if (!bid) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const suppliers = await db
    .collection(PROC_BID_SUPPLIERS)
    .find({ bidId: new ObjectId(bidId), buyerOrgId: auth.orgId })
    .toArray();

  // Aggregate signals + open questions per supplier
  const supplierRows = await Promise.all(
    suppliers.map(async (s: any) => {
      const signals = await db.collection(PROC_SIGNALS).find({ bidId: new ObjectId(bidId), supplierOrgId: s.supplierOrgId }).toArray();
      const openQ = await db.collection(PROC_QUESTIONS).countDocuments({ bidId: new ObjectId(bidId), supplierOrgId: s.supplierOrgId, status: "open" });

      const counts = { absence: 0, misalignment: 0, contradiction: 0, compression: 0 };
      for (const sig of signals) counts[sig.type as keyof typeof counts]++;

      const price = s.price ?? null;
      const benchmark = bid.benchmarkAvgPrice ?? null;
      const priceDeltaPct = price != null && benchmark ? Math.round(((price - benchmark) / benchmark) * 100) : null;

      return {
        supplierOrgId: s.supplierOrgId,
        supplierName: s.supplierName,
        status: s.status,
        price,
        priceDeltaPct,
        exposureCounts: counts,
        openQuestions: openQ,
      };
    })
  );

  // Simple “queue”: highest severity signals across all suppliers
  const queueSignals = await db
    .collection(PROC_SIGNALS)
    .find({ bidId: new ObjectId(bidId) })
    .sort({ severity: -1, createdAt: -1 })
    .limit(10)
    .toArray();

  const queue = queueSignals.map((q: any) => ({
    supplierOrgId: q.supplierOrgId,
    severity: q.severity,
    text: q.description,
  }));

  return NextResponse.json({
    bidId,
    benchmarkAvgPrice: bid.benchmarkAvgPrice ?? null,
    suppliers: supplierRows,
    queue,
  });
}
