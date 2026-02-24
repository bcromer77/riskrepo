export type Readiness = "Green" | "Yellow" | "Orange" | "Red";
export type SupplierTier = "1" | "2" | "3+";

export type Submission = {
  id: string;
  supplierOrgId: string;
  supplierName: string;
  tier: SupplierTier;
  origin: string; // country/region
  category: "Ingredients" | "Electronics" | "Packaging" | "Own Brand" | "Non-Food";
  commodity: "Palm" | "Cocoa" | "Soy" | "Coffee" | "Beef" | "Wood/Paper" | "Lithium" | "Cobalt" | "Nickel";
  product: string;
  updatedAt: string; // YYYY-MM-DD
  readiness: Readiness;

  riskThemes: Array<
    | "EUDR"
    | "Deforestation"
    | "Scope 3"
    | "CBAM"
    | "Battery Passport"
    | "Recycled Content"
    | "Carbon Footprint"
    | "Forced Labour"
    | "Child Labour"
    | "CSRD"
    | "NIS2"
  >;

  gaps: string[]; // concrete “missing” items to search
  aiSummary: string; // demo narrative
  riskScore: number; // 0-100
  potentialFineGBP: number; // demo numeric anchor
  opportunity: string; // remediation / value
};

export const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: "sub-001",
    supplierOrgId: "a",
    supplierName: "ABC Farms Ltd",
    tier: "1",
    origin: "Malaysia",
    category: "Own Brand",
    commodity: "Cocoa",
    product: "Own Brand Chocolate Bars (cocoa)",
    updatedAt: "2026-02-12",
    readiness: "Orange",
    riskThemes: ["EUDR", "Deforestation", "Scope 3"],
    gaps: ["polygon geolocation missing", "traceability gap", "HCV conversion allegation"],
    aiSummary:
      "Missing polygon geolocation for ~60% of cocoa supply. NGO grievance indicates potential HCV conversion risk. Scope 3 factors not evidenced for key processing stage.",
    riskScore: 78,
    potentialFineGBP: 4200000,
    opportunity:
      "Switch to Rainforest Alliance certified volume → projected +1.8% sustainable sales mix lift with minimal SKU disruption.",
  },
  {
    id: "sub-002",
    supplierOrgId: "b",
    supplierName: "GreenPalm Traders",
    tier: "1",
    origin: "Indonesia",
    category: "Ingredients",
    commodity: "Palm",
    product: "Palm-derived emulsifiers (ingredients)",
    updatedAt: "2026-02-08",
    readiness: "Red",
    riskThemes: ["EUDR", "Deforestation"],
    gaps: ["supplier plot polygons absent", "no deforestation monitoring evidence", "chain of custody incomplete"],
    aiSummary:
      "EUDR readiness fails minimum evidence: plot polygons absent and chain-of-custody incomplete. Deforestation monitoring evidence not provided.",
    riskScore: 92,
    potentialFineGBP: 8100000,
    opportunity:
      "Supplier remediation plan: polygons + monitoring feed + audited chain-of-custody within 30 days; alternative: transition to certified segregated palm source.",
  },
  {
    id: "sub-003",
    supplierOrgId: "c",
    supplierName: "West Africa Cocoa Co-op",
    tier: "2",
    origin: "Ghana",
    category: "Ingredients",
    commodity: "Cocoa",
    product: "Cocoa powder (ingredients)",
    updatedAt: "2026-01-19",
    readiness: "Yellow",
    riskThemes: ["EUDR", "Child Labour"],
    gaps: ["partial polygon coverage", "child-labour remediation evidence outdated"],
    aiSummary:
      "Polygon coverage partial. Child-labour remediation evidence is older than 12 months; requires updated audit or corrective action evidence.",
    riskScore: 61,
    potentialFineGBP: 1100000,
    opportunity:
      "Fast win: update labour audit + complete polygons for remaining farms; improves readiness to Green within quarter.",
  },
  {
    id: "sub-004",
    supplierOrgId: "d",
    supplierName: "BatteryCore Components",
    tier: "1",
    origin: "China",
    category: "Electronics",
    commodity: "Cobalt",
    product: "Rechargeable battery modules (own-brand tools)",
    updatedAt: "2026-02-02",
    readiness: "Orange",
    riskThemes: ["Battery Passport", "Recycled Content", "Scope 3"],
    gaps: ["recycled cobalt declaration missing", "battery passport prep unclear", "supplier due diligence incomplete"],
    aiSummary:
      "Battery passport preparation unclear and recycled cobalt declaration missing. Scope 3 emissions inputs not supported by verified declarations.",
    riskScore: 83,
    potentialFineGBP: 3500000,
    opportunity:
      "Remediation: require recycled content declarations + passport readiness pack; map to EU Battery Regulation timeline ahead of Feb 2027.",
  },
  {
    id: "sub-005",
    supplierOrgId: "e",
    supplierName: "EU PackFlex",
    tier: "1",
    origin: "Germany",
    category: "Packaging",
    commodity: "Wood/Paper",
    product: "Own brand packaging film + cartons",
    updatedAt: "2026-02-15",
    readiness: "Green",
    riskThemes: ["Recycled Content", "Carbon Footprint", "CSRD"],
    gaps: [],
    aiSummary:
      "Kerbside recyclability evidence provided (packaging spec + recyclability statement). Recycled content verified and footprint declaration present.",
    riskScore: 22,
    potentialFineGBP: 0,
    opportunity:
      "Opportunity: expand certified recycled content volumes to improve own-brand packaging targets.",
  },
  {
    id: "sub-006",
    supplierOrgId: "f",
    supplierName: "SoyLink Brasil",
    tier: "2",
    origin: "Brazil",
    category: "Ingredients",
    commodity: "Soy",
    product: "Soy-based ingredient feedstocks",
    updatedAt: "2026-02-20",
    readiness: "Red",
    riskThemes: ["EUDR", "Deforestation"],
    gaps: ["deforestation signal (satellite)", "traceability to plot missing", "supplier legal name mismatch"],
    aiSummary:
      "High-confidence deforestation signal detected in source region. Traceability to plot missing and legal entity identifiers misaligned across documents.",
    riskScore: 95,
    potentialFineGBP: 6000000,
    opportunity:
      "Immediate containment: freeze volume expansion; request plot-level traceability and independent verification; identify certified substitution suppliers.",
  },
];
