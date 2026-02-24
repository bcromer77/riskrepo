import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { PROC_PACKS, PROC_SIGNALS, PROC_QUESTIONS } from "@/lib/proc/collections";

export async function GET(req: NextRequest, ctx: { params: Promise<{ bidId: string; supplierOrgId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { bidId, supplierOrgId } = await ctx.params;
  if (!ObjectId.isValid(bidId)) return NextResponse.json({ error: "invalid_bid_id" }, { status: 400 });

  const db = await getMongoDb();

  const pack = await db.collection(PROC_PACKS).findOne({ bidId: new ObjectId(bidId), supplierOrgId });
  if (!pack) return NextResponse.json({ error: "pack_not_found" }, { status: 404 });

  const signals = await db.collection(PROC_SIGNALS).find({ bidId: new ObjectId(bidId), supplierOrgId }).toArray();
  const questions = await db.collection(PROC_QUESTIONS).find({ bidId: new ObjectId(bidId), supplierOrgId }).toArray();

  return NextResponse.json({
    summary: pack.summary,
    signals: signals.map((s: any) => ({
      type: s.type,
      severity: s.severity,
      description: s.description,
      evidenceRefs: s.evidenceRefs ?? [],
    })),
    questions: questions.map((q: any) => ({
      text: q.text,
      status: q.status,
    })),
  });
}
