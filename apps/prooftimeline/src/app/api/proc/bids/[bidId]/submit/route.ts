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
  const fileIds: string[] = body.fileIds ?? [];
  const price = body.price ?? null;

  const db = await getMongoDb();
  const bid = await db.collection(PROC_BIDS).findOne({ _id: new ObjectId(bidId) });
  if (!bid) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Supplier can only submit for themselves (supplierOrgId === auth.orgId)
  const supplierOrgId = auth.orgId;

  // Ensure this supplier is attached to the bid (invited)
  const existing = await db.collection(PROC_BID_SUPPLIERS).findOne({
    bidId: new ObjectId(bidId),
    supplierOrgId,
  });
  if (!existing) {
    return NextResponse.json({ error: "supplier_not_invited" }, { status: 403 });
  }

  await db.collection(PROC_BID_SUPPLIERS).updateOne(
    { bidId: new ObjectId(bidId), supplierOrgId },
    {
      $set: {
        price,
        currency: bid.currency ?? "GBP",
        sharedFileIds: fileIds,
        status: "submitted",
        submittedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true });
}
