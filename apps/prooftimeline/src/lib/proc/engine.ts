import type { ProcSignal, ProcSeverity } from "./types";

const OP_DETAIL = ["processor", "partner", "facility", "chain of custody", "custody", "trace", "traceability"];

function containsAny(haystack: string, needles: string[]) {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function severityFor(type: string, base: ProcSeverity): ProcSeverity {
  return base; // placeholder for future tuning
}

export function generateSignals(args: {
  benchmarkAvgPrice?: number;
  requiredCertifications?: string[];
  supplierPrice?: number;
  snippets: Array<{ fileId: string; chunkId?: string; text: string }>;
}): ProcSignal[] {
  const { benchmarkAvgPrice, requiredCertifications = [], supplierPrice, snippets } = args;

  const allText = snippets.map(s => s.text).join("\n").toLowerCase();

  const signals: ProcSignal[] = [];
  const evidence = (match: (t: string) => boolean) => {
    const hit = snippets.find(s => match(s.text.toLowerCase()));
    if (!hit) return [];
    return [{ fileId: hit.fileId, chunkId: hit.chunkId, excerpt: hit.text.slice(0, 280) }];
  };

  // 1) Compression
  if (benchmarkAvgPrice && supplierPrice != null && supplierPrice < benchmarkAvgPrice * 0.9) {
    signals.push({
      type: "compression",
      severity: severityFor("compression", "medium"),
      description: "Price is significantly below benchmark (requires verification of assumptions and scope).",
      evidenceRefs: [{ fileId: "price", excerpt: `Price ${supplierPrice} vs benchmark ${benchmarkAvgPrice}` }],
    });
  }

  // 2) Absence: required certifications not present in submitted evidence
  for (const cert of requiredCertifications) {
    if (!allText.includes(cert.toLowerCase())) {
      signals.push({
        type: "absence",
        severity: severityFor("absence", "high"),
        description: `Missing certification reference: ${cert} (requires verification).`,
        evidenceRefs: [],
      });
    }
  }

  // 3) Misalignment: zero landfill without operational detail
  const hasZeroLandfill = allText.includes("zero landfill") || allText.includes("landfill-free");
  const hasOpDetail = containsAny(allText, OP_DETAIL);
  if (hasZeroLandfill && !hasOpDetail) {
    signals.push({
      type: "misalignment",
      severity: severityFor("misalignment", "medium"),
      description: "Zero-landfill claim lacks operational detail (processor/partner/facility chain).",
      evidenceRefs: evidence(t => t.includes("zero landfill") || t.includes("landfill-free")),
    });
  }

  // 4) Contradiction: palm-free + vegetable oil blend
  const hasPalmFree = allText.includes("palm-free") || allText.includes("palm free");
  const hasBlend = allText.includes("vegetable oil blend") || allText.includes("blend");
  if (hasPalmFree && hasBlend) {
    signals.push({
      type: "contradiction",
      severity: severityFor("contradiction", "high"),
      description: "Inconsistent ingredient positioning (palm-free vs blend language). Requires clarification.",
      evidenceRefs: evidence(t => t.includes("palm-free") || t.includes("vegetable oil blend") || t.includes("blend")),
    });
  }

  // Backfill evidenceRefs for absence using a neutral excerpt if none
  for (const s of signals) {
    if (s.type === "absence" && s.evidenceRefs.length === 0) {
      s.evidenceRefs = [{ fileId: "submission", excerpt: "Certification not found in submitted evidence text." }];
    }
  }

  return signals;
}

export function generateQuestionsFromSignals(signals: ProcSignal[]) {
  return signals.map((s) => {
    switch (s.type) {
      case "absence":
        return `Please provide evidence for: ${s.description}`;
      case "compression":
        return "Please explain how pricing is achieved relative to benchmark (scope, assumptions, substitutions, exclusions).";
      case "misalignment":
        return "Please explain how this is achieved operationally and provide downstream evidence (partners/processors/facilities).";
      case "contradiction":
        return "Please clarify the discrepancy between ingredient/positioning statements and provide the controlling specification.";
      default:
        return "Please clarify and provide supporting evidence.";
    }
  });
}
