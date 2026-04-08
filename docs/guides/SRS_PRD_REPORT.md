# SRS/PRD Integration Report for IPA

## 1) What was added
- `docs/templates/SRS_TEMPLATE.md`
- `docs/templates/PRD_TEMPLATE.md`
- `docs/guides/SRS_PRD_GENERATION_PROMPTS.md`

## 2) Suggested structure/format
### SRS
- Document control
- Scope
- FR/NFR
- Data + interfaces
- Behavior flows
- Constraints/assumptions
- Testability
- Traceability matrix
- Open questions

### PRD
- Problem statement
- Product goals/metrics
- Users/JTBD
- MVP scope + out-of-scope
- Feature requirements
- UX requirements
- Technical strategy (high-level)
- Rollout plan
- Telemetry
- QA/validation
- Risks/trade-offs
- Open questions

## 3) How to use with Claude Code / Codex
- Use templates as canonical format constraints.
- Generate SRS first, then PRD.
- Keep IDs stable and track traceability.
- For iterative projects, regenerate only changed sections + update changelog.

## 4) Do we need IPA docs as input?
Yes (recommended):
- SRD + UI_SPEC + API_SPEC + DB_DESIGN/DB_SCHEMA
- This ensures SRS/PRD are grounded and auditable.

Without IPA docs:
- You can still draft SRS/PRD, but confidence/traceability is weaker.

## 5) For projects already running (`ipa:docs-sync` done)
- Start from synced docs as source of truth.
- Create/update `SRS.md` then `PRD.md`.
- Add delta/changelog section in both docs.
- Re-run validation and resolve open questions.

## 6) Proposed next command sequence
1. `/ipa-docs:sync`
2. Generate `SRS.md` using `SRS_TEMPLATE.md`
3. Generate `PRD.md` using `PRD_TEMPLATE.md`
4. `/ipa:validate`
5. Fix open questions & finalize
