import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { PROC_BIDS, PROC_BID_SUPPLIERS, PROC_SIGNALS, PROC_QUESTIONS, PROC_PACKS } from "@/lib/proc/collections";
import { generateSignals, generateQuestionsFromSignals } from "@/lib/proc/engine";

export async function POST(req: NextRequest, ctx: { params: Promise<{ bidId: string; supplierOrgId: string }> }) {
  const auth = await getAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { bidId, supplierOrgId } = await ctx.params;
  if (!ObjectId.isValid(bidId)) return NextResponse.json({ error: "invalid_bid_id" }, { status: 400 });

  const db = await getMongoDb();

  const bid = await db.collection(PROC_BIDS).findOne({ _id: new ObjectId(bidId), buyerOrgId: auth.orgId });
  if (!bid) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const submission = await db.collection(PROC_BID_SUPPLIERS).findOne({
    bidId: new ObjectId(bidId),
    buyerOrgId: auth.orgId,
    supplierOrgId,
  });
  if (!submission) return NextResponse.json({ error: "supplier_not_found" }, { status: 404 });

  const sharedFileIds: string[] = submission.sharedFileIds ?? [];
  const supplierPrice: number | null = submission.price ?? null;

  // Pull a few snippets from core_file_chunks for each shared fileId
  // NOTE: adjust collection name if Zach uses a different one (it was core_file_chunks in the zip).
  const snippets: Array<{ fileId: string; chunkId?: string; text: string }> = [];
  for (const fileId of sharedFileIds) {
    const chunks = await db
      .collection("core_file_chunks")
      .find({ fileId: fileId.toString() })
      .project({ _id: 1, text: 1 })
      .limit(3)
      .toArray();

    for (const c of chunks) {
      snippets.push({ fileId, chunkId: c._id.toString(), text: c.text ?? "" });
    }
  }

  const signals = generateSignals({
    benchmarkAvgPrice: bid.benchmarkAvgPrice ?? undefined,
    requiredCertifications: bid.requiredCertifications ?? [],
    supplierPrice: supplierPrice ?? undefined,
    snippets,
  });

  // Replace existing signals/questions/packs (idempotent demo)
  await db.collection(PROC_SIGNALS).deleteMany({ bidId: new ObjectId(bidId), supplierOrgId });
  await db.collection(PROC_QUESTIONS).deleteMany({ bidId: new ObjectId(bidId), supplierOrgId });
  await db.collection(PROC_PACKS).deleteMany({ bidId: new ObjectId(bidId), supplierOrgId });

  const insertedSignals = await db.collection(PROC_SIGNALS).insertMany(
    signals.map((s) => ({
      bidId: new ObjectId(bidId),
      buyerOrgId: auth.orgId,
      supplierOrgId,
      ...s,
      createdAt: new Date(),
    }))
  );

  const questionTexts = generateQuestionsFromSignals(signals);
  const qDocs = questionTexts.map((text, i) => ({
    bidId: new ObjectId(bidId),
    buyerOrgId: auth.orgId,
    supplierOrgId,
    text,
    status: "open",
    linkedSignalIndex: i,
    createdAt: new Date(),
  }));

  const insertedQuestions = qDocs.length ? await db.collection(PROC_QUESTIONS).insertMany(qDocs) : null;

  const summary =
    signals.length === 0
      ? "No exposures surfaced from submitted evidence."
      : "Exposures surfaced that require verification before decision.";

  await db.collection(PROC_PACKS).insertOne({
    bidId: new ObjectId(bidId),
    buyerOrgId: auth.orgId,
    supplierOrgId,
    summary,
    signalIds: Object.values(insertedSignals.insertedIds).map((id) => id),
    questionIds: insertedQuestions ? Object.values(insertedQuestions.insertedIds).map((id) => id) : [],
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true, signals: signals.length, questions: qDocs.length });
}
