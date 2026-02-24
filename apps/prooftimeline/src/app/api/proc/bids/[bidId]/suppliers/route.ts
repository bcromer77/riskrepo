import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { PROC_BID_SUPPLIERS, PROC_BIDS } from "@/lib/proc/collections";

export async function POST(req: NextRequest, ctx: { params: Promise<{ bidId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { bidId } = await ctx.params;
  if (!ObjectId.isValid(bidId)) return NextResponse.json({ error: "invalid_bid_id" }, { status: 400 });

  const body = await req.json();
  const db = await getMongoDb();

  const bid = await db.collection(PROC_BIDS).findOne({ _id: new ObjectId(bidId), buyerOrgId: auth.orgId });
  if (!bid) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const doc = {
    bidId: new ObjectId(bidId),
    buyerOrgId: auth.orgId,
    supplierOrgId: body.supplierOrgId,
    supplierName: body.supplierName,
    status: "invited",
    price: null,
    currency: bid.currency ?? "GBP",
    sharedFileIds: [],
    createdAt: new Date(),
  };

  await db.collection(PROC_BID_SUPPLIERS).updateOne(
    { bidId: doc.bidId, buyerOrgId: auth.orgId, supplierOrgId: doc.supplierOrgId },
    { $setOnInsert: doc },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
