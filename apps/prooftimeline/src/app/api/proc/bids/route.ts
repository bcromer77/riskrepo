import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

/**
 * Procurement Bids API (V1)
 *
 * GET  /api/proc/bids
 *   → List bids for buyer org
 *
 * POST /api/proc/bids
 *   → Create a new bid
 *
 * Notes:
 * - Typed (no `any`)
 * - Lint clean
 * - Header-based auth placeholder (easy to swap for WorkOS / NextAuth)
 */

type AuthContext = {
  orgId: string;
  userId: string | null;
};

type ProcBidDoc = {
  _id?: unknown;
  buyerOrgId: string;
  title: string;
  category: string | null;
  currency: string;
  benchmarkAvgPrice: number | null;
  requiredCertifications: string[];
  createdAt: Date;
  createdBy: string | null;
};

/**
 * TEMP auth stub
 * Replace with real auth:
 * - WorkOS
 * - NextAuth
 * - JWT
 */
async function getAuth(req: NextRequest): Promise<AuthContext | null> {
  const orgId = req.headers.get("x-org-id") ?? "demo-org";
  const userId = req.headers.get("x-user-id") ?? "demo-user";

  return { orgId, userId };
}

/**
 * POST: Create bid
 */
export async function POST(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth?.orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<ProcBidDoc>;

  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }

  const doc: ProcBidDoc = {
    buyerOrgId: auth.orgId,
    title: body.title,
    category: typeof body.category === "string" ? body.category : null,
    currency: typeof body.currency === "string" ? body.currency : "GBP",
    benchmarkAvgPrice:
      typeof body.benchmarkAvgPrice === "number" ? body.benchmarkAvgPrice : null,
    requiredCertifications: Array.isArray(body.requiredCertifications)
      ? body.requiredCertifications.filter((c) => typeof c === "string")
      : [],
    createdAt: new Date(),
    createdBy: auth.userId,
  };

  const db = await getMongoDb();
  const result = await db.collection<ProcBidDoc>("proc_bids").insertOne(doc);

  return NextResponse.json({
    bidId: result.insertedId.toString(),
  });
}

/**
 * GET: List bids
 */
export async function GET(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth?.orgId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = await getMongoDb();

  const bids = await db
    .collection<ProcBidDoc>("proc_bids")
    .find({ buyerOrgId: auth.orgId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json({
    bids: bids.map((b) => ({
      bidId: String(b._id),
      title: b.title,
      category: b.category,
      currency: b.currency,
      benchmarkAvgPrice: b.benchmarkAvgPrice,
      requiredCertifications: b.requiredCertifications ?? [],
      createdAt: b.createdAt,
    })),
  });
}
