# IPA Project Template

Claude Code template with IPA (Information-technology Promotion Agency, Japan) documentation workflow.

## Quick Start

```bash
# Copy template to new project
cp -r ipa-template/.claude your-project/

# Start with Lean analysis
/lean [your idea]

# Generate IPA docs
/ipa:srd → /ipa:bd → /ipa:dd → /ipa:design

# Create implementation plan
/plan
```

## Features

- **IPA Documentation Workflow** - Standardized docs (SRD, UI_SPEC, API_SPEC, DB_DESIGN)
- **Lean Analysis** - MVP definition with problem/features/assumptions
- **Mockup Analysis** - AI-powered design spec extraction from HTML mockups
- **Multi-Model Task Distribution** - Phase-first structure with layer files
- **Validation** - IPA docs consistency & traceability checks

---

## Process Overview

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IPA + LEAN WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                           │
│  │    IDEA     │                                                           │
│  └──────┬──────┘                                                           │
│         ↓                                                                   │
│  ┌─────────────┐     ┌──────────────────────────────────────┐              │
│  │   /lean     │ ──→ │ MVP Definition                       │              │
│  └──────┬──────┘     │ • Problem statement                  │              │
│         │            │ • Core features                      │              │
│         │            │ • Assumptions                        │              │
│         │            └──────────────────────────────────────┘              │
│         ↓                                                                   │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║                     IPA DOCUMENTATION PHASE                          ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                      ║   │
│  ║   /ipa:srd ──→ docs/SRD.md (Requirements)                           ║   │
│  ║       ↓                                                              ║   │
│  ║   /ipa:bd ──→ docs/UI_SPEC.md (Screens, Flows)                      ║   │
│  ║       ↓                                                              ║   │
│  ║   /ipa:dd ──→ docs/API_SPEC.md + docs/DB_DESIGN.md                  ║   │
│  ║       ↓                                                              ║   │
│  ║   /ipa:design ──→ docs/prototypes/*.html (Mockups)                  ║   │
│  ║       ↓                                                              ║   │
│  ║   [Optional] /ipa:mockup-analyze ──→ docs/UI_DESIGN_SPEC.md         ║   │
│  ║                                                                      ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│         ↓                                                                   │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║                     PLANNING PHASE                                   ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                      ║   │
│  ║   Path A: /plan (with UI_DESIGN_SPEC.md pre-generated)              ║   │
│  ║   Path B: /plan @docs/prototypes/ (on-demand analysis)             ║   │
│  ║                                                                      ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│         ↓                                                                   │
│  ┌─────────────┐     ┌──────────────────────────────────────┐              │
│  │   /code     │ ──→ │ Implementation                       │              │
│  └──────┬──────┘     │ • Phase by phase                     │              │
│         │            │ • Layer by layer (data→core→ui)      │              │
│         ↓            └──────────────────────────────────────┘              │
│  ┌─────────────┐                                                           │
│  │ /docs:sync  │ ──→ Update docs with actual implementation               │
│  └─────────────┘                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Logic-Heavy TDD Protocol (Auto-Detected)

When the planner detects logic-heavy tasks (calculations, validations, financial logic), it will automatically enforce a **Mandatory TDD Workflow**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TDD PROTOCOL (For [TDD] Flagged Tasks)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  /plan → Detects logic ("calculate", "verify") → Adds [TDD] flag            │
│    ↓                                                                        │
│  User reviews & accepts [TDD] flag in phase-01/core.md                      │
│    ↓                                                                        │
│  /code phase-01/core.md                                                     │
│    ↓                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  EXECUTOR LOOP (Mandatory)                                            │  │
│  │  1. 🔴 Write Test First (path/to/test.ts) → Run → FAIL                │  │
│  │  2. 🟢 Write Implementation (path/to/file.ts) → Run → PASS            │  │
│  │  3. 🔵 Refactor (Clean Code) → Run → PASS                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Design Mockup → Plan Integration

Two approaches to achieve **100% design match** in implementation:

| Approach | Command Flow | When to Use |
|----------|--------------|-------------|
| **Path A** | `/ipa:mockup-analyze` → `/plan` | Fixed mockups, reusable across multiple plans |
| **Path B** | `/plan @docs/prototypes/` | Per-plan analysis, flexible mockup sources |

#### Path A: Pre-generate UI_DESIGN_SPEC.md

```bash
# Generate design spec once, reference in all plans
/ipa:design [reference-url]
/ipa:mockup-analyze              # Creates docs/UI_DESIGN_SPEC.md
/plan:hard [feature]             # Auto-references UI_DESIGN_SPEC.md
```

**Output:**
```
docs/
├── UI_DESIGN_SPEC.md            # Reusable design spec
└── prototypes/*.html            # HTML mockups
```

**Pros:**
- ✅ Single source of truth for design
- ✅ Reusable across multiple plans
- ✅ Validation checkpoint passes

#### Path B: On-demand via @path

```bash
# Skip mockup-analyze, use @path in /plan
/ipa:design [reference-url]
/plan:hard implement login @docs/prototypes/login
```

**Output:**
```
plans/{date}-{slug}/
├── design/                      # Copied mockup files
├── reports/
│   └── design-analysis-report.md  # Per-plan design spec
└── phase-XX/ui.md               # Tasks reference design report
```

**Pros:**
- ✅ No extra command needed
- ✅ Plan-specific design analysis
- ✅ Flexible (different mockups per plan)

---

## Directory Structure

```
your-project/
├── .claude/
│   ├── CLAUDE.md                    # Project config (copy this!)
│   ├── agents/
│   │   ├── planner.md               # IPA-aware planner
│   │   └── docs-manager.md          # IPA-aware docs manager
│   ├── commands/
│   │   ├── docs/sync.md             # /docs:sync
│   │   ├── lean.md                  # /lean
│   │   └── ipa/
│   │       ├── init.md              # /ipa:init
│   │       ├── srd.md               # /ipa:srd
│   │       ├── bd.md                # /ipa:bd
│   │       ├── dd.md                # /ipa:dd
│   │       ├── design.md            # /ipa:design
│   │       ├── mockup-analyze.md    # /ipa:mockup-analyze
│   │       ├── all.md               # /ipa:all
│   │       └── validate.md          # /ipa:validate
│   ├── skills/
│   │   ├── ipa-validator/           # IPA validation workflow
│   │   └── lean-analyst/            # MVP analysis workflow
│   └── workflows/
│       └── multi-model-task-distribution.md
├── docs/                            # IPA docs (generated)
│   ├── SRD.md
│   ├── UI_SPEC.md
│   ├── UI_DESIGN_SPEC.md
│   ├── API_SPEC.md
│   └── DB_DESIGN.md
├── prototypes/html-mockups/         # UI mockups
└── plans/                           # Implementation plans
```

## Workflow

### New Project

```
Idea
  ↓
/lean [idea] → MVP Requirements
  ↓
/ipa:srd → docs/SRD.md
  ↓
/ipa:bd → docs/UI_SPEC.md
  ↓
/ipa:dd → docs/API_SPEC.md, docs/DB_DESIGN.md
  ↓
/ipa:design → prototypes/html-mockups/
  ↓
/ipa:mockup-analyze → docs/UI_DESIGN_SPEC.md
  ↓
/plan → Implementation tasks
  ↓
/code → /docs:sync
```

### Existing Project

```
Codebase (no docs)
  ↓
/ipa:init → Extract docs from code
  ↓
/lean [feature] → Feature analysis
  ↓
/plan → /code → /docs:sync
```

## Slash Commands

### Pre-Development (Analysis & Planning)

| Command | Output | Description | When to Use |
|---------|--------|-------------|-------------|
| `/ipa:user-research` | USER_RESEARCH.md | Personas, journey maps | Before /lean (optional) |
| `/lean` | MVP analysis | MVP/feature definition | Idea validation |
| `/ipa:all` | All IPA docs | SRD → BD → DD sequence | New project (full flow) |

### IPA Documentation (Individual)

| Command | Output | Description | When to Use |
|---------|--------|-------------|-------------|
| `/ipa:srd` | SRD.md | Requirements (FR-xx, S-xx, E-xx) | After /lean |
| `/ipa:bd` | UI_SPEC.md | Screens, flows, design system | After SRD |
| `/ipa:dd` | API_SPEC.md, DB_DESIGN.md | API contracts, DB schema | After BD |
| `/ipa:design` | html-mockups/ | Generate HTML mockups | After BD |
| `/ipa:mockup-analyze` | UI_DESIGN_SPEC.md | Design tokens from mockups | After /ipa:design |
| `/ipa:init` | All docs | Reverse engineer from code | Existing project |
| `/ipa:validate` | Validation report | Check consistency & IDs | After docs generated |

### Post-Development (Maintenance)

| Command | Output | Description | When to Use |
|---------|--------|-------------|-------------|
| `/docs:sync` | Update docs | Sync docs with implementation | After /code |
| `/ipa:analyze-usage` | Usage report | Post-launch analytics | 30+ days after launch |

---

## Workflow Scenarios

### Scenario 1: New Project (Full Process)

```
┌─────────────────────────────────────────────────────────────────────┐
│ NEW PROJECT: From Idea to Implementation                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Lean Analysis                                              │
│  ─────────────────────                                              │
│  /lean "Build a task management app for remote teams"              │
│       ↓                                                             │
│  Output: MVP definition with features, assumptions                 │
│                                                                     │
│  Step 2: IPA Documentation (Full Sequence)                         │
│  ─────────────────────────────────────────                         │
│  /ipa:all [requirements]                                            │
│       ↓                                                             │
│  Output: docs/SRD.md, UI_SPEC.md, API_SPEC.md, DB_DESIGN.md        │
│                                                                     │
│  Step 3: Design Mockups                                             │
│  ─────────────────────                                              │
│  /ipa:design https://linear.app    # Reference for style           │
│       ↓                                                             │
│  Output: docs/prototypes/*.html                                    │
│                                                                     │
│  Step 4: Design Specification (Recommended)                        │
│  ──────────────────────────────────────────                        │
│  /ipa:mockup-analyze                                                │
│       ↓                                                             │
│  Output: docs/UI_DESIGN_SPEC.md (design tokens, components)        │
│                                                                     │
│  Step 5: Implementation Planning                                    │
│  ───────────────────────────────                                   │
│  /plan:hard [feature]                                               │
│       ↓                                                             │
│  Output: plans/{date}-{slug}/ with phase files                     │
│                                                                     │
│  Step 6: Code & Sync                                                │
│  ───────────────────                                               │
│  /code phase-01/core.md                                             │
│  /docs:sync (after user verification)                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Scenario 2: Existing Project (No Docs)

```
┌─────────────────────────────────────────────────────────────────────┐
│ EXISTING PROJECT: Extract Docs from Code                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Extract IPA Docs from Codebase                            │
│  ─────────────────────────────────────                              │
│  /ipa:init                                                          │
│       ↓                                                             │
│  Output: docs/ generated from existing code                        │
│                                                                     │
│  Step 2: Feature Analysis                                           │
│  ───────────────────────                                           │
│  /lean [new feature]                                                │
│       ↓                                                             │
│  Output: Feature requirements with project context                 │
│                                                                     │
│  Step 3: Planning & Implementation                                  │
│  ────────────────────────────────                                  │
│  /plan:hard [feature] → /code → /docs:sync                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Scenario 3: Feature Improvement

```
┌─────────────────────────────────────────────────────────────────────┐
│ FEATURE IMPROVEMENT: Iterate on Existing Feature                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Analyze Current State                                      │
│  ────────────────────────────                                      │
│  /lean [improvement idea]                                           │
│       ↓                                                             │
│  Output: Analysis with impact on existing features                 │
│                                                                     │
│  Step 2: Update Design (if UI changes)                             │
│  ─────────────────────────────────────                              │
│  /ipa:design [screen to update]                                     │
│       ↓                                                             │
│  Output: Updated mockups in docs/prototypes/                       │
│                                                                     │
│  Step 3: Plan with @path (Per-Feature Analysis)                    │
│  ──────────────────────────────────────────────                    │
│  /plan:hard improve dashboard @docs/prototypes/dashboard           │
│       ↓                                                             │
│  Output: Plan with design analysis specific to dashboard           │
│                                                                     │
│  Step 4: Implement & Sync                                          │
│  ───────────────────────                                           │
│  /code → /docs:sync                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Scenario 4: User Research First (Optional)

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER-CENTERED DESIGN: Research Before Building                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: User Research                                              │
│  ──────────────────────                                            │
│  /ipa:user-research "SaaS product managers"                        │
│       ↓                                                             │
│  Output: docs/USER_RESEARCH.md (personas, journey maps)            │
│                                                                     │
│  Step 2: Data-Informed MVP Definition                              │
│  ─────────────────────────────────────                              │
│  /lean [idea]   # Reads USER_RESEARCH.md automatically             │
│       ↓                                                             │
│  Output: MVP requirements with user insights                       │
│                                                                     │
│  Step 3: IPA Documentation                                         │
│  ────────────────────────                                          │
│  /ipa:all → /ipa:design → /ipa:mockup-analyze                      │
│       ↓                                                             │
│  Output: Full IPA docs + mockups + design spec                     │
│                                                                     │
│  Step 4: Implement                                                  │
│  ─────────────────                                                 │
│  /plan → /code → /docs:sync                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Scenario 5: Post-Launch Iteration

```
┌─────────────────────────────────────────────────────────────────────┐
│ POST-LAUNCH: Data-Driven Improvement                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Prerequisites: Product launched 30+ days, analytics enabled        │
│                                                                     │
│  Step 1: Analyze Usage Data                                         │
│  ─────────────────────────                                         │
│  /ipa:analyze-usage analytics.csv                                   │
│       ↓                                                             │
│  Output: plans/reports/usage-analysis-{date}.md                    │
│          • Feature adoption rates                                  │
│          • Drop-off points                                          │
│          • Retention cohorts                                        │
│          • P0/P1/P2 recommendations                                 │
│                                                                     │
│  Step 2: Plan Improvements                                          │
│  ─────────────────────────                                         │
│  /lean [P0 improvement from report]                                 │
│       ↓                                                             │
│  Output: Improvement requirements                                  │
│                                                                     │
│  Step 3: Implement & Measure                                        │
│  ───────────────────────────                                       │
│  /plan → /code → /docs:sync                                         │
│       ↓                                                             │
│  Re-analyze after 30 days                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## IPA vs Lean: When to Use

| Stage | Command | Purpose |
|-------|---------|---------|
| **Idea Validation** | `/lean` | Define MVP, validate assumptions |
| **Requirements** | `/ipa:srd` | Formal requirements (FR-xx, S-xx, E-xx) |
| **UI/UX Design** | `/ipa:bd` → `/ipa:design` | Screens, flows, mockups |
| **Technical Design** | `/ipa:dd` | API contracts, DB schema |
| **Design Extraction** | `/ipa:mockup-analyze` | Design tokens from mockups |
| **Implementation** | `/plan` → `/code` | Phase-by-phase development |
| **Maintenance** | `/docs:sync` | Keep docs accurate |

---

## Plan Command Variants

| Command | Description | Use Case |
|---------|-------------|----------|
| `/plan` | Router, auto-selects fast/hard | Default entry point |
| `/plan:fast` | Analyze only, no research | Simple tasks, clear requirements |
| `/plan:hard` | Research + detailed analysis | Complex features, need investigation |
| `/plan @path` | Include design context | UI implementation with mockups |

---

## IPA Docs vs Global /docs:init

> **Warning:** Nếu bạn có global `/docs:init` command, cần hiểu sự khác biệt để tránh overlap.

### So Sánh Docs Output

| IPA Template | Global /docs:init | Overlap? |
|--------------|-------------------|----------|
| `SRD.md` (Requirements, FR-xx, S-xx, E-xx) | `project-overview-pdr.md` (PDR) | ⚠️ HIGH |
| `API_SPEC.md` + `DB_DESIGN.md` | `system-architecture.md` | ⚠️ MEDIUM |
| `UI_SPEC.md` (screens, flows) | `design-guidelines.md` | ⚠️ MEDIUM |
| — | `codebase-summary.md` | ✅ Unique |
| — | `code-standards.md` | ✅ Unique |
| — | `deployment-guide.md` | ✅ Unique |
| — | `project-roadmap.md` | ✅ Unique |
| Traceability (FR→Screen→API→DB) | — | ✅ Unique |

### Chọn Workflow Nào?

| Scenario | Recommendation |
|----------|----------------|
| Enterprise / Compliance projects | ✅ **Use IPA** (traceability, audit trail) |
| Formal requirements needed | ✅ **Use IPA** (FR-xx, S-xx IDs) |
| Quick codebase understanding | ✅ **Use /docs:init** (fast overview) |
| Small project / bug fix | ⚠️ **Neither** (overkill) |
| Need both specs + operational docs | ✅ **Complementary** (see below) |

### Complementary Approach (Option B)

Nếu cần cả hai, dùng **IPA cho specs** và **chỉ một số global docs cho operational info**:

```
docs/
├── SRD.md              ← IPA: Requirements source of truth
├── UI_SPEC.md          ← IPA: UI specs source of truth
├── API_SPEC.md         ← IPA: API contracts source of truth
├── DB_DESIGN.md        ← IPA: Schema source of truth
│
├── codebase-summary.md ← Global: Code navigation (unique, no overlap)
├── code-standards.md   ← Global: Coding conventions (unique, no overlap)
├── deployment-guide.md ← Global: DevOps (unique, no overlap)
└── project-roadmap.md  ← Global: Planning (unique, no overlap)
```

**SKIP these global docs (overlap với IPA):**
- ❌ `project-overview-pdr.md` → Dùng `SRD.md` thay thế
- ❌ `system-architecture.md` → Dùng `API_SPEC.md` + `DB_DESIGN.md` thay thế
- ❌ `design-guidelines.md` → Dùng `UI_SPEC.md` thay thế

### Cách Gộp (Migration)

**Nếu đã có global docs, muốn thêm IPA:**

```bash
# Step 1: Chạy IPA init (sẽ tạo files mới, không overwrite)
/ipa:init

# Step 2: Review và migrate content từ global docs sang IPA docs
# - project-overview-pdr.md → SRD.md (merge requirements)
# - system-architecture.md → API_SPEC.md + DB_DESIGN.md (merge diagrams)
# - design-guidelines.md → UI_SPEC.md (merge design system)

# Step 3: Xóa hoặc archive global docs có overlap
mv docs/project-overview-pdr.md docs/_archive/
mv docs/system-architecture.md docs/_archive/
mv docs/design-guidelines.md docs/_archive/

# Step 4: Giữ lại global docs không overlap
# codebase-summary.md, code-standards.md, deployment-guide.md, project-roadmap.md

# Step 5: Validate
/ipa:validate
```

**Nếu dự án mới, muốn dùng cả hai:**

```bash
# Step 1: IPA docs first (specs)
/ipa:all [requirements]

# Step 2: Global docs cho operational (chỉ những cái unique)
# Manually create or request:
# - docs/codebase-summary.md
# - docs/code-standards.md
# - docs/deployment-guide.md
# - docs/project-roadmap.md

# DO NOT run full /docs:init (will create overlap)
```

---

## Extending

### Adding Project Skills

Template includes only workflow skills. Add project-specific skills as needed:

```bash
mkdir -p .claude/skills/{skill-name}
# Create SKILL.md
```

For library docs, use `/docs-seeker {library}` (recommended) or create `docs/libraries/{lib}.md`.

### Adding Commands

```bash
mkdir -p .claude/commands/{category}
# Create {command}.md
```

## Principles

- **YAGNI** - You Aren't Gonna Need It
- **KISS** - Keep It Simple, Stupid
- **DRY** - Don't Repeat Yourself

## Template Version

**Version:** 2.5
**Last Updated:** 2026-01-11
**Changes:**
- Added `/ipa:user-research` and `/ipa:analyze-usage` to Slash Commands table
- Added `/ipa:all` to table (was missing)
- Reorganized Slash Commands into Pre-Development / IPA Documentation / Post-Development
- Added Scenario 4: User Research First
- Added Scenario 5: Post-Launch Iteration
- Added "IPA Docs vs Global /docs:init" section with comparison table
- Added warning about docs overlap
- Added Complementary Approach (Option B) for using both IPA + selected global docs
- Added Migration guide for existing projects

**v2.3 (2026-01-09):**
- Added Process Overview with complete flow diagram
- Added Design Mockup → Plan Integration (Path A vs Path B)
- Added Workflow Scenarios (New Project, Existing Project, Feature Improvement)
- Added IPA vs Lean comparison table
- Added Plan Command Variants table
