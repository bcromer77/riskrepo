import type { Readiness } from "@/lib/demoTesco";

export type NLQParsed = {
  categories: string[];
  commodities: string[];
  riskThemes: string[];
  origins: string[];
  readiness: Readiness[];
  since?: string; // YYYY-MM-DD
  raw: string;
};

const COMMODITIES = ["palm", "cocoa", "soy", "coffee", "beef", "wood", "paper", "lithium", "cobalt", "nickel"];
const ORIGINS = ["indonesia", "malaysia", "ivory coast", "ghana", "brazil", "dr congo", "congo", "china", "germany", "eu", "outside eu", "non-eu"];
const THEMES: Record<string, string> = {
  eudr: "EUDR",
  deforestation: "Deforestation",
  "scope 3": "Scope 3",
  cbam: "CBAM",
  battery: "Battery Passport",
  "battery passport": "Battery Passport",
  "recycled content": "Recycled Content",
  "carbon footprint": "Carbon Footprint",
  csrd: "CSRD",
  nis2: "NIS2",
  "forced labour": "Forced Labour",
  "child labour": "Child Labour",
};

function includesAny(s: string, needles: string[]) {
  return needles.filter((n) => s.includes(n));
}

// Very simple date handling for demo
function parseSince(s: string): string | undefined {
  if (s.includes("since jan 2026") || s.includes("since january 2026")) return "2026-01-01";
  if (s.includes("last 30d") || s.includes("last 30 days")) return "2026-01-25";
  if (s.includes("last 90d") || s.includes("last 90 days")) return "2025-11-26";
  return undefined;
}

export function parseNLQ(raw: string): NLQParsed {
  const q = raw.toLowerCase().trim();

  const commodities = includesAny(q, COMMODITIES).map((c) => (c === "wood" ? "Wood/Paper" : c[0].toUpperCase() + c.slice(1)));
  const origins = includesAny(q, ORIGINS).map((o) => {
    if (o === "ivory coast") return "Ivory Coast";
    if (o === "dr congo" || o === "congo") return "DR Congo";
    if (o === "outside eu" || o === "non-eu") return "Non-EU";
    if (o === "eu") return "EU";
    return o[0].toUpperCase() + o.slice(1);
  });

  const riskThemes = Object.entries(THEMES)
    .filter(([k]) => q.includes(k))
    .map(([, v]) => v);

  const readiness: Readiness[] = [];
  if (q.includes("red")) readiness.push("Red");
  if (q.includes("orange")) readiness.push("Orange");
  if (q.includes("yellow")) readiness.push("Yellow");
  if (q.includes("green")) readiness.push("Green");

  const categories: string[] = [];
  if (q.includes("electronics") || q.includes("tesco mobile") || q.includes("battery")) categories.push("Electronics");
  if (q.includes("packaging")) categories.push("Packaging");
  if (q.includes("own brand") || q.includes("private label")) categories.push("Own Brand");
  if (q.includes("ingredients") || commodities.length > 0) categories.push("Ingredients");

  return {
    categories: Array.from(new Set(categories)),
    commodities: Array.from(new Set(commodities)),
    riskThemes: Array.from(new Set(riskThemes)),
    origins: Array.from(new Set(origins)),
    readiness,
    since: parseSince(q),
    raw,
  };
}
