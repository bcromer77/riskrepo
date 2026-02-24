# Chronozone — Procurement Risk Layer

Chronozone is a procurement intelligence layer built on top of document ingestion systems (e.g. ProofTimeline / DocVault).

It is not a procurement workflow tool.

It is a **decision risk system**.

---

## Core Idea

Procurement decisions are expensive due to:

- missed detail
- duplicated effort
- slow decisions
- incorrect supplier selection
- inability to defend decisions

Chronozone focuses on:

> Exposing what requires verification before a decision is made.

---

## System Model (1 → 2 → 3)

### 1. Ingest
Supplier submissions:
- documents
- certifications
- policies
- specifications

Stored as:
- `core_files`
- `core_file_chunks`

---

### 2. Intelligence
Extract positions from submissions and generate **exposures**:

- **Absence** → missing required evidence  
- **Misalignment** → claims without operational support  
- **Contradiction** → inconsistent statements  
- **Compression** → price below benchmark (requires explanation)

---

### 3. Proof
Generate structured outputs:

- Supplier Pack (evidence-linked)
- Questions for clarification
- Portfolio (bird’s-eye exposure view)

---

## Dual View (Critical)

### 1) Supplier View
Supplier submits:
- price
- evidence (files)

Stored in:
- `proc_bid_suppliers.sharedFileIds`

---

### 2) Buyer View (Monitor)

Buyer sees:
- all suppliers
- price vs benchmark
- exposure counts
- open questions
- verification queue

This answers:

> Where could we be wrong?

---

## Core API Routes (Implemented)

### Bids
- `GET  /api/proc/bids`
- `POST /api/proc/bids`

Collection: `proc_bids`

---

### Portfolio (Birdseye View)
- `GET /api/proc/bids/:bidId/portfolio`

Returns:
- suppliers[]
- priceDeltaPct
- exposureCounts
- openQuestions
- queue[] (highest severity exposures)

Collections:
- `proc_bids`
- `proc_bid_suppliers`
- `proc_signals`
- `proc_questions`

---

## Required Next Endpoints (Zach)

### 1. Supplier invite
POST /api/proc/bids/:bidId/suppliers

Body:
{
  supplierOrgId,
  supplierName
}

---

### 2. Supplier submission
POST /api/proc/bids/:bidId/submit

Body:
{
  price,
  fileIds: string[]
}

---

### 3. Generate pack
POST /api/proc/bids/:bidId/suppliers/:supplierOrgId/generate

Process:
- pull `sharedFileIds`
- fetch chunks from `core_file_chunks`
- generate exposures
- create questions
- save pack

---

### 4. Get pack
GET /api/proc/bids/:bidId/suppliers/:supplierOrgId/pack

Returns:
- summary
- exposures
- evidence excerpts
- questions

---

## Data Model

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
- evidenceRefs: [{ fileId, chunkId?, excerpt? }]

---

## Auth (TO REPLACE)

Current:
Header-based stub

Headers:
- x-org-id
- x-user-id

Zach to replace with:
- WorkOS
- NextAuth
- or existing auth layer

---

## UI (Already Built)

### /monitor
Group risk view:
- exposure table
- verification queue
- change feed

### /proc/bids/*
Procurement view

---

## Design Principles

- No scoring
- No ranking
- No automated decisions

Everything must be:

- traceable
- neutral
- defensible

Language:

- "requires verification"
- "missing evidence"
- "inconsistent statements"

---

## Why This Matters

Procurement cost is not tools.

It is:

- missed detail
- duplicated effort
- wrong decisions

Chronozone reduces:

- decision risk
- audit exposure
- rework cost

---

## Positioning

Not:

❌ RFP tool  
❌ AI summariser  

This is:

> Decision Risk Infrastructure for document-heavy procurement

---

## Immediate Goal

Hook procurement layer into existing ingestion:

core_files → core_file_chunks → exposures → portfolio

---

## Notes

Voyage / embeddings not required for V1.

Can be added later for:
- semantic contradiction
- provenance similarity
- substitution detection

---

## Guiding Principle

> Surface what requires verification — do not make the decision.
