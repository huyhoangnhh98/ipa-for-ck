# Prompts to Generate SRS & PRD from IPA Docs

## Inputs you should pass
Minimum recommended inputs:
- `docs/project_detail/SRD.md`
- `docs/project_detail/UI_SPEC.md`
- `docs/project_detail/API_SPEC.md`
- `docs/project_detail/DB_DESIGN.md` (or DB_SCHEMA equivalent)
- Existing CHECKPOINTS / decisions (optional)

If some docs are missing, still generate with clear assumptions + open questions.

---

## Prompt: Generate SRS

You are an engineering analyst. Generate `docs/project_detail/SRS.md` using `docs/templates/SRS_TEMPLATE.md` format exactly.

Inputs:
- SRD.md
- UI_SPEC.md
- API_SPEC.md
- DB_DESIGN.md/DB_SCHEMA.md (if available)

Rules:
1. Keep requirement IDs stable and explicit (FR-xxx, NFR-xxx).
2. Every FR must have Given/When/Then acceptance criteria.
3. Every NFR must be measurable.
4. Include traceability matrix linking requirement ↔ UI ↔ API ↔ Data ↔ test intent.
5. If data is missing, add to Open Questions with owner=PM and status=pending.
6. Do not invent unsupported business claims.

Output file:
- `docs/project_detail/SRS.md`

---

## Prompt: Generate PRD

You are a product manager. Generate `docs/project_detail/PRD.md` using `docs/templates/PRD_TEMPLATE.md` format exactly.

Inputs:
- SRS.md (preferred) or SRD/UI_SPEC/API_SPEC if SRS not yet generated
- Business context from project docs

Rules:
1. Keep MVP scope tight and explicit.
2. Map each feature to a product goal and success metric.
3. Include rollout phases + go/no-go criteria.
4. Include dependencies, risks, and open questions.
5. Keep acceptance criteria testable.

Output file:
- `docs/project_detail/PRD.md`

---

## Do we need to pass IPA docs to generate SRS/PRD?
Short answer: **Yes, strongly recommended.**

- SRS quality depends on SRD/UI/API/DB consistency.
- PRD quality is best when grounded in SRS + SRD.
- Without these docs, model can still draft, but confidence and traceability drop.

---

## For an already-running project (ipa:docs-sync already done)
Recommended flow:
1. Run `/ipa-docs:sync` to ensure latest state.
2. Generate/update `SRS.md` from SRD/UI/API/DB.
3. Generate/update `PRD.md` from SRS + business goals.
4. Add a changelog section in both docs for delta updates.
5. Re-run validation (`/ipa:validate`) and resolve open questions.
