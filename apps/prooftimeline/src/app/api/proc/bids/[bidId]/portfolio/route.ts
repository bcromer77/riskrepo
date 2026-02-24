import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

/**
 * GET /api/proc/bids/:bidId/portfolio
 *
 * Birdseye view for buyers:
 * - suppliers
 * - price delta vs benchmark
 * - exposure counts by type
 * - open questions
 * - verification queue (highest severity across suppliers)
 */

type AuthContext = {
  orgId: string;
  userId: string | null;
};

type ProcBidDoc = {
  _id?: unknown;
  buyerOrgId: string;
  title: string;
  currency: string;
  benchmarkAvgPrice: number | null;
  requiredCertifications: string[];
  createdAt: Date;
};

type ProcBidSupplierDoc = {
  _id?: unknown;
  bidId: ObjectId;
  buyerOrgId: string;
  supplierOrgId: string;
  supplierName: string;
  status: "invited" | "submitted" | "in_review" | "clarification";
  price: number | null;
  currency: string;
  sharedFileIds: string[];
  submittedAt?: Date;
  createdAt: Date;
};

type ProcSignalType = "absence" | "misalignment" | "contradiction" | "compression";
type ProcSeverity = "low" | "medium" | "high";

type ProcSignalDoc = {
  _id?: unknown;
  bidId: ObjectId;
  buyerOrgId: string;
  supplierOrgId: string;
  type: ProcSignalType;
  severity: ProcSeverity;
  description: string;
  createdAt: Date;
};

type ProcQuestionDoc = {
  _id?: unknown;
  bidId: ObjectId;
  buyerOrgId: string;
  supplierOrgId: string;
  text: string;
  status: "open" | "answered";
  createdAt: Date;
};

async function getAuth(req: NextRequest): Promise<AuthContext | null> {
  const orgId = req.headers.get("x-org-id") ?? "demo-org";
  const userId = req.headers.get("x-user-id") ?? "demo-user";
  return { orgId, userId };
}

function priceDeltaPct(price: number | null, benchmark: number | null): number | null {
  if (price == null || benchmark == null || benchmark === 0) return null;
  return Math.round(((price - benchmark) / benchmark) * 100);
}

function severityRank(s: ProcSeverity): number {
  if (s === "high") return 3;
  if (s === "medium") return 2;
  return 1;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ bidId: string }> }) {
  const auth = await getAuth(req);
  if (!auth?.orgId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { bidId } = await ctx.params;
  if (!ObjectId.isValid(bidId)) {
    return NextResponse.json({ error: "invalid_bid_id" }, { status: 400 });
  }

  const db = await getMongoDb();

  const bid = await db
    .collection<ProcBidDoc>("proc_bids")
    .findOne({ _id: new ObjectId(bidId), buyerOrgId: auth.orgId });

  if (!bid) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const suppliers = await db
    .collection<ProcBidSupplierDoc>("proc_bid_suppliers")
    .find({ bidId: new ObjectId(bidId), buyerOrgId: auth.orgId })
    .sort({ createdAt: -1 })
    .toArray();

  // Pull all signals/questions for this bid (single pass)
  const signals = await db
    .collection<ProcSignalDoc>("proc_signals")
    .find({ bidId: new ObjectId(bidId), buyerOrgId: auth.orgId })
    .toArray();

  const questions = await db
    .collection<ProcQuestionDoc>("proc_questions")
    .find({ bidId: new ObjectId(bidId), buyerOrgId: auth.orgId })
    .toArray();

  // Group signals/questions by supplierOrgId
  const signalsBySupplier = new Map<string, ProcSignalDoc[]>();
  for (const s of signals) {
    const k = s.supplierOrgId;
    const arr = signalsBySupplier.get(k) ?? [];
    arr.push(s);
    signalsBySupplier.set(k, arr);
  }

  const openQCountBySupplier = new Map<string, number>();
  for (const q of questions) {
    if (q.status !== "open") continue;
    openQCountBySupplier.set(q.supplierOrgId, (openQCountBySupplier.get(q.supplierOrgId) ?? 0) + 1);
  }

  const supplierRows = suppliers.map((s) => {
    const sSignals = signalsBySupplier.get(s.supplierOrgId) ?? [];
    const counts: Record<ProcSignalType, number> = {
      absence: 0,
      misalignment: 0,
      contradiction: 0,
      compression: 0,
    };

    for (const sig of sSignals) counts[sig.type]++;

    return {
      supplierOrgId: s.supplierOrgId,
      supplierName: s.supplierName,
      status: s.status,
      price: s.price,
      currency: s.currency,
      priceDeltaPct: priceDeltaPct(s.price, bid.benchmarkAvgPrice ?? null),
      exposureCounts: counts,
      openQuestions: openQCountBySupplier.get(s.supplierOrgId) ?? 0,
      lastUpdated: s.submittedAt ?? s.createdAt,
    };
  });

  // Verification queue: top 10 signals across suppliers by severity then recency
  const queue = signals
    .slice()
    .sort((a, b) => {
      const sr = severityRank(b.severity) - severityRank(a.severity);
      if (sr !== 0) return sr;
      return (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0);
    })
    .slice(0, 10)
    .map((q) => ({
      supplierOrgId: q.supplierOrgId,
      severity: q.severity,
      text: q.description,
    }));

  return NextResponse.json({
    bidId,
    title: bid.title,
    currency: bid.currency,
    benchmarkAvgPrice: bid.benchmarkAvgPrice,
    requiredCertifications: bid.requiredCertifications ?? [],
    suppliers: supplierRows,
    queue,
  });
}
