# SRS — Software Requirements Specification (IPA-extended)

## 0) Document Control
- Version:
- Date:
- Owner:
- Status: Draft | Review | Approved
- Source inputs: SRD, UI_SPEC, API_SPEC, DB_DESIGN, traceability notes

## 1) Purpose & Scope
- Product scope
- In-scope
- Out-of-scope
- Business goals

## 2) Stakeholders & Users
- Stakeholder matrix
- User personas / actor list

## 3) Functional Requirements (FR)
Use stable IDs (FR-001...).
- FR-ID
- Description
- Priority (Must/Should/Could)
- Acceptance Criteria (Given/When/Then)
- Traceability (SRD ref, UI ref, API ref)

## 4) Non-Functional Requirements (NFR)
Use IDs (NFR-001...).
- Performance
- Security
- Availability
- Reliability
- Scalability
- Observability
- Accessibility
- Localization
- Compliance

## 5) Data Requirements
- Core entities
- Data constraints
- Validation rules
- Retention policy
- PII handling

## 6) Interface Requirements
### 6.1 UI Interfaces
- Screen list + purpose
- Input/output and validation

### 6.2 API Interfaces
- Endpoint groups
- Contract summary
- Error model

### 6.3 External Integrations
- Third-party deps
- Retry/fallback strategy

## 7) System Behavior
- Main user flows
- Alternate flows
- Failure paths

## 8) Constraints & Assumptions
- Technical constraints
- Business assumptions

## 9) Risks & Mitigations
- Top risks
- Mitigation owner/date

## 10) Testability & Verification
- Requirement-to-test mapping
- Definition of Done per requirement cluster

## 11) Traceability Matrix
- Requirement ↔ Screen ↔ API ↔ Data ↔ Test

## 12) Open Questions
- Pending decisions
- Blocking questions

---

## Quick Quality Checklist
- [ ] Every FR has acceptance criteria
- [ ] Every NFR has measurable target
- [ ] Every critical flow has failure path
- [ ] Traceability matrix is complete
- [ ] Out-of-scope clearly stated
