# Chronozone — Procurement Risk Layer

Chronozone is a procurement intelligence layer built on top of document ingestion systems (e.g. ProofTimeline / DocVault).

It is not a procurement workflow tool.

It is a **decision risk system**.

---

## Core Idea

Procurement decisions are not expensive because of tools.

They are expensive because of:

- missed detail
- duplicated effort
- slow decisions
- incorrect supplier selection
- inability to defend decisions

Chronozone focuses on:

> Exposing risk before a decision is made.

---

## System Model

Chronozone follows a strict model:

### 1. Ingest
Supplier submissions (documents, policies, certifications, claims)

### 2. Intelligence
Extract and structure positions from documents

Then generate **Exposures**:

- Absence (missing information)
- Misalignment (claims without operational support)
- Contradiction (inconsistent statements)
- Compression (price vs benchmark pressure)

### 3. Proof
Generate structured outputs:

- Supplier Risk Pack
- Questions for clarification
- Audit-ready evidence trail

---

## Dual View (Critical)

Chronozone has two views:

### 1) Supplier View (Submission)

Supplier uploads:

- documents
- certifications
- policies
- pricing

System records:

- fileIds
- claims
- submission state

---

### 2) Buyer View (Portfolio / Helicopter)

This is the core product.

The buyer sees:

- all suppliers in one view
- price vs benchmark
- exposures per supplier
- open questions
- a "Needs Verification" queue

This allows:

> Instant identification of where attention is required.

---

## The Helicopter View

The portfolio view is not a dashboard.

It answers one question:

> Where could we be wrong?

Each supplier shows:

- Price
- Exposure counts
- Open questions

A global queue surfaces:

- highest severity exposures
- across all suppliers

---

## Example

Supplier A:
- Price: -10% vs benchmark
- Missing certification
- Weak operational evidence

→ Potential cost and compliance exposure

Supplier B:
- Inconsistent ingredient claims

→ Requires clarification before decision

---

## Exposure Types

### Absence
Missing required information

Example:
- No RSPO certification
- Missing waste processing details

---

### Misalignment
Claims without operational support

Example:
- "Zero landfill" without processor details

---

### Contradiction
Conflicting statements

Example:
- "Palm-free" vs "vegetable oil blend"

---

### Compression
Price significantly below benchmark

Example:
- Supplier is 10% cheaper → potential substitution or scope reduction

---

## Key Principle

Chronozone does NOT:

- score suppliers
- rank suppliers
- make decisions

It:

> Surfaces what requires verification.

---

## Outputs

### 1. Portfolio View
- Supplier list
- Exposure counts
- Risk queue

### 2. Supplier Pack
- Summary
- Exposures
- Evidence excerpts
- Questions

### 3. Questions
- Generated from exposures
- Used for clarification

---

## Data Model (High Level)

Collections:

- proc_bids
- proc_bid_suppliers
- proc_signals
- proc_questions
- proc_packs

Key fields:

- bidId
- buyerOrgId
- supplierOrgId
- sharedFileIds
- evidenceRefs (fileId, chunkId, excerpt)

---

## Integration with Existing Backend

Chronozone assumes:

### Existing:
- file ingestion (`core_files`)
- text chunks (`core_file_chunks`)
- auth (orgId)

### New:
- /api/proc/* endpoints
- signal engine
- pack generation

---

## Why This Matters

Procurement cost is dominated by:

- time
- duplication
- wrong decisions

Not tooling.

Chronozone reduces:

- time to review
- missed detail
- audit exposure
- decision risk

---

## Positioning

This is not:

❌ "RFP automation"
❌ "AI summarisation"

This is:

> Decision Risk Infrastructure for document-heavy procurement.

---

## Next Steps

1. Implement /api/proc routes
2. Connect to core_file_chunks
3. Generate signals from real evidence
4. Populate portfolio view dynamically

---

## Guiding Principle

Every output must be:

- traceable to evidence
- neutral in language
- defensible in audit

No speculation.

No automation of decisions.

Only structured assistance.

---
