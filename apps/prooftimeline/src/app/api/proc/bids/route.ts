import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";            // <-- adjust if your repo uses a different path
import { getMongoDb } from "@/lib/mongodb";      // <-- adjust if your repo uses a different helper
import { PROC_BIDS } from "@/lib/proc/collections";

export async function POST(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await getMongoDb();

  const doc = {
    buyerOrgId: auth.orgId,
    title: body.title,
    category: body.category,
    currency: body.currency ?? "GBP",
    benchmarkAvgPrice: body.benchmarkAvgPrice ?? null,
    requiredCertifications: body.requiredCertifications ?? [],
    createdAt: new Date(),
    createdBy: auth.userId ?? null,
  };

  const r = await db.collection(PROC_BIDS).insertOne(doc);
  return NextResponse.json({ bidId: r.insertedId.toString() });
}

export async function GET(req: NextRequest) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = await getMongoDb();
  const bids = await db
    .collection(PROC_BIDS)
    .find({ buyerOrgId: auth.orgId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json({
    bids: bids.map((b: any) => ({
      bidId: b._id.toString(),
      title: b.title,
      category: b.category,
      currency: b.currency,
      benchmarkAvgPrice: b.benchmarkAvgPrice,
      requiredCertifications: b.requiredCertifications ?? [],
      createdAt: b.createdAt,
    })),
  });
}
